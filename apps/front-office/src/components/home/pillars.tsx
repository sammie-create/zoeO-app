"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
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

const pillClass =
  "group/pill inline-flex items-center gap-3.5 rounded-full bg-white py-0 pr-1.5 text-sm font-semibold whitespace-nowrap text-noir-900 shadow-[0_0_0_1.5px_rgba(255,255,255,.2)] transition-shadow duration-300 ease-[var(--ease)] hover:shadow-[0_12px_30px_-12px_rgba(127,35,224,.8),0_0_0_1.5px_rgba(255,255,255,.3)]";

export function Pillars() {
  const [active, setActive] = useState(0);
  const bgRef = useParallax<HTMLImageElement>(16, 1.1);

  useEffect(() => {
    const t = setInterval(() => setActive((a) => (a + 1) % slides.length), 4200);
    return () => clearInterval(t);
  }, []);

  return (
    <section className="pt-0 pb-[clamp(64px,9vw,120px)]">
      <div className="relative mx-auto max-w-[calc(1280px_+_clamp(16px,5vw,80px)*2)] overflow-hidden px-[clamp(16px,5vw,80px)]">
        <div className="relative overflow-hidden">
          <Image
            ref={bgRef}
            src="/img/about-blur.webp"
            alt=""
            fill
            sizes="(min-width: 1280px) 1280px, 100vw"
            className="object-cover"
          />
          <div
            className="pointer-events-none absolute inset-0"
            style={{ backgroundImage: "linear-gradient(90deg, rgba(14,12,18,.35), rgba(14,12,18,.55))" }}
          />
          <div
            className="relative grid grid-cols-1 items-start gap-[clamp(32px,5vw,72px)] py-[clamp(40px,4vw,56px)] px-[clamp(24px,5.5vw,86px)] lg:grid-cols-[440px_1fr]"
          >
            <Reveal
              variant="left"
              className="relative flex h-[450px] lg:h-[540px] flex-col justify-between overflow-hidden rounded-[28px] p-10 shadow-[0_30px_80px_-30px_rgba(127,35,224,.7)]"
              style={{ backgroundImage: "linear-gradient(160deg, #8B2BFF 0%, #7127D9 45%, #4A1392 100%)" }}
            >
              <div className="flex justify-between items-center">
                <span className="font-display text-[60px] md:text-[84px] leading-none font-bold text-white">{slides[active].num}</span>
                <Link href="/shop" className={`${pillClass} h-11 pl-4 text-violet-800`}>
                  See more
                  <span className="grid size-[30px] place-items-center rounded-full bg-violet-800 text-white transition-[transform,background-color] duration-[280ms] ease-[var(--ease)] group-hover/pill:translate-x-[3px] group-hover/pill:bg-violet-500">
                    <Icon name="arrow" className="size-4" />
                  </span>
                </Link>
              </div>
              <div className="relative min-h-[150px]">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={active}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 14 }}
                    transition={{ duration: 0.42, ease: [0.22, 0.7, 0.28, 1] }}
                  >
                    <h3 className="font-display mb-3.5 text-[34px] leading-[1.15] font-bold text-white">{slides[active].title}</h3>
                    <p className="text-[17px] leading-[1.55] text-white/88">{slides[active].text}</p>
                  </motion.div>
                </AnimatePresence>
                <div className="mt-6.5 flex gap-2" role="tablist" aria-label="Categories">
                  {slides.map((_, i) => (
                    <button
                      key={i}
                      role="tab"
                      aria-label={`Slide ${i + 1}`}
                      aria-selected={i === active}
                      onClick={() => setActive(i)}
                      className={`h-2 rounded-full transition-all duration-[280ms] ease-[var(--ease)] ${i === active ? "w-[26px] bg-white" : "w-2 bg-white/40"}`}
                    />
                  ))}
                </div>
              </div>
            </Reveal>

            <div>
              <Reveal
                as="h2"
                className="font-display block text-[clamp(28px,3vw,46px)] leading-[1.24] font-semibold text-white"
              >
                You shouldn&apos;t have to stress about getting your beauty needs met. Everything you need should be
                within reach — <em className="text-violet-300 font-semibold italic">all in one place.</em>
              </Reveal>
              <div className="mt-12 mb-11 grid grid-cols-1 gap-5 sm:grid-cols-3">
                {values.map((v, i) => (
                  <Reveal
                    key={v.title}
                    delay={i * 100}
                    className="rounded-2xl border border-white/16 bg-white/6 p-6 backdrop-blur-[10px] transition-[transform,background-color,border-color] duration-[280ms] ease-[var(--ease)] hover:-translate-y-1 hover:bg-white/10 hover:border-violet-300/50"
                  >
                    <span className="mb-5 grid size-[42px] place-items-center rounded-full border-[1.5px] border-violet-400 text-violet-300">
                      <Icon name={v.icon} className="size-4" />
                    </span>
                    <h4 className="mb-1 font-bold text-white">{v.title}</h4>
                    <p className="text-[14px] text-noir-300">{v.text}</p>
                  </Reveal>
                ))}
              </div>
              <Reveal>
                <Link href="/about" className={`${pillClass} h-[50px] pl-6 text-noir-900`}>
                  Learn more about us
                  <span className="grid size-[34px] place-items-center rounded-full bg-violet-800 text-white transition-[transform,background-color] duration-[280ms] ease-[var(--ease)] group-hover/pill:translate-x-[3px] group-hover/pill:bg-violet-500">
                    <Icon name="arrow" className="size-4" />
                  </span>
                </Link>
              </Reveal>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
