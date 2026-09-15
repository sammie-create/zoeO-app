import { createClient as createServerClient } from "@zoeallure/supabase/server";
import Link from "next/link";
import { notFound } from "next/navigation";
import { formatDate, ngn } from "@/lib/format";
import { DeleteOrderButton, DeliveryTracker, PaymentStatusPicker } from "./order-actions";

export const dynamic = "force-dynamic";

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createServerClient();
  const { data: order } = await supabase.from("orders").select("*").eq("id", id).single();
  if (!order) notFound();

  const [{ data: items }, { data: customer }] = await Promise.all([
    supabase.from("order_items").select("*, products(name)").eq("order_id", id),
    order.customer_id
      ? supabase.from("customer_profiles").select("*").eq("id", order.customer_id).single()
      : Promise.resolve({ data: null }),
  ]);

  const subtotal = (items ?? []).reduce((sum, it) => sum + it.quantity * it.unit_price, 0);
  const deliveryFee = order.fulfilment_type === "delivery" ? 3500 : 0;
  const total = subtotal + deliveryFee;

  return (
    <div>
      <Link href="/orders" className="text-[13px] font-semibold text-noir-400 hover:text-noir-600">
        ← Back to orders
      </Link>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-5">
        <h1 className="font-display text-[26px] font-normal tracking-[-0.01em] sm:text-[32px]">
          Order {order.ref}
        </h1>
        <span className="text-[12.5px] text-noir-400">Placed {formatDate(order.order_date)}</span>
      </div>

      <div className="mt-6 grid grid-cols-1 items-start gap-[22px] lg:grid-cols-[1.4fr_.9fr]">
        <div className="grid gap-[18px]">
          <div className="rounded-[18px] border border-noir-100 p-6">
            <div className="mb-3.5 text-[11px] font-bold tracking-[0.1em] text-noir-400 uppercase">
              Payment status
            </div>
            <PaymentStatusPicker orderId={order.id} current={order.payment_status} />
          </div>

          <div className="rounded-[18px] border border-noir-100 p-6">
            <div className="mb-4.5 flex items-center justify-between">
              <div className="text-[11px] font-bold tracking-[0.1em] text-noir-400 uppercase">
                Delivery tracking · {order.fulfilment_detail}
              </div>
            </div>
            <DeliveryTracker
              orderId={order.id}
              fulfilmentType={order.fulfilment_type}
              current={order.delivery_status}
            />
          </div>

          <div className="rounded-[18px] border border-noir-100 p-6">
            <div className="mb-3.5 text-[11px] font-bold tracking-[0.1em] text-noir-400 uppercase">Items</div>
            <div className="grid gap-2.5">
              {(items ?? []).map((it) => (
                <div
                  key={it.id}
                  className="flex justify-between gap-3 border-b border-[#F0EEF3] pb-2.5 text-[13.5px]"
                >
                  <span className="text-noir-600">
                    {it.quantity}× {(it as unknown as { products: { name: string } }).products?.name ?? "Product"}
                  </span>
                  <span className="font-bold text-noir-800">{ngn(it.quantity * it.unit_price)}</span>
                </div>
              ))}
            </div>
            <div className="mt-3.5 grid gap-2">
              <div className="flex justify-between text-[13px]">
                <span className="text-noir-500">Subtotal</span>
                <span className="font-bold">{ngn(subtotal)}</span>
              </div>
              <div className="flex justify-between text-[13px]">
                <span className="text-noir-500">Delivery</span>
                <span className="font-bold">{ngn(deliveryFee)}</span>
              </div>
              <div className="flex justify-between border-t border-noir-200 pt-2 text-base">
                <span className="font-bold">Total</span>
                <span className="font-extrabold">{ngn(total)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-[18px]">
          <div className="rounded-[18px] border border-noir-100 bg-noir-50 p-6">
            <div className="mb-3 text-[11px] font-bold tracking-[0.1em] text-noir-400 uppercase">Customer</div>
            <div className="text-base font-bold text-noir-800">{customer?.name ?? "Walk-in"}</div>
            <div className="mt-1 text-[12.5px] text-noir-400">{order.phone}</div>
            <div className="mt-3.5 rounded-xl border border-noir-100 bg-white p-3.5 text-[12.5px] leading-relaxed text-noir-600">
              <strong className="mb-1 block text-[11px] tracking-[0.08em] text-noir-800 uppercase">
                {order.fulfilment_detail}
              </strong>
              {order.address}
            </div>
          </div>
          <DeleteOrderButton orderId={order.id} orderRef={order.ref} />
        </div>
      </div>
    </div>
  );
}
