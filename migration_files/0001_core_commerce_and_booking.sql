-- ZoeO Allure — Migration 1: Core commerce + booking
-- Run via: supabase migration new create_core_tables
-- then paste this in and `supabase db push`

-- ============================================================
-- STAFF & CUSTOMERS
-- ============================================================

-- Lookup table instead of a hardcoded check constraint, so new
-- permission tiers can be added later with an INSERT, not a migration.
create table staff_roles (
  id          text primary key,
  label       text not null,
  description text,
  created_at  timestamptz not null default now()
);

insert into staff_roles (id, label, description) values
  ('owner',          'Owner',          'Full access to every part of the back office.'),
  ('studio_manager', 'Studio Manager', 'Manages day-to-day operations, staff and bookings.'),
  ('staff',          'Staff',          'Standard back-office access.');

create table staff_profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  name        text not null,
  role_id     text not null default 'staff' references staff_roles(id),
  job_title   text, -- display title / specialty — "Nail Technician", "Lash Technician", etc.
                     -- separate from role_id: this is what shows in the UI,
                     -- role_id is what gates access
  created_at  timestamptz not null default now()
);

-- Customers are phone-first (orders/bookings often start on WhatsApp),
-- so an auth account is optional and can be linked later.
create table customer_profiles (
  id            uuid primary key default gen_random_uuid(),
  auth_user_id  uuid unique references auth.users(id) on delete set null,
  name          text not null,
  phone         text not null unique,
  email         text,
  created_at    timestamptz not null default now()
);

-- ============================================================
-- CATALOG
-- ============================================================

create type product_category as enum ('hair', 'personal', 'nails', 'wigs');

create table products (
  id           uuid primary key default gen_random_uuid(),
  slug         text unique not null,
  name         text not null,
  category     product_category not null,
  price        numeric(12,2) not null check (price >= 0),
  stock_units  integer not null default 0 check (stock_units >= 0),
  is_hidden    boolean not null default false,
  description  text,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create table services (
  id             uuid primary key default gen_random_uuid(),
  slug           text unique not null,
  name           text not null,
  price          numeric(12,2) not null check (price >= 0),
  duration_label text not null, -- free text, e.g. "90 min" or "180 min · trial available"
  description    text,
  status         text not null default 'draft' check (status in ('draft', 'published')),
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

-- ============================================================
-- ORDERS
-- ============================================================

create or replace function generate_order_ref()
returns text
language plpgsql
as $$
declare
new_ref text;
begin
  loop
new_ref := 'ZA-' || lpad((floor(random() * 100000))::int::text, 5, '0');
    exit when not exists (select 1 from orders where ref = new_ref);
end loop;
return new_ref;
end;
$$;

create table orders (
                        id               uuid primary key default gen_random_uuid(),
                        ref              text unique not null default generate_order_ref(),
                        customer_id      uuid references customer_profiles(id),
                        phone            text not null,
                        order_date       timestamptz not null default now(),
                        fulfilment_type  text not null check (fulfilment_type in ('delivery', 'pickup')),
                        fulfilment_detail text,
                        address          text,
                        payment_status   text not null default 'pending'
                            check (payment_status in ('paid', 'pending', 'cancelled')),
                        delivery_status  text not null default 'processing'
                            check (delivery_status in
                                   ('processing', 'packed', 'out_for_delivery', 'delivered',
                                    'ready_for_pickup', 'picked_up')),
                        created_at       timestamptz not null default now(),
                        updated_at       timestamptz not null default now()
);

create table order_items (
  id          uuid primary key default gen_random_uuid(),
  order_id    uuid not null references orders(id) on delete cascade,
  product_id  uuid not null references products(id),
  quantity    integer not null check (quantity > 0),
  unit_price  numeric(12,2) not null -- snapshot of product price at order time
);

-- ============================================================
-- BOOKINGS
-- ============================================================

create or replace function generate_booking_ref()
returns text
language plpgsql
as $$
declare
new_ref text;
begin
  loop
new_ref := 'BK-' || lpad((floor(random() * 100000))::int::text, 5, '0');
    exit when not exists (select 1 from bookings where ref = new_ref);
end loop;
return new_ref;
end;
$$;

create table bookings (
                          id               uuid primary key default gen_random_uuid(),
                          ref              text unique not null default generate_booking_ref(),
                          customer_id      uuid references customer_profiles(id),
                          phone            text not null, -- snapshot at booking time
                          service_id       uuid not null references services(id),
                          scheduled_at     timestamptz not null,
                          location_type    text not null check (location_type in ('studio', 'home_service')),
                          location_detail  text, -- e.g. "Ikeja studio", "Home service (Lagos)"
                          status           text not null default 'requested'
                              check (status in ('requested', 'accepted', 'completed', 'declined')),
                          deposit_amount   numeric(12,2) not null default 0,
                          notes            text,
                          created_at       timestamptz not null default now(),
                          updated_at       timestamptz not null default now()
);

-- ============================================================
-- RLS — staff-only access for now (front-office policies come
-- later, once customer self-service auth is designed)
-- ============================================================

create or replace function is_staff()
returns boolean
language sql
security definer
stable
as $$
  select exists (select 1 from staff_profiles where id = auth.uid());
$$;

create or replace function is_owner()
returns boolean
language sql
security definer
stable
as $$
  select exists (
    select 1 from staff_profiles where id = auth.uid() and role_id = 'owner'
  );
$$;

-- Auto-provisioning: when a staff member is invited (Supabase Auth
-- creates the auth.users row), automatically create their
-- staff_profiles row with the default 'staff' role.
-- Guarded by an is_staff flag in user metadata so this never fires
-- for customer accounts if/when front-office self-service auth is added.
create or replace function handle_new_staff_user()
returns trigger
language plpgsql
security definer
as $$
begin
  if new.raw_user_meta_data ->> 'is_staff' = 'true' then
    insert into staff_profiles (id, name, role_id)
    values (new.id, coalesce(new.raw_user_meta_data ->> 'name', new.email), 'staff');
  end if;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_staff_user();

alter table staff_roles enable row level security;
alter table staff_profiles enable row level security;
alter table customer_profiles enable row level security;
alter table products enable row level security;
alter table services enable row level security;
alter table orders enable row level security;
alter table order_items enable row level security;
alter table bookings enable row level security;

-- Anyone on staff can see the roster; only the owner can add,
-- promote/demote, or remove staff — closes the self-promotion hole.
create policy "Staff can view roles" on staff_roles for select using (is_staff());
create policy "Owner manages roles" on staff_roles for insert with check (is_owner());
create policy "Owner manages roles" on staff_roles for update using (is_owner());
create policy "Owner manages roles" on staff_roles for delete using (is_owner());

create policy "Staff can view profiles" on staff_profiles for select using (is_staff());
create policy "Owner manages profiles" on staff_profiles for insert with check (is_owner());
create policy "Owner manages profiles" on staff_profiles for update using (is_owner());
create policy "Owner manages profiles" on staff_profiles for delete using (is_owner());

create policy "Staff full access" on customer_profiles for all using (is_staff());
create policy "Staff full access" on products for all using (is_staff());
create policy "Staff full access" on services for all using (is_staff());
create policy "Staff full access" on orders for all using (is_staff());
create policy "Staff full access" on order_items for all using (is_staff());
create policy "Staff full access" on bookings for all using (is_staff());
