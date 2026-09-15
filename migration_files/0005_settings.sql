-- ZoeO Allure — Migration 5: site settings
-- A single-row table for storefront-facing configuration.

create table site_settings (
  id                       boolean primary key default true,
  delivery_fee             numeric(12,2) not null default 3500,
  low_stock_threshold      integer not null default 10,
  show_exhibition_teaser   boolean not null default true,
  whatsapp_number          text not null default '',
  instagram_handle         text not null default '',
  updated_at               timestamptz not null default now(),
  constraint site_settings_singleton check (id)
);

insert into site_settings (id) values (true);

alter table site_settings enable row level security;

create policy "Staff full access" on site_settings for all using (is_staff());
