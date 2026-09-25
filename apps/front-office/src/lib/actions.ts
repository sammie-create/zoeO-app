"use server";

import { createClient } from "@zoeallure/supabase/server";

export type CartLine = { id: string; qty: number };

export async function placeOrder(input: {
  name: string;
  phone: string;
  email: string | null;
  fulfilmentType: "delivery" | "pickup";
  fulfilmentDetail: string | null;
  address: string | null;
  items: CartLine[];
}) {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("create_guest_order", {
    p_name: input.name,
    p_phone: input.phone,
    p_email: input.email,
    p_fulfilment_type: input.fulfilmentType,
    p_fulfilment_detail: input.fulfilmentDetail,
    p_address: input.address,
    p_items: input.items.map((i) => ({ product_id: i.id, quantity: i.qty })),
  });
  if (error) throw new Error(error.message);
  return data;
}

export async function placeBooking(input: {
  name: string;
  phone: string;
  email: string | null;
  serviceId: string;
  scheduledAt: string;
  locationType: "studio" | "home_service";
  locationDetail: string | null;
  notes: string | null;
}) {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("create_guest_booking", {
    p_name: input.name,
    p_phone: input.phone,
    p_email: input.email,
    p_service_id: input.serviceId,
    p_scheduled_at: input.scheduledAt,
    p_location_type: input.locationType,
    p_location_detail: input.locationDetail,
    p_notes: input.notes,
  });
  if (error) throw new Error(error.message);
  return data;
}
