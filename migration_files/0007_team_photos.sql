-- ZoeO Allure — Migration 7: team member photos
-- Adds a photo_url column to team_members and a public storage bucket for
-- team photos. Reads are public, writes are staff-only via is_staff().

alter table team_members add column if not exists photo_url text;

insert into storage.buckets (id, name, public)
values ('team-photos', 'team-photos', true)
on conflict (id) do nothing;

create policy "Public can view team photos"
on storage.objects for select
using (bucket_id = 'team-photos');

create policy "Staff can upload team photos"
on storage.objects for insert
with check (bucket_id = 'team-photos' and is_staff());

create policy "Staff can update team photos"
on storage.objects for update
using (bucket_id = 'team-photos' and is_staff());

create policy "Staff can delete team photos"
on storage.objects for delete
using (bucket_id = 'team-photos' and is_staff());
