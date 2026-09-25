import Link from "next/link";
import { AddToCartButton } from "@/components/shared/add-to-cart-button";
import { Reveal } from "@/components/shared/reveal";
import type { Product } from "@/lib/queries";
import { MoneyLabel } from "@/components/shared/money-label";

export function Bestsellers({ products }: { products: Product[] }) {
  return (
    <section
      className="noise-overlay relative overflow-hidden py-[clamp(64px,8vw,110px)]"
      style={{ backgroundImage: "linear-gradient(120deg, #2A1470 0%, #3E1580 45%, #4A1690 100%)" }}
    >
      <div className="relative mx-auto max-w-[calc(1280px_+_clamp(16px,5vw,80px)*2)] px-[clamp(16px,5vw,80px)]">
        <div className="mb-11 flex flex-col items-start gap-6 min-[761px]:flex-row min-[761px]:items-end min-[761px]:justify-between">
          <div>
            <Reveal as="span" className="mb-[18px] block text-[13px] font-bold text-white uppercase">
              Curated favorites
            </Reveal>
            <Reveal as="h2" className="font-display block text-[clamp(34px,4.6vw,60px)] leading-[1.08] font-bold">
              Best Selling Products
            </Reveal>
          </div>
          <Reveal>
            <Link
              href="/shop"
              className="text-[19px] font-medium text-violet-300 underline decoration-1 underline-offset-4 transition-colors duration-150 hover:text-white"
            >
              View All Bestsellers
            </Link>
          </Reveal>
        </div>

        <div className="grid grid-cols-4 gap-7 max-[1080px]:grid-cols-2 max-[760px]:gap-[14px] max-[560px]:grid-cols-1 max-[560px]:gap-[18px]">
          {products.map((p, i) => (
            <Reveal key={p.id} delay={i * 90}>
              <Link
                href={`/product/${p.id}`}
                className="group relative block aspect-[335/523] overflow-hidden rounded-[22px] shadow-[0_20px_50px_-24px_rgba(0,0,0,.6)] transition-[transform,box-shadow] duration-[420ms] ease-[var(--ease)] max-[560px]:aspect-[4/5] hover:-translate-y-1.5 hover:shadow-[0_30px_60px_-24px_rgba(0,0,0,.8)]"
              >
                {p.image_url && (
                  // eslint-disable-next-line @next/next/no-img-element -- Supabase Storage URL, no next/image loader configured
                  <img
                    src={p.image_url}
                    alt={p.name}
                    className="absolute inset-0 size-full object-cover transition-transform duration-1000 ease-[var(--ease)] group-hover:scale-[1.06]"
                  />
                )}
                <div
                  className="pointer-events-none absolute inset-0"
                  style={{
                    backgroundImage: "linear-gradient(180deg, transparent 45%, rgba(40,36,44,.85) 78%, rgba(60,56,62,.95))",
                  }}
                />
                <div className="absolute inset-x-[26px] bottom-[26px] z-[2] max-[760px]:inset-x-[14px] max-[760px]:bottom-[14px]">
                  {p.brand && (
                    <div className="text-[13px] font-semibold text-champagne-100 uppercase">{p.brand}</div>
                  )}
                  <h3 className="font-display mt-1.5 mb-3 text-[22px] leading-[1.2] font-bold text-white max-[760px]:text-[17px] max-[560px]:text-[22px]">
                    {p.name}
                  </h3>
                  <div className="mb-[18px] text-[17px] font-bold text-champagne-100">
                    <MoneyLabel ngn={p.price} />
                  </div>
                  <AddToCartButton
                    productId={p.id}
                    productName={p.name}
                    className="h-[42px] w-full rounded-full bg-violet-500 text-sm font-bold text-white uppercase transition-colors hover:bg-violet-600"
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
