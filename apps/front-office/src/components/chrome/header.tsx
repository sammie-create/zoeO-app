"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Icon } from "@/components/shared/icon";
import { useCart } from "@/lib/store/cart";
import { useChromeUi } from "@/lib/store/chrome-ui";
import { Brand } from "./brand";
import { ThemeToggle } from "./theme-toggle";

const navItems = [
  { label: "Shop", href: "/shop", match: ["/shop", "/product", "/cart", "/checkout"] },
  { label: "Services", href: "/services", match: ["/services"] },
  { label: "About", href: "/about", match: ["/about"] },
  { label: "Blog", href: "/blog", match: ["/blog"] },
];

function iconBtnClass(dimmed: boolean) {
  const base = "grid size-9 place-items-center rounded-full text-white transition-colors hover:bg-white/8 hover:text-violet-200";
  return dimmed ? base : `${base} light:text-noir-900 light:hover:bg-noir-900/6 light:hover:text-violet-600`;
}

export function Header() {
  const pathname = usePathname();
  const { count } = useCart();
  const { setSearchOpen, setMenuOpen } = useChromeUi();
  const isOverlay = pathname === "/";
  const [isStuck, setIsStuck] = useState(false);
  const dimmed = isOverlay && !isStuck;

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

  // Over hero photography (overlay, not yet stuck) dark glass always reads
  // fine regardless of theme, so that branch intentionally carries no
  // `light:` classes at all — it stays dark-locked. Once the header is
  // sitting on a plain page background (stuck, or any non-home route) the
  // `light:` variant takes over automatically, driven purely by the
  // [data-theme="light"] attribute — no JS/React state involved.
  return (
    <header
      className={`z-50 overflow-hidden border-b bg-[linear-gradient(180deg,rgba(255,255,255,.09),rgba(255,255,255,.03)),rgba(20,16,30,.56)] shadow-[inset_0_1px_0_rgba(255,255,255,.08),0_10px_40px_-20px_rgba(0,0,0,.6)] backdrop-blur-[22px] transition-[border-radius] duration-[280ms] ${
        isOverlay
          ? isStuck
            ? "light:bg-[linear-gradient(180deg,rgba(255,255,255,.78),rgba(255,255,255,.58))] light:shadow-[inset_0_1px_0_rgba(255,255,255,.8),0_12px_40px_-26px_rgba(41,10,77,.35)] fixed top-0 right-0 left-0 animate-[slide-down_420ms_var(--ease)] rounded-none border-white/12 light:border-noir-900/8"
            : "absolute top-4 right-4 left-4 rounded-[20px] border-white/18 sm:top-8 sm:right-8 sm:left-8"
          : "light:bg-[linear-gradient(180deg,rgba(255,255,255,.78),rgba(255,255,255,.58))] light:shadow-[inset_0_1px_0_rgba(255,255,255,.8),0_12px_40px_-26px_rgba(41,10,77,.35)] sticky top-0 border-white/12 light:border-noir-900/8"
      }`}
    >
      <div
        aria-hidden
        className={`pointer-events-none absolute inset-0 bg-[radial-gradient(60%_140%_at_12%_0%,rgba(127,35,224,.18),transparent_60%),radial-gradient(40%_120%_at_90%_100%,rgba(182,137,246,.10),transparent_60%)] ${
          isOverlay && !isStuck
            ? ""
            : "light:bg-[radial-gradient(60%_140%_at_12%_0%,rgba(127,35,224,.10),transparent_60%),radial-gradient(40%_120%_at_90%_100%,rgba(182,137,246,.10),transparent_60%)]"
        }`}
      />
      <div
        className={`relative mx-auto grid max-w-[1280px] grid-cols-2 items-center gap-6 px-4 sm:px-6 lg:grid-cols-[1fr_auto_1fr] lg:px-0 ${
          isOverlay && !isStuck ? "h-[76px]" : "h-[72px] sm:h-[88px]"
        }`}
      >
        <Brand small dimmed={dimmed} />

        <nav aria-label="Primary" className="hidden items-center gap-[clamp(20px,3vw,44px)] lg:flex">
          {navItems.map((item) => {
            const isActive = item.match.some((m) => pathname.startsWith(m));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative py-1.5 text-[15px] font-medium transition-colors ${
                  isActive
                    ? `text-violet-400 ${dimmed ? "" : "light:text-violet-600"}`
                    : `text-white hover:text-violet-200 ${dimmed ? "" : "light:text-noir-900 light:hover:text-violet-600"}`
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center justify-end gap-1.5 sm:gap-3">
          <Link
            href="/contact"
            className="hidden h-10 items-center rounded-full bg-violet-500 px-4.5 text-[13px] font-bold text-white uppercase transition-colors hover:bg-violet-600 lg:inline-flex"
          >
            Contact us
          </Link>
          <ThemeToggle disableLight={dimmed} className="hidden lg:grid" />
          <button type="button" onClick={() => setSearchOpen(true)} aria-label="Search" className={iconBtnClass(dimmed)}>
            <Icon name="search" className="size-[22px]" />
          </button>
          <Link href="/cart" aria-label="Cart" className="inline-flex items-center gap-1">
            <span className={iconBtnClass(dimmed)}>
              <Icon name="bag" className="size-[22px]" />
            </span>
            <span className="grid h-5 min-w-5 place-items-center rounded-full bg-violet-500 px-1.5 text-[11px] font-bold text-white">
              {count}
            </span>
          </Link>
          <button type="button" onClick={() => setMenuOpen(true)} aria-label="Menu" className={`${iconBtnClass(dimmed)} lg:hidden`}>
            <Icon name="menu" className="size-[22px]" />
          </button>
        </div>
      </div>
    </header>
  );
}
