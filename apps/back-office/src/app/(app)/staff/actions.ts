"use server";

import { createClient as createServerClient } from "@zoeallure/supabase/server";
import { createAdminClient } from "@zoeallure/supabase/admin";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

export async function inviteStaff(name: string, email: string, roleId: string) {
  const headerList = await headers();
  const origin = headerList.get("origin") ?? `https://${headerList.get("host")}`;

  const admin = createAdminClient();
  const { data, error } = await admin.auth.admin.inviteUserByEmail(email, {
    data: { is_staff: "true", name },
    redirectTo: `${origin}/reset-password`,
  });
  if (error) throw new Error(error.message);

  if (roleId !== "staff" && data.user) {
    const supabase = await createServerClient();
    const { error: roleError } = await supabase
      .from("staff_profiles")
      .update({ role_id: roleId })
      .eq("id", data.user.id);
    if (roleError) throw new Error(roleError.message);
  }

  revalidatePath("/staff");
}

export async function updateStaffRole(id: string, roleId: string) {
  const supabase = await createServerClient();
  const { error } = await supabase.from("staff_profiles").update({ role_id: roleId }).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/staff");
}

export async function removeStaff(id: string) {
  const supabase = await createServerClient();
  const { error } = await supabase.from("staff_profiles").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/staff");
}
