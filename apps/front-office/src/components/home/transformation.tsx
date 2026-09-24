"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { Icon } from "@/components/shared/icon";
import { Reveal } from "@/components/shared/reveal";

export function Transformation() {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState(50);
  const dragging = useRef(false);

  function setFromEvent(e: { clientX: number }) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const next = ((e.clientX - rect.left) / rect.width) * 100;
    setPos(Math.max(4, Math.min(96, next)));
  }

  return (
    <section className="px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
      <div className="mx-auto max-w-[800px] text-center">
        <Reveal variant="fade" className="inline-flex items-center gap-2 text-[13px] font-semibold tracking-[.18em] text-violet-400 uppercase">
          <span className="size-1.5 rounded-full bg-current" />
          The Allure Effect
        </Reveal>
        <Reveal as="h2" className="font-display mt-3 block text-3xl font-bold sm:text-4xl lg:text-[44px]">A Stunning Transformation</Reveal>
        <Reveal as="p" className="mx-auto mt-4 max-w-[600px] text-[17px] text-noir-200">
          Rough hair, no makeup? We&apos;ve got you. From wig revamp to full glam — see the difference ZoeO Allure
          makes.
        </Reveal>
      </div>

      <div
        ref={ref}
        role="slider"
        aria-label="Before and after comparison"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(pos)}
        tabIndex={0}
        onPointerDown={(e) => {
          dragging.current = true;
          (e.target as HTMLElement).setPointerCapture(e.pointerId);
          setFromEvent(e);
        }}
        onPointerMove={(e) => dragging.current && setFromEvent(e)}
        onPointerUp={() => (dragging.current = false)}
        onKeyDown={(e) => {
          if (e.key === "ArrowLeft") setPos((p) => Math.max(4, p - 5));
          if (e.key === "ArrowRight") setPos((p) => Math.min(96, p + 5));
        }}
        className="relative mx-auto mt-10 aspect-[16/9] max-w-[1280px] cursor-ew-resize touch-none overflow-hidden rounded-2xl select-none"
      >
        <div className="absolute inset-0">
          <Image
            src="/img/after.webp"
            alt="After: glam makeup and styled wig"
            fill
            sizes="(min-width: 1280px) 1280px, 100vw"
            className="object-cover"
            draggable={false}
          />
        </div>
        <div className="absolute inset-0 overflow-hidden" style={{ width: `${pos}%` }}>
          <Image
            src="/img/before.webp"
            alt="Before: natural hair, no makeup"
            fill
            sizes="(min-width: 1280px) 1280px, 100vw"
            className="object-cover"
            draggable={false}
          />
        </div>
        <div className="absolute inset-y-0 w-0.5 bg-white" style={{ left: `${pos}%` }} />
        <div
          className="absolute top-1/2 flex size-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white text-noir-900 shadow-lg"
          style={{ left: `${pos}%` }}
        >
          <Icon name="swap" className="size-5" />
        </div>
      </div>
    </section>
  );
}
