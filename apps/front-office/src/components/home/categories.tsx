import Image from "next/image";
import Link from "next/link";
import { Icon } from "@/components/shared/icon";
import { Reveal } from "@/components/shared/reveal";

const categories = [
  { label: "Hair Care", cat: "hair", img: "cat-hair", alt: "HELicia hair care bottle" },
  { label: "Personal Care", cat: "personal", img: "cat-personal", alt: "Lip gloss and roll-on deodorant" },
  { label: "Nail Care", cat: "nails", img: "cat-nail", alt: "Jewelled press-on nails on green velvet" },
  { label: "Extensions", cat: "wigs", img: "cat-extensions", alt: "Long wavy wig on a mannequin" },
];

export function Categories() {
  return (
    <section className="py-[clamp(64px,9vw,120px)]">
      <Reveal
        as="h2"
        className="font-display mb-[clamp(40px,5vw,64px)] block px-4 text-center text-[clamp(34px,4.6vw,60px)] leading-[1.08] font-bold"
      >
        Our Categories at ZoeO <em className="font-normal italic">Allure</em>
      </Reveal>
      <Reveal
        variant="fade"
        as="div"
        className="group/cats grid grid-cols-1 gap-1.5 md:grid-cols-2 lg:flex lg:h-[clamp(460px,48vw,720px)] lg:flex-row"
      >
        {categories.map((c) => (
          <Link
            key={c.cat}
            href={`/shop?cat=${c.cat}`}
            className="group/cat relative flex h-[280px] overflow-hidden transition-[flex] duration-700 ease-[var(--ease)] md:h-[340px] lg:h-auto lg:flex-1 lg:hover:flex-[1.45]"
          >
            <Image
              src={`/img/${c.img}.webp`}
              alt={c.alt}
              fill
              sizes="(min-width: 1024px) 25vw, (min-width: 768px) 50vw, 100vw"
              className="object-cover transition-[filter,transform] duration-1000 ease-[var(--ease)] hover:scale-[1.06] lg:group-hover/cats:not-hover:brightness-[.7] lg:group-hover/cats:not-hover:saturate-[.85]"
            />
            <div
              className="pointer-events-none absolute inset-0"
              style={{
                backgroundImage:
                  "linear-gradient(180deg, rgba(14,12,18,.35), rgba(14,12,18,0) 45%, rgba(14,12,18,.45))",
              }}
            />
            <span
              className="font-display absolute z-[2] text-[clamp(28px,2.8vw,42px)] leading-none font-bold whitespace-nowrap text-white capitalize [writing-mode:horizontal-tb] lg:[writing-mode:vertical-rl] lg:rotate-180"
              style={{
                top: "clamp(24px, 4vw, 56px)",
                left: "clamp(20px, 2.6vw, 40px)",
              }}
            >
              {c.label}
            </span>
            <span
              className="group/pill absolute z-[2] inline-flex h-11 items-center gap-3.5 rounded-full bg-white py-0 pr-1.5 pl-5 text-sm font-semibold whitespace-nowrap text-noir-900 shadow-[0_0_0_1.5px_rgba(255,255,255,.2)] transition-shadow duration-300 ease-[var(--ease)] hover:shadow-[0_12px_30px_-12px_rgba(127,35,224,.8),0_0_0_1.5px_rgba(255,255,255,.3)]"
              style={{ left: "clamp(16px, 2.2vw, 36px)", bottom: "clamp(24px, 3vw, 48px)" }}
            >
              Shop {c.label}
              <span className="grid size-7.5 place-items-center rounded-full bg-violet-800 text-white transition-[transform,background-color] duration-[280ms] ease-[var(--ease)] group-hover/pill:translate-x-[3px] group-hover/pill:bg-violet-500">
                <Icon name="arrow" className="size-4" />
              </span>
            </span>
          </Link>
        ))}
      </Reveal>
    </section>
  );
}
