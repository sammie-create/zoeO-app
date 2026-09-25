"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Icon } from "@/components/shared/icon";
import { Reveal } from "@/components/shared/reveal";
import { placeOrder } from "@/lib/actions";
import type { Product } from "@/lib/queries";
import { useCart } from "@/lib/store/cart";
import { useCurrency } from "@/lib/store/currency";

export function CheckoutClient({ products }: { products: Product[] }) {
  const { items, clear } = useCart();
  const { money } = useCurrency();
  const router = useRouter();

  const [mode, setMode] = useState<"ship" | "pickup">("ship");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("Lagos");
  const [state, setState] = useState("Lagos");
  const [pay, setPay] = useState("Paystack");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [invalid, setInvalid] = useState<Set<string>>(new Set());

  const rows = items
    .map((i) => ({ item: i, product: products.find((p) => p.id === i.id) }))
    .filter((r): r is { item: (typeof items)[number]; product: Product } => !!r.product);

  if (rows.length === 0) {
    return (
      <main className="mx-auto max-w-[calc(1280px_+_clamp(16px,5vw,80px)*2)] px-[clamp(16px,5vw,80px)] py-20">
        <div className="cart-empty panel flex flex-col items-center gap-4 text-center">
          <span className="ic">
            <Icon name="bag" className="size-10" />
          </span>
          <h1 className="font-display text-2xl">Nothing to check out yet</h1>
          <p className="text-noir-400">Your cart is empty — let&apos;s find something you&apos;ll love.</p>
          <Link href="/shop" className="h-12 rounded-full bg-violet-500 px-6 text-sm font-bold text-white uppercase leading-[3rem]">
            Shop products
          </Link>
        </div>
      </main>
    );
  }

  const subtotal = rows.reduce((s, r) => s + r.product.price * r.item.qty, 0);
  const shipping = mode === "pickup" || subtotal >= 50000 ? 0 : state === "Lagos" ? 2500 : 4500;
  const total = subtotal + shipping;

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitError(null);

    const next = new Set<string>();
    if (!/\S+@\S+\.\S+/.test(email)) next.add("email");
    if (phone.replace(/\D/g, "").length < 7) next.add("phone");
    if (mode === "ship") {
      if (!firstName.trim()) next.add("firstName");
      if (!lastName.trim()) next.add("lastName");
      if (!address.trim()) next.add("address");
      if (!city.trim()) next.add("city");
    }
    setInvalid(next);
    if (next.size > 0) return;

    setSubmitting(true);
    try {
      const order = await placeOrder({
        name: mode === "ship" ? `${firstName} ${lastName}`.trim() : (firstName || "Guest").trim(),
        phone,
        email,
        fulfilmentType: mode === "ship" ? "delivery" : "pickup",
        fulfilmentDetail: mode === "ship" ? `${city}, ${state}` : "Ikeja pickup",
        address: mode === "ship" ? address : null,
        items: rows.map((r) => ({ id: r.product.id, qty: r.item.qty })),
      });
      clear();
      router.push(`/checkout/confirmation?ref=${order.ref}&pay=${encodeURIComponent(pay)}&total=${total}&mode=${mode}&email=${encodeURIComponent(email)}`);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Something went wrong placing your order.");
      setSubmitting(false);
    }
  }

  return (
    <main className="mx-auto max-w-[calc(1280px_+_clamp(16px,5vw,80px)*2)] px-[clamp(16px,5vw,80px)]">
      <div className="checkout">
        <div>
          <nav aria-label="Breadcrumb" className="crumbs">
            <Link href="/cart">Cart</Link> › <span className="cur">Checkout</span>
          </nav>
          <h1 className="font-display mb-9 text-3xl font-bold sm:text-4xl">Checkout</h1>

          <form onSubmit={handleSubmit} noValidate>
            <Reveal as="fieldset" className="mb-9 border-0 p-0">
              <h2>Contact</h2>
              <div className="grid2">
                <div className={`field ${invalid.has("email") ? "is-invalid" : ""}`}>
                  <label htmlFor="co-email">Email</label>
                  <input
                    id="co-email"
                    className="input"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                    placeholder="you@example.com"
                  />
                  <span className="err">Enter a valid email address.</span>
                </div>
                <div className={`field ${invalid.has("phone") ? "is-invalid" : ""}`}>
                  <label htmlFor="co-phone">Phone</label>
                  <input
                    id="co-phone"
                    className="input"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    autoComplete="tel"
                    placeholder="+234 000 000 0000"
                  />
                  <span className="err">Enter a valid phone number.</span>
                </div>
              </div>
            </Reveal>

            <Reveal as="fieldset" delay={80} className="mb-9 border-0 p-0">
              <h2>Delivery</h2>
              <div className="seg mb-1" role="radiogroup">
                <button type="button" onClick={() => setMode("ship")} className={mode === "ship" ? "is-active" : ""}>
                  Ship to me
                </button>
                <button type="button" onClick={() => setMode("pickup")} className={mode === "pickup" ? "is-active" : ""}>
                  Pick up in Ikeja
                </button>
              </div>
              {mode === "ship" && (
                <div className="grid gap-4 pt-4">
                  <div className="grid2">
                    <div className={`field ${invalid.has("firstName") ? "is-invalid" : ""}`}>
                      <label htmlFor="co-first">First name</label>
                      <input
                        id="co-first"
                        className="input"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        autoComplete="given-name"
                      />
                      <span className="err">Required.</span>
                    </div>
                    <div className={`field ${invalid.has("lastName") ? "is-invalid" : ""}`}>
                      <label htmlFor="co-last">Last name</label>
                      <input
                        id="co-last"
                        className="input"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        autoComplete="family-name"
                      />
                      <span className="err">Required.</span>
                    </div>
                  </div>
                  <div className={`field ${invalid.has("address") ? "is-invalid" : ""}`}>
                    <label htmlFor="co-addr">Address</label>
                    <input
                      id="co-addr"
                      className="input"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      autoComplete="street-address"
                      placeholder="House number and street"
                    />
                    <span className="err">Required.</span>
                  </div>
                  <div className="grid2">
                    <div className={`field ${invalid.has("city") ? "is-invalid" : ""}`}>
                      <label htmlFor="co-city">City</label>
                      <input id="co-city" className="input" value={city} onChange={(e) => setCity(e.target.value)} />
                      <span className="err">Required.</span>
                    </div>
                    <div className="field">
                      <label htmlFor="co-state">State</label>
                      <select id="co-state" className="select" value={state} onChange={(e) => setState(e.target.value)}>
                        <option>Lagos</option>
                        <option>Abuja (FCT)</option>
                        <option>Oyo</option>
                        <option>Rivers</option>
                        <option>Enugu</option>
                        <option>Other</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}
            </Reveal>

            <Reveal as="fieldset" delay={160} className="mb-9 border-0 p-0">
              <h2>Payment</h2>
              <div className="flex flex-col gap-2.5">
                {["Paystack", "Flutterwave", "Bank transfer"].map((opt) => (
                  <label key={opt} className={`pay-opt ${pay === opt ? "is-active" : ""}`}>
                    <input type="radio" name="pay" checked={pay === opt} onChange={() => setPay(opt)} />
                    {opt === "Paystack" ? "Paystack — card, bank or USSD" : opt}
                  </label>
                ))}
              </div>
              <p className="mt-3 flex items-center gap-2 text-[13px] text-noir-400">
                <Icon name="lock" className="size-4" /> Payments are SSL encrypted. You&apos;ll be redirected to complete
                payment securely.
              </p>
            </Reveal>

            {submitError && <p className="mb-4 text-sm font-medium text-status-cancelled">{submitError}</p>}

            <button
              type="submit"
              disabled={submitting}
              className="flex h-14 items-center justify-center rounded-full bg-violet-500 px-9 text-[15px] font-bold text-white uppercase disabled:opacity-50"
            >
              {submitting ? "Placing order…" : `Place order · ${money(total, { decimals: true })}`}
            </button>
          </form>
        </div>

        <Reveal delay={120} as="aside" className="panel summary h-fit">
          <h2 className="mb-4 font-bold">Order summary</h2>
          <div>
            {rows.map(({ item, product }) => (
              <div key={item.id} className="mini-line">
                <span className="thumb">
                  {product.image_url ? (
                    // eslint-disable-next-line @next/next/no-img-element -- Supabase Storage URL, no next/image loader configured
                    <img src={product.image_url} alt="" />
                  ) : (
                    <div className="size-14 rounded-[10px] bg-noir-700" />
                  )}
                  <b>{item.qty}</b>
                </span>
                <div className="n">{product.name}</div>
                <span>{money(product.price * item.qty, { decimals: true })}</span>
              </div>
            ))}
          </div>
          <div className="totals">
            <div className="sum-row">
              <span>Subtotal</span>
              <span>{money(subtotal, { decimals: true })}</span>
            </div>
            <div className="sum-row">
              <span>{mode === "pickup" ? "Store pickup" : "Shipping"}</span>
              <span>{shipping ? money(shipping, { decimals: true }) : "Free"}</span>
            </div>
            <div className="sum-row grand">
              <span>Total</span>
              <strong>{money(total, { decimals: true })}</strong>
            </div>
          </div>
          <Link href="/cart" className="mt-4.5 inline-block text-sm text-violet-300 underline underline-offset-4 hover:text-white">
            Edit cart
          </Link>
        </Reveal>
      </div>
    </main>
  );
}
