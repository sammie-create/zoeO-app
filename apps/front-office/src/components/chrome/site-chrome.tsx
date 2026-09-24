"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
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
      <main className="flex-1">{children}</main>
      {showPerks && <Perks />}
      <Footer />
    </ChromeUiProvider>
  );
}
