"use client";

import { useEffect, useState } from "react";
import { Icon } from "@/components/shared/icon";
import { Reveal } from "@/components/shared/reveal";
import type { Testimonial } from "@/lib/queries";

export function Testimonials({ testimonials }: { testimonials: Testimonial[] }) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (testimonials.length < 2) return;
    const t = setInterval(() => setActive((a) => (a + 1) % testimonials.length), 7000);
    return () => clearInterval(t);
  }, [testimonials.length]);

  if (testimonials.length === 0) return null;
  const current = testimonials[active];

  return (
    <>
      <section className="bg-noir-900 px-4 py-14 text-center sm:px-6 lg:px-8">
        <Reveal as="h2" className="font-display block text-3xl font-bold sm:text-4xl">What Our Clients Say</Reveal>
        <div className="mx-auto mt-4 h-[3px] w-20 bg-violet-500" />
      </section>

      <section className="bg-[#ece1ef] px-4 py-16 text-[#0e0c12] sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <div className="mx-auto grid max-w-[1200px] grid-cols-1 items-center gap-12 lg:grid-cols-[460px_1fr]">
          <Reveal variant="left" className="mx-auto flex size-[280px] items-center justify-center sm:size-[380px]">
            <div className="flex size-[300px] items-center justify-center rounded-3xl bg-white text-6xl font-bold text-violet-400">
              &ldquo;
            </div>
          </Reveal>

          <Reveal>
            <p className="font-display mb-6 text-[100px] leading-[.6] text-violet-400 opacity-70">&rdquo;</p>
            <div className="mb-6 flex gap-1.5 text-violet-800" aria-label="5 out of 5 stars">
              {Array.from({ length: 5 }).map((_, i) => (
                <Icon key={i} name="star" className="size-6 fill-current" />
              ))}
            </div>
            <blockquote className="font-display text-2xl leading-[1.45] sm:text-[31px]">{current.quote}</blockquote>
            <div className="mt-7 flex items-center gap-3 text-lg font-bold">
              <span className="size-3 rounded-full bg-violet-400" />
              {current.customer_name}
            </div>
            {current.service_label && (
              <p className="mt-5 text-[15px] text-[#5b5568]">Service: {current.service_label}</p>
            )}
            <div className="mt-11 flex items-center gap-5">
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
                    className={`h-1 rounded-full transition-all ${i === active ? "w-11 bg-violet-400" : "w-4 bg-[#403b4c]/30"}`}
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
