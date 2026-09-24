import Link from "next/link";
import { AddToCartButton } from "@/components/shared/add-to-cart-button";
import { MoneyLabel } from "@/components/shared/money-label";
import type { Product } from "@/lib/queries";

export function ProductCard({ product }: { product: Product }) {
  const lowStock = product.stock_units > 0 && product.stock_units < 10;

  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl bg-white/5">
      <Link href={`/product/${product.id}`} className="relative block aspect-[236/320] overflow-hidden">
        {product.image_url ? (
          // eslint-disable-next-line @next/next/no-img-element -- Supabase Storage URL, no next/image loader configured
          <img
            src={product.image_url}
            alt={product.name}
            className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="size-full bg-noir-700" />
        )}
        {lowStock && (
          <span className="absolute top-3 left-3 rounded-full bg-status-cancelled px-2.5 py-1 text-[11px] font-bold text-white">
            Almost gone
          </span>
        )}
        {product.stock_units === 0 && (
          <span className="absolute top-3 left-3 rounded-full bg-noir-900 px-2.5 py-1 text-[11px] font-bold text-white">
            Out of stock
          </span>
        )}
      </Link>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <Link href={`/product/${product.id}`} className="font-display line-clamp-2 text-[15px] font-semibold">
          {product.name}
        </Link>
        <div className="text-base font-bold text-champagne-100">
          <MoneyLabel ngn={product.price} />
        </div>
        <AddToCartButton
          productId={product.id}
          productName={product.name}
          className="mt-auto h-10 rounded-full bg-violet-500 text-[13px] font-bold text-white uppercase transition-colors hover:bg-violet-600 disabled:opacity-40"
        >
          Add to cart
        </AddToCartButton>
      </div>
    </div>
  );
}
