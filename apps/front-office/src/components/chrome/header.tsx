"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Icon } from "@/components/shared/icon";
import { useCart } from "@/lib/store/cart";
import { useChromeUi } from "@/lib/store/chrome-ui";
import { Brand } from "./brand";

const navItems = [
  { label: "Shop", href: "/shop", match: ["/shop", "/product", "/cart", "/checkout"] },
  { label: "Services", href: "/services", match: ["/services"] },
  { label: "About", href: "/about", match: ["/about"] },
  { label: "Blog", href: "/blog", match: ["/blog"] },
];

export function Header() {
  const pathname = usePathname();
  const { count } = useCart();
  const { setSearchOpen, setMenuOpen } = useChromeUi();
  const isOverlay = pathname === "/";
  const [isStuck, setIsStuck] = useState(false);

  useEffect(() => {
    if (!isOverlay) return;
    function onScroll() {
      const heroHeight = document.querySelector<HTMLElement>("[data-hero]")?.offsetHeight ?? window.innerHeight;
      setIsStuck(window.scrollY > heroHeight * 0.6);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isOverlay]);

  return (
    <header
      style={{
        background: "linear-gradient(180deg, rgba(255,255,255,.09), rgba(255,255,255,.03)), rgba(20,16,30,.56)",
        boxShadow: "inset 0 1px 0 rgba(255,255,255,.08), 0 10px 40px -20px rgba(0,0,0,.6)",
      }}
      className={`z-50 overflow-hidden border-b backdrop-blur-[22px] transition-[border-radius] duration-[280ms] ${
        isOverlay
          ? isStuck
            ? "fixed top-0 right-0 left-0 animate-[slide-down_420ms_var(--ease)] rounded-none border-white/12"
            : "absolute top-4 right-4 left-4 rounded-[20px] border-white/18 sm:top-8 sm:right-8 sm:left-8"
          : "sticky top-0 border-white/12"
      }`}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(60% 140% at 12% 0%, rgba(127,35,224,.18), transparent 60%), radial-gradient(40% 120% at 90% 100%, rgba(182,137,246,.10), transparent 60%)",
        }}
      />
      <div
        className={`relative mx-auto grid max-w-[1280px] grid-cols-2 items-center gap-6 px-4 sm:px-6 lg:grid-cols-[1fr_auto_1fr] lg:px-0 ${
          isOverlay && !isStuck ? "h-[76px]" : "h-[72px] sm:h-[88px]"
        }`}
      >
        <Brand small />

        <nav aria-label="Primary" className="hidden items-center gap-[clamp(20px,3vw,44px)] lg:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`relative py-1.5 text-[15px] font-medium transition-colors ${
                item.match.some((m) => pathname.startsWith(m)) ? "text-violet-400" : "text-white hover:text-violet-200"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center justify-end gap-1.5 sm:gap-3">
          <Link
            href="/contact"
            className="hidden h-10 items-center rounded-full bg-violet-500 px-4.5 text-[13px] font-bold text-white uppercase transition-colors hover:bg-violet-600 lg:inline-flex"
          >
            Contact us
          </Link>
          <button
            type="button"
            onClick={() => setSearchOpen(true)}
            aria-label="Search"
            className="grid size-9 place-items-center rounded-full text-white transition-colors hover:bg-white/8 hover:text-violet-200"
          >
            <Icon name="search" className="size-[22px]" />
          </button>
          <Link
            href="/cart"
            aria-label="Cart"
            className="inline-flex items-center gap-1"
          >
            <span className="grid size-9 place-items-center rounded-full text-white transition-colors hover:bg-white/8 hover:text-violet-200">
              <Icon name="bag" className="size-[22px]" />
            </span>
            <span className="grid h-5 min-w-5 place-items-center rounded-full bg-violet-500 px-1.5 text-[11px] font-bold text-white">
              {count}
            </span>
          </Link>
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            aria-label="Menu"
            className="grid size-9 place-items-center rounded-full text-white transition-colors hover:bg-white/8 hover:text-violet-200 lg:hidden"
          >
            <Icon name="menu" className="size-[22px]" />
          </button>
        </div>
      </div>
    </header>
  );
}
