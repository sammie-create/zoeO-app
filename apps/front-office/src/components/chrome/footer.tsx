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
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-9 sm:grid-cols-2 lg:grid-cols-[1.35fr_.8fr_.8fr_1.3fr] lg:gap-12">
          <Reveal className="sm:col-span-2 lg:col-span-1">
            <Brand />
            <p className="mt-5.5 max-w-[340px] text-[15px] text-noir-300">
              Beauty, made easier. All in one place. Shop hair care, extensions, custom nails, and gorgeous lashes.
            </p>
            <div className="mt-6 flex gap-2.5">
              {socialIcons.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="grid size-10 place-items-center rounded-full bg-white/6 text-noir-200 transition-all hover:-translate-y-0.5 hover:bg-violet-500 hover:text-white"
                >
                  <Icon name={s.icon} className="size-4.5" />
                </a>
              ))}
            </div>
            <div className="mt-6 flex flex-wrap gap-2.5">
              <label className="flex h-9 items-center rounded-full border border-white/16 px-3.5 text-xs text-noir-200">
                <span className="sr-only">Currency</span>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value as "NGN" | "USD")}
                  className="bg-transparent outline-none"
                >
                  <option value="NGN">🇳🇬 Nigeria (NGN ₦)</option>
                  <option value="USD">🇺🇸 United States (USD $)</option>
                </select>
              </label>
              <label className="flex h-9 items-center rounded-full border border-white/16 px-3.5 text-xs text-noir-200">
                <span className="sr-only">Language</span>
                <select className="bg-transparent outline-none">
                  <option>English</option>
                </select>
              </label>
            </div>
          </Reveal>

          <Reveal delay={80}>
            <h4 className="mb-5 text-sm font-bold tracking-wide text-white uppercase">Shop</h4>
            {shopLinks.map((l) => (
              <Link key={l.label} href={l.href} className="block py-1.5 text-[15px] text-noir-300 transition-all hover:translate-x-1 hover:text-white">
                {l.label}
              </Link>
            ))}
          </Reveal>

          <Reveal delay={160}>
            <h4 className="mb-5 text-sm font-bold tracking-wide text-white uppercase">Company</h4>
            {companyLinks.map((l) => (
              <Link key={l.label} href={l.href} className="block py-1.5 text-[15px] text-noir-300 transition-all hover:translate-x-1 hover:text-white">
                {l.label}
              </Link>
            ))}
          </Reveal>

          <Reveal delay={240} className="sm:col-span-2 lg:col-span-1">
            <h3 className="font-display mb-3.5 text-[26px] font-bold">Subscribe to our newsletter</h3>
            <p className="mb-6 text-[15px] text-noir-300">Stay in the loop with exclusive offers and product previews.</p>
            <form onSubmit={handleNewsletter} className="flex items-center justify-between rounded-full border border-white/16 bg-noir-800 py-1.5 pr-1.5 pl-5">
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
                className="w-full bg-transparent text-[13px] text-white outline-none placeholder:text-noir-500"
              />
              <button type="submit" className="rounded-full bg-violet-50 px-5 py-2.5 text-xs font-bold text-noir-900 uppercase">
                Subscribe
              </button>
            </form>
          </Reveal>
        </div>

        <div className="mt-[72px] flex flex-col items-center justify-between gap-5 border-t border-white/8 py-6.5 text-sm text-noir-400 sm:flex-row">
          <div>
            © 2026 ZoeO Allure. All rights reserved.{" "}
            <a href="mailto:hello@zoeoallure.com" className="text-noir-200 hover:text-violet-300">
              hello@zoeoallure.com
            </a>
          </div>
          <div className="flex flex-wrap gap-2.5">
            <span className="grid h-[30px] place-items-center rounded-md border border-white/16 px-3 text-[11px] font-bold">VISA</span>
            <span className="flex items-center px-1">
              <i className="size-4 rounded-full bg-[#EB001B]" />
              <i className="-ml-1.5 size-4 rounded-full bg-[#F79E1B] opacity-90" />
            </span>
            <span className="grid h-[30px] place-items-center rounded-md border border-white/16 px-3 text-[11px] font-bold text-[#0BA4DB]">Paystack</span>
            <span className="grid h-[30px] place-items-center rounded-md border border-white/16 px-3 text-[11px] font-bold text-[#F5A623]">Flutterwave</span>
          </div>
        </div>
      </div>
      <p
        aria-hidden
        className="font-display mb-[-0.12em] text-center leading-[0.8] font-bold whitespace-nowrap text-white/[.035] select-none"
        style={{ fontSize: "clamp(80px, 17vw, 260px)" }}
      >
        ZoeO Allure
      </p>
    </footer>
  );
}
