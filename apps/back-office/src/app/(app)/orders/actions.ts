"use server";

import { createClient as createServerClient } from "@zoeallure/supabase/server";
import type { Database } from "@zoeallure/supabase";
import { revalidatePath } from "next/cache";

type PaymentStatus = Database["public"]["Tables"]["orders"]["Row"]["payment_status"];
type DeliveryStatus = Database["public"]["Tables"]["orders"]["Row"]["delivery_status"];

export async function updateOrderPaymentStatus(id: string, status: PaymentStatus) {
  const supabase = await createServerClient();
  const { error } = await supabase.from("orders").update({ payment_status: status }).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/orders");
  revalidatePath(`/orders/${id}`);
  revalidatePath("/");
}

export async function updateOrderDeliveryStatus(id: string, status: DeliveryStatus) {
  const supabase = await createServerClient();
  const { error } = await supabase.from("orders").update({ delivery_status: status }).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/orders");
  revalidatePath(`/orders/${id}`);
}

export async function deleteOrder(id: string) {
  const supabase = await createServerClient();
  const { error } = await supabase.from("orders").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/orders");
}
