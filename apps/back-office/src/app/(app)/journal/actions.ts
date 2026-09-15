"use server";

import { createClient as createServerClient } from "@zoeallure/supabase/server";
import type { TablesInsert, TablesUpdate } from "@zoeallure/supabase";
import { revalidatePath } from "next/cache";

export async function createJournalPost(input: TablesInsert<"journal_posts">) {
  const supabase = await createServerClient();
  const { data, error } = await supabase.from("journal_posts").insert(input).select().single();
  if (error) throw new Error(error.message);
  revalidatePath("/journal");
  return data;
}

export async function updateJournalPost(id: string, input: TablesUpdate<"journal_posts">) {
  const supabase = await createServerClient();
  const { error } = await supabase.from("journal_posts").update(input).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/journal");
}

export async function deleteJournalPost(id: string) {
  const supabase = await createServerClient();
  const { error } = await supabase.from("journal_posts").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/journal");
}
