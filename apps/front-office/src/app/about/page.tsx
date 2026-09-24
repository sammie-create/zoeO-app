import Link from "next/link";
import { CountUp } from "@/components/shared/count-up";
import { Icon } from "@/components/shared/icon";
import { Reveal } from "@/components/shared/reveal";
import { getAboutStats } from "@/lib/queries";

export const metadata = { title: "About Us — ZoeO Allure" };

const journeySteps = [
  { title: "Book Your Session", text: "Easily schedule online. Select your artist and specific customization options." },
  { title: "Warm Welcome & Consultation", text: "Our concierge welcomes you with signature drinks for a detailed style consult." },
  { title: "The Customized Treatment", text: "Premium treatments customized exclusively for your unique texture and preference." },
  { title: "Relaxation & Rejuvenation", text: "Leave completely refreshed, carrying the signature Allure confidence home." },
];

const values = [
  { title: "Quality", text: "Products and services held to one standard — the one we would accept ourselves.", img: "after-portrait" },
  { title: "Community", text: "Empowering the artists, stylists and technicians who make this industry work.", img: "svc-wig-sq" },
  { title: "Convenience", text: "Everything within reach — shop, book and collect without the running around.", img: "p-wig-revamp-kit" },
];

const chapters = [
  { yr: "2021", title: "Where it started", text: "Zoe Onirun begins with wigs and wig revamp — turning weaves women already owned into beautiful, wearable units." },
  { yr: "2023", title: "Registered as a company", text: "Zoe Onirun becomes a limited liability company. Clients buy wigs from us or bring their own for transformation." },
  { yr: "2024", title: "ZoeO Bridals & Artistry", text: "Our brides asked for more. Bridal hair, makeup and gele come together under one trusted team." },
  { yr: "2025", title: "ZoeO Allure is born", text: "Registered on May 5, 2025 — the umbrella brand. Lash extensions, nails and brow lamination join the family." },
  { yr: "2026", title: "Products & experiences", text: "Four product lines launch at the Beauty Lounge Exhibition in November. The story continues.", now: true },
];

