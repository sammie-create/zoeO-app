-- ZoeO Allure — Migration 14: journal post cover photos
-- Adds an image_url column to journal_posts and a public storage bucket for
-- post cover images. Reads are public, writes are staff-only via is_staff().

alter table journal_posts add column if not exists image_url text;

insert into storage.buckets (id, name, public)
values ('journal-images', 'journal-images', true)
on conflict (id) do nothing;

create policy "Public can view journal images"
on storage.objects for select
using (bucket_id = 'journal-images');

create policy "Staff can upload journal images"
on storage.objects for insert
with check (bucket_id = 'journal-images' and is_staff());

create policy "Staff can update journal images"
on storage.objects for update
using (bucket_id = 'journal-images' and is_staff());

create policy "Staff can delete journal images"
on storage.objects for delete
using (bucket_id = 'journal-images' and is_staff());
