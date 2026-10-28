import Link from "next/link";
import type { ReactNode } from "react";
import { Reveal } from "@/components/shared/reveal";

export const POLICY_LINKS = [
  { slug: "terms", label: "Terms & Conditions", href: "/terms" },
  { slug: "service-policy", label: "Service Policy", href: "/service-policy" },
  { slug: "sales-delivery-policy", label: "Sales & Delivery", href: "/sales-delivery-policy" },
  { slug: "returns-policy", label: "Returns, Exchanges & Refunds", href: "/returns-policy" },
  { slug: "warranty-policy", label: "Warranty & Hair Care", href: "/warranty-policy" },
  { slug: "privacy-policy", label: "Privacy", href: "/privacy-policy" },
] as const;

export type PolicySlug = (typeof POLICY_LINKS)[number]["slug"];

export function PolicyLayout({
  active,
  title,
  lead,
  toc,
  children,
}: {
  active: PolicySlug;
  title: string;
  lead: string;
  toc?: { href: string; label: string }[];
  children: ReactNode;
}) {
  const activeLink = POLICY_LINKS.find((l) => l.slug === active)!;

  return (
    <main className="mx-auto max-w-[calc(1280px_+_clamp(16px,5vw,80px)*2)] px-[clamp(16px,5vw,80px)] pt-[clamp(96px,10vw,140px)]">
      <header className="policy-hero">
        <nav aria-label="Breadcrumb" className="crumbs">
          <Link href="/">Home</Link> › <Link href="/terms">Policies</Link> › <span className="cur">{activeLink.label}</span>
        </nav>
        <Reveal as="h1" className="h1 text-foreground">
          {title}
        </Reveal>
        <Reveal as="p" delay={120} className="max-w-[560px] text-noir-300 light:text-noir-600">
          {lead}
        </Reveal>
        <p className="policy-note">Please read the relevant policy before placing an order or using a service.</p>
      </header>

      <div className="policy-layout">
        <aside className="policy-side">
          <nav className="policy-nav" aria-label="Policies">
            <span>Policies &amp; customer terms</span>
            {POLICY_LINKS.map((l) => (
              <Link
                key={l.slug}
                href={l.href}
                className={l.slug === active ? "is-active" : ""}
                aria-current={l.slug === active ? "page" : undefined}
              >
                {l.label}
              </Link>
            ))}
          </nav>
        </aside>

        <article className="policy-body">
          {toc && toc.length > 0 && (
            <div className="policy-toc">
              <span>On this page</span>
              {toc.map((t) => (
                <a key={t.href} href={t.href}>
                  {t.label}
                </a>
              ))}
            </div>
          )}

          {children}

          <div className="policy-help">
            <div>
              <strong>Questions about this policy?</strong>
              <span>Our customer service team is happy to help.</span>
            </div>
            <div className="policy-help__links">
              <a
                href="tel:+2348052579324"
                className="inline-flex h-10 items-center rounded-full bg-violet-500 px-4.5 text-[13px] font-bold text-white transition-colors hover:bg-violet-600"
              >
                Call +234 805 257 9324
              </a>
              <Link
                href="/contact"
                className="inline-flex h-10 items-center rounded-full border border-[var(--line-strong)] px-4.5 text-[13px] font-bold text-foreground transition-colors hover:border-violet-400"
              >
                Contact us
              </Link>
            </div>
          </div>
        </article>
      </div>
    </main>
  );
}
