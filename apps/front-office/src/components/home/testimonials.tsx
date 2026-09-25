"use client";

import { useEffect, useState } from "react";
import { Icon } from "@/components/shared/icon";
import { Reveal } from "@/components/shared/reveal";
import type { Testimonial } from "@/lib/queries";

export function Testimonials({ testimonials }: { testimonials: Testimonial[] }) {
  const [active, setActive] = useState(0);
  const hasPhotos = testimonials.some((t) => t.photo_url);

  useEffect(() => {
    if (testimonials.length < 2) return;
    const t = setInterval(() => setActive((a) => (a + 1) % testimonials.length), 7000);
    return () => clearInterval(t);
  }, [testimonials.length]);

  if (testimonials.length === 0) return null;
  const current = testimonials[active];

  return (
    <>
      <section className="bg-noir-900 pt-[clamp(64px,8vw,110px)] pb-[clamp(48px,5vw,72px)] text-center">
        <Reveal as="h2" className="font-display block text-3xl font-bold sm:text-4xl">What Our Clients Say</Reveal>
        <Reveal
          variant="zoom"
          as="span"
          className="mx-auto mt-[22px] block h-[3px] w-[60px] rounded-[2px] bg-violet-500"
        />
      </section>

      <section
        className="py-[clamp(56px,7vw,96px)] text-[#0e0c12]"
        style={{ background: "#EDE2F1" }}
      >
        <div className="mx-auto grid max-w-[1200px] grid-cols-1 items-center gap-[clamp(40px,7vw,120px)] px-4 sm:px-6 lg:grid-cols-[460px_1fr] lg:px-8">
          {hasPhotos ? (
            <Reveal variant="left" className="tst__photo">
              <div className="tst__photo-stack">
                {testimonials.map(
                  (t, i) =>
                    t.photo_url && (
                      // eslint-disable-next-line @next/next/no-img-element -- Supabase Storage URL, no next/image loader configured
                      <img
                        key={t.id}
                        src={t.photo_url}
                        alt={t.customer_name}
                        className={i === active ? "is-active" : ""}
                      />
                    ),
                )}
              </div>
            </Reveal>
          ) : (
            <Reveal variant="left" className="mx-auto flex size-[280px] items-center justify-center sm:size-[380px]">
              <div className="flex size-[300px] items-center justify-center rounded-3xl bg-white text-6xl font-bold text-violet-400">
                &ldquo;
              </div>
            </Reveal>
          )}

          <Reveal>
            <p className="font-display mb-11 h-[50px] text-[100px] leading-[.6] text-violet-400">&rdquo;</p>
            <div className="mb-[26px] flex gap-1.5 text-violet-800" aria-label="5 out of 5 stars">
              {Array.from({ length: 5 }).map((_, i) => (
                <Icon key={i} name="star" className="size-[26px] fill-current" />
              ))}
            </div>
            <blockquote className="font-display mb-7 text-[clamp(22px,2.2vw,31px)] leading-[1.45]">
              {current.quote}
            </blockquote>
            <div className="flex items-center gap-3 text-[19px] font-bold">
              <span className="size-3 rounded-full bg-violet-400" />
              {current.customer_name}
            </div>
            {current.service_label && (
              <p className="mt-[22px] text-[15px] text-noir-500">Service: {current.service_label}</p>
            )}
            <div className="mt-11 flex items-center gap-[22px]">
              <button
                type="button"
                aria-label="Previous testimonial"
                onClick={() => setActive((a) => (a - 1 + testimonials.length) % testimonials.length)}
                className="grid size-[50px] place-items-center rounded-full bg-noir-900 text-white"
              >
                <Icon name="arrowL" className="size-4" />
              </button>
              <div className="flex items-center gap-1.5">
                {testimonials.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActive(i)}
                    aria-label={`Testimonial ${i + 1}`}
                    className={`h-1 rounded-[2px] transition-all ${i === active ? "w-11 bg-violet-400" : "w-4 bg-noir-600"}`}
                  />
                ))}
              </div>
              <button
                type="button"
                aria-label="Next testimonial"
                onClick={() => setActive((a) => (a + 1) % testimonials.length)}
                className="grid size-[50px] place-items-center rounded-full border-[1.5px] border-violet-400 text-violet-500 hover:bg-violet-500 hover:text-white"
              >
                <Icon name="arrow" className="size-4" />
              </button>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
