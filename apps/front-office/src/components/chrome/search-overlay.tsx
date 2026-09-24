"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Icon } from "@/components/shared/icon";
import { categoryLabels } from "@/lib/data";
import type { Product, Service } from "@/lib/queries";
import { useChromeUi } from "@/lib/store/chrome-ui";
import { useCurrency } from "@/lib/store/currency";

const suggestions = ["Shampoo", "Wig", "Press-on nails", "Lip gloss", "Lash", "Bridal"];

export function SearchOverlay({ products, services }: { products: Product[]; services: Service[] }) {
  const { searchOpen, setSearchOpen } = useChromeUi();
  const { money } = useCurrency();
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (searchOpen) {
      const t = setTimeout(() => inputRef.current?.focus(), 150);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setQuery(""), 0);
    return () => clearTimeout(t);
  }, [searchOpen]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setSearchOpen(false);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [setSearchOpen]);

  const q = query.trim().toLowerCase();
  const productHits = q
    ? products
        .filter((p) => `${p.name} ${categoryLabels[p.category]}`.toLowerCase().includes(q))
        .slice(0, 8)
    : [];
  const serviceHits = q ? services.filter((s) => `${s.name} ${s.category}`.toLowerCase().includes(q)).slice(0, 3) : [];
  const hasResults = productHits.length > 0 || serviceHits.length > 0;

  return (
    <div
      className={`fixed inset-0 z-[110] ${searchOpen ? "visible pointer-events-auto" : "pointer-events-none invisible delay-[420ms]"}`}
    >
      <div
        onClick={() => setSearchOpen(false)}
        className={`absolute inset-0 bg-[rgba(8,6,12,.7)] backdrop-blur-[12px] transition-opacity duration-[420ms] ${
          searchOpen ? "opacity-100" : "opacity-0"
        }`}
      />
      <div
        role="dialog"
        aria-label="Search"
        className={`relative border-b border-white/8 bg-noir-800 pt-8 pb-10 transition-transform duration-[420ms] ease-[var(--ease)] ${
          searchOpen ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 border-b-[1.5px] border-white/16 pb-3.5">
            <Icon name="search" className="size-7 shrink-0 text-noir-400" />
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              type="search"
              placeholder="Search products & services"
              autoComplete="off"
              aria-label="Search"
              className="font-display flex-1 bg-transparent text-2xl text-white outline-none placeholder:text-noir-500 sm:text-4xl"
            />
            <button
              type="button"
              onClick={() => setSearchOpen(false)}
              aria-label="Close search"
              className="grid size-9 shrink-0 place-items-center rounded-full text-white hover:bg-white/8"
            >
              <Icon name="close" className="size-5" />
            </button>
          </div>

          {!q && (
            <div className="mt-5 flex flex-wrap gap-2.5">
              {suggestions.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setQuery(s)}
                  className="h-[34px] rounded-full border border-white/16 px-4 text-sm text-noir-200 hover:border-violet-300 hover:text-white"
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          {q && (
            <div className="mt-6 grid max-h-[50vh] grid-cols-1 gap-3 overflow-auto sm:grid-cols-2">
              {productHits.map((p) => (
                <Link
                  key={p.id}
                  href={`/product/${p.id}`}
                  className="flex items-center gap-3.5 rounded-xl p-2.5 hover:bg-white/6"
                >
                  {p.image_url && (
                    // eslint-disable-next-line @next/next/no-img-element -- Supabase Storage URL, no next/image loader configured
                    <img src={p.image_url} alt="" className="size-14 rounded-lg object-cover" />
                  )}
                  <div>
                    <p className="font-display text-base">{p.name}</p>
                    <p className="text-[13px] text-noir-300">{money(p.price)}</p>
                  </div>
                </Link>
              ))}
              {serviceHits.map((s) => (
                <Link
                  key={s.id}
                  href={`/services?service=${s.id}#book`}
                  className="flex items-center gap-3.5 rounded-xl p-2.5 hover:bg-white/6"
                >
                  {s.image_url && (
                    // eslint-disable-next-line @next/next/no-img-element -- Supabase Storage URL, no next/image loader configured
                    <img src={s.image_url} alt="" className="size-14 rounded-lg object-cover" />
                  )}
                  <div>
                    <p className="font-display text-base">{s.name}</p>
                    <p className="text-[13px] text-noir-300">Service · from {money(s.price)}</p>
                  </div>
                </Link>
              ))}
              {!hasResults && <p className="text-noir-400">No matches for &ldquo;{query}&rdquo;. Try &ldquo;shampoo&rdquo; or &ldquo;wig&rdquo;.</p>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
