-- ZoeO Allure — Migration 3: Content (Testimonials / FAQ / Journal / Team / About)
-- Run via: supabase migration new create_content_tables
-- then paste this in and `supabase db push`

-- ============================================================
-- TESTIMONIALS
-- ============================================================

create table testimonials (
  id             uuid primary key default gen_random_uuid(),
  quote          text not null,
  customer_name  text not null,
  service_label  text, -- free text — not FK'd to services, testimonials
                        -- sometimes reference products, not bookable services
  status         text not null default 'draft' check (status in ('draft', 'published')),
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);
-- Note: initials and avatar colors from the mock are dropped here — those
-- are presentation, derivable from customer_name at render time rather
-- than stored per row.

-- ============================================================
-- FAQ
-- ============================================================

create table faqs (
  id          uuid primary key default gen_random_uuid(),
  question    text not null,
  answer      text not null,
  status      text not null default 'draft' check (status in ('draft', 'published')),
  sort_order  integer not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- ============================================================
-- JOURNAL
-- ============================================================

create table journal_posts (
  id            uuid primary key default gen_random_uuid(),
  category      text not null check (category in ('Hair care', 'Bridal', 'Nail care', 'Personal care')),
  title         text not null,
  body          text not null,
  published_at  date not null default current_date,
  status        text not null default 'draft' check (status in ('draft', 'published')),
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);
-- Note: the per-post swatch color from the mock is dropped — category is a
-- fixed, small set, so map category -> color once in the UI instead of
-- storing a color on every row.

-- ============================================================
-- TEAM
-- ============================================================

create table team_members (
  id            uuid primary key default gen_random_uuid(),
  staff_id      uuid references staff_profiles(id), -- optional: link a public
                                                      -- team card to a real login
                                                      -- account when there is one
  name          text not null, -- can be a person ("Zoe Onirun") or a
                                -- station/department ("Nail studio")
  title         text not null, -- e.g. "Founder & lead hair stylist"
  initials      text not null,
  accent_color  text not null, -- hex or gradient string — curated per card,
                                -- not derivable, so stored explicitly
  status        text not null default 'draft' check (status in ('draft', 'published')),
  sort_order    integer not null default 0,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- ============================================================
-- ABOUT STATS
-- ============================================================

create table about_stats (
  id           uuid primary key default gen_random_uuid(),
  figure       text not null, -- display string, not always numeric — "04", "2021"
  title        text not null,
  description  text not null,
  sort_order   integer not null default 0,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

-- ============================================================
-- RLS — staff full access.
-- No public read policy yet: front-office has no data-access
-- strategy decided. When you build it, this is where a
-- `status = 'published'` public SELECT policy (or a server-side
-- service-role fetch instead) gets added.
-- ============================================================

alter table testimonials enable row level security;
alter table faqs enable row level security;
alter table journal_posts enable row level security;
alter table team_members enable row level security;
alter table about_stats enable row level security;

create policy "Staff full access" on testimonials for all using (is_staff());
create policy "Staff full access" on faqs for all using (is_staff());
create policy "Staff full access" on journal_posts for all using (is_staff());
create policy "Staff full access" on team_members for all using (is_staff());
create policy "Staff full access" on about_stats for all using (is_staff());
