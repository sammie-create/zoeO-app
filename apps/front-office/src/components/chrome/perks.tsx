import Link from "next/link";
import { Icon, type IconName } from "@/components/shared/icon";
import { Reveal } from "@/components/shared/reveal";

const perks: { icon: IconName; title: string; text: string; href?: string }[] = [
  { icon: "returns", title: "3-Day Exchange Policy", text: "T and C applies", href: "/returns-policy" },
  { icon: "shield", title: "100% Secure Checkout", text: "SSL encrypted transaction" },
  { icon: "headset", title: "Customer Service 24/7", text: "We are always ready to assist", href: "/contact" },
];

export function Perks() {
  return (
    <section className="border-y border-[var(--line)] bg-bg-alt">
      <div className="mx-auto grid max-w-[1280px] grid-cols-1 gap-6 px-4 py-9 sm:grid-cols-2 sm:px-6 lg:grid-cols-3 lg:px-8">
        {perks.map((p, i) => {
          const content = (
            <>
              <span className="grid size-11 shrink-0 place-items-center rounded-full bg-violet-500/16 text-violet-300">
                <Icon name={p.icon} className="size-5" />
              </span>
              <div>
                <strong className="block text-[15px] font-semibold transition-colors group-hover:text-violet-300">
                  {p.title}
                </strong>
                <span className="text-[13px] text-noir-400">{p.text}</span>
              </div>
            </>
          );
          return (
            <Reveal key={p.title} delay={i * 80}>
              {p.href ? (
                <Link href={p.href} className="group flex items-center gap-4">
                  {content}
                </Link>
              ) : (
                <div className="flex items-center gap-4">{content}</div>
              )}
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
