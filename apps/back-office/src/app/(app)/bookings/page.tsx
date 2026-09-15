import { createClient as createServerClient } from "@zoeallure/supabase/server";
import Link from "next/link";
import { SectionEyebrow } from "../badge";
import { Button } from "@/components/ui/button";
import { BookingsTable, type BookingRow } from "./bookings-table";
import type { Database } from "@zoeallure/supabase";

export const dynamic = "force-dynamic";

type BookingStatus = Database["public"]["Tables"]["bookings"]["Row"]["status"];

const FILTERS: { key: BookingStatus | "all"; label: string }[] = [
  { key: "all", label: "All" },
  { key: "requested", label: "Requested" },
  { key: "accepted", label: "Accepted" },
  { key: "completed", label: "Completed" },
  { key: "declined", label: "Declined" },
];

export default async function BookingsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const activeFilter = (status ?? "all") as BookingStatus | "all";

  const supabase = await createServerClient();
  let query = supabase.from("bookings").select("*").order("scheduled_at", { ascending: true });
  if (activeFilter !== "all") query = query.eq("status", activeFilter);
  const { data: bookings } = await query;

  const { count: bookingCount } = await supabase.from("bookings").select("*", { count: "exact", head: true });
  const { count: pendingCount } = await supabase
    .from("bookings")
    .select("*", { count: "exact", head: true })
    .eq("status", "requested");

  const serviceIds = [...new Set((bookings ?? []).map((b) => b.service_id))];
  const { data: services } = serviceIds.length
    ? await supabase.from("services").select("id, name").in("id", serviceIds)
    : { data: [] as { id: string; name: string }[] };
  const serviceNameById = Object.fromEntries((services ?? []).map((s) => [s.id, s.name]));

  const customerIds = [...new Set((bookings ?? []).map((b) => b.customer_id).filter((v): v is string => !!v))];
  const { data: customers } = customerIds.length
    ? await supabase.from("customer_profiles").select("id, name").in("id", customerIds)
    : { data: [] as { id: string; name: string }[] };
  const customerNameById = Object.fromEntries((customers ?? []).map((c) => [c.id, c.name]));

  const rows: BookingRow[] = (bookings ?? []).map((b) => ({
    ...b,
    serviceName: serviceNameById[b.service_id] ?? "Service",
    customerName: b.customer_id ? (customerNameById[b.customer_id] ?? null) : null,
  }));

  return (
    <div>
      <SectionEyebrow>Services</SectionEyebrow>
      <h1 className="mt-3.5 font-display text-[28px] font-normal tracking-[-0.01em] sm:text-[34px] lg:text-[38px]">
        Bookings
      </h1>
      <p className="mt-2 text-[13.5px] text-noir-500 sm:text-[14.5px]">
        {bookingCount ?? 0} appointments · {pendingCount ?? 0} requested and waiting on a decision.
      </p>

      <div className="mt-6 mb-5 flex flex-wrap gap-2.5">
        {FILTERS.map((f) => {
          const active = f.key === activeFilter;
          return (
            <Button
              asChild
              variant="outline"
              key={f.key}
              className="h-auto rounded-full border px-[18px] py-[9px] text-[12.5px] font-bold"
              style={{
                borderColor: active ? "transparent" : "#D8D5E0",
                background: active ? "#1A1720" : "transparent",
                color: active ? "#fff" : "#403B4C",
              }}
            >
              <Link href={f.key === "all" ? "/bookings" : `/bookings?status=${f.key}`}>{f.label}</Link>
            </Button>
          );
        })}
      </div>

      <BookingsTable bookings={rows} />
    </div>
  );
}
