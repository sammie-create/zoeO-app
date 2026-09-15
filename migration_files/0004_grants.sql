-- ZoeO Allure — Migration 4: restore standard Supabase default grants
-- Fixes "permission denied for table X" errors on service_role/authenticated/anon.
-- These are the default privileges every new Supabase project has out of the box;
-- run this once in the SQL Editor and it's safe to re-run any time.

grant usage on schema public to anon, authenticated, service_role;

grant all on all tables in schema public to service_role;
grant all on all sequences in schema public to service_role;
grant all on all routines in schema public to service_role;

grant select, insert, update, delete on all tables in schema public to authenticated;
grant usage, select on all sequences in schema public to authenticated;
grant select on all tables in schema public to anon;

alter default privileges in schema public grant all on tables to service_role;
alter default privileges in schema public grant all on sequences to service_role;
alter default privileges in schema public grant all on routines to service_role;

alter default privileges in schema public grant select, insert, update, delete on tables to authenticated;
alter default privileges in schema public grant usage, select on sequences to authenticated;

alter default privileges in schema public grant select on tables to anon;
