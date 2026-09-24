"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Icon } from "@/components/shared/icon";
import { Reveal } from "@/components/shared/reveal";
import { useParallax } from "@/components/shared/use-parallax";

const slides = [
  { num: "04", title: "Four core categories", text: "From hair care and personal care to nails, lashes and hair extensions." },
  { num: "01", title: "Hair Care", text: "HELicia botanicals for depth, shine and healthy volume — made for textured hair." },
  { num: "02", title: "Nail Care", text: "FELenee press-ons and care kits: salon-grade artistry you can wear at home." },
  { num: "03", title: "Extensions", text: "Zoe Onirun units and revamps — good hair days, custom-built to last." },
];

const values = [
  { icon: "sparkles" as const, title: "Excellence", text: "We strive to deliver work we can be proud of — every wig, every set, every service." },
  { icon: "users" as const, title: "Community", text: "Beauty is about connection, collaboration and creating spaces where people belong." },
  { icon: "sparkle" as const, title: "Convenience", text: "Everything within reach — shop, book and collect without the running around." },
];

export function Pillars() {
  const [active, setActive] = useState(0);
  const bgRef = useParallax<HTMLImageElement>(16);

  useEffect(() => {
    const t = setInterval(() => setActive((a) => (a + 1) % slides.length), 4200);
    return () => clearInterval(t);
  }, []);

  return (
    <section className="px-4 sm:px-6 lg:px-8">
      <div className="relative mx-auto max-w-[1280px] overflow-hidden rounded-[28px] bg-noir-800">
        <Image
          ref={bgRef}
          src="/img/about-blur.webp"
          alt=""
          fill
          sizes="(min-width: 1280px) 1280px, 100vw"
          className="object-cover opacity-40"
        />
        <div className="relative grid grid-cols-1 gap-9 p-6 sm:p-10 lg:grid-cols-[440px_1fr] lg:gap-16 lg:p-16">
          <Reveal variant="left" className="flex min-h-[480px] flex-col justify-between rounded-3xl bg-gradient-to-br from-violet-500 to-violet-900 p-8">
            <div className="flex items-start justify-between">
              <span className="font-display text-6xl font-bold">{slides[active].num}</span>
              <Link href="/shop" className="inline-flex h-11 items-center gap-2 rounded-full bg-white pr-1.5 pl-4 text-sm font-bold text-violet-800">
                See more
                <span className="grid size-8 place-items-center rounded-full bg-violet-800 text-white">
                  <Icon name="arrow" className="size-4" />
                </span>
              </Link>
            </div>
            <div>
              <h3 className="font-display mb-2 text-3xl font-bold">{slides[active].title}</h3>
              <p className="text-white/85">{slides[active].text}</p>
              <div className="mt-6 flex gap-2" role="tablist" aria-label="Categories">
                {slides.map((_, i) => (
                  <button
                    key={i}
                    role="tab"
                    aria-label={`Slide ${i + 1}`}
                    aria-selected={i === active}
                    onClick={() => setActive(i)}
                    className={`h-1.5 rounded-full transition-all ${i === active ? "w-7 bg-white" : "w-2.5 bg-white/40"}`}
                  />
                ))}
              </div>
            </div>
          </Reveal>

          <div>
            <Reveal as="h2" className="font-display block text-2xl leading-[1.3] font-semibold sm:text-3xl lg:text-[42px]">You shouldn&apos;t have to stress about getting your beauty needs met. Everything you need should be within reach — all in one place.</Reveal>
            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
              {values.map((v, i) => (
                <Reveal key={v.title} delay={i * 100} className="rounded-2xl border border-white/16 bg-white/6 p-6 backdrop-blur-[10px]">
                  <span className="mb-4 grid size-9 place-items-center rounded-full border-[1.5px] border-violet-400 text-violet-300">
                    <Icon name={v.icon} className="size-4" />
                  </span>
                  <h4 className="mb-1 font-bold">{v.title}</h4>
                  <p className="text-[14px] text-noir-300">{v.text}</p>
                </Reveal>
              ))}
            </div>
            <Reveal className="mt-8">
              <Link href="/about" className="inline-flex h-12 items-center gap-2 rounded-full bg-white pr-1.5 pl-6 text-sm font-bold text-violet-800">
                Learn more about us
                <span className="grid size-9 place-items-center rounded-full bg-violet-800 text-white">
                  <Icon name="arrow" className="size-4" />
                </span>
              </Link>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
