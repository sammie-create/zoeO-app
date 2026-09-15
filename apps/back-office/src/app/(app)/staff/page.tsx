import { createClient as createServerClient } from "@zoeallure/supabase/server";
import { createAdminClient } from "@zoeallure/supabase/admin";
import { SectionEyebrow } from "../badge";
import { StaffTable, type StaffRow } from "./staff-table";

export const dynamic = "force-dynamic";

export default async function StaffPage() {
  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [{ data: staff }, { data: roles }] = await Promise.all([
    supabase.from("staff_profiles").select("*").order("created_at", { ascending: true }),
    supabase.from("staff_roles").select("*"),
  ]);
  const roleLabelById = Object.fromEntries((roles ?? []).map((r) => [r.id, r.label]));

  const admin = createAdminClient();
  const { data: usersData } = await admin.auth.admin.listUsers();
  const userById = new Map(usersData?.users.map((u) => [u.id, u]));

  const rows: StaffRow[] = (staff ?? []).map((s) => ({
    ...s,
    email: userById.get(s.id)?.email ?? "—",
    roleLabel: roleLabelById[s.role_id] ?? s.role_id,
    lastSignIn: userById.get(s.id)?.last_sign_in_at ?? null,
  }));

  return (
    <div>
      <SectionEyebrow>Access</SectionEyebrow>
      <h1 className="mt-3.5 font-display text-[28px] font-normal tracking-[-0.01em] sm:text-[34px] lg:text-[38px]">
        Staff management
      </h1>
      <p className="mt-2 text-[13.5px] text-noir-500 sm:text-[14.5px]">
        {rows.length} people with access to this back office.
      </p>

      <div className="mt-7">
        <StaffTable staff={rows} currentUserId={user?.id ?? ""} />
      </div>
    </div>
  );
}
