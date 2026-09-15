"use server";

import { createClient as createServerClient } from "@zoeallure/supabase/server";
import type { TablesInsert, TablesUpdate } from "@zoeallure/supabase";
import { revalidatePath } from "next/cache";

export async function createTicket(input: TablesInsert<"tickets">) {
  const supabase = await createServerClient();
  const { data, error } = await supabase.from("tickets").insert(input).select().single();
  if (error) throw new Error(error.message);
  revalidatePath("/tickets");
  revalidatePath("/");
  return data;
}

export async function updateTicket(id: string, input: TablesUpdate<"tickets">) {
  const supabase = await createServerClient();
  const { error } = await supabase.from("tickets").update(input).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/tickets");
  revalidatePath(`/tickets/${id}`);
}

export async function deleteTicket(id: string) {
  const supabase = await createServerClient();
  const { error } = await supabase.from("tickets").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/tickets");
}
