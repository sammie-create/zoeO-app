import { createClient as createServerClient } from "@zoeallure/supabase/server";
import { redirect } from "next/navigation";
import { Shell } from "./shell";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const [{ data: staffProfile }, { count: pendingOrders }, { count: pendingBookings }] =
    await Promise.all([
      supabase.from("staff_profiles").select("name, role_id").eq("id", user.id).single(),
      supabase
        .from("orders")
        .select("*", { count: "exact", head: true })
        .eq("payment_status", "pending"),
      supabase
        .from("bookings")
        .select("*", { count: "exact", head: true })
        .eq("status", "requested"),
    ]);

  const name = staffProfile?.name ?? user.email ?? "Staff";
  let roleLabel = staffProfile?.role_id ?? "Staff";
  if (staffProfile?.role_id) {
    const { data: role } = await supabase
      .from("staff_roles")
      .select("label")
      .eq("id", staffProfile.role_id)
      .single();
    if (role) roleLabel = role.label;
  }

  // Not awaited: the notification-bell preview lists aren't needed for first
  // paint, so they stream in separately (via `use()` in the client tree)
  // instead of blocking every route under this layout on two extra queries.
  const pendingPreviewPromise = Promise.all([
    supabase
      .from("orders")
      .select("id, ref, order_date, phone")
      .eq("payment_status", "pending")
      .order("order_date", { ascending: false })
      .limit(5),
    supabase
      .from("bookings")
      .select("id, ref, scheduled_at, phone")
      .eq("status", "requested")
      .order("scheduled_at", { ascending: true })
      .limit(5),
  ]).then(([ordersRes, bookingsRes]) => ({
    pendingOrdersPreview: ordersRes.data ?? [],
    pendingBookingsPreview: bookingsRes.data ?? [],
  }));

  return (
    <Shell
      name={name}
      roleLabel={roleLabel}
      pendingOrders={pendingOrders ?? 0}
      pendingBookings={pendingBookings ?? 0}
      pendingPreviewPromise={pendingPreviewPromise}
    >
      {children}
    </Shell>
  );
}
