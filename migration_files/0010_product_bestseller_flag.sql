-- ZoeO Allure — Migration 10: product bestseller flag
-- Adds a manual is_bestseller flag to products so staff can curate the
-- storefront's "Best Selling Products" section instead of it falling back
-- to most-recently-created (there's no real sales-ranking data source yet).

alter table products add column if not exists is_bestseller boolean not null default false;
