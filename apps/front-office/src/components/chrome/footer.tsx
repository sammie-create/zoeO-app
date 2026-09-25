"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { Icon } from "@/components/shared/icon";
import { Reveal } from "@/components/shared/reveal";
import { useCurrency } from "@/lib/store/currency";
import { Brand } from "./brand";

const shopLinks = [
  { label: "Hair Care", href: "/shop?cat=hair" },
  { label: "Personal Care", href: "/shop?cat=personal" },
  { label: "Nails", href: "/shop?cat=nails" },
  { label: "Extensions", href: "/shop?cat=wigs" },
  { label: "Lashes", href: "/shop?q=lash" },
];

const companyLinks = [
  { label: "About Us", href: "/about" },
  { label: "Our Story", href: "/about#story" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
  { label: "Careers", href: "/contact?topic=careers" },
];

const socialIcons = [
  { icon: "instagram" as const, href: "https://instagram.com/zoeoallure", label: "Instagram" },
  { icon: "x" as const, href: "https://x.com/zoeoallure", label: "X" },
  { icon: "facebook" as const, href: "https://facebook.com/zoeoallure", label: "Facebook" },
  { icon: "youtube" as const, href: "https://youtube.com/@zoeoallure", label: "YouTube" },
  { icon: "twitter" as const, href: "https://twitter.com/zoeoallure", label: "Twitter" },
];

export function Footer() {
  const { currency, setCurrency } = useCurrency();
  const [email, setEmail] = useState("");

  function handleNewsletter(e: FormEvent) {
    e.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      toast.error("Enter a valid email address.");
      return;
    }
    setEmail("");
    toast.success("You're on the list!");
  }

  return (
    <footer className="relative overflow-hidden bg-noir-900 pt-20">
      <div className="mx-auto max-w-[calc(1280px_+_clamp(16px,5vw,80px)*2)] px-[clamp(16px,5vw,80px)]">
        <div className="grid grid-cols-[1.35fr_.8fr_.8fr_1.3fr] gap-12 max-[1080px]:grid-cols-2 max-[760px]:gap-9">
          <Reveal className="max-[760px]:col-span-2">
            <Brand />
            <p className="mt-5.5 mb-[26px] max-w-[340px] text-[15px] text-noir-300">
              Beauty, made easier. All in one place. Shop hair care, extensions, custom nails, and gorgeous lashes.
            </p>
            <div className="flex gap-2.5">
              {socialIcons.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="grid size-10 place-items-center rounded-full bg-white/6 text-noir-200 transition-all hover:-translate-y-[3px] hover:bg-violet-500 hover:text-white"
                >
                  <Icon name={s.icon} className="size-5" />
                </a>
              ))}
            </div>
            <div className="mt-6 flex flex-wrap gap-2.5">
              <label className="relative">
                <span className="sr-only">Currency</span>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value as "NGN" | "USD")}
                  className="h-[34px] appearance-none rounded-full border border-white/16 bg-transparent pr-8 pl-3.5 text-[13px] text-noir-200"
                >
                  <option value="NGN" className="bg-noir-800">
                    🇳🇬 Nigeria (NGN ₦)
                  </option>
                  <option value="USD" className="bg-noir-800">
                    🇺🇸 United States (USD $)
                  </option>
                </select>
                <span className="pointer-events-none absolute top-1/2 right-3.5 size-1.5 -translate-y-1/2 rotate-45 border-r-[1.5px] border-b-[1.5px] border-noir-200" />
              </label>
              <label className="relative">
                <span className="sr-only">Language</span>
                <select className="h-[34px] appearance-none rounded-full border border-white/16 bg-transparent pr-8 pl-3.5 text-[13px] text-noir-200">
                  <option className="bg-noir-800">English</option>
                </select>
                <span className="pointer-events-none absolute top-1/2 right-3.5 size-1.5 -translate-y-1/2 rotate-45 border-r-[1.5px] border-b-[1.5px] border-noir-200" />
              </label>
            </div>
          </Reveal>

          <Reveal delay={80}>
            <h4 className="mb-5 text-sm font-bold tracking-[.02em] text-white uppercase">Shop</h4>
            {shopLinks.map((l) => (
              <Link key={l.label} href={l.href} className="block py-1.5 text-[15px] text-noir-300 transition-all hover:translate-x-1 hover:text-white">
                {l.label}
              </Link>
            ))}
          </Reveal>

          <Reveal delay={160}>
            <h4 className="mb-5 text-sm font-bold tracking-[.02em] text-white uppercase">Company</h4>
            {companyLinks.map((l) => (
              <Link key={l.label} href={l.href} className="block py-1.5 text-[15px] text-noir-300 transition-all hover:translate-x-1 hover:text-white">
                {l.label}
              </Link>
            ))}
          </Reveal>

          <Reveal delay={240} className="max-[760px]:col-span-2">
            <h3 className="font-display mb-3.5 text-[26px] font-bold">Subscribe to our newsletter</h3>
            <p className="mb-6 text-[15px] text-noir-300">Stay in the loop with exclusive offers and product previews.</p>
            <form
              onSubmit={handleNewsletter}
              className="flex items-center rounded-full border border-white/16 p-[5px] transition-colors duration-150 focus-within:border-violet-400"
            >
              <label className="sr-only" htmlFor="nl-email">
                Email
              </label>
              <input
                id="nl-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="min-w-0 flex-1 bg-transparent px-4 text-sm text-white outline-none placeholder:text-noir-400"
              />
              <button
                type="submit"
                className="h-10 shrink-0 rounded-full bg-violet-50 px-5 text-xs font-bold text-noir-900 uppercase hover:bg-white"
              >
                Subscribe
              </button>
            </form>
          </Reveal>
        </div>

        <div className="mt-[72px] flex flex-wrap items-center justify-between gap-5 border-t border-white/8 py-6.5 text-sm text-noir-400">
          <div>
            © 2026 ZoeO Allure. All rights reserved.
            <a
              href="mailto:hello@zoeoallure.com"
              className="ml-6 text-noir-200 hover:text-violet-300 max-[760px]:ml-0 max-[760px]:block"
            >
              hello@zoeoallure.com
            </a>
          </div>
          <div className="flex flex-wrap gap-2.5">
            <span className="grid h-[30px] place-items-center rounded-md border border-white/16 px-3 text-[11px] font-bold">VISA</span>
            <span className="flex items-center px-1">
              <i className="size-4 rounded-full bg-[#EB001B]" />
              <i className="-ml-[5px] size-4 rounded-full bg-[#F79E1B] opacity-90" />
            </span>
            <span className="grid h-[30px] place-items-center rounded-md border border-white/16 px-3 text-[11px] font-bold text-[#0BA4DB]">Paystack</span>
            <span className="grid h-[30px] place-items-center rounded-md border border-white/16 px-3 text-[11px] font-bold text-[#F5A623]">Flutterwave</span>
          </div>
        </div>
      </div>
      <p
        aria-hidden
        className="font-display mb-[-0.12em] text-center text-[clamp(80px,17vw,260px)] leading-[0.8] font-bold tracking-[-.02em] whitespace-nowrap text-white/[.035] select-none max-[760px]:text-[22vw]"
      >
        ZoeO Allure
      </p>
    </footer>
  );
}
