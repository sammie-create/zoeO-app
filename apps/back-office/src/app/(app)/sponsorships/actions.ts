"use server";

import { createClient as createServerClient } from "@zoeallure/supabase/server";
import { revalidatePath } from "next/cache";

const CYCLE = ["new", "contacted", "confirmed"] as const;

export async function cycleSponsorStatus(id: string, current: (typeof CYCLE)[number]) {
  const next = CYCLE[(CYCLE.indexOf(current) + 1) % CYCLE.length];
  const supabase = await createServerClient();
  const { error } = await supabase.from("sponsors").update({ status: next }).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/sponsorships");
  return next;
}
