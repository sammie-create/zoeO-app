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
      className="px-4 py-[clamp(80px,9vw,130px)] text-center sm:px-6 lg:px-8"
      style={{ background: "radial-gradient(120% 90% at 50% 0%, #2F1263 0%, #230C4A 45%, #1B0A38 100%)" }}
    >
      <div className="mx-auto max-w-[1280px]">
        <Reveal
          as="span"
          className="inline-flex items-center text-[13px] font-medium tracking-[.02em] text-violet-200 uppercase"
        >
          + Join our community
        </Reveal>
        <Reveal
          as="h2"
          className="font-display mt-[26px] mb-[22px] block text-[clamp(38px,5.6vw,76px)] leading-[1.02] font-bold"
        >
          Begin your <em className="text-violet-300 not-italic">beauty</em> in one place
        </Reveal>
        <Reveal as="p" className="mx-auto mb-13 max-w-[600px] text-[17px] text-white">
          Members save 15% on every visit. Get priority booking and early access to signature product drops.
        </Reveal>

        <div className="mb-11 grid grid-cols-5 gap-4 max-[1080px]:grid-cols-3 max-[1080px]:[&>*:nth-child(n+4)]:hidden max-[760px]:grid-cols-2 max-[760px]:[&>*:nth-child(3)]:hidden">
          {gallery.map((g, i) => (
            <Reveal
              key={g.img}
              delay={i * 80}
              className="overflow-hidden rounded-[18px]"
              style={{ aspectRatio: "275/377" }}
            >
              <Image
                src={`/img/${g.img}.webp`}
                alt={g.alt}
                width={275}
                height={377}
                className="size-full object-cover transition-transform duration-1000 hover:scale-[1.07]"
                style={g.pos ? { objectPosition: g.pos } : undefined}
              />
            </Reveal>
          ))}
        </div>

        <Reveal className="flex flex-wrap justify-center gap-4.5">
          <Link
            href="/shop"
            className="group/pill inline-flex h-[62px] items-center gap-[18px] rounded-full bg-white pr-3 pl-8 text-[17px] font-semibold text-noir-900 shadow-[0_0_0_1.5px_rgba(255,255,255,.2)] transition-shadow duration-300 ease-[var(--ease)] hover:shadow-[0_12px_30px_-12px_rgba(127,35,224,.8),0_0_0_1.5px_rgba(255,255,255,.3)]"
          >
            Shop Products
            <span className="grid size-9.5 place-items-center rounded-full bg-noir-900 text-white transition-[transform,background-color] duration-[280ms] ease-[var(--ease)] group-hover/pill:translate-x-[3px] group-hover/pill:bg-violet-500">
              <Icon name="arrow" className="size-4" />
            </span>
          </Link>
          <Link
            href="/contact?topic=exhibition"
            className="inline-flex h-[58px] items-center rounded-full border-[1.5px] border-violet-500 px-[30px] text-[17px] font-medium text-white hover:bg-violet-500/25"
          >
            Register for the Exhibition
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
