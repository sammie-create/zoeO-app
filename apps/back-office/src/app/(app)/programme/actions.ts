"use server";

import { createClient as createServerClient } from "@zoeallure/supabase/server";
import type { Database, TablesInsert, TablesUpdate } from "@zoeallure/supabase";
import { revalidatePath } from "next/cache";

type SlotTime = Database["public"]["Tables"]["programme_slots"]["Row"]["slot_time"];

const SLOT_TIMES = ["10 AM", "12 PM", "2 PM", "4 PM", "6 PM"] as const satisfies readonly SlotTime[];

export async function createProgramme(
  input: Omit<TablesInsert<"programmes">, "id">,
  slots: boolean[],
) {
  const supabase = await createServerClient();
  const { data, error } = await supabase.from("programmes").insert(input).select().single();
  if (error) throw new Error(error.message);

  const slotRows = SLOT_TIMES.map((time, i) => ({
    programme_id: data.id,
    slot_time: time,
    is_available: slots[i] ?? true,
  }));
  const { error: slotError } = await supabase.from("programme_slots").insert(slotRows);
  if (slotError) throw new Error(slotError.message);

  revalidatePath("/programme");
  return data;
}

export async function updateProgramme(id: string, input: TablesUpdate<"programmes">) {
  const supabase = await createServerClient();
  const { error } = await supabase.from("programmes").update(input).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/programme");
}

export async function toggleProgrammePublish(id: string, status: "draft" | "published") {
  const supabase = await createServerClient();
  const { error } = await supabase.from("programmes").update({ status }).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/programme");
}

export async function toggleProgrammeSlot(programmeId: string, slotTime: SlotTime, isAvailable: boolean) {
  const supabase = await createServerClient();
  const { error } = await supabase
    .from("programme_slots")
    .update({ is_available: isAvailable })
    .eq("programme_id", programmeId)
    .eq("slot_time", slotTime);
  if (error) throw new Error(error.message);
  revalidatePath("/programme");
}

export async function deleteProgramme(id: string) {
  const supabase = await createServerClient();
  const { error } = await supabase.from("programmes").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/programme");
}