export default async function AboutPage() {
  const stats = await getAboutStats();

  return (
    <>
      <section className="relative flex min-h-[460px] items-end overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element -- static marketing asset */}
        <img src="/img/hero-about.webp" alt="Woman with long braids and glossy makeup" className="absolute inset-0 size-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
        <div className="relative flex w-full flex-col gap-4 p-8 sm:p-14">
          <Reveal as="span" className="block text-sm font-bold text-violet-300 uppercase">
            + About us
          </Reveal>
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <Reveal as="h1" className="font-display block max-w-2xl text-3xl font-bold sm:text-4xl lg:text-[52px]">We are not just one thing — and that&apos;s the point</Reveal>
            <Reveal as="p" delay={400} className="max-w-sm text-white/85">
              Delivering high-end products and exceptional aesthetic experiences harmoniously. Beauty should never
              require compromise or unnecessary stress.
            </Reveal>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1280px] px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[.9fr_1.1fr]">
          <div>
            <Reveal as="span" className="block text-sm font-bold text-violet-400 uppercase">
              The vision &amp; concept
            </Reveal>
            <Reveal as="h2" className="font-display mt-3 block text-3xl font-bold sm:text-4xl">An Umbrella Ecosystem of Beauty</Reveal>
            <Reveal as="p" className="mt-4 text-noir-300">
              ZoeO Allure is an umbrella brand and a growing beauty ecosystem: artistry, hair, products, experiences
              and the innovations still to come. Not a makeup brand, not a bridal brand — a one-stop beauty
              destination where several expressions of beauty coexist.
            </Reveal>
            <Reveal className="mt-6">
              <Link href="/services" className="inline-flex h-12 items-center rounded-full border border-white/20 px-6 text-sm font-bold uppercase hover:bg-white/6">
                Explore our services
              </Link>
            </Reveal>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {stats.length === 0
              ? null
              : stats.map((s, i) => (
                  <Reveal key={s.id} delay={i * 90} className="rounded-2xl border border-white/10 p-6">
                    <div className="font-display text-4xl font-bold text-violet-300">
                      <CountUp value={s.figure} />
                    </div>
                    <h4 className="mt-2 font-bold">{s.title}</h4>
                    <p className="mt-1 text-[13px] text-noir-300">{s.description}</p>
                  </Reveal>
                ))}
          </div>
        </div>
      </section>

      <section className="bg-noir-800/60 px-4 py-16 text-center sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <Reveal as="span" className="block text-sm font-bold text-violet-400 uppercase">
          Our philosophy
        </Reveal>
        <Reveal as="h2" className="font-display mx-auto mt-3 block max-w-3xl text-3xl font-bold sm:text-4xl">The Harmony Between Expert Beauty Care & Exceptionally Simple Luxury.</Reveal>
        <Reveal as="p" className="mx-auto mt-5 max-w-[560px] text-noir-300">
          Our expert stylists are highly trained in a variety of techniques, ensuring your beauty experience is
          perfectly customized to your style, preference, and occasion.
        </Reveal>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-2">
        <div className="relative min-h-[360px]">
          {/* eslint-disable-next-line @next/next/no-img-element -- static marketing asset */}
          <img src="/img/salon-journey.webp" alt="Warmly lit spa suite with twin basins" className="absolute inset-0 size-full object-cover" />
        </div>
        <div className="flex flex-col justify-center gap-8 bg-noir-800 p-8 sm:p-14">
          <div>
            <Reveal as="span" className="block text-sm font-bold text-violet-400 uppercase">
              How it works
            </Reveal>
            <Reveal as="h2" className="font-display mt-3 block text-3xl font-bold">The Salon Journey</Reveal>
          </div>
          <ol className="flex flex-col gap-6 border-l border-white/10 pl-6">
            {journeySteps.map((s, i) => (
              <Reveal key={s.title} as="li" delay={i * 150} className="relative">
                <span className="absolute top-0.5 -left-[31px] grid size-6 place-items-center rounded-full bg-violet-500 text-[11px] font-bold">
                  {i + 1}
                </span>
                <strong className="block">{s.title}</strong>
                <span className="text-[13px] text-noir-300">{s.text}</span>
              </Reveal>
            ))}
          </ol>
          <Reveal>
            <Link href="/services#book" className="inline-flex h-12 w-fit items-center rounded-full bg-violet-500 px-6 text-sm font-bold text-white uppercase">
              Book your session
            </Link>
          </Reveal>
        </div>
      </section>

      <section className="bg-noir-800/60 px-4 py-20 text-center sm:px-6 lg:px-8">
        <Reveal className="mx-auto max-w-[720px]">
          <span aria-hidden className="font-display text-6xl text-violet-500/40">
            &ldquo;
          </span>
          <blockquote className="font-display text-2xl leading-[1.4] sm:text-3xl">
            Step away from the ordinary &amp; into a dedicated moment designed solely for you.
          </blockquote>
          <cite className="mt-4 block text-sm text-noir-400 not-italic">Helen O. Adetunbi (Founder)</cite>
        </Reveal>
      </section>

      <section className="px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <Reveal as="h2" className="font-display mb-10 block text-center text-3xl font-bold sm:text-4xl">What We Value</Reveal>
        <div className="mx-auto grid max-w-[1280px] grid-cols-1 gap-6 sm:grid-cols-3">
          {values.map((v, i) => (
            <Reveal key={v.title} delay={i * 120} className="overflow-hidden rounded-2xl bg-white/5">
              <div className="relative aspect-[4/3]">
                {/* eslint-disable-next-line @next/next/no-img-element -- static marketing asset */}
                <img src={`/img/${v.img}.webp`} alt="" className="absolute inset-0 size-full object-cover" />
              </div>
              <div className="p-6">
                <h4 className="font-display text-xl font-bold">{v.title}</h4>
                <p className="mt-1.5 text-[14px] text-noir-300">{v.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section id="story" className="bg-noir-800/60 px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-[1280px]">
          <div className="mb-14 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_1.2fr]">
            <div>
              <Reveal as="span" className="block text-sm font-bold text-violet-400 uppercase">
                Our story
              </Reveal>
              <Reveal as="h2" className="font-display mt-3 block text-3xl font-bold">How we got here — one chapter at a time.</Reveal>
            </div>
            <Reveal as="p" className="text-noir-300">
              Every chapter of ZoeO Allure has been shaped by a simple principle:{" "}
              <strong className="text-white">listen to the needs of the women we serve, solve real beauty
              problems, and keep improving the experience.</strong> What began with wigs and wig revamp has grown
              into a beauty brand of products, services and experiences.
            </Reveal>
          </div>

          <div className="relative grid grid-cols-1 gap-8 border-t border-white/10 pt-10 sm:grid-cols-5">
            {chapters.map((c, i) => (
              <Reveal key={c.yr} delay={i * 100} className="relative">
                <span className="absolute -top-[46px] left-0 size-2.5 rounded-full bg-violet-400" />
                <div className="font-display text-2xl font-bold text-violet-300">{c.yr}</div>
                <h3 className="mt-2 font-bold">{c.title}</h3>
                <p className="mt-1.5 text-[13px] text-noir-300">{c.text}</p>
                {c.now && (
                  <span className="mt-2 inline-block rounded-full bg-violet-500/15 px-2.5 py-0.5 text-[11px] font-bold text-violet-300">
                    Now
                  </span>
                )}
              </Reveal>
            ))}
          </div>

          <Reveal className="mt-14 border-t border-white/10 pt-10 text-center">
            <blockquote className="font-display mx-auto max-w-2xl text-xl leading-[1.5] sm:text-2xl">
              &ldquo;Our journey has never simply been about adding more services. It&apos;s about understanding your
              beauty journey — and finding better ways to serve it.&rdquo;
            </blockquote>
            <Link href="/blog/our-journey" className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-violet-300">
              Read the full story <Icon name="arrow" className="size-4" />
            </Link>
          </Reveal>
        </div>
      </section>

      <section id="founder" className="grid grid-cols-1 lg:grid-cols-2">
        <div className="relative min-h-[420px]">
          {/* eslint-disable-next-line @next/next/no-img-element -- static marketing asset */}
          <img src="/img/expert-helen.webp" alt="Helen O. Adetunbi, Creative Director and Founder" className="absolute inset-0 size-full object-cover" style={{ objectPosition: "50% 18%" }} />
        </div>
        <div className="flex flex-col justify-center gap-4 bg-champagne-100/5 p-8 sm:p-14">
          <Reveal as="span" className="block text-sm font-bold text-champagne-300 uppercase">
            The artist behind it all
          </Reveal>
          <Reveal as="h2" className="font-display block text-3xl font-bold sm:text-4xl">Meet your founder</Reveal>
          <Reveal className="mt-1">
            <div className="font-semibold">Helen O. Adetunbi</div>
            <div className="text-[13px] text-noir-400">Creative Director &amp; Founder</div>
          </Reveal>
          <Reveal as="p" className="text-noir-300">
            Helen started Zoe Onirun with a simple observation: women had weaves that could become beautiful wigs,
            but no one they trusted to make the transformation. She became that someone.
          </Reveal>
          <Reveal as="p" className="text-noir-300">
            Every chapter since — bridal artistry, lashes, nails, products — came from listening to the women she
            serves. <strong className="text-white">Beauty, made easier. All in one place.</strong>
          </Reveal>
          <Reveal className="mt-4 flex flex-wrap gap-4">
            <Link href="/services#book" className="inline-flex h-12 items-center rounded-full bg-champagne-300 px-6 text-sm font-bold text-noir-900 uppercase">
              Book an appointment
            </Link>
            <Link href="/blog/our-journey" className="inline-flex items-center gap-1.5 text-sm font-semibold text-violet-300">
              Read her story <Icon name="arrow" className="size-4" />
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}
