"use client";

import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { MoneyLabel } from "@/components/shared/money-label";
import { ProductQuickView } from "@/components/shop/product-quick-view";
import { categoryLabels } from "@/lib/data";
import { useCart } from "@/lib/store/cart";
import type { Product } from "@/lib/queries";
import type { CSSProperties } from "react";

export function ProductRow({ product, index = 0 }: { product: Product; index?: number }) {
  const { add } = useCart();
  const [quickViewOpen, setQuickViewOpen] = useState(false);
  const isSoon = product.status === "coming_soon";
  const isOutOfStock = product.status === "out_of_stock";
  const unavailable = isSoon || isOutOfStock;

  function quickAdd(e: React.MouseEvent) {
    e.stopPropagation();
    e.preventDefault();
    add(product.id);
    toast.success("Added to cart", { description: product.name });
  }

  return (
    <>
      <article
        className={`prow ${isSoon ? "is-soon" : ""} ${isOutOfStock ? "is-oos" : ""}`}
        style={{ "--i": index } as CSSProperties}
      >
        <div
          className="prow__img"
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
            <div className="size-full bg-noir-700 light:bg-noir-100" />
          )}
          {unavailable && <span className="soon-badge">{isSoon ? "Coming soon" : "Out of stock"}</span>}
        </div>
        <div className="prow__body">
          <div className="pcard__brand">
            {product.brand ? `${product.brand} · ${categoryLabels[product.category]}` : categoryLabels[product.category]}
          </div>
          <h3 className="prow__name">
            <Link href={`/product/${product.id}`}>{product.name}</Link>
          </h3>
          {product.description && <p className="prow__desc">{product.description}</p>}
        </div>
        <div className="prow__side">
          <div className="prow__price">
            <MoneyLabel ngn={product.price} />
          </div>
          {unavailable ? (
            <span className="chip chip--outline">{isSoon ? "Coming soon" : "Out of stock"}</span>
          ) : (
            <button
              type="button"
              className="h-10 rounded-full bg-violet-500 px-5 text-sm font-bold text-white uppercase transition-colors hover:bg-violet-600"
              onClick={quickAdd}
            >
              Add to cart
            </button>
          )}
        </div>
      </article>

      <ProductQuickView product={product} open={quickViewOpen} onOpenChange={setQuickViewOpen} />
    </>
  );
}
