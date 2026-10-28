"use client";

import { createClient as createBrowserClient } from "@zoeallure/supabase/client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type ChangeEvent, type FormEvent } from "react";
import { toast } from "sonner";
import { Icon } from "@/components/shared/icon";
import { Reveal } from "@/components/shared/reveal";
import { placeOrder } from "@/lib/actions";
import { uploadImage, validateUploadProof } from "@/lib/image-upload";
import type { Product, SiteSettings } from "@/lib/queries";
import { useCart } from "@/lib/store/cart";
import { useCurrency } from "@/lib/store/currency";

const PAYMENT_PROOFS_BUCKET = "payment-proofs";

export function CheckoutClient({
  products,
  settings,
}: {
  products: Product[];
  settings: SiteSettings | null;
}) {
  const { items, clear } = useCart();
  const { money } = useCurrency();
  const router = useRouter();
  const [supabase] = useState(() => createBrowserClient());

  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("Lagos");
  const [state, setState] = useState("Lagos");
  const pay = "Bank transfer";
  const [proofUrl, setProofUrl] = useState<string | null>(null);
  const [proofFileName, setProofFileName] = useState<string | null>(null);
  const [uploadingProof, setUploadingProof] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [invalid, setInvalid] = useState<Set<string>>(new Set());

  async function handleProofChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const err = validateUploadProof(file);
    if (err) {
      setUploadError(err);
      return;
    }
    setUploadError(null);
    setUploadingProof(true);
    try {
      const url = await uploadImage(supabase, PAYMENT_PROOFS_BUCKET, file);
      setProofUrl(url);
      setProofFileName(file.name);
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "Could not upload file.");
    } finally {
      setUploadingProof(false);
    }
  }

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
          <p className="text-noir-400 light:text-noir-600">Your cart is empty — let&apos;s find something you&apos;ll love.</p>
          <Link href="/shop" className="h-12 rounded-full bg-violet-500 px-6 text-sm font-bold text-white uppercase leading-[3rem]">
            Shop products
          </Link>
        </div>
      </main>
    );
  }

  const subtotal = rows.reduce((s, r) => s + r.product.price * r.item.qty, 0);
  const shipping = subtotal >= 50000 ? 0 : state === "Lagos" ? 2500 : 4500;
  const total = subtotal + shipping;

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitError(null);

    const next = new Set<string>();
    if (!/\S+@\S+\.\S+/.test(email)) next.add("email");
    if (phone.replace(/\D/g, "").length < 7) next.add("phone");
    if (!firstName.trim()) next.add("firstName");
    if (!lastName.trim()) next.add("lastName");
    if (!address.trim()) next.add("address");
    if (!city.trim()) next.add("city");
    if (!proofUrl) next.add("proof");
    setInvalid(next);
    if (next.size > 0) return;

    setSubmitting(true);
    try {
      const order = await placeOrder({
        name: `${firstName} ${lastName}`.trim(),
        phone,
        email,
        fulfilmentType: "delivery",
        fulfilmentDetail: `${city}, ${state}`,
        address,
        items: rows.map((r) => ({ id: r.product.id, qty: r.item.qty })),
        paymentProofUrl: proofUrl,
      });
      clear();
      router.push(`/checkout/confirmation?ref=${order.ref}&pay=${encodeURIComponent(pay)}&total=${total}&mode=ship&email=${encodeURIComponent(email)}`);
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
                <button type="button" className="is-active">
                  Ship to me
                </button>
                <button
                  type="button"
                  disabled
                  className="relative cursor-not-allowed opacity-50"
                  title="Pickup isn't available yet"
                >
                  Pick up in Ikeja
                  <span className="absolute top-1 right-1.5 rounded-full bg-violet-500 px-1.5 py-0.5 text-[9px] font-bold tracking-wide text-white uppercase">
                    Soon
                  </span>
                </button>
              </div>
              <div className="grid gap-4 pt-4">
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
            </Reveal>

            <Reveal as="fieldset" delay={160} className="mb-9 border-0 p-0">
              <h2>Payment</h2>
              <div className="flex flex-col gap-2.5">
                {/* Paystack and Flutterwave aren't integrated yet — bank transfer only for now.
                {["Paystack", "Flutterwave"].map((opt) => (
                  <label key={opt} className={`pay-opt ${pay === opt ? "is-active" : ""}`}>
                    <input type="radio" name="pay" checked={pay === opt} readOnly />
                    {opt === "Paystack" ? "Paystack — card, bank or USSD" : opt}
                  </label>
                ))}
                */}
                {["Bank transfer"].map((opt) => (
                  <label key={opt} className={`pay-opt ${pay === opt ? "is-active" : ""}`}>
                    <input type="radio" name="pay" checked={pay === opt} readOnly />
                    {opt === "Paystack" ? "Paystack — card, bank or USSD" : opt}
                  </label>
                ))}
              </div>
              <div className="mt-3.5 rounded-xl border border-white/12 light:border-noir-900/12 p-4 text-[13.5px] leading-relaxed">
                <p className="mb-2 font-bold uppercase tracking-[0.05em] text-[11px] text-noir-400 light:text-noir-600">
                  Transfer to
                </p>
                <p>
                  Bank: <strong>{settings?.bank_name || "—"}</strong>
                  <br />
                  Account name: <strong>{settings?.bank_account_name || "—"}</strong>
                </p>
                <div className="mt-1 flex items-center gap-1">
                  <span>
                    Account number: <strong>{settings?.bank_account_number || "—"}</strong>
                  </span>
                  {settings?.bank_account_number && (
                    <button
                      type="button"
                      aria-label="Copy account number"
                      onClick={async () => {
                        const value = settings.bank_account_number;
                        try {
                          await navigator.clipboard.writeText(value);
                          toast.success("Account number copied");
                        } catch {
                          toast.message("Copy this account number", { description: value });
                        }
                      }}
                      className="-my-2 inline-flex size-9 shrink-0 items-center justify-center rounded-md text-noir-300 transition-colors hover:bg-white/8 hover:text-violet-300 active:bg-white/8 light:text-noir-500 light:hover:bg-noir-900/6 light:hover:text-violet-600 light:active:bg-noir-900/6"
                    >
                      <Icon name="copy" className="size-3.5" />
                    </button>
                  )}
                </div>
                <p className="mt-2 text-noir-400 light:text-noir-600">
                  After transferring, upload a screenshot or PDF of the receipt below — we&apos;ll confirm your order once
                  it&apos;s reviewed.
                </p>
              </div>

              <div className={`field mt-3.5 ${invalid.has("proof") ? "is-invalid" : ""}`}>
                <label htmlFor="co-proof">Proof of payment</label>
                <div className="flex flex-wrap items-center gap-2.5">
                  <label
                    htmlFor="co-proof"
                    className={`inline-flex h-11 shrink-0 cursor-pointer items-center gap-2 rounded-full border border-[var(--line-strong)] px-4.5 text-[13.5px] font-semibold text-foreground transition-colors hover:border-violet-400 ${
                      uploadingProof ? "pointer-events-none opacity-60" : ""
                    }`}
                  >
                    <Icon name="upload" className="size-4" />
                    {uploadingProof ? "Uploading…" : proofFileName ? "Change file" : "Upload proof"}
                  </label>
                  <input
                    id="co-proof"
                    type="file"
                    accept="image/*,application/pdf"
                    className="sr-only"
                    onChange={handleProofChange}
                    disabled={uploadingProof}
                  />
                  {proofFileName && !uploadingProof && (
                    <span className="flex min-w-0 items-center gap-1.5 text-[13px] text-noir-400 light:text-noir-600">
                      <Icon name="check" className="size-4 shrink-0 text-status-booked" />
                      <span className="truncate">{proofFileName}</span>
                    </span>
                  )}
                </div>
                <span className="err">Please upload proof of your bank transfer.</span>
                {uploadError && <p className="mt-1.5 text-[13px] font-medium text-status-cancelled">{uploadError}</p>}
              </div>

              <p className="mt-3 flex items-center gap-2 text-[13px] text-noir-400 light:text-noir-600">
                <Icon name="lock" className="size-4" /> Your details are encrypted and only used to process this order.
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
              <span>Shipping</span>
              <span>{shipping ? money(shipping, { decimals: true }) : "Free"}</span>
            </div>
            <div className="sum-row grand">
              <span>Total</span>
              <strong>{money(total, { decimals: true })}</strong>
            </div>
          </div>
          <Link
            href="/cart"
            className="mt-4.5 inline-block text-sm text-violet-300 underline underline-offset-4 hover:text-white light:text-violet-600 light:hover:text-foreground"
          >
            Edit cart
          </Link>
        </Reveal>
      </div>
    </main>
  );
}
