-- ZoeO Allure — Migration 6: product images
-- Adds an image_url column to products and a public storage bucket for
-- product photos. Reads are public (storefront + admin), writes are
-- restricted to staff via the existing is_staff() helper.

alter table products add column if not exists image_url text;

insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

create policy "Public can view product images"
on storage.objects for select
using (bucket_id = 'product-images');

create policy "Staff can upload product images"
on storage.objects for insert
with check (bucket_id = 'product-images' and is_staff());

create policy "Staff can update product images"
on storage.objects for update
using (bucket_id = 'product-images' and is_staff());

create policy "Staff can delete product images"
on storage.objects for delete
using (bucket_id = 'product-images' and is_staff());
