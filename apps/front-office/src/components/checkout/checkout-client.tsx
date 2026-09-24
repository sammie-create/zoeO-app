"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Icon } from "@/components/shared/icon";
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
  const [error, setError] = useState<string | null>(null);

  const rows = items
    .map((i) => ({ item: i, product: products.find((p) => p.id === i.id) }))
    .filter((r): r is { item: (typeof items)[number]; product: Product } => !!r.product);

  if (rows.length === 0) {
    return (
      <main className="mx-auto max-w-[1280px] px-4 py-20 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-4 rounded-2xl border border-white/10 py-20 text-center">
          <Icon name="bag" className="size-10 text-noir-400" />
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
    setError(null);

    if (!/\S+@\S+\.\S+/.test(email)) return setError("Enter a valid email address.");
    if (phone.replace(/\D/g, "").length < 7) return setError("Enter a valid phone number.");
    if (mode === "ship" && (!firstName.trim() || !lastName.trim() || !address.trim() || !city.trim())) {
      return setError("Fill in all delivery fields.");
    }

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
      setError(err instanceof Error ? err.message : "Something went wrong placing your order.");
      setSubmitting(false);
    }
  }

  return (
    <main className="mx-auto max-w-[1280px] px-4 py-10 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1.3fr_1fr]">
        <div>
          <nav aria-label="Breadcrumb" className="mb-2 text-[13px] text-noir-400">
            <Link href="/cart" className="hover:text-white">
              Cart
            </Link>{" "}
            › <span className="text-white">Checkout</span>
          </nav>
          <h1 className="font-display mb-9 text-3xl font-bold sm:text-4xl">Checkout</h1>

          <form onSubmit={handleSubmit} className="flex flex-col gap-8">
            <fieldset>
              <h2 className="mb-4 font-bold">Contact</h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <label className="text-sm">
                  Email
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                    placeholder="you@example.com"
                    className="mt-1.5 h-12 w-full rounded-lg border border-white/16 bg-transparent px-3.5"
                  />
                </label>
                <label className="text-sm">
                  Phone
                  <input
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    autoComplete="tel"
                    placeholder="+234 000 000 0000"
                    className="mt-1.5 h-12 w-full rounded-lg border border-white/16 bg-transparent px-3.5"
                  />
                </label>
              </div>
            </fieldset>

            <fieldset>
              <h2 className="mb-4 font-bold">Delivery</h2>
              <div className="mb-4 inline-flex rounded-full border border-white/16 p-1">
                <button
                  type="button"
                  onClick={() => setMode("ship")}
                  className={`rounded-full px-4 py-2 text-sm ${mode === "ship" ? "bg-violet-500 text-white" : "text-noir-300"}`}
                >
                  Ship to me
                </button>
                <button
                  type="button"
                  onClick={() => setMode("pickup")}
                  className={`rounded-full px-4 py-2 text-sm ${mode === "pickup" ? "bg-violet-500 text-white" : "text-noir-300"}`}
                >
                  Pick up in Ikeja
                </button>
              </div>
              {mode === "ship" && (
                <div className="grid grid-cols-1 gap-4">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <label className="text-sm">
                      First name
                      <input
                        required
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        autoComplete="given-name"
                        className="mt-1.5 h-12 w-full rounded-lg border border-white/16 bg-transparent px-3.5"
                      />
                    </label>
                    <label className="text-sm">
                      Last name
                      <input
                        required
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        autoComplete="family-name"
                        className="mt-1.5 h-12 w-full rounded-lg border border-white/16 bg-transparent px-3.5"
                      />
                    </label>
                  </div>
                  <label className="text-sm">
                    Address
                    <input
                      required
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      autoComplete="street-address"
                      placeholder="House number and street"
                      className="mt-1.5 h-12 w-full rounded-lg border border-white/16 bg-transparent px-3.5"
                    />
                  </label>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <label className="text-sm">
                      City
                      <input
                        required
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="mt-1.5 h-12 w-full rounded-lg border border-white/16 bg-transparent px-3.5"
                      />
                    </label>
                    <label className="text-sm">
                      State
                      <select
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        className="mt-1.5 h-12 w-full rounded-lg border border-white/16 bg-transparent px-3.5"
                      >
                        <option>Lagos</option>
                        <option>Abuja (FCT)</option>
                        <option>Oyo</option>
                        <option>Rivers</option>
                        <option>Enugu</option>
                        <option>Other</option>
                      </select>
                    </label>
                  </div>
                </div>
              )}
            </fieldset>

            <fieldset>
              <h2 className="mb-4 font-bold">Payment</h2>
              <div className="flex flex-col gap-2.5">
                {["Paystack", "Flutterwave", "Bank transfer"].map((opt) => (
                  <label
                    key={opt}
                    className={`flex items-center gap-3 rounded-xl border px-4 py-3.5 ${
                      pay === opt ? "border-violet-500 bg-violet-500/10" : "border-white/16"
                    }`}
                  >
                    <input type="radio" name="pay" checked={pay === opt} onChange={() => setPay(opt)} className="accent-violet-500" />
                    {opt === "Paystack" ? "Paystack — card, bank or USSD" : opt}
                  </label>
                ))}
              </div>
              <p className="mt-3 flex items-center gap-2 text-[13px] text-noir-400">
                <Icon name="lock" className="size-4" /> Payments are SSL encrypted. You&apos;ll be redirected to complete
                payment securely.
              </p>
            </fieldset>

            {error && <p className="text-sm font-medium text-status-cancelled">{error}</p>}

            <button
              type="submit"
              disabled={submitting}
              className="flex h-14 items-center justify-center rounded-full bg-violet-500 text-sm font-bold text-white uppercase disabled:opacity-50"
            >
              {submitting ? "Placing order…" : `Place order · ${money(total, { decimals: true })}`}
            </button>
          </form>
        </div>

        <aside className="h-fit rounded-2xl border border-white/10 p-5">
          <h2 className="mb-4 font-bold">Order summary</h2>
          <div className="flex flex-col gap-3">
            {rows.map(({ item, product }) => (
              <div key={item.id} className="flex items-center gap-3">
                <div className="relative size-12 shrink-0 overflow-hidden rounded-lg bg-noir-800">
                  {product.image_url && (
                    // eslint-disable-next-line @next/next/no-img-element -- Supabase Storage URL, no next/image loader configured
                    <img src={product.image_url} alt="" className="size-full object-cover" />
                  )}
                  <b className="absolute -top-1.5 -right-1.5 grid size-5 place-items-center rounded-full bg-violet-500 text-[10px] font-bold text-white">
                    {item.qty}
                  </b>
                </div>
                <div className="flex-1 text-sm">{product.name}</div>
                <span className="text-sm font-semibold">{money(product.price * item.qty, { decimals: true })}</span>
              </div>
            ))}
          </div>
          <div className="mt-5 flex flex-col gap-2 border-t border-white/8 pt-4 text-sm">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>{money(subtotal, { decimals: true })}</span>
            </div>
            <div className="flex justify-between">
              <span>{mode === "pickup" ? "Store pickup" : "Shipping"}</span>
              <span>{shipping ? money(shipping, { decimals: true }) : "Free"}</span>
            </div>
            <div className="flex justify-between border-t border-white/8 pt-2 text-base font-bold">
              <span>Total</span>
              <span>{money(total, { decimals: true })}</span>
            </div>
          </div>
          <Link href="/cart" className="mt-4 inline-block text-sm text-violet-300 underline">
            Edit cart
          </Link>
        </aside>
      </div>
    </main>
  );
}
