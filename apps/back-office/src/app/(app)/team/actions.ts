"use server";

import { createClient as createServerClient } from "@zoeallure/supabase/server";
import type { TablesInsert, TablesUpdate } from "@zoeallure/supabase";
import { revalidatePath } from "next/cache";

function initialsOf(name: string) {
  const parts = name.trim().split(/\s+/);
  return (parts[0]?.[0] ?? "").concat(parts[1]?.[0] ?? "").toUpperCase();
}

export async function createTeamMember(input: Omit<TablesInsert<"team_members">, "initials">) {
  const supabase = await createServerClient();
  const { error } = await supabase.from("team_members").insert({ ...input, initials: initialsOf(input.name) });
  if (error) throw new Error(error.message);
  revalidatePath("/team");
}

export async function updateTeamMember(id: string, input: TablesUpdate<"team_members">) {
  const supabase = await createServerClient();
  const patch = { ...input };
  if (input.name) patch.initials = initialsOf(input.name);
  const { error } = await supabase.from("team_members").update(patch).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/team");
}

export async function deleteTeamMember(id: string) {
  const supabase = await createServerClient();
  const { error } = await supabase.from("team_members").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/team");
}
