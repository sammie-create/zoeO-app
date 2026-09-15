import type { createClient as createServerClient } from "@zoeallure/supabase/server";
import { TICKET_TIER } from "./catalog";

type Supabase = Awaited<ReturnType<typeof createServerClient>>;

export type CustomerAggregate = {
  spend: number;
  lastActive: string | null;
  tags: string[];
  history: { text: string; date: string }[];
};

export async function computeCustomerAggregates(
  supabase: Supabase,
): Promise<Record<string, CustomerAggregate>> {
  const [{ data: orders }, { data: bookings }, { data: tickets }] = await Promise.all([
    supabase
      .from("orders")
      .select("id, ref, customer_id, payment_status, created_at")
      .not("customer_id", "is", null),
    supabase
      .from("bookings")
      .select("ref, customer_id, deposit_amount, status, created_at, service_id")
      .not("customer_id", "is", null),
    supabase
      .from("tickets")
      .select("ref, customer_id, tier, status, created_at")
      .not("customer_id", "is", null),
  ]);

  const orderIds = (orders ?? []).map((o) => o.id);
  const { data: items } = orderIds.length
    ? await supabase.from("order_items").select("order_id, quantity, unit_price").in("order_id", orderIds)
    : { data: [] as { order_id: string; quantity: number; unit_price: number }[] };
  const totalByOrder: Record<string, number> = {};
  for (const it of items ?? []) {
    totalByOrder[it.order_id] = (totalByOrder[it.order_id] ?? 0) + it.quantity * it.unit_price;
  }

  const serviceIds = [...new Set((bookings ?? []).map((b) => b.service_id))];
  const { data: services } = serviceIds.length
    ? await supabase.from("services").select("id, name").in("id", serviceIds)
    : { data: [] as { id: string; name: string }[] };
  const serviceNameById = Object.fromEntries((services ?? []).map((s) => [s.id, s.name]));

  const result: Record<string, CustomerAggregate> = {};

  function ensure(id: string): CustomerAggregate {
    if (!result[id]) result[id] = { spend: 0, lastActive: null, tags: [], history: [] };
    return result[id];
  }

  function bump(agg: CustomerAggregate, date: string) {
    if (!agg.lastActive || new Date(date) > new Date(agg.lastActive)) agg.lastActive = date;
  }

  for (const o of orders ?? []) {
    const agg = ensure(o.customer_id!);
    if (!agg.tags.includes("Order")) agg.tags.push("Order");
    const total = totalByOrder[o.id] ?? 0;
    if (o.payment_status === "paid") agg.spend += total;
    agg.history.push({ text: `Order ${o.ref} ${o.payment_status}`, date: o.created_at });
    bump(agg, o.created_at);
  }

  for (const b of bookings ?? []) {
    const agg = ensure(b.customer_id!);
    if (!agg.tags.includes("Booking")) agg.tags.push("Booking");
    agg.spend += b.deposit_amount ?? 0;
    const serviceName = serviceNameById[b.service_id] ?? "service";
    agg.history.push({ text: `Booking ${b.ref} ${b.status} — ${serviceName}`, date: b.created_at });
    bump(agg, b.created_at);
  }

  for (const t of tickets ?? []) {
    const agg = ensure(t.customer_id!);
    if (!agg.tags.includes("Ticket")) agg.tags.push("Ticket");
    if (t.status === "paid") agg.spend += TICKET_TIER[t.tier].price;
    agg.history.push({ text: `Ticket ${t.ref} registered (${TICKET_TIER[t.tier].label})`, date: t.created_at });
    bump(agg, t.created_at);
  }

  for (const agg of Object.values(result)) {
    agg.history.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  return result;
}
