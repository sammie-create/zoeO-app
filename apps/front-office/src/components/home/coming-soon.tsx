import Link from "next/link";
import { ComingSoonCard } from "@/components/home/coming-soon-card";
import { Reveal } from "@/components/shared/reveal";
import type { Product } from "@/lib/queries";

export function ComingSoon({ products }: { products: Product[] }) {
  if (products.length === 0) return null;

  return (
    <section className="py-[clamp(64px,9vw,120px)]">
      <div className="mx-auto max-w-[calc(1280px_+_clamp(16px,5vw,80px)*2)] px-[clamp(16px,5vw,80px)]">
        <div className="mb-11 flex flex-col items-start gap-6 min-[761px]:flex-row min-[761px]:items-end min-[761px]:justify-between">
          <div>
            <Reveal
              as="span"
              className="mb-[18px] inline-flex items-center gap-2 text-[13px] font-semibold tracking-[.18em] text-violet-400 uppercase"
            >
              <span className="size-1.5 rounded-full bg-current" />
              Launching soon
            </Reveal>
            <Reveal as="h2" className="font-display block text-[clamp(34px,4.6vw,60px)] leading-[1.08] font-bold">
              Coming <em className="font-normal italic">Soon</em>
            </Reveal>
          </div>
          <Reveal>
            <Link
              href="/shop"
              className="text-[19px] font-medium text-violet-400 underline decoration-1 underline-offset-4 transition-colors duration-150 hover:text-violet-300"
            >
              See everything coming soon
            </Link>
          </Reveal>
        </div>

        <div className="grid grid-cols-4 gap-7 max-[1080px]:grid-cols-2 max-[760px]:gap-[14px] max-[560px]:grid-cols-1 max-[560px]:gap-[18px]">
          {products.map((p, i) => (
            <Reveal key={p.id} delay={i * 90}>
              <ComingSoonCard product={p} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
