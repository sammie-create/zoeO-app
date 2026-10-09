"use client";

import Link from "next/link";
import { useState, type CSSProperties } from "react";
import { toast } from "sonner";
import { Icon } from "@/components/shared/icon";
import { MoneyLabel } from "@/components/shared/money-label";
import { ProductQuickView } from "@/components/shop/product-quick-view";
import { useCart } from "@/lib/store/cart";
import type { Product } from "@/lib/queries";

export function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
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
        className={`pcard ${isSoon ? "is-soon" : ""} ${isOutOfStock ? "is-oos" : ""}`}
        style={{ "--i": index } as CSSProperties}
      >
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
            <div className="size-full bg-noir-700 light:bg-noir-100" />
          )}
          <span className="pcard__view">
            <Icon name="eye" className="size-4" />
          </span>
          {unavailable ? (
            <span className="soon-badge">{isSoon ? "Coming soon" : "Out of stock"}</span>
          ) : (
            <button type="button" className="pcard__quick" onClick={quickAdd}>
              Quick add +
            </button>
          )}
        </div>
        {product.brand && <div className="pcard__brand">{product.brand}</div>}
        <h3 className="pcard__name">
          <Link href={`/product/${product.id}`}>{product.name}</Link>
        </h3>
        <div className="pcard__price">
          <MoneyLabel ngn={product.price} />
        </div>
      </article>

      <ProductQuickView product={product} open={quickViewOpen} onOpenChange={setQuickViewOpen} />
    </>
  );
}
