import { createClient as createServerClient } from "@zoeallure/supabase/server";
import Link from "next/link";
import { SectionEyebrow } from "../badge";
import { Button } from "@/components/ui/button";
import { OrdersTable, type OrderRow } from "./orders-table";
import type { Database } from "@zoeallure/supabase";

export const dynamic = "force-dynamic";

type PaymentStatus = Database["public"]["Tables"]["orders"]["Row"]["payment_status"];

const FILTERS: { key: PaymentStatus | "all"; label: string }[] = [
  { key: "all", label: "All" },
  { key: "pending", label: "Pending" },
  { key: "paid", label: "Paid" },
  { key: "cancelled", label: "Cancelled" },
];

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const activeFilter = (status ?? "all") as PaymentStatus | "all";

  const supabase = await createServerClient();
  let query = supabase.from("orders").select("*").order("order_date", { ascending: false });
  if (activeFilter !== "all") query = query.eq("payment_status", activeFilter);
  const { data: orders } = await query;

  const { count: orderCount } = await supabase.from("orders").select("*", { count: "exact", head: true });
  const { count: pendingCount } = await supabase
    .from("orders")
    .select("*", { count: "exact", head: true })
    .eq("payment_status", "pending");

  const orderIds = (orders ?? []).map((o) => o.id);
  const { data: items } = orderIds.length
    ? await supabase.from("order_items").select("order_id, quantity, unit_price").in("order_id", orderIds)
    : { data: [] as { order_id: string; quantity: number; unit_price: number }[] };
  const totalByOrder: Record<string, number> = {};
  for (const it of items ?? []) {
    totalByOrder[it.order_id] = (totalByOrder[it.order_id] ?? 0) + it.quantity * it.unit_price;
  }

  const customerIds = [...new Set((orders ?? []).map((o) => o.customer_id).filter((v): v is string => !!v))];
  const { data: customers } = customerIds.length
    ? await supabase.from("customer_profiles").select("id, name").in("id", customerIds)
    : { data: [] as { id: string; name: string }[] };
  const nameById = Object.fromEntries((customers ?? []).map((c) => [c.id, c.name]));

  const rows: OrderRow[] = (orders ?? []).map((o) => ({
    ...o,
    customerName: o.customer_id ? (nameById[o.customer_id] ?? null) : null,
    total: totalByOrder[o.id] ?? 0,
  }));

  return (
    <div>
      <SectionEyebrow>Commerce</SectionEyebrow>
      <h1 className="mt-3.5 font-display text-[28px] font-normal tracking-[-0.01em] sm:text-[34px] lg:text-[38px]">
        Orders
      </h1>
      <p className="mt-2 text-[13.5px] text-noir-500 sm:text-[14.5px]">
        {orderCount ?? 0} orders · {pendingCount ?? 0} still pending payment.
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
              <Link href={f.key === "all" ? "/orders" : `/orders?status=${f.key}`}>{f.label}</Link>
            </Button>
          );
        })}
      </div>

      <OrdersTable orders={rows} />
    </div>
  );
}
