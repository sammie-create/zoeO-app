"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Icon } from "@/components/shared/icon";
import type { Testimonial } from "@/lib/queries";

export function ServicesTestimonials({ testimonials }: { testimonials: Testimonial[] }) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (testimonials.length < 2) return;
    const t = setInterval(() => setActive((a) => (a + 1) % testimonials.length), 7000);
    return () => clearInterval(t);
  }, [testimonials.length]);

  if (testimonials.length === 0) return null;

  return (
    <section className="ed-tst">
      <div className="ed-tst__panel">
        <div className="stars" aria-label="5 out of 5 stars">
          {Array.from({ length: 5 }).map((_, i) => (
            <Icon key={i} name="star" className="fill-current" />
          ))}
        </div>
        <div className="ed-tst__slides" aria-live="polite">
          {testimonials.map((t, i) => (
            <div key={t.id} className={`ed-tst__slide ${i === active ? "is-active" : ""}`}>
              <blockquote>&ldquo;{t.quote}&rdquo;</blockquote>
              <cite>
                — {t.customer_name}
                {t.service_label && (
                  <>
                    {" "}
                    · <Link href="/services#book">{t.service_label}</Link>
                  </>
                )}
              </cite>
            </div>
          ))}
        </div>
        <div className="ed-tst__nav">
          <button
            type="button"
            onClick={() => setActive((a) => (a - 1 + testimonials.length) % testimonials.length)}
          >
            Prev
          </button>
          <button type="button" onClick={() => setActive((a) => (a + 1) % testimonials.length)}>
            Next
          </button>
        </div>
      </div>
      <div className="ed-tst__img">
        {testimonials.map(
          (t, i) =>
            t.photo_url && (
              // eslint-disable-next-line @next/next/no-img-element -- Supabase Storage URL, no next/image loader configured
              <img
                key={t.id}
                src={t.photo_url}
                alt={t.customer_name}
                className={i === active ? "is-active" : ""}
                style={{ objectPosition: "50% 25%" }}
              />
            ),
        )}
      </div>
    </section>
  );
}
