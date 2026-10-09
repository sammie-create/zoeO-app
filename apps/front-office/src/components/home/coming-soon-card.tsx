"use client";

import { useState } from "react";
import { Icon } from "@/components/shared/icon";
import { MoneyLabel } from "@/components/shared/money-label";
import { ProductQuickView } from "@/components/shop/product-quick-view";
import type { Product } from "@/lib/queries";

export function ComingSoonCard({ product: p }: { product: Product }) {
  const [quickViewOpen, setQuickViewOpen] = useState(false);

  return (
    <>
      <div
        className="group relative block aspect-[335/523] cursor-pointer overflow-hidden rounded-[22px] shadow-[0_20px_50px_-24px_rgba(0,0,0,.6)] max-[560px]:aspect-[4/5]"
        role="button"
        tabIndex={0}
        aria-label={`Quick view ${p.name}`}
        onClick={() => setQuickViewOpen(true)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setQuickViewOpen(true);
          }
        }}
      >
        {p.image_url ? (
          // eslint-disable-next-line @next/next/no-img-element -- Supabase Storage URL, no next/image loader configured
          <img
            src={p.image_url}
            alt={p.name}
            className="absolute inset-0 size-full object-cover transition-transform duration-1000 ease-[var(--ease)] group-hover:scale-[1.06]"
            style={{ filter: "saturate(.75) brightness(.85)" }}
          />
        ) : (
          <div className="absolute inset-0 size-full bg-noir-700 light:bg-noir-100" />
        )}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage: "linear-gradient(180deg, transparent 45%, rgba(40,36,44,.85) 78%, rgba(60,56,62,.95))",
          }}
        />
        <span className="absolute top-[18px] left-[18px] z-[2] inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 text-[11px] font-bold text-noir-900">
          <Icon name="clock" className="size-3.5 text-violet-500" />
          Coming soon
        </span>
        <span className="absolute top-[12px] right-[12px] z-[2] grid size-9 -translate-y-1.5 place-items-center rounded-full bg-white/92 text-noir-900 opacity-0 transition-[opacity,transform] duration-300 ease-[var(--ease)] group-hover:translate-y-0 group-hover:opacity-100">
          <Icon name="eye" className="size-4" />
        </span>
        <div className="absolute inset-x-[26px] bottom-[26px] z-[2] max-[760px]:inset-x-[14px] max-[760px]:bottom-[14px]">
          {p.brand && <div className="text-[13px] font-semibold text-champagne-100 uppercase">{p.brand}</div>}
          <h3 className="font-display mt-1.5 mb-3 text-[22px] leading-[1.2] font-bold text-white max-[760px]:text-[17px] max-[560px]:text-[22px]">
            {p.name}
          </h3>
          <div className="text-[17px] font-bold text-champagne-100">
            <MoneyLabel ngn={p.price} />
          </div>
        </div>
      </div>

      <ProductQuickView product={p} open={quickViewOpen} onOpenChange={setQuickViewOpen} />
    </>
  );
}
