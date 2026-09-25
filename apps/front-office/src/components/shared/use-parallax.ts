"use client";

import { useEffect, useRef } from "react";

/** Ports the reference site's `data-parallax` scroll-driven translate. `strength` is in px. */
export function useParallax<T extends HTMLElement>(strength = 16, baseScale = 1.06) {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const parent = el.parentElement;
    if (!parent) return;

    let ticking = false;
    function update() {
      ticking = false;
      if (!el || !parent) return;
      const rect = parent.getBoundingClientRect();
      const center = rect.top + rect.height / 2;
      const viewportCenter = window.innerHeight / 2;
      const progress = (center - viewportCenter) / window.innerHeight;
      el.style.transform = `translateY(${progress * -strength}px) scale(${baseScale})`;
    }

    function onScroll() {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    }

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [strength, baseScale]);

  return ref;
}
