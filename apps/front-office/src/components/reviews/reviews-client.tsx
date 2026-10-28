"use client";

import { useState } from "react";
import Link from "next/link";
import { XIcon } from "lucide-react";
import { Dialog, DialogClose, DialogContent } from "@/components/ui/dialog";
import { Icon } from "@/components/shared/icon";
import { Reveal } from "@/components/shared/reveal";
import type { Product, Service } from "@/lib/queries";
import { reviewAverage, reviewSubjectLabel, type DisplayReview } from "@/lib/review-utils";
import { ReviewAvatar } from "./review-avatar";
import { ReviewStars } from "./review-stars";

const PAGE = 9;

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

export function ReviewsSummary({ reviews }: { reviews: DisplayReview[] }) {
  const avg = reviewAverage(reviews);
  const faces = [...reviews.filter((r) => r.photo_url), ...reviews.filter((r) => !r.photo_url)].slice(0, 5);

  return (
    <Reveal
      delay={120}
      className="mx-auto mt-8 inline-flex flex-wrap items-center justify-center gap-3.5 rounded-full border border-[var(--line)] bg-surface py-2.5 pr-2.5 pl-4"
    >
      <div className="flex">
        {faces.map((r, i) => (
          <ReviewAvatar
            key={r.id}
            name={r.customer_name}
            photoUrl={r.photo_url}
            size="sm"
            className={`border-2 border-surface ${i > 0 ? "-ml-2.5" : ""}`}
          />
        ))}
      </div>
      {reviews.length > 0 ? (
        <div className="flex items-center gap-2.5 text-left">
          <strong className="font-display text-[28px] leading-none font-normal text-foreground">
            {avg.toFixed(1)}
          </strong>
          <div>
            <ReviewStars rating={Math.round(avg)} size="sm" />
            <small className="mt-0.5 block text-[12px] text-muted-foreground">from {reviews.length} reviews</small>
          </div>
        </div>
      ) : (
        <span className="text-[13px] text-muted-foreground">Be the first to leave one</span>
      )}
      <a
        href="#write"
        className="inline-flex h-9 items-center rounded-full bg-violet-500 px-4 text-[13px] font-bold text-white transition-colors hover:bg-violet-600"
      >
        Write a review
      </a>
    </Reveal>
  );
}

export function ReviewsGrid({
  reviews,
  services,
  products,
}: {
  reviews: DisplayReview[];
  services: Service[];
  products: Product[];
}) {
  const [shown, setShown] = useState(PAGE);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const visible = reviews.slice(0, shown);

  const step = (d: 1 | -1) => {
    setOpenIndex((cur) => {
      if (cur === null) return cur;
      return (cur + d + reviews.length) % reviews.length;
    });
  };

  const active = openIndex !== null ? reviews[openIndex] : null;

  if (reviews.length === 0) {
    return <p className="py-10 text-center text-muted-foreground">No reviews yet. Be the first.</p>;
  }

  return (
    <>
      <div className="columns-1 gap-4 sm:columns-2 lg:columns-3" aria-label="Client reviews">
        {visible.map((r, i) => (
          <button
            key={r.id}
            type="button"
            onClick={() => setOpenIndex(i)}
            className="mb-4 block w-full rounded-card border border-[var(--line)] bg-surface p-6 text-left break-inside-avoid transition-[border-color,background-color,translate] duration-300 ease-out hover:-translate-y-[3px] hover:border-violet-300/45 hover:bg-surface-2 light:hover:border-violet-400/40"
          >
            <div className="flex flex-col gap-4.5">
              <ReviewStars rating={r.rating} />
              <p className="line-clamp-6 text-[15px] leading-[1.65] text-noir-200 light:text-noir-600">{r.body}</p>
              <span className="-mt-2 inline-flex items-center gap-1.5 text-[13px] font-bold text-violet-300 light:text-violet-600">
                Read full review <Icon name="arrow" className="size-3.5" />
              </span>
              <span className="flex min-w-0 items-center gap-3">
                <ReviewAvatar name={r.customer_name} photoUrl={r.photo_url} />
                <span className="min-w-0">
                  <strong className="block truncate text-[15px] text-foreground">{r.customer_name}</strong>
                  <span className="block truncate text-[13px] text-muted-foreground">
                    {reviewSubjectLabel(r, services, products)}
                  </span>
                </span>
              </span>
            </div>
          </button>
        ))}
      </div>

      {shown < reviews.length && (
        <div className="mt-10 text-center">
          <button
            type="button"
            onClick={() => setShown((s) => s + PAGE)}
            className="inline-flex h-12 items-center rounded-full border border-[var(--line-strong)] px-6 text-[14px] font-bold text-foreground transition-colors hover:border-violet-400 hover:text-violet-400"
          >
            Show more reviews
          </button>
        </div>
      )}

      <Dialog open={openIndex !== null} onOpenChange={(open) => !open && setOpenIndex(null)}>
        <DialogContent
          className="modal__box max-w-[min(640px,calc(100%-2rem))] p-[clamp(24px,3vw,44px)] sm:max-w-[min(640px,calc(100%-2rem))]"
          overlayClassName="modal__scrim"
          showCloseButton={false}
        >
          <DialogClose asChild>
            <button type="button" className="modal__close" aria-label="Close">
              <XIcon className="size-5" />
            </button>
          </DialogClose>
          {active && (
            <div className="pt-1.5">
              <ReviewStars rating={active.rating} size="lg" />
              <blockquote className="font-display my-5.5 text-[clamp(20px,2.2vw,26px)] leading-[1.5] text-foreground">
                &ldquo;{active.body}&rdquo;
              </blockquote>
              <div className="flex items-center gap-3">
                <ReviewAvatar name={active.customer_name} photoUrl={active.photo_url} size="lg" />
                <span>
                  <strong className="block text-[17px] text-foreground">{active.customer_name}</strong>
                  <span className="block text-[13px] text-muted-foreground">
                    {reviewSubjectLabel(active, services, products)} · {formatDate(active.created_at)}
                  </span>
                </span>
              </div>
              <div className="mt-7.5 flex flex-wrap items-center justify-between gap-4 border-t border-[var(--line)] pt-5.5">
                <div className="flex items-center gap-3.5">
                  <button
                    type="button"
                    aria-label="Previous review"
                    onClick={() => step(-1)}
                    className="grid size-11 place-items-center rounded-full border border-[var(--line-strong)] text-foreground transition-colors hover:border-violet-400 hover:text-violet-400"
                  >
                    <Icon name="arrowL" className="size-4" />
                  </button>
                  <small className="min-w-[52px] text-center text-[12px] text-muted-foreground">
                    {(openIndex ?? 0) + 1} / {reviews.length}
                  </small>
                  <button
                    type="button"
                    aria-label="Next review"
                    onClick={() => step(1)}
                    className="grid size-11 place-items-center rounded-full border border-[var(--line-strong)] text-foreground transition-colors hover:border-violet-400 hover:text-violet-400"
                  >
                    <Icon name="arrow" className="size-4" />
                  </button>
                </div>
                {active.service_id && (
                  <Link href={`/services?service=${active.service_id}#book`} className="text-[14px] font-bold text-violet-300 underline-offset-2 hover:underline light:text-violet-600">
                    Book this service
                  </Link>
                )}
                {active.product_id && (
                  <Link href={`/product/${active.product_id}`} className="text-[14px] font-bold text-violet-300 underline-offset-2 hover:underline light:text-violet-600">
                    View product
                  </Link>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
