"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { Icon } from "@/components/shared/icon";
import { useChromeUi } from "@/lib/store/chrome-ui";
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
        className={`absolute inset-0 bg-black/60 transition-opacity duration-[420ms] ${menuOpen ? "opacity-100" : "opacity-0"}`}
      />
      <div
        role="dialog"
        aria-label="Menu"
        className={`absolute top-0 right-0 bottom-0 flex w-[min(380px,88vw)] flex-col gap-2 border-l border-white/14 bg-[linear-gradient(180deg,rgba(255,255,255,.08),rgba(255,255,255,.02)),rgba(20,16,30,.6)] p-6 backdrop-blur-[24px] transition-transform duration-[420ms] ease-[var(--ease)] ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="mb-6 flex items-center justify-between">
          <Brand small />
          <button
            type="button"
            onClick={() => setMenuOpen(false)}
            aria-label="Close menu"
            className="grid size-9 place-items-center rounded-full text-white hover:bg-white/8"
          >
            <Icon name="close" className="size-5" />
          </button>
        </div>

        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center justify-between border-b border-white/8 py-2 font-display text-[28px] ${
              item.match.some((m) => (m === "/" ? pathname === "/" : pathname.startsWith(m)))
                ? "text-violet-300"
                : "text-white"
            }`}
          >
            {item.label}
            <Icon name="arrow" className="size-5" />
          </Link>
        ))}

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
