"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { Icon } from "@/components/shared/icon";
import { Reveal } from "@/components/shared/reveal";

export function Transformation() {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState(50);
  const dragging = useRef(false);

  function setFromEvent(e: { clientX: number; clientY: number }) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const isStacked = window.matchMedia("(max-width: 760px)").matches;
    const next = isStacked
      ? ((e.clientY - rect.top) / rect.height) * 100
      : ((e.clientX - rect.left) / rect.width) * 100;
    setPos(Math.max(4, Math.min(96, next)));
  }

  return (
    <section className="py-[clamp(64px,9vw,120px)]">
      <div className="mx-auto max-w-[calc(1280px_+_clamp(16px,5vw,80px)*2)] px-[clamp(16px,5vw,80px)]">
        <div className="mb-14 text-center">
          <Reveal
            variant="fade"
            className="inline-flex items-center gap-2 text-[13px] font-semibold tracking-[.18em] text-violet-400 uppercase"
          >
            <span className="size-1.5 rounded-full bg-current" />
            The Allure Effect
          </Reveal>
          <Reveal as="h2" className="font-display mt-5 mb-4 block text-[clamp(34px,4.6vw,60px)] leading-[1.08] font-normal">
            A Stunning <em className="font-semibold italic">Transformation</em>
          </Reveal>
          <Reveal as="p" className="mx-auto max-w-[900px] text-[clamp(16px,1.3vw,18px)] leading-[1.7] text-noir-200">
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
            if (e.key === "ArrowLeft" || e.key === "ArrowUp") setPos((p) => Math.max(4, p - 5));
            if (e.key === "ArrowRight" || e.key === "ArrowDown") setPos((p) => Math.min(96, p + 5));
          }}
          className="ba touch-none"
          style={{ "--pos": `${pos}%` } as React.CSSProperties}
        >
          <div className="ba__before">
            <Image
              src="/img/before.webp"
              alt="Before: natural hair, no makeup"
              fill
              sizes="(min-width: 1280px) 1280px, 100vw"
              draggable={false}
            />
          </div>
          <div className="ba__after">
            <Image
              src="/img/after.webp"
              alt="After: glam makeup and styled wig"
              fill
              sizes="(min-width: 1280px) 1280px, 100vw"
              draggable={false}
            />
          </div>
          <div className="ba__line" />
          <div className="ba__handle">
            <Icon name="swap" className="size-5" />
          </div>
        </div>
      </div>
    </section>
  );
}
