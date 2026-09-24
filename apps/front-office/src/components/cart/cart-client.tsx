"use client";

import Link from "next/link";
import { useMemo, useState, type FormEvent } from "react";
import { toast } from "sonner";
import { Icon } from "@/components/shared/icon";
import { MoneyLabel } from "@/components/shared/money-label";
import { ProductCard } from "@/components/shop/product-card";
import type { Product } from "@/lib/queries";
import { useCart } from "@/lib/store/cart";
import { useCurrency } from "@/lib/store/currency";

const FREE_SHIP = 50000;
const WRAP = 1500;
const PROTECT = 600;
const CODES: Record<string, number> = { ALLURE10: 0.1, CIRCLE15: 0.15 };

export function CartClient({ products }: { products: Product[] }) {
  const { items, setQty, remove } = useCart();
  const { money } = useCurrency();
  const [note, setNote] = useState("");
  const [wrap, setWrap] = useState(false);
  const [protect, setProtect] = useState(true);
  const [code, setCode] = useState("");
  const [appliedCode, setAppliedCode] = useState("");
  const [shipping, setShipping] = useState<number | null>(null);
  const [country, setCountry] = useState("Nigeria");
  const [province, setProvince] = useState("Lagos");

  const rows = items
    .map((i) => ({ item: i, product: products.find((p) => p.id === i.id) }))
    .filter((r): r is { item: (typeof items)[number]; product: Product } => !!r.product);

  const subtotal = rows.reduce((s, r) => s + r.product.price * r.item.qty, 0);
  const discountRate = CODES[appliedCode] ?? 0;
  const discount = Math.round(subtotal * discountRate);
  const extras = (wrap ? WRAP : 0) + (protect ? PROTECT : 0);
  const freeLeft = Math.max(0, FREE_SHIP - subtotal);
  const grandTotal = subtotal - discount + extras + (shipping ?? 0);

  const suggestions = useMemo(
    () => products.filter((p) => !items.some((i) => i.id === p.id)).slice(0, 4),
    [products, items],
  );

  function applyCode(e: FormEvent) {
    e.preventDefault();
    const c = code.trim().toUpperCase();
    if (!c) {
      setAppliedCode("");
      return;
    }
    if (CODES[c]) {
      setAppliedCode(c);
      toast.success("Code applied", { description: `${c} — ${CODES[c] * 100}% off your items.` });
    } else {
      toast.error("Code not recognised", { description: "Try ALLURE10 for 10% off." });
    }
  }

  function estimateShipping() {
    let base = country !== "Nigeria" ? 25000 : province === "Lagos" ? 2500 : 4500;
    if (country === "Nigeria" && subtotal >= FREE_SHIP) base = 0;
    setShipping(base);
  }

  return (
    <>
      <main className="mx-auto max-w-[1280px] px-4 py-10 sm:px-6 lg:px-8">
        <h1 className="font-display mb-8 text-3xl font-bold sm:text-4xl">Your Cart</h1>

        {rows.length === 0 ? (
          <div className="flex flex-col items-center gap-4 rounded-2xl border border-white/10 py-20 text-center">
            <Icon name="bag" className="size-10 text-noir-400" />
            <h2 className="font-display text-2xl">Your cart is empty</h2>
            <p className="max-w-sm text-noir-400">Beauty, made easier — start with our bestsellers or book a service.</p>
            <div className="flex gap-3">
              <Link href="/shop" className="h-12 rounded-full bg-violet-500 px-6 text-sm font-bold text-white uppercase leading-[3rem]">
                Shop products
              </Link>
              <Link href="/services" className="h-12 rounded-full border border-white/20 px-6 text-sm font-bold uppercase leading-[3rem]">
                Book a service
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.6fr_1fr]">
            <div className="flex flex-col gap-6">
              <div className="rounded-2xl border border-white/10 p-5">
                <div className="mb-4 hidden grid-cols-[1fr_160px_140px] text-sm text-noir-400 sm:grid">
                  <span>Product</span>
                  <span>Quantity</span>
                  <span>Total</span>
                </div>
                <div className="flex flex-col divide-y divide-white/8">
                  {rows.map(({ item, product }) => (
                    <div key={item.id} className="grid grid-cols-1 items-center gap-4 py-4 sm:grid-cols-[1fr_160px_140px]">
                      <div className="flex items-center gap-4">
                        <Link href={`/product/${product.id}`} className="size-16 shrink-0 overflow-hidden rounded-lg bg-noir-800">
                          {product.image_url && (
                            // eslint-disable-next-line @next/next/no-img-element -- Supabase Storage URL, no next/image loader configured
                            <img src={product.image_url} alt="" className="size-full object-cover" />
                          )}
                        </Link>
                        <div>
                          <Link href={`/product/${product.id}`} className="font-display font-semibold">
                            {product.name}
                          </Link>
                          <div className="mt-1 text-[13px] text-noir-400">
                            <MoneyLabel ngn={product.price} decimals />
                          </div>
                        </div>
                      </div>
                      <div className="flex h-10 w-fit items-center rounded-full border border-white/16">
                        <button
                          type="button"
                          onClick={() => setQty(item.id, item.qty - 1)}
                          className="w-9"
                          aria-label="Decrease"
                        >
                          <Icon name="minus" className="mx-auto size-3.5" />
                        </button>
                        <input
                          type="number"
                          min={1}
                          max={99}
                          value={item.qty}
                          onChange={(e) => setQty(item.id, Number(e.target.value) || 1)}
                          aria-label="Quantity"
                          className="w-10 bg-transparent text-center outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => setQty(item.id, item.qty + 1)}
                          className="w-9"
                          aria-label="Increase"
                        >
                          <Icon name="plus" className="mx-auto size-3.5" />
                        </button>
                      </div>
                      <div className="flex items-center justify-between gap-3 sm:justify-end">
                        <span className="font-semibold">
                          <MoneyLabel ngn={product.price * item.qty} decimals />
                        </span>
                        <button
                          type="button"
                          onClick={() => remove(item.id)}
                          aria-label={`Remove ${product.name}`}
                          className="text-noir-400 hover:text-status-cancelled"
                        >
                          <Icon name="trash" className="size-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 p-5">
                <h3 className="mb-4 font-bold">Estimate shipping rates</h3>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                  <select value={country} onChange={(e) => setCountry(e.target.value)} className="h-11 rounded-lg border border-white/16 bg-transparent px-3">
                    <option>Nigeria</option>
                    <option>Ghana</option>
                    <option>United Kingdom</option>
                    <option>United States</option>
                  </select>
                  <select value={province} onChange={(e) => setProvince(e.target.value)} className="h-11 rounded-lg border border-white/16 bg-transparent px-3">
                    <option>Lagos</option>
                    <option>Abuja (FCT)</option>
                    <option>Oyo</option>
                    <option>Rivers</option>
                    <option>Enugu</option>
                    <option>Other</option>
                  </select>
                  <input defaultValue="100001" className="h-11 rounded-lg border border-white/16 bg-transparent px-3" />
                </div>
                <button type="button" onClick={estimateShipping} className="mt-4 h-11 rounded-full bg-violet-500 px-5 text-sm font-bold text-white uppercase">
                  Estimate
                </button>
                {shipping !== null && (
                  <p className="mt-3 text-sm text-noir-300">
                    <Icon name="truck" className="mr-1.5 inline size-4" />
                    Standard delivery to {province === "Other" ? country : `${province}, ${country}`}:{" "}
                    <strong>{shipping === 0 ? "Free" : money(shipping, { decimals: true })}</strong>
                  </p>
                )}
              </div>
            </div>

            <aside className="h-fit rounded-2xl border border-white/10 p-5">
              <div className="rounded-xl bg-violet-500/10 p-4">
                <strong className="flex items-center gap-1.5 text-sm">
                  <Icon name="tag" className="size-4" /> Special Allure Promo
                </strong>
                <p className="mt-1 text-[13px] text-noir-300">
                  Use code <b>ALLURE10</b> for 10% off your first luxury care box.
                </p>
              </div>

              <p className="mt-4 text-sm">
                {freeLeft > 0 ? (
                  <>
                    You are <strong>{money(freeLeft, { decimals: true })}</strong> away from free shipping!
                  </>
                ) : (
                  <strong className="text-status-booked">You&apos;ve unlocked free shipping!</strong>
                )}
              </p>
              <div className="mt-2 h-1.5 rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-violet-500 transition-all"
                  style={{ width: `${Math.min(100, (subtotal / FREE_SHIP) * 100)}%` }}
                />
              </div>

              <label className="mt-5 block text-sm">
                Add order note
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Special instructions for delivery..."
                  className="mt-1.5 w-full rounded-lg border border-white/16 bg-transparent p-3 text-sm"
                  rows={2}
                />
              </label>

              <label className="mt-4 flex items-center gap-2 text-sm text-noir-300">
                <input type="checkbox" checked={wrap} onChange={(e) => setWrap(e.target.checked)} />
                For {money(WRAP, { decimals: true })}, please wrap the products in this order
              </label>

              <div className="mt-4 flex items-center gap-3 rounded-xl border border-white/10 p-3">
                <Icon name="shield" className="size-6 text-violet-300" />
                <div className="flex-1">
                  <strong className="block text-sm">Shipping Protection</strong>
                  <span className="text-[12px] text-noir-400">Guarantees order safety from theft or damage</span>
                </div>
                <span className="text-sm font-semibold">{money(PROTECT, { decimals: true })}</span>
                <button
                  type="button"
                  role="switch"
                  aria-checked={protect}
                  aria-label="Shipping protection"
                  onClick={() => setProtect((v) => !v)}
                  className={`h-6 w-11 rounded-full transition-colors ${protect ? "bg-violet-500" : "bg-white/16"}`}
                >
                  <span className={`block size-5 rounded-full bg-white transition-transform ${protect ? "translate-x-5" : "translate-x-0.5"}`} />
                </button>
              </div>

              <form onSubmit={applyCode} className="mt-4 flex gap-2">
                <input
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="Discount code"
                  className="h-11 flex-1 rounded-full border border-white/16 bg-transparent px-4 text-sm"
                />
                <button type="submit" className="h-11 rounded-full bg-violet-500 px-5 text-sm font-bold text-white">
                  Apply
                </button>
              </form>

              <div className="mt-5 flex flex-col gap-2 border-t border-white/8 pt-4 text-sm">
                <div className="flex justify-between">
                  <span>Items</span>
                  <span>{money(subtotal, { decimals: true })}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-status-booked">
                    <span>Discount ({appliedCode})</span>
                    <span>−{money(discount, { decimals: true })}</span>
                  </div>
                )}
                {extras > 0 && (
                  <div className="flex justify-between">
                    <span>Gift wrap &amp; protection</span>
                    <span>{money(extras, { decimals: true })}</span>
                  </div>
                )}
                {shipping !== null && (
                  <div className="flex justify-between">
                    <span>Shipping (est.)</span>
                    <span>{shipping === 0 ? "Free" : money(shipping, { decimals: true })}</span>
                  </div>
                )}
                <div className="flex justify-between border-t border-white/8 pt-2 text-base font-bold">
                  <span>Subtotal</span>
                  <span>{money(grandTotal, { decimals: true })}</span>
                </div>
              </div>

              <p className="mt-3 text-[12px] text-noir-500">Taxes and shipping calculated at checkout</p>
              <Link
                href="/checkout"
                className="mt-4 flex h-14 items-center justify-center rounded-full bg-violet-500 text-sm font-bold text-white uppercase"
              >
                Check out
              </Link>
            </aside>
          </div>
        )}
      </main>

      {suggestions.length > 0 && (
        <section className="mx-auto max-w-[1280px] px-4 py-16 sm:px-6 lg:px-8">
          <h2 className="font-display mb-6 text-2xl font-bold">You may also like</h2>
          <div className="grid grid-cols-2 gap-5 sm:grid-cols-4">
            {suggestions.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </>
  );
}
