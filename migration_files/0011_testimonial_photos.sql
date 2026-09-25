-- ZoeO Allure — Migration 11: testimonial photos
-- Adds a photo_url column to testimonials and a public storage bucket for
-- customer photos, mirroring migration 7's team-photos pattern. Reads are
-- public, writes are staff-only via is_staff().

alter table testimonials add column if not exists photo_url text;

insert into storage.buckets (id, name, public)
values ('testimonial-photos', 'testimonial-photos', true)
on conflict (id) do nothing;

create policy "Public can view testimonial photos"
on storage.objects for select
using (bucket_id = 'testimonial-photos');

create policy "Staff can upload testimonial photos"
on storage.objects for insert
with check (bucket_id = 'testimonial-photos' and is_staff());

create policy "Staff can update testimonial photos"
on storage.objects for update
using (bucket_id = 'testimonial-photos' and is_staff());

create policy "Staff can delete testimonial photos"
on storage.objects for delete
using (bucket_id = 'testimonial-photos' and is_staff());
