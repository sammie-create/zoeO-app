import { createClient as createServerClient } from "@zoeallure/supabase/server";
import Link from "next/link";
import { SectionEyebrow } from "../badge";
import { Button } from "@/components/ui/button";
import { LINE_META, STATUS_BADGE, TICKET_TIER } from "@/lib/catalog";
import { ngn } from "@/lib/format";
import type { ProductCategory } from "@zoeallure/supabase";

export const dynamic = "force-dynamic";

type Period = "month" | "last_month" | "all";

function periodRange(period: Period) {
  const now = new Date();
  if (period === "all") return { start: null, end: null };
  const y = now.getUTCFullYear();
  const m = now.getUTCMonth();
  if (period === "month") {
    return { start: new Date(Date.UTC(y, m, 1)).toISOString(), end: new Date(Date.UTC(y, m + 1, 1)).toISOString() };
  }
  return { start: new Date(Date.UTC(y, m - 1, 1)).toISOString(), end: new Date(Date.UTC(y, m, 1)).toISOString() };
}

function Bar({ label, pct, value, color }: { label: string; pct: number; value: string; color: string }) {
  return (
    <div>
      <div className="mb-1.5 flex justify-between text-[12.5px]">
        <span className="text-noir-600">{label}</span>
        <span className="font-bold text-noir-800">{value}</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-[#F0EEF3]">
        <div className="h-full rounded-full" style={{ width: `${pct}%`, background: color }} />
      </div>
    </div>
  );
}

const PERIODS: { key: Period; label: string }[] = [
  { key: "month", label: "This month" },
  { key: "last_month", label: "Last month" },
  { key: "all", label: "All time" },
];

export default async function AnalyticsPage({
  searchParams,
}: {
  searchParams: Promise<{ period?: string }>;
}) {
  const { period: periodParam } = await searchParams;
  const period = (periodParam ?? "month") as Period;
  const { start, end } = periodRange(period);

  const supabase = await createServerClient();

  let orderQuery = supabase.from("orders").select("id, payment_status, order_date");
  if (start) orderQuery = orderQuery.gte("order_date", start).lt("order_date", end!);
  const { data: orders } = await orderQuery;

  let bookingQuery = supabase.from("bookings").select("id, deposit_amount, service_id, created_at");
  if (start) bookingQuery = bookingQuery.gte("created_at", start).lt("created_at", end!);
  const { data: bookings } = await bookingQuery;

  let ticketQuery = supabase.from("tickets").select("tier, status, created_at");
  if (start) ticketQuery = ticketQuery.gte("created_at", start).lt("created_at", end!);
  const { data: tickets } = await ticketQuery;

  let customerQuery = supabase.from("customer_profiles").select("id, created_at");
  if (start) customerQuery = customerQuery.gte("created_at", start).lt("created_at", end!);
  const { count: newCustomers } = await customerQuery;

  const orderIds = (orders ?? []).map((o) => o.id);
  const itemsRes = orderIds.length
    ? await supabase
        .from("order_items")
        .select("order_id, quantity, unit_price, products(name, category)")
        .in("order_id", orderIds)
    : { data: [] };
  const items = (itemsRes.data ?? []) as unknown as {
    order_id: string;
    quantity: number;
    unit_price: number;
    products: { name: string; category: ProductCategory } | null;
  }[];

  const paidOrderIds = new Set((orders ?? []).filter((o) => o.payment_status === "paid").map((o) => o.id));
  let orderRevenue = 0;
  const categoryRevenue: Record<string, number> = {};
  const productRevenue: Record<string, number> = {};
  for (const it of items) {
    if (!paidOrderIds.has(it.order_id)) continue;
    const lineTotal = it.quantity * it.unit_price;
    orderRevenue += lineTotal;
    const cat = it.products?.category;
    if (cat) categoryRevenue[cat] = (categoryRevenue[cat] ?? 0) + lineTotal;
    const name = it.products?.name ?? "Product";
    productRevenue[name] = (productRevenue[name] ?? 0) + lineTotal;
  }

  const bookingRevenue = (bookings ?? []).reduce((sum, b) => sum + (b.deposit_amount ?? 0), 0);
  const ticketRevenue = (tickets ?? [])
    .filter((t) => t.status === "paid")
    .reduce((sum, t) => sum + TICKET_TIER[t.tier].price, 0);
  const revenue = orderRevenue + bookingRevenue + ticketRevenue;

  const aov = paidOrderIds.size > 0 ? orderRevenue / paidOrderIds.size : 0;

  const statusCounts = { paid: 0, pending: 0, cancelled: 0 } as Record<string, number>;
  for (const o of orders ?? []) statusCounts[o.payment_status] = (statusCounts[o.payment_status] ?? 0) + 1;
  const totalOrders = orders?.length ?? 0;

  const categoryEntries = Object.entries(categoryRevenue).sort((a, b) => b[1] - a[1]);
  const maxCategoryRevenue = categoryEntries[0]?.[1] ?? 1;

  const topProducts = Object.entries(productRevenue)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const serviceIds = [...new Set((bookings ?? []).map((b) => b.service_id))];
  const { data: services } = serviceIds.length
    ? await supabase.from("services").select("id, name").in("id", serviceIds)
    : { data: [] as { id: string; name: string }[] };
  const serviceNameById = Object.fromEntries((services ?? []).map((s) => [s.id, s.name]));
  const bookingsByService: Record<string, number> = {};
  for (const b of bookings ?? []) {
    const name = serviceNameById[b.service_id] ?? "Service";
    bookingsByService[name] = (bookingsByService[name] ?? 0) + 1;
  }
  const bookingServiceEntries = Object.entries(bookingsByService).sort((a, b) => b[1] - a[1]);
  const maxBookingCount = bookingServiceEntries[0]?.[1] ?? 1;

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <SectionEyebrow>Analytics</SectionEyebrow>
          <h1 className="mt-3.5 font-display text-[28px] font-normal tracking-[-0.01em] sm:text-[34px] lg:text-[38px]">
            Income &amp; performance
          </h1>
          <p className="mt-2 text-[13.5px] text-noir-500 sm:text-[14.5px]">
            Real figures only — every card recomputes for the period you pick.
          </p>
        </div>
        <div className="flex gap-2">
          {PERIODS.map((p) => {
            const active = p.key === period;
            return (
              <Button
                asChild
                variant="outline"
                key={p.key}
                className="h-auto rounded-full px-[18px] py-[9px] text-[12.5px] font-bold"
                style={{
                  borderColor: active ? "transparent" : "#D8D5E0",
                  background: active ? "#1A1720" : "transparent",
                  color: active ? "#fff" : "#403B4C",
                }}
              >
                <Link href={p.key === "month" ? "/analytics" : `/analytics?period=${p.key}`}>{p.label}</Link>
              </Button>
            );
          })}
        </div>
      </div>

      <div className="mt-7 grid grid-cols-2 gap-3.5 lg:grid-cols-4">
        <div className="flex flex-col gap-1.5 rounded-2xl bg-[linear-gradient(150deg,#7F23E0,#55129B_62%,#3F0E74)] p-5 text-white">
          <span className="text-[10.5px] font-bold tracking-[0.1em] text-violet-100 uppercase">Revenue</span>
          <span className="font-display text-xl">{ngn(revenue)}</span>
        </div>
        <div className="flex flex-col gap-1.5 rounded-2xl border border-noir-100 p-5">
          <span className="text-[10.5px] font-bold tracking-[0.1em] text-noir-400 uppercase">Orders</span>
          <span className="font-display text-xl text-noir-800">{totalOrders}</span>
        </div>
        <div className="flex flex-col gap-1.5 rounded-2xl border border-noir-100 p-5">
          <span className="text-[10.5px] font-bold tracking-[0.1em] text-noir-400 uppercase">Avg. order value</span>
          <span className="font-display text-xl text-noir-800">{ngn(aov)}</span>
        </div>
        <div className="flex flex-col gap-1.5 rounded-2xl border border-noir-100 p-5">
          <span className="text-[10.5px] font-bold tracking-[0.1em] text-noir-400 uppercase">New customers</span>
          <span className="font-display text-xl text-noir-800">{newCustomers ?? 0}</span>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-2">
        <div className="rounded-[18px] border border-noir-100 p-6">
          <span className="text-[15px] font-bold">Top selling categories</span>
          <div className="mt-5 grid gap-4">
            {categoryEntries.length === 0 && <p className="text-[12.5px] text-noir-400">No paid orders yet.</p>}
            {categoryEntries.map(([cat, rev]) => (
              <Bar
                key={cat}
                label={LINE_META[cat as ProductCategory]?.line ?? cat}
                pct={(rev / maxCategoryRevenue) * 100}
                value={ngn(rev)}
                color={LINE_META[cat as ProductCategory]?.swatch ?? "#7F23E0"}
              />
            ))}
          </div>
        </div>

        <div className="rounded-[18px] border border-noir-100 p-6">
          <span className="text-[15px] font-bold">Orders by payment status</span>
          <div className="mt-5 grid gap-4">
            {(["paid", "pending", "cancelled"] as const).map((s) => (
              <Bar
                key={s}
                label={STATUS_BADGE[s].label}
                pct={totalOrders > 0 ? (statusCounts[s] / totalOrders) * 100 : 0}
                value={`${statusCounts[s] ?? 0}`}
                color={STATUS_BADGE[s].fg}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-2">
        <div className="overflow-hidden rounded-[18px] border border-noir-100">
          <div className="px-[22px] py-[18px]">
            <span className="text-[15px] font-bold">Top products by revenue</span>
          </div>
          {topProducts.length === 0 && (
            <div className="border-t border-[#F0EEF3] px-[22px] py-6 text-[13px] text-noir-400">
              No paid orders yet.
            </div>
          )}
          {topProducts.map(([name, rev]) => (
            <div key={name} className="flex items-center justify-between gap-3 border-t border-[#F0EEF3] px-[22px] py-3">
              <span className="text-[13px] font-semibold text-noir-800">{name}</span>
              <span className="text-[13px] font-bold text-noir-800">{ngn(rev)}</span>
            </div>
          ))}
        </div>

        <div className="rounded-[18px] border border-noir-100 p-6">
          <span className="text-[15px] font-bold">Bookings by service</span>
          <div className="mt-5 grid gap-3.5">
            {bookingServiceEntries.length === 0 && (
              <p className="text-[12.5px] text-noir-400">No bookings in this period.</p>
            )}
            {bookingServiceEntries.map(([name, count]) => (
              <Bar
                key={name}
                label={name}
                pct={(count / maxBookingCount) * 100}
                value={`${count}`}
                color="#B689F6"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
