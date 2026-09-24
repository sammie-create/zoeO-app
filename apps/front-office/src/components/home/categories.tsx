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
    <section className="px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
      <Reveal as="h2" className="font-display mb-10 block max-w-3xl text-center text-3xl font-bold sm:text-4xl lg:text-[46px]">Our Categories of ZoeO Allure</Reveal>
      <Reveal
        variant="fade"
        as="div"
        className="flex h-auto flex-col gap-1.5 overflow-hidden rounded-2xl sm:h-[clamp(460px,48vw,720px)] sm:flex-row"
      >
        {categories.map((c) => (
          <Link
            key={c.cat}
            href={`/shop?cat=${c.cat}`}
            className="group relative flex h-[280px] flex-1 items-end overflow-hidden transition-[flex-grow] duration-700 sm:h-auto sm:hover:flex-[1.45]"
          >
            <Image
              src={`/img/${c.img}.webp`}
              alt={c.alt}
              fill
              sizes="(min-width: 640px) 25vw, 100vw"
              className="object-cover transition-[filter] duration-500 group-hover:brightness-90"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
            <span className="font-display absolute top-6 left-5 text-2xl font-bold text-white sm:top-10 sm:text-[32px]">
              {c.label}
            </span>
            <span className="relative m-5 inline-flex h-11 items-center gap-2 rounded-full bg-white pr-1.5 pl-4 text-sm font-bold text-violet-800">
              Shop {c.label}
              <span className="grid size-8 place-items-center rounded-full bg-violet-800 text-white">
                <Icon name="arrow" className="size-4" />
              </span>
            </span>
          </Link>
        ))}
      </Reveal>
    </section>
  );
}
