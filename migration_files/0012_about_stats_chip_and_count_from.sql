-- ZoeO Allure — Migration 12: about_stats chip label + count-up start value
-- Adds the small tag chip shown above each stat number (e.g. "HELicia",
-- "Salon", "Launch") and an optional count-up start value for stats that
-- read as a year (e.g. counting up from 2000 to 2021 rather than from 0).

alter table about_stats add column if not exists chip text;
alter table about_stats add column if not exists count_from integer;
