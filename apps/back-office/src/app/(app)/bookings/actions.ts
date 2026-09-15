"use server";

import { createClient as createServerClient } from "@zoeallure/supabase/server";
import type { Database } from "@zoeallure/supabase";
import { revalidatePath } from "next/cache";

type BookingStatus = Database["public"]["Tables"]["bookings"]["Row"]["status"];

export async function updateBookingStatus(id: string, status: BookingStatus) {
  const supabase = await createServerClient();
  const { error } = await supabase.from("bookings").update({ status }).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/bookings");
  revalidatePath("/");
}

export async function deleteBooking(id: string) {
  const supabase = await createServerClient();
  const { error } = await supabase.from("bookings").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/bookings");
}
