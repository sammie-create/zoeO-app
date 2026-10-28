"use server";

import { createClient as createServerClient } from "@zoeallure/supabase/server";
import { revalidatePath } from "next/cache";

export async function deleteReview(id: string) {
  const supabase = await createServerClient();
  const { error } = await supabase.from("reviews").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/reviews");
}
