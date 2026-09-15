"use server";

import { createClient as createServerClient } from "@zoeallure/supabase/server";
import type { TablesInsert, TablesUpdate } from "@zoeallure/supabase";
import { revalidatePath } from "next/cache";

export async function createProduct(input: TablesInsert<"products">) {
  const supabase = await createServerClient();
  const { data, error } = await supabase.from("products").insert(input).select().single();
  if (error) throw new Error(error.message);
  revalidatePath("/products");
  return data;
}

export async function updateProduct(id: string, input: TablesUpdate<"products">) {
  const supabase = await createServerClient();
  const { error } = await supabase.from("products").update(input).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/products");
  revalidatePath(`/products/${id}`);
}

export async function toggleProductHidden(id: string, hidden: boolean) {
  const supabase = await createServerClient();
  const { error } = await supabase.from("products").update({ is_hidden: hidden }).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/products");
}

export async function deleteProduct(id: string) {
  const supabase = await createServerClient();
  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/products");
}
