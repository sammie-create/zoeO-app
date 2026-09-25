import { createClient as createServerClient } from "@zoeallure/supabase/server";
import Link from "next/link";
import { Badge, SectionEyebrow } from "./badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ProductThumb } from "@/components/product-thumb";
import { STATUS_BADGE, STOCK_BADGE, TICKET_TIER, stockLevel } from "@/lib/catalog";
import { formatDateTime, ngn } from "@/lib/format";
import { getLowStockThreshold } from "@/lib/settings";

export const dynamic = "force-dynamic";

export default async function OverviewPage() {
  const supabase = await createServerClient();
  const lowStockThreshold = await getLowStockThreshold(supabase);

  const now = new Date();
  const startOfMonth = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1)).toISOString();
  const startOfToday = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())).toISOString();
  const startOfTomorrow = new Date(startOfToday);
  startOfTomorrow.setUTCDate(startOfTomorrow.getUTCDate() + 1);

  const [
    { data: ordersThisMonth },
    { data: bookingsThisMonth },
    { data: ticketsThisMonth },
    { count: ordersTodayCount },
    { count: pendingOrderCount },
    { count: pendingBookingCount },
    { count: ticketCount },
    { count: vipTicketCount },
    { count: gaTicketCount },
    { data: recentOrders },
    { data: attentionProducts },
    { data: recentBookings },
    { data: recentTickets },
  ] = await Promise.all([
    supabase.from("orders").select("id, payment_status").gte("order_date", startOfMonth),
    supabase.from("bookings").select("deposit_amount").gte("created_at", startOfMonth),
    supabase.from("tickets").select("tier, status").gte("created_at", startOfMonth),
    supabase.from("orders").select("*", { count: "exact", head: true }).gte("order_date", startOfToday).lt("order_date", startOfTomorrow.toISOString()),
    supabase.from("orders").select("*", { count: "exact", head: true }).eq("payment_status", "pending"),
    supabase.from("bookings").select("*", { count: "exact", head: true }).eq("status", "requested"),
    supabase.from("tickets").select("*", { count: "exact", head: true }),
    supabase.from("tickets").select("*", { count: "exact", head: true }).eq("tier", "vip"),
    supabase.from("tickets").select("*", { count: "exact", head: true }).eq("tier", "ga"),
    supabase
      .from("orders")
      .select("id, ref, phone, customer_id, payment_status, delivery_status, created_at")
      .order("created_at", { ascending: false })
      .limit(5),
    supabase
      .from("products")
      .select("id, slug, name, category, stock_units, image_url")
      .lte("stock_units", lowStockThreshold)
      .order("stock_units", { ascending: true })
      .limit(5),
    supabase.from("bookings").select("ref, status, created_at").order("created_at", { ascending: false }).limit(5),
    supabase.from("tickets").select("ref, status, tier, created_at").order("created_at", { ascending: false }).limit(5),
  ]);

  const paidOrderIds = (ordersThisMonth ?? []).filter((o) => o.payment_status === "paid").map((o) => o.id);
  let orderRevenue = 0;
  if (paidOrderIds.length) {
    const { data: items } = await supabase
      .from("order_items")
      .select("order_id, quantity, unit_price")
      .in("order_id", paidOrderIds);
    orderRevenue = (items ?? []).reduce((sum, it) => sum + it.quantity * it.unit_price, 0);
  }
  const bookingRevenue = (bookingsThisMonth ?? []).reduce((sum, b) => sum + (b.deposit_amount ?? 0), 0);
  const ticketRevenue = (ticketsThisMonth ?? [])
    .filter((t) => t.status === "paid")
    .reduce((sum, t) => sum + TICKET_TIER[t.tier].price, 0);
  const revenueMonth = orderRevenue + bookingRevenue + ticketRevenue;

  const recentOrderIds = (recentOrders ?? []).map((o) => o.id);
  const { data: recentItems } = recentOrderIds.length
    ? await supabase.from("order_items").select("order_id, quantity, unit_price").in("order_id", recentOrderIds)
    : { data: [] as { order_id: string; quantity: number; unit_price: number }[] };
  const totalByOrder: Record<string, number> = {};
  for (const it of recentItems ?? []) {
    totalByOrder[it.order_id] = (totalByOrder[it.order_id] ?? 0) + it.quantity * it.unit_price;
  }

  const recentCustomerIds = [...new Set((recentOrders ?? []).map((o) => o.customer_id).filter((v): v is string => !!v))];
  const { data: recentCustomers } = recentCustomerIds.length
    ? await supabase.from("customer_profiles").select("id, name").in("id", recentCustomerIds)
    : { data: [] as { id: string; name: string }[] };
  const custNameById = Object.fromEntries((recentCustomers ?? []).map((c) => [c.id, c.name]));

  type Activity = { text: string; time: string; dot: string; at: string };
  const activity: Activity[] = [
    ...(recentOrders ?? []).map((o) => ({
      text: `Order ${o.ref} placed${o.customer_id ? ` — ${custNameById[o.customer_id] ?? "customer"}` : ""}`,
      time: formatDateTime(o.created_at),
      dot: "#7F23E0",
      at: o.created_at,
    })),
    ...(recentBookings ?? []).map((b) => ({
      text: `Booking ${b.ref} ${b.status}`,
      time: formatDateTime(b.created_at),
      dot: "#B689F6",
      at: b.created_at,
    })),
    ...(recentTickets ?? []).map((t) => ({
      text: `Ticket ${t.ref} registered (${TICKET_TIER[t.tier].label})`,
      time: formatDateTime(t.created_at),
      dot: "#D4AF6A",
      at: t.created_at,
    })),
  ]
    .sort((a, b) => new Date(b.at).getTime() - new Date(a.at).getTime())
    .slice(0, 6);

  return (
    <div>
      <SectionEyebrow>Overview</SectionEyebrow>
      <h1 className="mt-3.5 font-display text-[28px] font-normal tracking-[-0.01em] sm:text-[34px] lg:text-[38px]">
        Good to see you
      </h1>
      <p className="mt-2 text-[13.5px] text-noir-500 sm:text-[14.5px]">
        Here&apos;s what&apos;s moving across the store, the studio and the exhibition today.
      </p>

      <div className="mt-7 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="flex flex-col gap-2.5 rounded-[18px] bg-[linear-gradient(150deg,#7F23E0,#55129B_62%,#3F0E74)] p-6 text-white">
          <span className="text-[11.5px] font-bold tracking-[0.14em] text-violet-100 uppercase">
            Revenue this month
          </span>
          <span className="font-display text-[28px] sm:text-[32px]">{ngn(revenueMonth)}</span>
          <span className="text-xs text-violet-200">Orders, bookings &amp; ticket sales combined</span>
        </div>
        <div className="flex flex-col gap-2.5 rounded-[18px] border border-noir-100 bg-white p-6">
          <span className="text-[11.5px] font-bold tracking-[0.14em] text-noir-400 uppercase">Orders today</span>
          <span className="font-display text-[28px] text-noir-800 sm:text-[32px]">{ordersTodayCount ?? 0}</span>
          <span className="text-xs text-noir-400">{pendingOrderCount ?? 0} awaiting fulfilment</span>
        </div>
        <div className="flex flex-col gap-2.5 rounded-[18px] border border-noir-100 bg-white p-6">
          <span className="text-[11.5px] font-bold tracking-[0.14em] text-noir-400 uppercase">Pending bookings</span>
          <span className="font-display text-[28px] text-noir-800 sm:text-[32px]">{pendingBookingCount ?? 0}</span>
          <span className="text-xs text-noir-400">Need an accept or a decline</span>
        </div>
        <div className="flex flex-col gap-2.5 rounded-[18px] border border-noir-100 bg-white p-6">
          <span className="text-[11.5px] font-bold tracking-[0.14em] text-noir-400 uppercase">
            Exhibition registrations
          </span>
          <span className="font-display text-[28px] text-noir-800 sm:text-[32px]">{ticketCount ?? 0}</span>
          <span className="text-xs text-noir-400">
            {vipTicketCount ?? 0} VIP · {gaTicketCount ?? 0} general
          </span>
        </div>
      </div>

      <div className="mt-5 flex flex-col items-start gap-4 rounded-[18px] border border-noir-100 bg-noir-50 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div>
          <div className="text-[14.5px] font-bold text-noir-800">Quick actions</div>
          <div className="mt-[3px] text-xs text-noir-400">Jump straight into the most common tasks.</div>
        </div>
        <div className="flex flex-wrap gap-2.5">
          <Button
            asChild
            className="h-auto rounded-full bg-noir-800 px-5 py-[11px] text-[13px] font-bold text-white hover:bg-violet-500"
          >
            <Link href="/products/new">+ Add product</Link>
          </Button>
          <Button
            asChild
            variant="outline"
            className="h-auto rounded-full border-noir-200 bg-white px-5 py-[11px] text-[13px] font-bold hover:border-violet-500 hover:text-violet-500"
          >
            <Link href="/orders">View orders</Link>
          </Button>
          <Button
            asChild
            variant="outline"
            className="h-auto rounded-full border-noir-200 bg-white px-5 py-[11px] text-[13px] font-bold hover:border-violet-500 hover:text-violet-500"
          >
            <Link href="/catalog/new">+ Add a service</Link>
          </Button>
        </div>
      </div>

      <div className="mt-5 overflow-hidden rounded-[18px] border border-noir-100">
        <div className="flex items-center justify-between gap-3 px-5 py-[18px] sm:px-6">
          <span className="text-[15px] font-bold">Recent orders</span>
          <Link href="/orders" className="text-[12.5px] font-bold text-violet-500">
            View all →
          </Link>
        </div>
        <Table className="min-w-[600px]">
          <TableHeader>
            <TableRow className="bg-noir-50 hover:bg-noir-50">
              <TableHead className="px-5 py-3 text-[11px] font-bold tracking-[0.1em] text-noir-400 uppercase sm:px-6">
                Reference
              </TableHead>
              <TableHead className="text-[11px] font-bold tracking-[0.1em] text-noir-400 uppercase">
                Customer
              </TableHead>
              <TableHead className="text-[11px] font-bold tracking-[0.1em] text-noir-400 uppercase">
                Payment
              </TableHead>
              <TableHead className="text-[11px] font-bold tracking-[0.1em] text-noir-400 uppercase">
                Delivery
              </TableHead>
              <TableHead className="text-[11px] font-bold tracking-[0.1em] text-noir-400 uppercase">Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {(recentOrders ?? []).length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="px-5 py-6 text-[13px] whitespace-normal text-noir-400 sm:px-6">
                  No orders yet.
                </TableCell>
              </TableRow>
            )}
            {(recentOrders ?? []).map((o) => {
              const pay = STATUS_BADGE[o.payment_status];
              const delivery = STATUS_BADGE[o.delivery_status];
              return (
                <TableRow key={o.id}>
                  <TableCell className="px-5 py-3.5 font-mono text-xs text-noir-600 sm:px-6">
                    <Link href={`/orders/${o.id}`} className="block">
                      {o.ref}
                    </Link>
                  </TableCell>
                  <TableCell className="max-w-[160px] truncate text-[13px] font-bold text-noir-800">
                    <Link href={`/orders/${o.id}`} className="block truncate">
                      {o.customer_id ? (custNameById[o.customer_id] ?? "—") : "—"}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Badge label={pay.label} bg={pay.bg} fg={pay.fg} />
                  </TableCell>
                  <TableCell className="text-xs text-noir-600">{delivery.label}</TableCell>
                  <TableCell className="text-[13px] font-bold text-noir-800">{ngn(totalByOrder[o.id] ?? 0)}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      <div className="mt-5 overflow-hidden rounded-[18px] border border-noir-100">
        <div className="flex items-center justify-between gap-3 px-5 py-[18px] sm:px-6">
          <span className="text-[15px] font-bold">Products that need attention</span>
          <Link href="/products" className="text-[12.5px] font-bold text-violet-500">
            View all products →
          </Link>
        </div>
        <Table className="min-w-[480px]">
          <TableHeader>
            <TableRow className="bg-noir-50 hover:bg-noir-50">
              <TableHead className="px-5 py-3 text-[11px] font-bold tracking-[0.1em] text-noir-400 uppercase sm:px-6">
                Product
              </TableHead>
              <TableHead className="text-[11px] font-bold tracking-[0.1em] text-noir-400 uppercase">Status</TableHead>
              <TableHead className="text-[11px] font-bold tracking-[0.1em] text-noir-400 uppercase">
                Units left
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {(attentionProducts ?? []).length === 0 && (
              <TableRow>
                <TableCell colSpan={3} className="px-5 py-6 text-[13px] whitespace-normal text-noir-400 sm:px-6">
                  Every product is comfortably stocked.
                </TableCell>
              </TableRow>
            )}
            {(attentionProducts ?? []).map((p) => {
              const level = STOCK_BADGE[stockLevel(p.stock_units, lowStockThreshold)];
              return (
                <TableRow key={p.id}>
                  <TableCell className="px-5 py-3.5 sm:px-6">
                    <Link href={`/products/${p.id}`} className="flex min-w-0 items-center gap-3">
                      <ProductThumb
                        imageUrl={p.image_url}
                        category={p.category}
                        name={p.name}
                        className="flex h-8 w-8 flex-none items-center justify-center rounded-[9px] text-[10px] font-extrabold text-white"
                        initialsClassName="text-[10px] font-extrabold text-white"
                      />
                      <span className="truncate text-[13px] font-bold text-noir-800">{p.name}</span>
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Badge label={level.label} bg={level.bg} fg={level.fg} />
                  </TableCell>
                  <TableCell className="text-xs text-noir-600">{p.stock_units}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      <div className="mt-5 overflow-hidden rounded-[18px] border border-noir-100">
        <div className="px-5 py-[18px] sm:px-6">
          <span className="text-[15px] font-bold">Recent activity</span>
        </div>
        <Table className="min-w-[440px]">
          <TableHeader>
            <TableRow className="bg-noir-50 hover:bg-noir-50">
              <TableHead className="px-5 py-3 text-[11px] font-bold tracking-[0.1em] text-noir-400 uppercase sm:px-6">
                Activity
              </TableHead>
              <TableHead className="text-[11px] font-bold tracking-[0.1em] text-noir-400 uppercase">When</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {activity.length === 0 && (
              <TableRow>
                <TableCell colSpan={2} className="px-5 py-6 text-[13px] whitespace-normal text-noir-400 sm:px-6">
                  Nothing yet.
                </TableCell>
              </TableRow>
            )}
            {activity.map((ev, i) => (
              <TableRow key={i}>
                <TableCell className="px-5 py-3 sm:px-6">
                  <div className="flex min-w-0 items-center gap-2.5">
                    <span className="h-[7px] w-[7px] flex-none rounded-full" style={{ background: ev.dot }} />
                    <span className="truncate text-[13px] text-noir-800">{ev.text}</span>
                  </div>
                </TableCell>
                <TableCell className="font-mono text-[11.5px] text-noir-300">{ev.time}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
