"use server";

import { createClient as createServerClient } from "@zoeallure/supabase/server";
import type { TablesUpdate } from "@zoeallure/supabase";
import { revalidatePath } from "next/cache";

export async function updateAboutStat(id: string, input: TablesUpdate<"about_stats">) {
  const supabase = await createServerClient();
  const { error } = await supabase.from("about_stats").update(input).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/about");
}
