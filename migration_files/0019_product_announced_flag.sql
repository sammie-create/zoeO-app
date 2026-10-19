-- ZoeO Allure — Migration 19: product announcement flag
-- Adds a manual is_announced flag so staff can feature one or more products
-- in the storefront's topbar announcement banner, the same curation pattern
-- already used for is_bestseller.

alter table products add column if not exists is_announced boolean not null default false;
