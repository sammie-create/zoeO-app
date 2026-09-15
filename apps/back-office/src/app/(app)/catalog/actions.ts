"use server";

import { createClient as createServerClient } from "@zoeallure/supabase/server";
import type { TablesInsert, TablesUpdate } from "@zoeallure/supabase";
import { revalidatePath } from "next/cache";

export async function createService(input: TablesInsert<"services">) {
  const supabase = await createServerClient();
  const { data, error } = await supabase.from("services").insert(input).select().single();
  if (error) throw new Error(error.message);
  revalidatePath("/catalog");
  return data;
}

export async function updateService(id: string, input: TablesUpdate<"services">) {
  const supabase = await createServerClient();
  const { error } = await supabase.from("services").update(input).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/catalog");
}

export async function toggleServicePublish(id: string, status: "draft" | "published") {
  const supabase = await createServerClient();
  const { error } = await supabase.from("services").update({ status }).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/catalog");
}

export async function deleteService(id: string) {
  const supabase = await createServerClient();
  const { error } = await supabase.from("services").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/catalog");
}
