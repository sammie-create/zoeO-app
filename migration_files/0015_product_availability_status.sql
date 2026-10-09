-- ZoeO Allure — Migration 15: product availability status
-- Adds an explicit status to products (available / coming_soon / out_of_stock)
-- so staff can mark a product as not yet launched, independent of stock_units.
-- The storefront's homepage category tiles derive their "Coming Soon" vs
-- available state from this field.

create type product_status as enum ('available', 'coming_soon', 'out_of_stock');

alter table products add column if not exists status product_status not null default 'available';
