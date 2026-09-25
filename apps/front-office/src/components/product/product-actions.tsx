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
    <>
      <div className="buy-row">
        <div className="qty qty--pill">
          <button type="button" onClick={() => setQty((q) => clamp(q - 1))} aria-label="Decrease">
            -
          </button>
          <input
            type="number"
            min={1}
            max={99}
            value={qty}
            onChange={(e) => setQty(clamp(Number(e.target.value) || 1))}
            aria-label="Quantity"
          />
          <button type="button" onClick={() => setQty((q) => clamp(q + 1))} aria-label="Increase">
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
          className="h-[52px] flex-1 rounded-full bg-violet-500 text-[16px] font-bold text-white uppercase transition-colors hover:bg-violet-600 disabled:opacity-40"
        >
          Add to cart
        </button>
      </div>
      <button
        type="button"
        disabled={disabled}
        onClick={() => {
          add(productId, qty);
          router.push("/checkout");
        }}
        className="btn-buynow w-full disabled:opacity-40"
      >
        Buy it now
      </button>
    </>
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
    >
      <Icon name="share" className="size-4" /> Share product
    </button>
  );
}
