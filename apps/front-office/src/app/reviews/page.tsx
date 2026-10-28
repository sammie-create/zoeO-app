import Link from "next/link";
import { Icon } from "@/components/shared/icon";
import { Reveal } from "@/components/shared/reveal";
import { ReviewForm } from "@/components/reviews/review-form";
import { ReviewsGrid, ReviewsSummary } from "@/components/reviews/reviews-client";
import { getProducts, getReviews, getServices, getTestimonials } from "@/lib/queries";
import { testimonialToDisplayReview, type DisplayReview } from "@/lib/review-utils";

export const dynamic = "force-dynamic";
export const metadata = { title: "Reviews — ZoeO Allure" };

export default async function ReviewsPage() {
  const [reviews, services, products, testimonials] = await Promise.all([
    getReviews(),
    getServices(),
    getProducts(),
    getTestimonials(),
  ]);

  // Staff-written testimonials fill out the page alongside real customer
  // reviews — adapted to the same card shape (5 stars, since staff wouldn't
  // publish a negative one) and merged by date, by design: see memory.
  const displayReviews: DisplayReview[] = [...reviews, ...testimonials.map(testimonialToDisplayReview)].sort(
    (a, b) => b.created_at.localeCompare(a.created_at),
  );

  return (
    <>
      <section className="pt-[clamp(56px,7vw,96px)] pb-[clamp(36px,4vw,56px)] text-center">
        <div className="mx-auto max-w-[calc(1280px_+_clamp(16px,5vw,80px)*2)] px-[clamp(16px,5vw,80px)]">
          <Reveal as="span" className="inline-flex h-6.5 items-center rounded-full bg-violet-500/15 px-3.5 text-[11px] font-bold tracking-[.14em] text-violet-300 uppercase light:bg-violet-500/12 light:text-violet-600">
            Reviews
          </Reveal>
          <Reveal as="h1" delay={120} className="h1 mt-4.5 mb-3.5 text-foreground">
            What our clients <em className="text-violet-400 italic">say</em>
          </Reveal>
          <Reveal as="p" delay={200} className="mx-auto max-w-[560px] text-noir-300 light:text-noir-600">
            Real clients, real results. Tap any review to read it in full.
          </Reveal>

          <ReviewsSummary reviews={displayReviews} />
        </div>
      </section>

      <section className="pb-[clamp(56px,7vw,96px)]">
        <div className="mx-auto max-w-[calc(1280px_+_clamp(16px,5vw,80px)*2)] px-[clamp(16px,5vw,80px)]">
          <ReviewsGrid reviews={displayReviews} services={services} products={products} />
        </div>
      </section>

      <section id="write" className="bg-surface-2 py-[clamp(56px,7vw,96px)]">
        <div className="mx-auto max-w-[calc(1280px_+_clamp(16px,5vw,80px)*2)] px-[clamp(16px,5vw,80px)]">
          <ReviewForm services={services} products={products} />
        </div>
      </section>

      <section className="bg-noir-900 py-[clamp(64px,8vw,110px)] text-center text-white">
        <div className="mx-auto max-w-[calc(1280px_+_clamp(16px,5vw,80px)*2)] px-[clamp(16px,5vw,80px)]">
          <Reveal as="h2" className="h1 text-white">
            Your next look, <em className="italic text-violet-300">made easier</em>
          </Reveal>
          <Reveal as="p" delay={120} className="mx-auto mt-3.5 max-w-[560px] text-noir-300">
            Book a service in under a minute, or shop extensions delivered to your door.
          </Reveal>

          <Reveal delay={200} className="mt-9 flex flex-wrap items-center justify-center gap-3.5">
            <Link
              href="/services#book"
              className="inline-flex h-14 items-center gap-2.5 rounded-full bg-violet-500 px-7 text-[15px] font-bold text-white transition-colors hover:bg-violet-600"
            >
              Book a service <Icon name="arrow" className="size-4" />
            </Link>
            <Link
              href="/shop?cat=wigs"
              className="inline-flex h-14 items-center rounded-full bg-white px-7 text-[15px] font-bold text-noir-900 transition-colors hover:bg-noir-100"
            >
              Shop extensions
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}
