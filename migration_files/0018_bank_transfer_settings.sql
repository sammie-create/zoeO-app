-- ZoeO Allure — Migration 18: bank transfer settings
-- Bank details shown at checkout are now staff-configurable instead of
-- hardcoded, same pattern as the rest of site_settings.

alter table site_settings add column if not exists bank_name text not null default '';
alter table site_settings add column if not exists bank_account_name text not null default 'ZoeO Allure';
alter table site_settings add column if not exists bank_account_number text not null default '';
