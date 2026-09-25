-- ZoeO Allure — Migration 9: product brand
-- Adds a nullable brand column to products (e.g. "HELicia", "FELenee") so the
-- storefront can show a brand line on bestseller cards and the PDP.

alter table products add column if not exists brand text;
