import { Icon, type IconName } from "@/components/shared/icon";
import { Reveal } from "@/components/shared/reveal";

const perks: { icon: IconName; title: string; text: string }[] = [
  { icon: "truck", title: "Fast Free Shipping", text: "On orders above ₦50,000" },
  { icon: "returns", title: "Hassle-free Returns", text: "Easy 14 days exchange policy" },
  { icon: "shield", title: "100% Secure Checkout", text: "SSL encrypted transaction" },
  { icon: "headset", title: "Customer Service 24/7", text: "We are always ready to assist" },
];

export function Perks() {
  return (
    <section className="border-y border-white/8 bg-noir-800/60">
      <div className="mx-auto grid max-w-[1280px] grid-cols-1 gap-6 px-4 py-9 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">
        {perks.map((p, i) => (
          <Reveal key={p.title} delay={i * 80} className="flex items-center gap-4">
            <Icon name={p.icon} className="size-7 shrink-0 text-violet-300" />
            <div>
              <strong className="block text-[15px] font-semibold">{p.title}</strong>
              <span className="text-[13px] text-noir-400">{p.text}</span>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
