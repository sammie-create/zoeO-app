-- ZoeO Allure — Migration 20: customer reviews
-- Public-facing reviews page: client-submitted star ratings + text, optionally
-- tagged to a service or product and with an optional photo. Distinct from
-- `testimonials` (staff-written quotes for the homepage carousel, no rating).
-- Reviews publish immediately — no draft/pending status — but staff keep
-- full access so an inappropriate one can be deleted from the back office.

create table reviews (
  id            uuid primary key default gen_random_uuid(),
  customer_name text not null check (char_length(trim(customer_name)) > 0),
  rating        smallint not null check (rating between 1 and 5),
  body          text not null check (char_length(trim(body)) >= 10),
  photo_url     text,
  service_id    uuid references services(id) on delete set null,
  product_id    uuid references products(id) on delete set null,
  created_at    timestamptz not null default now()
);


alter table reviews enable row level security;

create policy "Public can view reviews" on reviews for select using (true);
create policy "Staff full access" on reviews for all using (is_staff());

insert into storage.buckets (id, name, public)
values ('review-photos', 'review-photos', true)
on conflict (id) do nothing;

create policy "Public can view review photos"
on storage.objects for select
using (bucket_id = 'review-photos');

create policy "Anyone can upload a review photo"
on storage.objects for insert
with check (bucket_id = 'review-photos');

create policy "Staff can delete review photos"
on storage.objects for delete
using (bucket_id = 'review-photos' and is_staff());

-- SECURITY DEFINER so anon can insert without a broad public INSERT grant
-- on the table itself — mirrors create_guest_order/create_guest_booking.
create or replace function create_guest_review(
  p_customer_name text,
  p_rating int,
  p_body text,
  p_photo_url text,
  p_service_id uuid,
  p_product_id uuid
)
returns reviews
language plpgsql
security definer
set search_path = public
as $$
declare
  v_review reviews;
begin
  if p_rating < 1 or p_rating > 5 then
    raise exception 'rating must be between 1 and 5';
  end if;
  if p_service_id is not null and not exists (select 1 from services where id = p_service_id and status = 'published') then
    raise exception 'service % is not available', p_service_id;
  end if;
  if p_product_id is not null and not exists (select 1 from products where id = p_product_id and not is_hidden) then
    raise exception 'product % is not available', p_product_id;
  end if;

  insert into reviews (customer_name, rating, body, photo_url, service_id, product_id)
  values (p_customer_name, p_rating, p_body, p_photo_url, p_service_id, p_product_id)
  returning * into v_review;

  return v_review;
end;
$$;

grant execute on function create_guest_review(text, int, text, text, uuid, uuid) to anon;
