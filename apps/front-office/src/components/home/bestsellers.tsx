import Link from "next/link";
import { AddToCartButton } from "@/components/shared/add-to-cart-button";
import { Reveal } from "@/components/shared/reveal";
import type { Product } from "@/lib/queries";
import { MoneyLabel } from "@/components/shared/money-label";

export function Bestsellers({ products }: { products: Product[] }) {
  return (
    <section className="relative overflow-hidden bg-[linear-gradient(120deg,#2A1470,#3E1580,#4A1690)] px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
      <div className="relative mx-auto max-w-[1280px]">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <Reveal as="span" className="block text-sm font-bold text-white uppercase">
              Curated favorites
            </Reveal>
            <Reveal as="h2" className="font-display mt-1 block text-3xl font-bold sm:text-4xl lg:text-[44px]">Best Selling Products</Reveal>
          </div>
          <Reveal>
            <Link href="/shop" className="text-lg font-medium text-violet-300 underline">
              View All Bestsellers
            </Link>
          </Reveal>
        </div>

        <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((p, i) => (
            <Reveal key={p.id} delay={i * 90}>
              <Link href={`/product/${p.id}`} className="group block overflow-hidden rounded-2xl bg-white/5" style={{ aspectRatio: "335/523" }}>
                <div className="relative h-3/5 w-full overflow-hidden">
                  {p.image_url && (
                    // eslint-disable-next-line @next/next/no-img-element -- Supabase Storage URL, no next/image loader configured
                    <img
                      src={p.image_url}
                      alt={p.name}
                      className="size-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  )}
                </div>
                <div className="flex flex-col gap-1.5 p-5">
                  <h3 className="font-display text-xl font-bold text-white">{p.name}</h3>
                  <div className="text-lg font-bold text-champagne-100">
                    <MoneyLabel ngn={p.price} />
                  </div>
                  <AddToCartButton
                    productId={p.id}
                    productName={p.name}
                    className="mt-2 h-11 rounded-full bg-violet-500 text-sm font-bold text-white uppercase transition-colors hover:bg-violet-600"
                  >
                    Add to cart
                  </AddToCartButton>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
