"use client";

import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Icon } from "@/components/shared/icon";
import type { Product } from "@/lib/queries";
import { useCurrency } from "@/lib/store/currency";

const ROTATE_MS = 4500;

function AnnouncementBanner({ products }: { products: Product[] }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (products.length < 2) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % products.length), ROTATE_MS);
    return () => clearInterval(id);
  }, [products.length]);

  if (products.length === 0) return null;

  const product = products[index % products.length];

  return (
    <div className="flex items-center gap-2.5 overflow-hidden text-white light:text-noir-900">
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={product.id}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.32 }}
          className="flex items-center gap-2.5"
        >
          <span className="truncate">New: {product.brand ? `${product.brand} ` : ""}{product.name} now live</span>
          <Link
            href={`/product/${product.id}`}
            className="hidden h-[22px] shrink-0 items-center rounded-full bg-violet-500 px-2.5 text-[10px] font-extrabold tracking-wide text-white uppercase sm:inline-flex"
          >
            Shop now
          </Link>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export function Topbar({ announcedProducts }: { announcedProducts: Product[] }) {
  const { currency, setCurrency } = useCurrency();

  return (
    <div className="border-b border-white/8 bg-noir-900 text-[13px] light:border-noir-900/8 light:bg-surface">
      <div className="mx-auto flex h-11 max-w-[1280px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <div className="hidden items-center gap-3.5 text-noir-200 md:flex light:text-noir-900/70">
          <a href="https://instagram.com/zoeoallure" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="opacity-85 hover:text-violet-300 hover:opacity-100 light:hover:text-noir-900">
            <Icon name="instagram" className="size-4" />
          </a>
          <a href="https://x.com/zoeoallure" target="_blank" rel="noopener noreferrer" aria-label="X" className="opacity-85 hover:text-violet-300 hover:opacity-100 light:hover:text-noir-900">
            <Icon name="x" className="size-4" />
          </a>
          <a href="https://facebook.com/zoeoallure" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="opacity-85 hover:text-violet-300 hover:opacity-100 light:hover:text-noir-900">
            <Icon name="facebook" className="size-4" />
          </a>
        </div>

        <AnnouncementBanner products={announcedProducts} />

        <div className="hidden items-center gap-5 text-noir-300 lg:flex light:text-noir-900/60">
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value as "NGN" | "USD")}
            aria-label="Currency"
            className="rounded-none bg-transparent text-noir-300 outline-none hover:text-white light:text-noir-900/60 light:hover:text-noir-900"
          >
            <option value="NGN" className="bg-white text-noir-900">NGN ₦ (Nigeria)</option>
            <option value="USD" className="bg-white text-noir-900">USD $ (United States)</option>
          </select>
          <Link href="/about" className="hover:text-white light:hover:text-noir-900">
            About
          </Link>
          <Link href="/contact#faq" className="hover:text-white light:hover:text-noir-900">
            Help &amp; FAQs
          </Link>
        </div>
      </div>
    </div>
  );
}
