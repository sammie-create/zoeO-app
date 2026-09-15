"use server";

import { createClient as createServerClient } from "@zoeallure/supabase/server";
import type { TablesInsert, TablesUpdate } from "@zoeallure/supabase";
import { revalidatePath } from "next/cache";

export async function createFaq(input: TablesInsert<"faqs">) {
  const supabase = await createServerClient();
  const { error } = await supabase.from("faqs").insert(input);
  if (error) throw new Error(error.message);
  revalidatePath("/faq");
}

export async function updateFaq(id: string, input: TablesUpdate<"faqs">) {
  const supabase = await createServerClient();
  const { error } = await supabase.from("faqs").update(input).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/faq");
}

export async function deleteFaq(id: string) {
  const supabase = await createServerClient();
  const { error } = await supabase.from("faqs").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/faq");
}
