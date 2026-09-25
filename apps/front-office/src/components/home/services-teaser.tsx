import Link from "next/link";
import { Icon } from "@/components/shared/icon";
import { Reveal } from "@/components/shared/reveal";

const teasers = [
  {
    title: "Wig Revamp & Styling",
    image: "/img/svc-wig.webp",
    alt: "Stylist restoring a wig",
    text: "De-tangling, professional washing, conditioning treatments, customized styling, and restoration for your favorite units.",
  },
  {
    title: "Bridal Hair & Makeup",
    image: "/img/svc-bridal.webp",
    alt: "Bride with glittering eye makeup",
    text: "Flawless, bespoke bridal transformations tailored beautifully for your magical celebration.",
    right: true,
  },
  {
    title: "Lash Extensions",
    image: "/img/svc-lash.webp",
    alt: "Close-up of volume lash extensions",
    text: "Premium custom lash mapping with classic, hybrid, or volume choices designed to captivate.",
  },
  {
    title: "Nail Services",
    image: "/img/svc-nail.webp",
    alt: "Almond nails with red French tips and gold detail",
    text: "Relaxing aesthetic manicures and pedicures, expert extensions, and custom nail art designs.",
    right: true,
  },
];

export function ServicesTeaser() {
  return (
    <section className="bg-bg-alt py-[clamp(64px,9vw,120px)]">
      <div className="mx-auto max-w-[calc(1280px_+_clamp(16px,5vw,80px)*2)] px-[clamp(16px,5vw,80px)]">
        <div className="mx-auto mb-16 max-w-[640px] text-center">
          <Reveal as="span" className="block text-sm font-bold text-violet-400 uppercase">
            Premium in-salon experience
          </Reveal>
          <Reveal as="h2" className="font-display my-3.5 block text-[clamp(34px,4.6vw,60px)] leading-[1.08] font-bold">
            Beauty Services
          </Reveal>
          <Reveal as="p" className="text-[17px] text-white">
            Beyond our exceptional products, sit back and let our master artists pamper you.
          </Reveal>
        </div>

        <div className="grid gap-[22px]">
          {teasers.map((t) => (
            <Reveal key={t.title}>
              <Link
                href="/services#book"
                tabIndex={0}
                className={`svc block ${t.right ? "svc--right" : ""}`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element -- local marketing asset */}
                <img src={t.image} alt={t.alt} loading="lazy" />
                <div className="svc__body">
                  <h3>{t.title}</h3>
                  <span className="svc__hint">
                    Hover to explore
                    <Icon name="plus" className="size-4" />
                  </span>
                  <div className="svc__more">
                    <div>
                      <p>{t.text}</p>
                      <span className="group/pill inline-flex h-11 items-center gap-3.5 rounded-full bg-white pr-1.5 pl-5 text-sm font-semibold whitespace-nowrap text-noir-900 shadow-[0_0_0_1.5px_rgba(255,255,255,.2)] transition-shadow duration-300 ease-[var(--ease)] hover:shadow-[0_12px_30px_-12px_rgba(127,35,224,.8),0_0_0_1.5px_rgba(255,255,255,.3)]">
                        Book an Appointment
                        <span className="grid size-[30px] place-items-center rounded-full bg-violet-800 text-white transition-[transform,background-color] duration-[280ms] ease-[var(--ease)] group-hover/pill:translate-x-[3px] group-hover/pill:bg-violet-500">
                          <Icon name="arrow" className="size-4" />
                        </span>
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
