import { createClient as createServerClient } from "@zoeallure/supabase/server";
import Link from "next/link";
import { SectionEyebrow } from "../badge";
import { Button } from "@/components/ui/button";
import { TicketsTable } from "./tickets-table";
import type { Database } from "@zoeallure/supabase";

export const dynamic = "force-dynamic";

type TicketStatus = Database["public"]["Tables"]["tickets"]["Row"]["status"];

const FILTERS: { key: TicketStatus | "all"; label: string }[] = [
  { key: "all", label: "All" },
  { key: "reserved", label: "Reserved" },
  { key: "paid", label: "Paid" },
  { key: "cancelled", label: "Cancelled" },
];

export default async function TicketsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const activeFilter = (status ?? "all") as TicketStatus | "all";

  const supabase = await createServerClient();
  let query = supabase.from("tickets").select("*").order("created_at", { ascending: false });
  if (activeFilter !== "all") query = query.eq("status", activeFilter);
  const { data: tickets } = await query;

  const { count: ticketCount } = await supabase.from("tickets").select("*", { count: "exact", head: true });
  const { count: vipCount } = await supabase
    .from("tickets")
    .select("*", { count: "exact", head: true })
    .eq("tier", "vip");
  const { count: gaCount } = await supabase
    .from("tickets")
    .select("*", { count: "exact", head: true })
    .eq("tier", "ga");

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <SectionEyebrow>Exhibition</SectionEyebrow>
          <h1 className="mt-3.5 font-display text-[28px] font-normal tracking-[-0.01em] sm:text-[34px] lg:text-[38px]">
            Ticket registrations
          </h1>
          <p className="mt-2 text-[13.5px] text-noir-500 sm:text-[14.5px]">
            {ticketCount ?? 0} registered · {vipCount ?? 0} VIP (₦20,000) · {gaCount ?? 0} general (₦1,000).
          </p>
        </div>
        <Button
          asChild
          className="h-auto rounded-full bg-noir-800 px-[22px] py-3 text-[13.5px] font-bold text-white hover:bg-violet-500"
        >
          <Link href="/tickets/new">+ Add ticket</Link>
        </Button>
      </div>

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
              <Link href={f.key === "all" ? "/tickets" : `/tickets?status=${f.key}`}>{f.label}</Link>
            </Button>
          );
        })}
      </div>

      <TicketsTable tickets={tickets ?? []} />
    </div>
  );
}
