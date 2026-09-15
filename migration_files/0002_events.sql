-- ZoeO Allure — Migration 2: Events (Programme / Tickets / Sponsorships)
-- Run via: supabase migration new create_events_tables
-- then paste this in and `supabase db push`

-- ============================================================
-- PROGRAMMES
-- ============================================================

create table programmes (
  id           uuid primary key default gen_random_uuid(),
  name         text not null,
  price_label  text not null, -- free text — "₦1,000 /entry", "Free /with entry"
  description  text,
  status       text not null default 'draft' check (status in ('draft', 'published')),
  sort_order   integer not null default 0, -- display tag ("/ Programme 01") is
                                            -- derived from this, not stored
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

-- Normalized instead of an array column: each programme has up to 5 fixed
-- time slots, and this shape lets you query/update one slot at a time.
create table programme_slots (
  id            uuid primary key default gen_random_uuid(),
  programme_id  uuid not null references programmes(id) on delete cascade,
  slot_time     text not null check (slot_time in ('10 AM', '12 PM', '2 PM', '4 PM', '6 PM')),
  is_available  boolean not null default true,
  unique (programme_id, slot_time)
);

-- ============================================================
-- TICKETS
-- ============================================================

create or replace function generate_ticket_ref()
returns text
language plpgsql
as $$
declare
new_ref text;
begin
  loop
new_ref := 'EX-' || lpad((floor(random() * 100000))::int::text, 5, '0');
    exit when not exists (select 1 from tickets where ref = new_ref);
end loop;
return new_ref;
end;
$$;

create table tickets (
                         id           uuid primary key default gen_random_uuid(),
                         ref          text unique not null default generate_ticket_ref(),
                         customer_id  uuid references customer_profiles(id), -- optional link if the
    -- buyer matches an existing customer
                         name         text not null,
                         phone        text not null,
                         email        text,
                         tier         text not null check (tier in ('ga', 'vip')),
                         source       text, -- free text — "Instagram", "Scanned a poster QR code", etc.
                         event_date   date not null,
                         status       text not null default 'reserved' check (status in ('reserved', 'paid', 'cancelled')),
                         created_at   timestamptz not null default now()
);

-- ============================================================
-- SPONSORS
-- ============================================================

create table sponsors (
  id            uuid primary key default gen_random_uuid(),
  brand         text not null,
  tier          text not null, -- free text — "Gold sponsorship", "Vendor booth", etc.
  contact_name  text not null,
  email         text,
  status        text not null default 'new' check (status in ('new', 'contacted', 'confirmed')),
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- ============================================================
-- RLS — staff full access (not owner-gated like staff/roles;
-- events content isn't access-sensitive the same way)
-- ============================================================

alter table programmes enable row level security;
alter table programme_slots enable row level security;
alter table tickets enable row level security;
alter table sponsors enable row level security;

create policy "Staff full access" on programmes for all using (is_staff());
create policy "Staff full access" on programme_slots for all using (is_staff());
create policy "Staff full access" on tickets for all using (is_staff());
create policy "Staff full access" on sponsors for all using (is_staff());
