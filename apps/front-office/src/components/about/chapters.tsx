"use client";

import { useEffect, useRef, useState } from "react";

type Chapter = { yr: string; title: string; text: string; img: string; imgPosition?: string; now?: boolean };

export function Chapters({ chapters }: { chapters: Chapter[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const firstDotRef = useRef<HTMLSpanElement>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [lineTop, setLineTop] = useState(0);
  const [lineWidth, setLineWidth] = useState<string | undefined>(undefined);
  const [current, setCurrent] = useState(chapters.length - 1);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    function place() {
      const dot = firstDotRef.current;
      const container = containerRef.current;
      if (!dot || !container) return;
      setLineTop(dot.offsetTop + dot.offsetHeight / 2);
      setLineWidth(window.innerWidth <= 1080 ? `${container.scrollWidth}px` : undefined);
    }
    place();
    window.addEventListener("resize", place);
    return () => window.removeEventListener("resize", place);
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();
      setInView(true);
      setCurrent(0);
      let i = 0;
      timerRef.current = setInterval(() => {
        i++;
        if (i >= chapters.length) {
          if (timerRef.current) clearInterval(timerRef.current);
          return;
        }
        setCurrent(i);
      }, 900);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [chapters.length]);

  function handleHover(i: number) {
    if (timerRef.current) clearInterval(timerRef.current);
    setCurrent(i);
  }

  return (
    <div ref={containerRef} className={`story2__chapters ${inView ? "is-in" : ""}`}>
      <span className="story2__line" style={{ top: lineTop, width: lineWidth }} />
      {chapters.map((c, i) => (
        <article
          key={c.yr}
          className={`chapter ${current === i ? "is-current" : ""}`}
          onMouseEnter={() => handleHover(i)}
        >
          <figure>
            {/* eslint-disable-next-line @next/next/no-img-element -- static marketing asset */}
            <img src={`/img/${c.img}.webp`} alt="" style={c.imgPosition ? { objectPosition: c.imgPosition } : undefined} />
          </figure>
          <span className="chapter__dot" ref={i === 0 ? firstDotRef : undefined} />
          <div className="chapter__yr">{c.yr}</div>
          <h3>{c.title}</h3>
          <p>{c.text}</p>
          {c.now && <span className="chip">Now</span>}
        </article>
      ))}
    </div>
  );
}
