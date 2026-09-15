"use server";

import { createClient as createServerClient } from "@zoeallure/supabase/server";
import type { TablesInsert, TablesUpdate } from "@zoeallure/supabase";
import { revalidatePath } from "next/cache";

export async function createTestimonial(input: TablesInsert<"testimonials">) {
  const supabase = await createServerClient();
  const { error } = await supabase.from("testimonials").insert(input);
  if (error) throw new Error(error.message);
  revalidatePath("/testimonials");
}

export async function updateTestimonial(id: string, input: TablesUpdate<"testimonials">) {
  const supabase = await createServerClient();
  const { error } = await supabase.from("testimonials").update(input).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/testimonials");
}

export async function deleteTestimonial(id: string) {
  const supabase = await createServerClient();
  const { error } = await supabase.from("testimonials").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/testimonials");
}
