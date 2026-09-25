"use client";

import { useState } from "react";
import { Icon } from "@/components/shared/icon";

export function FaqAccordion({ items }: { items: { question: string; answer: string }[] }) {
  const [open, setOpen] = useState(0);

  return (
    <div className="faq">
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <div key={item.question} className={`faq__item ${isOpen ? "is-open" : ""}`}>
            <button
              type="button"
              className="faq__q"
              onClick={() => setOpen(isOpen ? -1 : i)}
              aria-expanded={isOpen}
            >
              {item.question}
              <span className="pm">
                <Icon name="plus" className="size-4" />
              </span>
            </button>
            <div className="faq__a">
              <div>
                <p>{item.answer}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
