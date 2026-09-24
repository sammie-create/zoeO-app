"use client";

import Link from "next/link";
import { Icon } from "@/components/shared/icon";
import { useCurrency } from "@/lib/store/currency";

export function Topbar() {
  const { currency, setCurrency } = useCurrency();

  return (
    <div className="border-b border-white/8 bg-noir-900 text-[13px]">
      <div className="mx-auto flex h-11 max-w-[1280px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <div className="hidden items-center gap-3.5 text-noir-200 md:flex">
          <a href="https://instagram.com/zoeoallure" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="opacity-85 hover:text-violet-300 hover:opacity-100">
            <Icon name="instagram" className="size-4" />
          </a>
          <a href="https://x.com/zoeoallure" target="_blank" rel="noopener noreferrer" aria-label="X" className="opacity-85 hover:text-violet-300 hover:opacity-100">
            <Icon name="x" className="size-4" />
          </a>
          <a href="https://facebook.com/zoeoallure" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="opacity-85 hover:text-violet-300 hover:opacity-100">
            <Icon name="facebook" className="size-4" />
          </a>
        </div>

        <div className="flex items-center gap-2.5 text-white">
          <span>New HELicia Hair Care collection now live</span>
          <Link
            href="/shop?cat=hair"
            className="hidden h-[22px] items-center rounded-full bg-violet-500 px-2.5 text-[10px] font-extrabold tracking-wide text-white uppercase sm:inline-flex"
          >
            Shop now
          </Link>
        </div>

        <div className="hidden items-center gap-5 text-noir-300 lg:flex">
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value as "NGN" | "USD")}
            aria-label="Currency"
            className="rounded-none bg-transparent text-noir-300 outline-none hover:text-white"
          >
            <option value="NGN">NGN ₦ (Nigeria)</option>
            <option value="USD">USD $ (United States)</option>
          </select>
          <Link href="/about" className="hover:text-white">
            About
          </Link>
          <Link href="/contact#faq" className="hover:text-white">
            Help &amp; FAQs
          </Link>
        </div>
      </div>
    </div>
  );
}
