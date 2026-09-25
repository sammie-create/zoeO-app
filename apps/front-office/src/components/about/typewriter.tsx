"use client";

import { useEffect, useRef, useState } from "react";

export function Typewriter({ text }: { text: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const [display, setDisplay] = useState("");

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      queueMicrotask(() => setDisplay(text));
      return;
    }
    let started = false;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting || started) return;
      started = true;
      observer.disconnect();
      let i = 0;
      const t = setInterval(() => {
        i++;
        setDisplay(text.slice(0, i));
        if (i >= text.length) clearInterval(t);
      }, 45);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [text]);

  return (
    <p ref={ref} className="typer" aria-label={text}>
      {display}
    </p>
  );
}
