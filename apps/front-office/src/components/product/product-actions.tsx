"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Icon } from "@/components/shared/icon";
import { useCart } from "@/lib/store/cart";

export function ProductActions({ productId, productName, maxQty }: { productId: string; productName: string; maxQty: number }) {
  const { add } = useCart();
  const router = useRouter();
  const [qty, setQty] = useState(1);
  const disabled = maxQty === 0;

  function clamp(n: number) {
    return Math.max(1, Math.min(99, maxQty > 0 ? Math.min(n, maxQty) : n));
  }

  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <div className="flex h-14 items-center rounded-full border border-white/16">
        <button type="button" onClick={() => setQty((q) => clamp(q - 1))} className="w-12 text-lg" aria-label="Decrease">
          −
        </button>
        <input
          type="number"
          min={1}
          max={99}
          value={qty}
          onChange={(e) => setQty(clamp(Number(e.target.value) || 1))}
          aria-label="Quantity"
          className="w-12 bg-transparent text-center outline-none"
        />
        <button type="button" onClick={() => setQty((q) => clamp(q + 1))} className="w-12 text-lg" aria-label="Increase">
          +
        </button>
      </div>
      <button
        type="button"
        disabled={disabled}
        onClick={() => {
          add(productId, qty);
          toast.success("Added to cart", { description: `${productName} × ${qty}` });
        }}
        className="h-14 flex-1 rounded-full bg-violet-500 text-sm font-bold text-white uppercase transition-colors hover:bg-violet-600 disabled:opacity-40"
      >
        Add to cart
      </button>
      <button
        type="button"
        disabled={disabled}
        onClick={() => {
          add(productId, qty);
          router.push("/checkout");
        }}
        className="h-14 rounded-full border border-white/24 px-6 text-sm font-bold uppercase hover:bg-white/6 disabled:opacity-40"
      >
        Buy it now
      </button>
    </div>
  );
}

export function ShareButton({ productName }: { productName: string }) {
  return (
    <button
      type="button"
      onClick={async () => {
        const shareData = { title: productName, text: `${productName} at ZoeO Allure`, url: window.location.href };
        if (navigator.share) {
          try {
            await navigator.share(shareData);
          } catch {
            // user cancelled
          }
          return;
        }
        try {
          await navigator.clipboard.writeText(window.location.href);
          toast.success("Link copied", { description: "Share it with someone who deserves a glow-up." });
        } catch {
          toast.message("Copy this link", { description: window.location.href });
        }
      }}
      className="inline-flex items-center gap-1.5 text-[13px] text-noir-300 hover:text-white"
    >
      <Icon name="share" className="size-4" /> Share product
    </button>
  );
}
