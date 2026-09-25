"use client";

import { useEffect, useRef, useState } from "react";

export function CountUp({ value, from = 0 }: { value: string; from?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const numeric = parseInt(value.replace(/\D/g, ""), 10);
  const pad = value.replace(/\D/g, "").length;
  const [display, setDisplay] = useState(Number.isNaN(numeric) ? value : String(from).padStart(pad, "0"));

  useEffect(() => {
    const el = ref.current;
    if (!el || Number.isNaN(numeric)) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      queueMicrotask(() => setDisplay(value));
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        const start = performance.now();
        const duration = 1200;
        function step(t: number) {
          const k = Math.min(1, (t - start) / duration);
          const eased = 1 - Math.pow(1 - k, 3);
          setDisplay(String(Math.round(from + (numeric - from) * eased)).padStart(pad, "0"));
          if (k < 1) requestAnimationFrame(step);
          else setDisplay(value);
        }
        requestAnimationFrame(step);
      },
      { threshold: 0.4 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [numeric, value, from, pad]);

  return <span ref={ref}>{display}</span>;
}
