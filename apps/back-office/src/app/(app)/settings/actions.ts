"use server";

import { createClient as createServerClient } from "@zoeallure/supabase/server";
import type { TablesUpdate } from "@zoeallure/supabase";
import { revalidatePath } from "next/cache";

export async function updateSettings(input: TablesUpdate<"site_settings">) {
  const supabase = await createServerClient();
  const { error } = await supabase
    .from("site_settings")
    .update({ ...input, updated_at: new Date().toISOString() })
    .eq("id", true);
  if (error) throw new Error(error.message);
  revalidatePath("/settings");
}
