-- ZoeO Allure — Migration 17: manual bank transfer + proof-of-payment upload
-- Online payment gateways (Paystack/Flutterwave) aren't integrated yet, so
-- checkout is temporarily bank-transfer only. Guests upload a screenshot/PDF
-- receipt at checkout; staff review it against the bank statement and mark
-- the order paid manually from the back office.

alter table orders add column if not exists payment_proof_url text;

insert into storage.buckets (id, name, public)
values ('payment-proofs', 'payment-proofs', true)
on conflict (id) do nothing;

create policy "Public can view payment proofs"
on storage.objects for select
using (bucket_id = 'payment-proofs');

create policy "Anyone can upload a payment proof"
on storage.objects for insert
with check (bucket_id = 'payment-proofs');

create policy "Staff can delete payment proofs"
on storage.objects for delete
using (bucket_id = 'payment-proofs' and is_staff());

drop function if exists create_guest_order(text, text, text, text, text, text, jsonb);

create or replace function create_guest_order(
  p_name text,
  p_phone text,
  p_email text,
  p_fulfilment_type text,
  p_fulfilment_detail text,
  p_address text,
  p_items jsonb, -- [{ "product_id": uuid, "quantity": int }, ...]
  p_payment_proof_url text default null
)
returns orders
language plpgsql
security definer
set search_path = public
as $$
declare
  v_customer_id uuid;
  v_order       orders;
  v_item        jsonb;
  v_price       numeric(12,2);
begin
  if p_fulfilment_type not in ('delivery', 'pickup') then
    raise exception 'invalid fulfilment_type';
  end if;
  if jsonb_array_length(p_items) = 0 then
    raise exception 'order must have at least one item';
  end if;

  insert into customer_profiles (name, phone, email)
  values (p_name, p_phone, p_email)
  on conflict (phone) do update set name = excluded.name, email = coalesce(excluded.email, customer_profiles.email)
  returning id into v_customer_id;

  insert into orders (customer_id, phone, fulfilment_type, fulfilment_detail, address, payment_proof_url)
  values (v_customer_id, p_phone, p_fulfilment_type, p_fulfilment_detail, p_address, p_payment_proof_url)
  returning * into v_order;

  for v_item in select * from jsonb_array_elements(p_items) loop
    select price into v_price from products where id = (v_item ->> 'product_id')::uuid and not is_hidden;
    if v_price is null then
      raise exception 'product % is not available', v_item ->> 'product_id';
    end if;
    insert into order_items (order_id, product_id, quantity, unit_price)
    values (v_order.id, (v_item ->> 'product_id')::uuid, (v_item ->> 'quantity')::int, v_price);
  end loop;

  return v_order;
end;
$$;

grant execute on function create_guest_order(text, text, text, text, text, text, jsonb, text) to anon;
