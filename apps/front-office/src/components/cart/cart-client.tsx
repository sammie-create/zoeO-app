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
const payLogos = ["Visa", "Mastercard", "Amex", "Paystack", "Apple Pay", "Google Pay"];

export function CartClient({ products }: { products: Product[] }) {
  const { items, setQty, remove } = useCart();
  const { money } = useCurrency();
  const [note, setNote] = useState("");
  const [wrap, setWrap] = useState(false);
  const [protect, setProtect] = useState(true);
  const [code, setCode] = useState("");
  const [appliedCode, setAppliedCode] = useState("");
  const [shipping, setShipping] = useState<number | null>(null);
  const [deliveryDays, setDeliveryDays] = useState("");
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
    setDeliveryDays(
      country !== "Nigeria" ? "5–9 business days" : province === "Lagos" ? "1–2 business days" : "2–4 business days",
    );
  }

  return (
    <>
      <main className="mx-auto max-w-[calc(1280px_+_clamp(16px,5vw,80px)*2)] px-[clamp(16px,5vw,80px)] py-[clamp(64px,7vw,100px)]">
        <h1 className="font-display mb-8 text-3xl font-bold sm:text-4xl">Your Cart</h1>

        {rows.length === 0 ? (
          <div className="cart-empty flex flex-col items-center gap-4 py-20 text-center">
            <span className="ic">
              <Icon name="bag" className="size-10" />
            </span>
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
          <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-[1.6fr_1fr]">
            <div className="flex flex-col gap-8">
              <div className="panel">
                <div className="cart-table__head">
                  <span>Product</span>
                  <span>Quantity</span>
                  <span>Total</span>
                </div>
                {rows.map(({ item, product }) => (
                  <div key={item.id} className="cart-row">
                    <div className="cart-item">
                      <Link href={`/product/${product.id}`}>
                        {product.image_url ? (
                          // eslint-disable-next-line @next/next/no-img-element -- Supabase Storage URL, no next/image loader configured
                          <img src={product.image_url} alt="" />
                        ) : (
                          <div className="size-[88px] rounded-xl bg-noir-700" />
                        )}
                      </Link>
                      <div>
                        {product.brand && <div className="brand-s">{product.brand}</div>}
                        <Link href={`/product/${product.id}`} className="name">
                          {product.name}
                        </Link>
                        <div className="unit">
                          <MoneyLabel ngn={product.price} decimals />
                        </div>
                      </div>
                    </div>
                    <div className="qty qty--sm">
                      <button type="button" onClick={() => setQty(item.id, item.qty - 1)} aria-label="Decrease">
                        <Icon name="minus" className="mx-auto size-3.5" />
                      </button>
                      <input
                        type="number"
                        min={1}
                        max={99}
                        value={item.qty}
                        onChange={(e) => setQty(item.id, Number(e.target.value) || 1)}
                        aria-label="Quantity"
                      />
                      <button type="button" onClick={() => setQty(item.id, item.qty + 1)} aria-label="Increase">
                        <Icon name="plus" className="mx-auto size-3.5" />
                      </button>
                    </div>
                    <div className="cart-row__total">
                      <span>
                        <MoneyLabel ngn={product.price * item.qty} decimals />
                      </span>
                      <button type="button" onClick={() => remove(item.id)} aria-label={`Remove ${product.name}`} className="trash">
                        <Icon name="trash" className="size-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="panel ship-est">
                <h3>Estimate shipping rates</h3>
                <div className="ship-est__grid">
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
                <button type="button" onClick={estimateShipping} className="h-11 rounded-full bg-violet-500 px-5 text-sm font-bold text-white uppercase">
                  Estimate
                </button>
                {shipping !== null && (
                  <p className="ship-result">
                    <Icon name="truck" className="mr-1.5 inline size-4" />
                    Standard delivery to {province === "Other" ? country : `${province}, ${country}`}:{" "}
                    <strong>{shipping === 0 ? "Free" : money(shipping, { decimals: true })}</strong> · {deliveryDays}
                  </p>
                )}
              </div>
            </div>

            <aside className="panel summary">
              <div className="promo-box">
                <strong>
                  <Icon name="tag" className="size-4" /> Special Allure Promo
                </strong>
                <p>
                  Use code <b>ALLURE10</b> for 10% off your first luxury care box.
                </p>
              </div>

              <p className="text-sm">
                {freeLeft > 0 ? (
                  <>
                    You are <strong>{money(freeLeft, { decimals: true })}</strong> away from free shipping!
                  </>
                ) : (
                  <strong className="text-status-booked">You&apos;ve unlocked free shipping!</strong>
                )}
              </p>
              <div className="progress">
                <i style={{ width: `${Math.min(100, (subtotal / FREE_SHIP) * 100)}%` }} />
              </div>

              <label className="block text-sm">
                Add order note
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Special instructions for delivery..."
                  className="mt-1.5 w-full rounded-lg border border-white/16 bg-transparent p-3 text-sm"
                  rows={2}
                />
              </label>

              <label className="mt-4.5 flex items-center gap-2 text-sm text-noir-300">
                <input type="checkbox" checked={wrap} onChange={(e) => setWrap(e.target.checked)} />
                For {money(WRAP, { decimals: true })}, please wrap the products in this order
              </label>

              <div className="protect">
                <Icon name="shield" className="size-6 text-violet-300" />
                <div>
                  <strong>Shipping Protection</strong>
                  <small>Guarantees order safety from theft or damage</small>
                </div>
                <span className="amt">{money(PROTECT, { decimals: true })}</span>
                <button
                  type="button"
                  role="switch"
                  aria-checked={protect}
                  aria-label="Shipping protection"
                  onClick={() => setProtect((v) => !v)}
                  className={`toggle ${protect ? "is-on" : ""}`}
                />
              </div>

              <label className="block text-sm">
                Discount
                <form onSubmit={applyCode} className="discount-form">
                  <input value={code} onChange={(e) => setCode(e.target.value)} placeholder="Discount code" />
                  <button type="submit">Apply</button>
                </form>
              </label>

              <div className="totals">
                <div className="sum-row">
                  <span>Items</span>
                  <span>{money(subtotal, { decimals: true })}</span>
                </div>
                {discount > 0 && (
                  <div className="sum-row">
                    <span>Discount ({appliedCode})</span>
                    <span className="text-status-booked">−{money(discount, { decimals: true })}</span>
                  </div>
                )}
                {extras > 0 && (
                  <div className="sum-row">
                    <span>Gift wrap &amp; protection</span>
                    <span>{money(extras, { decimals: true })}</span>
                  </div>
                )}
                {shipping !== null && (
                  <div className="sum-row">
                    <span>Shipping (est.)</span>
                    <span>{shipping === 0 ? "Free" : money(shipping, { decimals: true })}</span>
                  </div>
                )}
                <div className="sum-row grand">
                  <span>Subtotal</span>
                  <strong>{money(grandTotal, { decimals: true })}</strong>
                </div>
              </div>

              <p className="fine">Taxes and shipping calculated at checkout</p>
              <Link href="/checkout" className="btn-checkout flex items-center justify-center rounded-full bg-violet-500 font-bold text-white">
                Check out
              </Link>
              <div className="pay-logos">
                {payLogos.map((p) => (
                  <span key={p}>{p}</span>
                ))}
              </div>
            </aside>
          </div>
        )}
      </main>

      {suggestions.length > 0 && (
        <section className="ymal border-t border-white/8 px-[clamp(16px,5vw,80px)] py-20">
          <div className="mx-auto max-w-[calc(1280px_+_clamp(16px,5vw,80px)*2)]">
            <h2 className="font-display mb-3 text-2xl font-bold">You may also like</h2>
            <div className="rule" />
            <div className="grid grid-cols-2 gap-5 sm:grid-cols-4">
              {suggestions.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
