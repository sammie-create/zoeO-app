"use client";

import { useState } from "react";
import { Reveal } from "@/components/shared/reveal";
import { Typewriter } from "./typewriter";

type Value = { title: string; text: string; img: string; imgPosition?: string };

const tabs = ["Core value", "Pillar", "Foundation"];

export function ValuesFocus({ values }: { values: Value[] }) {
  const [focus, setFocus] = useState(1);
  const [hasFocus, setHasFocus] = useState(false);

  function activate(i: number) {
    setFocus(i);
    setHasFocus(true);
  }

  return (
    <>
      <div className="values-head">
        <Reveal as="h2" className="font-display block text-[clamp(42px,5vw,76px)] font-bold">
          What We Value
        </Reveal>
        <span className="vr" />
        <Reveal>
          <Typewriter text="Three principles. One standard of excellence" />
          <div className="vtabs" role="tablist">
            {tabs.map((t, i) => (
              <button
                key={t}
                type="button"
                role="tab"
                aria-selected={focus === i}
                className={focus === i ? "is-active" : ""}
                onClick={() => activate(i)}
              >
                {t}
              </button>
            ))}
          </div>
        </Reveal>
      </div>
      <div className={`values ${hasFocus ? "has-focus" : ""}`} onMouseLeave={() => setHasFocus(false)}>
        {values.map((v, i) => (
          <article
            key={v.title}
            className={`value ${hasFocus && focus === i ? "is-focus" : ""}`}
            onMouseEnter={() => activate(i)}
          >
            <figure>
              {/* eslint-disable-next-line @next/next/no-img-element -- static marketing asset */}
              <img
                src={`/img/${v.img}.webp`}
                alt=""
                style={v.imgPosition ? { objectPosition: v.imgPosition } : undefined}
              />
            </figure>
            <h4>{v.title}</h4>
            <p>{v.text}</p>
          </article>
        ))}
      </div>
    </>
  );
}
