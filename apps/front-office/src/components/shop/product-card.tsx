"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type CSSProperties } from "react";
import { toast } from "sonner";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Icon } from "@/components/shared/icon";
import { MoneyLabel } from "@/components/shared/money-label";
import { useCart } from "@/lib/store/cart";
import type { Product } from "@/lib/queries";

export function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  const router = useRouter();
  const { add } = useCart();
  const [quickViewOpen, setQuickViewOpen] = useState(false);
  const [qty, setQty] = useState(1);

  function quickAdd(e: React.MouseEvent) {
    e.stopPropagation();
    e.preventDefault();
    add(product.id);
    toast.success("Added to cart", { description: product.name });
  }

  return (
    <>
      <article className="pcard" style={{ "--i": index } as CSSProperties}>
        <div
          className="pcard__media"
          role="button"
          tabIndex={0}
          aria-label={`Quick view ${product.name}`}
          onClick={() => setQuickViewOpen(true)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              setQuickViewOpen(true);
            }
          }}
        >
          {product.image_url ? (
            // eslint-disable-next-line @next/next/no-img-element -- Supabase Storage URL, no next/image loader configured
            <img src={product.image_url} alt={product.name} />
          ) : (
            <div className="size-full bg-noir-700" />
          )}
          <span className="pcard__view">
            <Icon name="eye" className="size-4" />
          </span>
          <button type="button" className="pcard__quick" onClick={quickAdd}>
            Quick add +
          </button>
        </div>
        {product.brand && <div className="pcard__brand">{product.brand}</div>}
        <h3 className="pcard__name">
          <Link href={`/product/${product.id}`}>{product.name}</Link>
        </h3>
        <div className="pcard__price">
          <MoneyLabel ngn={product.price} />
        </div>
      </article>

      <Dialog open={quickViewOpen} onOpenChange={setQuickViewOpen}>
        <DialogContent
          className="max-w-[min(1260px,calc(100%-2rem))] bg-[#211E28] p-[clamp(24px,3vw,44px)] sm:max-w-[min(1260px,calc(100%-2rem))]"
          showCloseButton
        >
          <div className="qv">
            <div className="qv__main">
              {product.image_url ? (
                // eslint-disable-next-line @next/next/no-img-element -- Supabase Storage URL, no next/image loader configured
                <img src={product.image_url} alt={product.name} />
              ) : (
                <div className="size-full bg-noir-700" />
              )}
            </div>
            <div className="qv__info">
              {product.brand && <span className="chip chip--outline">{product.brand}</span>}
              <h2 className="qv__title">{product.name}</h2>
              <div className="qv__price">
                <MoneyLabel ngn={product.price} decimals />
              </div>
              <div className="guarantees">
                <span>
                  <Icon name="shield" className="size-4" /> 1-Year Warranty
                </span>
                <span>
                  <Icon name="truck" className="size-4" /> Fast Delivery
                </span>
                <span>
                  <Icon name="swap" className="size-4" /> 30-Day Returns
                </span>
              </div>
              <div className="buy-row">
                <div className="qty">
                  <button type="button" onClick={() => setQty((v) => Math.max(1, v - 1))} aria-label="Decrease">
                    -
                  </button>
                  <input
                    type="number"
                    value={qty}
                    min={1}
                    max={99}
                    onChange={(e) => setQty(Math.max(1, Math.min(99, Number(e.target.value) || 1)))}
                    aria-label="Quantity"
                  />
                  <button type="button" onClick={() => setQty((v) => Math.min(99, v + 1))} aria-label="Increase">
                    +
                  </button>
                </div>
                <button
                  type="button"
                  className="h-[58px] flex-1 rounded-xl bg-violet-500 text-[17px] font-bold text-white uppercase transition-colors hover:bg-violet-600"
                  onClick={() => {
                    add(product.id, qty);
                    setQuickViewOpen(false);
                    toast.success("Added to cart", { description: product.name });
                  }}
                >
                  Add to cart
                </button>
              </div>
              <button
                type="button"
                className="btn-buynow"
                onClick={() => {
                  add(product.id, qty);
                  setQuickViewOpen(false);
                  router.push("/checkout");
                }}
              >
                Buy it now
              </button>
              <div className="qv__details">
                <Link href={`/product/${product.id}`}>View full details</Link>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
