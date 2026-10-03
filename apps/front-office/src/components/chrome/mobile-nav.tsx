"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { Icon } from "@/components/shared/icon";
import { useChromeUi } from "@/lib/store/chrome-ui";
import { toggleTheme, useTheme } from "@/lib/theme";
import { Brand } from "./brand";

const navItems = [
  { label: "Home", href: "/", match: ["/"] },
  { label: "Shop", href: "/shop", match: ["/shop", "/product"] },
  { label: "Services", href: "/services", match: ["/services"] },
  { label: "About", href: "/about", match: ["/about"] },
  { label: "Blog", href: "/blog", match: ["/blog"] },
  { label: "Cart", href: "/cart", match: ["/cart", "/checkout"] },
];

export function MobileNav() {
  const { menuOpen, setMenuOpen } = useChromeUi();
  const pathname = usePathname();
  // Only used for the visible "Light theme"/"Dark theme" label text and the
  // aria-pressed attribute — real content/accessibility state that has to
  // come from JS. Every visual style below is driven by the `light:` CSS
  // variant instead, keyed off [data-theme="light"].
  const theme = useTheme();
  const isLight = theme === "light";

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname, setMenuOpen]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <div
      className={`fixed inset-0 z-[90] ${menuOpen ? "pointer-events-auto" : "pointer-events-none"}`}
      aria-hidden={!menuOpen}
    >
      <div
        onClick={() => setMenuOpen(false)}
        className={`absolute inset-0 bg-black/60 transition-opacity duration-[420ms] light:bg-noir-900/35 ${menuOpen ? "opacity-100" : "opacity-0"}`}
      />
      <div
        role="dialog"
        aria-label="Menu"
        className={`absolute top-0 right-0 bottom-0 flex w-[min(380px,88vw)] flex-col gap-2 border-l border-white/14 bg-[linear-gradient(180deg,rgba(255,255,255,.08),rgba(255,255,255,.02)),rgba(20,16,30,.6)] p-6 backdrop-blur-[24px] transition-transform duration-[420ms] ease-[var(--ease)] light:border-noir-900/8 light:bg-[linear-gradient(180deg,rgba(255,255,255,.9),rgba(255,255,255,.75))] ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="mb-6 flex items-center justify-between">
          <Brand small />
          <button
            type="button"
            onClick={() => setMenuOpen(false)}
            aria-label="Close menu"
            className="grid size-9 place-items-center rounded-full text-white hover:bg-white/8 light:text-noir-900 light:hover:bg-noir-900/6"
          >
            <Icon name="close" className="size-5" />
          </button>
        </div>

        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center justify-between border-b border-white/8 py-2 font-display text-[28px] light:border-noir-900/8 ${
              item.match.some((m) => (m === "/" ? pathname === "/" : pathname.startsWith(m)))
                ? "text-violet-300"
                : "text-white light:text-noir-900"
            }`}
          >
            {item.label}
            <Icon name="arrow" className="size-5" />
          </Link>
        ))}

        <button
          type="button"
          onClick={(e) => toggleTheme({ clientX: e.clientX, clientY: e.clientY })}
          aria-pressed={isLight}
          aria-label={isLight ? "Switch to dark theme" : "Switch to light theme"}
          className="flex items-center justify-between border-b border-white/8 py-3.5 font-semibold text-white light:border-noir-900/8 light:text-noir-900"
        >
          <span>Light theme</span>
          <span
            aria-hidden
            className="relative h-[26px] w-[48px] flex-none rounded-full bg-noir-600 transition-colors duration-[280ms] light:bg-violet-500"
          >
            <span className="absolute top-[3px] left-[3px] size-5 translate-x-0 rounded-full bg-white transition-transform duration-[280ms] light:translate-x-[22px]" />
          </span>
        </button>

        <div className="mt-auto">
          <Link
            href="/contact"
            className="flex h-12 items-center justify-center rounded-full bg-violet-500 text-sm font-bold text-white uppercase"
          >
            Contact us
          </Link>
        </div>
      </div>
    </div>
  );
}
