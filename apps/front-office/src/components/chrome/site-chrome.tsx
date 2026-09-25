"use client";

import { AnimatePresence, motion } from "motion/react";
import { usePathname } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import type { Product, Service } from "@/lib/queries";
import { ChromeUiProvider } from "@/lib/store/chrome-ui";
import { Footer } from "./footer";
import { Header } from "./header";
import { MobileNav } from "./mobile-nav";
import { Perks } from "./perks";
import { SearchOverlay } from "./search-overlay";
import { Topbar } from "./topbar";

const topbarRoutes = ["/shop", "/product", "/cart", "/checkout"];
const noChromeRoutes: string[] = [];

// Fires once the incoming page mounts (after the outgoing page's exit
// animation completes, since AnimatePresence is mode="wait") — so the jump
// to top happens while the new page is still invisible (opacity 0), never
// visible on the outgoing page mid-fade. Disabling the browser's own
// scroll-restoration is required too — otherwise it silently restores a
// previously-visited route's old scroll offset regardless of our timing.
function ScrollReset() {
  useEffect(() => {
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    window.scrollTo(0, 0);
  }, []);
  return null;
}

export function SiteChrome({
  children,
  products,
  services,
}: {
  children: ReactNode;
  products: Product[];
  services: Service[];
}) {
  const pathname = usePathname();
  const showTopbar = topbarRoutes.some((r) => pathname.startsWith(r));
  const showPerks = showTopbar;
  const hideChrome = noChromeRoutes.some((r) => pathname.startsWith(r));

  if (hideChrome) return <>{children}</>;

  return (
    <ChromeUiProvider>
      {showTopbar && <Topbar />}
      <Header />
      <MobileNav />
      <SearchOverlay products={products} services={services} />
      <AnimatePresence mode="wait" initial={false}>
        <motion.main
          key={pathname}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.42, ease: [0.22, 0.7, 0.28, 1] }}
          className="flex-1"
        >
          <ScrollReset />
          {children}
        </motion.main>
      </AnimatePresence>
      {showPerks && <Perks />}
      <Footer />
    </ChromeUiProvider>
  );
}
