"use client";

import { createClient as createBrowserClient } from "@zoeallure/supabase/client";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Badge } from "./badge";
import { LINE_META, STATUS_BADGE } from "@/lib/catalog";

type OrderHit = { id: string; ref: string; phone: string; payment_status: string };
type BookingHit = { id: string; ref: string; phone: string; status: string };
type CustomerHit = { id: string; name: string; phone: string; email: string | null };
type ProductHit = { id: string; name: string; category: keyof typeof LINE_META };

type Results = {
  orders: OrderHit[];
  bookings: BookingHit[];
  customers: CustomerHit[];
  products: ProductHit[];
};

const EMPTY_RESULTS: Results = { orders: [], bookings: [], customers: [], products: [] };

export function GlobalSearch() {
  const router = useRouter();
  const [supabase] = useState(() => createBrowserClient());
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<Results>(EMPTY_RESULTS);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const term = query.trim();
    if (term.length < 2) return;

    const safeTerm = term.replace(/[%,()]/g, " ").trim();
    const handle = setTimeout(async () => {
      const [{ data: orders }, { data: bookings }, { data: customers }, { data: products }] =
        await Promise.all([
          supabase
            .from("orders")
            .select("id, ref, phone, payment_status")
            .or(`ref.ilike.%${safeTerm}%,phone.ilike.%${safeTerm}%`)
            .limit(5),
          supabase
            .from("bookings")
            .select("id, ref, phone, status")
            .or(`ref.ilike.%${safeTerm}%,phone.ilike.%${safeTerm}%`)
            .limit(5),
          supabase
            .from("customer_profiles")
            .select("id, name, phone, email")
            .or(`name.ilike.%${safeTerm}%,phone.ilike.%${safeTerm}%,email.ilike.%${safeTerm}%`)
            .limit(5),
          supabase.from("products").select("id, name, category").ilike("name", `%${safeTerm}%`).limit(5),
        ]);

      setResults({
        orders: orders ?? [],
        bookings: bookings ?? [],
        customers: customers ?? [],
        products: products ?? [],
      });
      setLoading(false);
    }, 300);

    return () => clearTimeout(handle);
  }, [query, supabase]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function go(href: string) {
    setOpen(false);
    setQuery("");
    router.push(href);
  }

  const hasQuery = query.trim().length >= 2;
  const hasResults =
    results.orders.length + results.bookings.length + results.customers.length + results.products.length > 0;

  return (
    <div
      ref={containerRef}
      className="relative min-w-0 flex-1 lg:w-[min(420px,42vw)] lg:flex-none"
    >
      <div className="flex items-center gap-3 rounded-xl border border-noir-100 bg-noir-50 px-4 py-[11px]">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#837D93" strokeWidth="1.8" strokeLinecap="round" className="flex-none">
          <circle cx="11" cy="11" r="7" />
          <path d="M21 21l-4.3-4.3" />
        </svg>
        <input
          value={query}
          onChange={(e) => {
            const value = e.target.value;
            setQuery(value);
            if (value.trim().length < 2) {
              setResults(EMPTY_RESULTS);
              setLoading(false);
            } else {
              setLoading(true);
            }
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={(e) => {
            if (e.key === "Escape") {
              setOpen(false);
              e.currentTarget.blur();
            }
          }}
          placeholder="Search orders, bookings, customers…"
          className="w-full min-w-0 truncate bg-transparent text-[13.5px] text-noir-800 outline-none placeholder:text-noir-400"
        />
      </div>

      {open && hasQuery && (
        <div className="absolute top-[calc(100%+6px)] z-50 w-full min-w-[320px] overflow-hidden rounded-xl border border-noir-100 bg-white shadow-lg">
          {loading ? (
            <div className="px-4 py-5 text-center text-[12.5px] text-noir-400">Searching…</div>
          ) : !hasResults ? (
            <div className="px-4 py-5 text-center text-[12.5px] text-noir-400">
              No results for &ldquo;{query.trim()}&rdquo;
            </div>
          ) : (
            <div className="max-h-[420px] overflow-y-auto py-1.5">
              {results.orders.length > 0 && (
                <ResultGroup label="Orders">
                  {results.orders.map((o) => (
                    <ResultRow key={o.id} onClick={() => go(`/orders/${o.id}`)}>
                      <span className="min-w-0">
                        <span className="block truncate text-[13px] font-bold text-noir-800">#{o.ref}</span>
                        <span className="block truncate text-[12px] text-noir-400">{o.phone}</span>
                      </span>
                      <Badge
                        label={STATUS_BADGE[o.payment_status]?.label ?? o.payment_status}
                        bg={STATUS_BADGE[o.payment_status]?.bg ?? "#F7F6F9"}
                        fg={STATUS_BADGE[o.payment_status]?.fg ?? "#5B5568"}
                      />
                    </ResultRow>
                  ))}
                </ResultGroup>
              )}

              {results.bookings.length > 0 && (
                <ResultGroup label="Bookings">
                  {results.bookings.map((b) => (
                    <ResultRow key={b.id} onClick={() => go(`/bookings?status=${b.status}`)}>
                      <span className="min-w-0">
                        <span className="block truncate text-[13px] font-bold text-noir-800">#{b.ref}</span>
                        <span className="block truncate text-[12px] text-noir-400">{b.phone}</span>
                      </span>
                      <Badge
                        label={STATUS_BADGE[b.status]?.label ?? b.status}
                        bg={STATUS_BADGE[b.status]?.bg ?? "#F7F6F9"}
                        fg={STATUS_BADGE[b.status]?.fg ?? "#5B5568"}
                      />
                    </ResultRow>
                  ))}
                </ResultGroup>
              )}

              {results.customers.length > 0 && (
                <ResultGroup label="Customers">
                  {results.customers.map((c) => (
                    <ResultRow key={c.id} onClick={() => go(`/customers/${c.id}`)}>
                      <span className="min-w-0">
                        <span className="block truncate text-[13px] font-bold text-noir-800">{c.name}</span>
                        <span className="block truncate text-[12px] text-noir-400">{c.phone}</span>
                      </span>
                    </ResultRow>
                  ))}
                </ResultGroup>
              )}

              {results.products.length > 0 && (
                <ResultGroup label="Products">
                  {results.products.map((p) => (
                    <ResultRow key={p.id} onClick={() => go(`/products/${p.id}`)}>
                      <span className="min-w-0">
                        <span className="block truncate text-[13px] font-bold text-noir-800">{p.name}</span>
                        <span className="block truncate text-[12px] text-noir-400">{LINE_META[p.category]?.line}</span>
                      </span>
                    </ResultRow>
                  ))}
                </ResultGroup>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function ResultGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="px-1.5 py-1">
      <div className="px-2.5 py-1 text-[10.5px] font-bold tracking-[0.1em] text-noir-400 uppercase">{label}</div>
      <div className="flex flex-col">{children}</div>
    </div>
  );
}

function ResultRow({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center justify-between gap-2.5 rounded-lg px-2.5 py-2 text-left hover:bg-noir-50"
    >
      {children}
    </button>
  );
}
