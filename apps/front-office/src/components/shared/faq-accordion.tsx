"use client";

import { useState } from "react";
import { Icon } from "@/components/shared/icon";

export function FaqAccordion({ items }: { items: { question: string; answer: string }[] }) {
  const [open, setOpen] = useState(0);

  return (
    <div className="flex flex-col divide-y divide-white/8 rounded-2xl border border-white/10">
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <div key={item.question}>
            <button
              type="button"
              onClick={() => setOpen(isOpen ? -1 : i)}
              aria-expanded={isOpen}
              className="flex w-full items-center justify-between gap-4 p-5 text-left font-medium"
            >
              {item.question}
              <Icon name={isOpen ? "minus" : "plus"} className="size-4 shrink-0 text-violet-300" />
            </button>
            {isOpen && <div className="px-5 pb-5 text-[14px] text-noir-300">{item.answer}</div>}
          </div>
        );
      })}
    </div>
  );
}
