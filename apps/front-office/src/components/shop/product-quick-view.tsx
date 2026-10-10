"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { XIcon } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogClose, DialogContent } from "@/components/ui/dialog";
import { Icon } from "@/components/shared/icon";
import { MoneyLabel } from "@/components/shared/money-label";
import { useCart } from "@/lib/store/cart";
import type { Product } from "@/lib/queries";

export function ProductQuickView({
  product,
  open,
  onOpenChange,
}: {
  product: Product;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const router = useRouter();
  const { add } = useCart();
  const [qty, setQty] = useState(1);
  const isSoon = product.status === "coming_soon";
  const isOutOfStock = product.status === "out_of_stock";
  const unavailable = isSoon || isOutOfStock;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="modal__box max-w-[min(1260px,calc(100%-2rem))] p-[clamp(24px,3vw,44px)] sm:max-w-[min(1260px,calc(100%-2rem))]"
        overlayClassName="modal__scrim"
        showCloseButton={false}
      >
        <DialogClose asChild>
          <button type="button" className="modal__close" aria-label="Close">
            <XIcon className="size-5" />
          </button>
        </DialogClose>
        <div className="qv">
          <div className="qv__main">
            {product.image_url ? (
              // eslint-disable-next-line @next/next/no-img-element -- Supabase Storage URL, no next/image loader configured
              <img src={product.image_url} alt={product.name} />
            ) : (
              <div className="size-full bg-noir-700 light:bg-noir-100" />
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
            {unavailable ? (
              <button type="button" disabled className="btn-buynow" style={{ opacity: 0.6, cursor: "not-allowed" }}>
                {isSoon ? "Coming soon" : "Out of stock"}
              </button>
            ) : (
              <>
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
                      onOpenChange(false);
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
                    onOpenChange(false);
                    router.push("/checkout");
                  }}
                >
                  Buy it now
                </button>
              </>
            )}
            <div className="qv__details">
              <Link href={`/product/${product.id}`}>View full details</Link>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
