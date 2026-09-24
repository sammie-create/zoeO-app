import Image from "next/image";
import Link from "next/link";
import { Icon } from "@/components/shared/icon";
import { Reveal } from "@/components/shared/reveal";

const gallery = [
  { img: "nails-art", alt: "Almond nails with red French tips and gold detail" },
  { img: "gele", alt: "Woman in an emerald gele and lace aso-ebi", pos: "50% 15%" },
  { img: "gallery-3", alt: "Luxury hair elixir set" },
  { img: "portrait-braids", alt: "Woman with long braids and glossy makeup" },
  { img: "gallery-5", alt: "Press-on nail designs" },
];

export function Community() {
  return (
    <section
      className="px-4 py-20 text-center sm:px-6 lg:px-8"
      style={{ background: "radial-gradient(120% 90% at 50% 0%, #2F1263 0%, #230C4A 45%, #1B0A38 100%)" }}
    >
      <div className="mx-auto max-w-[1280px]">
        <Reveal as="span" className="inline-block text-sm font-medium text-violet-200">
          + Join our community
        </Reveal>
        <Reveal as="h2" className="font-display mt-6 mb-5 block text-4xl font-bold sm:text-6xl lg:text-[76px]">Begin your beauty in one place</Reveal>
        <Reveal as="p" className="mx-auto mb-13 max-w-[600px] text-[17px] text-white">
          Members save 15% on every visit. Get priority booking and early access to signature product drops.
        </Reveal>

        <div className="mb-11 grid grid-cols-2 gap-4 sm:grid-cols-5">
          {gallery.map((g, i) => (
            <Reveal key={g.img} delay={i * 80} className="overflow-hidden rounded-2xl" style={{ aspectRatio: "275/377" }}>
              <Image
                src={`/img/${g.img}.webp`}
                alt={g.alt}
                width={275}
                height={377}
                className="size-full object-cover transition-transform duration-1000 hover:scale-105"
                style={g.pos ? { objectPosition: g.pos } : undefined}
              />
            </Reveal>
          ))}
        </div>

        <Reveal className="flex flex-wrap justify-center gap-4.5">
          <Link href="/shop" className="inline-flex h-[62px] items-center gap-3 rounded-full bg-white pr-2 pl-7 text-[15px] font-semibold text-noir-900">
            Shop Products
            <span className="grid size-9.5 place-items-center rounded-full bg-noir-900 text-white">
              <Icon name="arrow" className="size-3.5" />
            </span>
          </Link>
          <Link
            href="/contact?topic=exhibition"
            className="inline-flex h-[58px] items-center rounded-full border-[1.5px] border-violet-500 px-7 text-[15px] font-semibold text-white hover:bg-violet-500/25"
          >
            Register for the Exhibition
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
