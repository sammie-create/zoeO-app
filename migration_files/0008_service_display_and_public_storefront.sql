-- ZoeO Allure — Migration 8: service display fields + public storefront access
--
-- Two things:
-- 1. `services` gains the display fields the front-office storefront needs
--    (icon, image, category grouping, numeric duration) — mirrors the
--    `image_url` addition pattern from migration 6, plus a matching
--    `service-images` storage bucket.
-- 2. Every table already had table-level SELECT granted to `anon` (migration 4),
--    but RLS only allowed staff — so the storefront's anon key got zero rows.
--    Adds narrow, read-only public policies for exactly what the storefront
--    shows (visible products, published services/testimonials/posts/faqs,
--    about stats, site settings), plus two SECURITY DEFINER RPCs so guest
--    checkout/booking can write without opening broad public INSERT/SELECT
--    access to customer_profiles/orders/order_items/bookings.

-- ============================================================
-- SERVICE DISPLAY FIELDS
-- ============================================================

alter table services
  add column if not exists category text not null default 'Hair'
    check (category in ('Hair', 'Bridal', 'Lashes', 'Nails')),
  add column if not exists icon text,
  add column if not exists image_url text,
  add column if not exists duration_mins integer not null default 60 check (duration_mins > 0),
  add column if not exists object_position text not null default '50% 50%';

insert into storage.buckets (id, name, public)
values ('service-images', 'service-images', true)
on conflict (id) do nothing;

create policy "Public can view service images"
on storage.objects for select
using (bucket_id = 'service-images');

create policy "Staff can upload service images"
on storage.objects for insert
with check (bucket_id = 'service-images' and is_staff());

create policy "Staff can update service images"
on storage.objects for update
using (bucket_id = 'service-images' and is_staff());

create policy "Staff can delete service images"
on storage.objects for delete
using (bucket_id = 'service-images' and is_staff());

-- ============================================================
-- PUBLIC READ ACCESS (storefront)
-- ============================================================

create policy "Public can view visible products" on products for select using (not is_hidden);
create policy "Public can view published services" on services for select using (status = 'published');
create policy "Public can view published testimonials" on testimonials for select using (status = 'published');
create policy "Public can view published journal posts" on journal_posts for select using (status = 'published');
create policy "Public can view published faqs" on faqs for select using (status = 'published');
create policy "Public can view about stats" on about_stats for select using (true);
create policy "Public can view site settings" on site_settings for select using (true);

-- ============================================================
-- GUEST CHECKOUT / BOOKING (SECURITY DEFINER RPCs)
-- ============================================================
-- These run with the privileges of the function owner, bypassing RLS
-- internally for their own well-defined inserts only — anon never gets a
-- direct INSERT/SELECT grant on customer_profiles/orders/order_items/bookings.

create or replace function create_guest_order(
  p_name text,
  p_phone text,
  p_email text,
  p_fulfilment_type text,
  p_fulfilment_detail text,
  p_address text,
  p_items jsonb -- [{ "product_id": uuid, "quantity": int }, ...]
)
returns orders
language plpgsql
security definer
set search_path = public
as $$
declare
  v_customer_id uuid;
  v_order       orders;
  v_item        jsonb;
  v_price       numeric(12,2);
begin
  if p_fulfilment_type not in ('delivery', 'pickup') then
    raise exception 'invalid fulfilment_type';
  end if;
  if jsonb_array_length(p_items) = 0 then
    raise exception 'order must have at least one item';
  end if;

  insert into customer_profiles (name, phone, email)
  values (p_name, p_phone, p_email)
  on conflict (phone) do update set name = excluded.name, email = coalesce(excluded.email, customer_profiles.email)
  returning id into v_customer_id;

  insert into orders (customer_id, phone, fulfilment_type, fulfilment_detail, address)
  values (v_customer_id, p_phone, p_fulfilment_type, p_fulfilment_detail, p_address)
  returning * into v_order;

  for v_item in select * from jsonb_array_elements(p_items) loop
    select price into v_price from products where id = (v_item ->> 'product_id')::uuid and not is_hidden;
    if v_price is null then
      raise exception 'product % is not available', v_item ->> 'product_id';
    end if;
    insert into order_items (order_id, product_id, quantity, unit_price)
    values (v_order.id, (v_item ->> 'product_id')::uuid, (v_item ->> 'quantity')::int, v_price);
  end loop;

  return v_order;
end;
$$;

create or replace function create_guest_booking(
  p_name text,
  p_phone text,
  p_email text,
  p_service_id uuid,
  p_scheduled_at timestamptz,
  p_location_type text,
  p_location_detail text,
  p_notes text
)
returns bookings
language plpgsql
security definer
set search_path = public
as $$
declare
  v_customer_id uuid;
  v_booking     bookings;
begin
  if p_location_type not in ('studio', 'home_service') then
    raise exception 'invalid location_type';
  end if;
  if not exists (select 1 from services where id = p_service_id and status = 'published') then
    raise exception 'service % is not available', p_service_id;
  end if;

  insert into customer_profiles (name, phone, email)
  values (p_name, p_phone, p_email)
  on conflict (phone) do update set name = excluded.name, email = coalesce(excluded.email, customer_profiles.email)
  returning id into v_customer_id;

  insert into bookings (customer_id, phone, service_id, scheduled_at, location_type, location_detail, notes)
  values (v_customer_id, p_phone, p_service_id, p_scheduled_at, p_location_type, p_location_detail, p_notes)
  returning * into v_booking;

  return v_booking;
end;
$$;

grant execute on function create_guest_order(text, text, text, text, text, text, jsonb) to anon;
grant execute on function create_guest_booking(text, text, text, uuid, timestamptz, text, text, text) to anon;
