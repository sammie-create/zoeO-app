import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/shared/reveal";

export function Hero() {
  return (
    <section data-hero className="p-2 sm:p-4">
      <div className="relative flex min-h-[560px] items-end overflow-hidden rounded-[28px] border border-white/28 sm:min-h-[92vh] sm:max-h-[860px]">
        <Image
          src="/img/hero-home.webp"
          alt="Woman with glowing makeup and crystal earrings"
          fill
          priority
          sizes="100vw"
          className="animate-[kenburns_18s_ease-out_forwards] object-cover"
          style={{ objectPosition: "60% 30%" }}
        />
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(180deg, rgba(14,12,18,.25) 0%, rgba(14,12,18,0) 30%, rgba(14,12,18,.35) 60%, rgba(8,6,10,.96) 100%)",
          }}
        />
        <div className="relative grid w-full gap-8 px-6 pb-10 sm:gap-12 sm:px-10 sm:pb-14 lg:grid-cols-[1.45fr_1fr] lg:items-end lg:px-14 lg:pb-[72px]">
          <Reveal
            as="h1"
            className="font-display block text-[42px] leading-[1.04] text-white sm:text-6xl lg:text-[78px]"
          >
            <span className="block whitespace-normal font-bold sm:whitespace-nowrap">Beauty, Made Easier</span>
            <span className="block whitespace-normal sm:whitespace-nowrap">
              <span className="font-bold">—</span> <em className="text-violet-300 italic">All in One Place</em>
            </span>
          </Reveal>
          <Reveal delay={500} className="flex flex-col items-start gap-7">
            <p className="max-w-[560px] text-[15px] leading-[1.6] text-noir-200 sm:text-lg">
              From premium hair care to flawless nails, lash extensions to wig revamp — discover everything you need
              under one glamorous roof.
            </p>
            <Link
              href="/shop"
              className="flex h-12 items-center rounded-full bg-violet-500 px-7 text-sm font-bold text-white uppercase transition-colors hover:bg-violet-600"
            >
              Explore products
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
