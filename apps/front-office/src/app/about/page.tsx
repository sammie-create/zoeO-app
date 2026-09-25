import Link from "next/link";
import { Chapters } from "@/components/about/chapters";
import { StepsProgress } from "@/components/about/steps-progress";
import { ValuesFocus } from "@/components/about/values-focus";
import { CountUp } from "@/components/shared/count-up";
import { Icon } from "@/components/shared/icon";
import { ImgReveal, Reveal } from "@/components/shared/reveal";
import { getAboutStats, getProductBrands } from "@/lib/queries";

export const metadata = { title: "About Us — ZoeO Allure" };

const journeySteps = [
  { title: "Book Your Session", text: "Easily schedule online. Select your artist and specific customization options." },
  { title: "Warm Welcome & Consultation", text: "Our concierge welcomes you with signature drinks for a detailed style consult." },
  { title: "The Customized Treatment", text: "Premium treatments customized exclusively for your unique texture and preference." },
  { title: "Relaxation & Rejuvenation", text: "Leave completely refreshed, carrying the signature Allure confidence home." },
];

const values = [
  {
    title: "Quality",
    text: "Products and services held to one standard - the one we would accept ourselves.",
    img: "after-portrait",
    imgPosition: "50% 20%",
  },
  { title: "Community", text: "Empowering the artists, stylists and technicians who make this industry work.", img: "svc-wig-sq" },
  { title: "Convenience", text: "Everything within reach - shop, book and collect without the running around.", img: "p-wig-revamp-kit" },
];

const chapters = [
  { yr: "2021", title: "Where it started", text: "Zoe Onirun begins with wigs and wig revamp — turning weaves women already owned into beautiful, wearable units.", img: "line-zoe-onirun" },
  { yr: "2023", title: "Registered as a company", text: "Zoe Onirun becomes a limited liability company. Clients buy wigs from us or bring their own for transformation.", img: "p-body-wave-wig", imgPosition: "50% 25%" },
  { yr: "2024", title: "ZoeO Bridals & Artistry", text: "Our brides asked for more. Bridal hair, makeup and gele come together under one trusted team.", img: "line-bridals", imgPosition: "50% 30%" },
  { yr: "2025", title: "ZoeO Allure is born", text: "Registered on May 5, 2025 — the umbrella brand. Lash extensions, nails and brow lamination join the family.", img: "expert-helen", imgPosition: "50% 20%" },
  { yr: "2026", title: "Products & experiences", text: "Four product lines launch at the Beauty Lounge Exhibition in November. The story continues.", img: "gallery-3", now: true },
];

const marqueeWords = ["Listen", "Solve", "Improve", "Repeat"];

export default async function AboutPage() {
  const [stats, brands] = await Promise.all([getAboutStats(), getProductBrands()]);

  return (
    <>
      <section className="about-hero">
        <div className="about-hero__frame">
          {/* eslint-disable-next-line @next/next/no-img-element -- static marketing asset */}
          <img src="/img/hero-about.webp" alt="Woman with long braids and glossy makeup" />
          <Reveal as="span" className="block text-sm font-bold text-violet-300 uppercase">
            + About us
          </Reveal>
          <div className="about-hero__row">
            <Reveal as="h1" className="font-display block text-[clamp(36px,4.2vw,62px)] leading-[1.12] font-bold">
              We are not just one thing — and <em className="text-violet-300 not-italic">that&apos;s the point</em>
            </Reveal>
            <Reveal as="p" delay={400}>
              Delivering high-end products and exceptional aesthetic experiences harmoniously. Beauty should never
              require compromise or unnecessary stress.
            </Reveal>
          </div>
        </div>
      </section>

      <section className="py-[clamp(64px,9vw,120px)]">
        <div className="eco mx-auto max-w-[calc(1280px_+_clamp(16px,5vw,80px)*2)] px-[clamp(16px,5vw,80px)]">
          <div>
            <Reveal as="span" className="block text-sm font-bold text-violet-400 uppercase">
              The vision &amp; concept
            </Reveal>
            <Reveal as="h2" className="font-display mt-[18px] mb-7 block text-[clamp(32px,3.4vw,48px)] leading-[1.08] font-bold">
              An Umbrella Ecosystem of Beauty
            </Reveal>
            <Reveal as="p">
              ZoeO Allure is an umbrella brand and a growing beauty ecosystem: artistry, hair, products, experiences
              and the innovations still to come. Not a makeup brand, not a bridal brand — a one-stop beauty
              destination where several expressions of beauty coexist.
            </Reveal>
            <Reveal>
              <Link
                href="#lines"
                className="mt-2 inline-flex h-12 items-center gap-2 rounded-full border border-white/20 px-6 text-sm font-bold uppercase hover:bg-white/6"
              >
                Explore the lines <Icon name="arrow" className="size-4" />
              </Link>
            </Reveal>
          </div>
          <div className="stat-grid">
            {stats.map((s, i) => (
              <Reveal key={s.id} delay={i * 100} className="stat">
                {s.chip && <span className="chip chip--violet">{s.chip}</span>}
                <div className="stat__num">
                  <CountUp value={s.figure} from={s.count_from ?? 0} />
                </div>
                <h4>{s.title}</h4>
                <p>{s.description}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="philo bg-noir-800/60 px-4 py-[clamp(64px,9vw,120px)] sm:px-6 lg:px-8">
        <Reveal as="span" className="block text-sm font-bold text-violet-400 uppercase">
          Our philosophy
        </Reveal>
        <Reveal as="h2" className="h1 font-display block">
          The Harmony Between Expert Beauty Care{" "}
          {/* eslint-disable-next-line @next/next/no-img-element -- static marketing asset */}
          <img src="/img/elixir.webp" alt="" />
          <br />
          &amp; Exceptionally Simple Luxury.
        </Reveal>
        <Reveal as="p">
          Our expert stylists are highly trained in a variety of techniques, ensuring your beauty experience is
          perfectly customized to your style, preference, and occasion.
        </Reveal>
      </section>

      <section className="journey">
        <ImgReveal className="journey__img">
          {/* eslint-disable-next-line @next/next/no-img-element -- static marketing asset */}
          <img src="/img/salon-journey.webp" alt="Warmly lit spa suite with twin basins" />
        </ImgReveal>
        <div className="journey__body">
          <div>
            <Reveal as="span" className="block text-sm font-bold text-violet-400 uppercase">
              How it works
            </Reveal>
            <Reveal as="h2" className="h1 font-display block">
              The Salon Journey
            </Reveal>
          </div>
          <StepsProgress>
            {journeySteps.map((s, i) => (
              <Reveal key={s.title} delay={i * 150} className="step">
                <span className="step__n">{i + 1}</span>
                <div>
                  <h4>{s.title}</h4>
                  <p>{s.text}</p>
                </div>
              </Reveal>
            ))}
          </StepsProgress>
          <Reveal className="mt-11">
            <Link
              href="/services#book"
              className="inline-flex h-12 w-fit items-center rounded-full bg-violet-500 px-6 text-sm font-bold text-white uppercase hover:bg-violet-600"
            >
              Book your session
            </Link>
          </Reveal>
        </div>
      </section>

      <section className="founder-q bg-noir-800/60 px-4 py-[clamp(64px,9vw,120px)] sm:px-6 lg:px-8">
        <Reveal>
          <span aria-hidden className="qmark">
            &ldquo;
          </span>
          <blockquote>Step away from the ordinary &amp; into a dedicated moment designed solely for you.</blockquote>
          <cite>Helen O. Adetunbi (Founder)</cite>
          {/* eslint-disable-next-line @next/next/no-img-element -- static marketing asset */}
          <img src="/img/founder-round.webp" alt="Helen O. Adetunbi" />
        </Reveal>
      </section>

      <section className="px-4 py-[clamp(64px,9vw,120px)] sm:px-6 lg:px-8">
        <div className="mx-auto max-w-[1280px]">
          <ValuesFocus values={values} />
        </div>
      </section>

      <section id="story" className="ed-light story2">
        <div className="story2__head mx-auto max-w-[1280px] px-[clamp(16px,5vw,80px)]">
          <div>
            <Reveal as="span" className="overline block text-[13px] font-bold tracking-[.02em] uppercase">
              Our story
            </Reveal>
            <Reveal as="h2" className="ed-serif block">
              How we got here — <em className="it not-italic">one chapter at a time.</em>
            </Reveal>
          </div>
          <Reveal as="p">
            Every chapter of ZoeO Allure has been shaped by a simple principle:{" "}
            <strong>listen to the needs of the women we serve, solve real beauty problems, and keep improving the
            experience.</strong> What began with wigs and wig revamp has grown into a beauty brand of products,
            services and experiences.
          </Reveal>
        </div>
        <div className="ed-marquee ed-marquee--sm" aria-hidden>
          <div className="ed-marquee__track">
            {Array.from({ length: 6 }).flatMap((_, i) =>
              marqueeWords.map((w) => <span key={`${i}-${w}`}>{w}</span>),
            )}
          </div>
        </div>
        <div className="mx-auto max-w-[1280px]">
          <Chapters chapters={chapters} />
        </div>
        <div className="story2__foot">
          <blockquote>
            &ldquo;Our journey has never simply been about adding more services. It&apos;s about understanding your
            beauty journey — and finding better ways to serve it.&rdquo;
          </blockquote>
          <Link href="/blog/our-journey" className="ed-link">
            Read the full story <Icon name="arrow" className="size-4" />
          </Link>
        </div>
      </section>

      <section id="lines" className="ed-light dual">
        <div className="mx-auto max-w-[1280px] px-[clamp(16px,5vw,80px)]">
          <div className="dual__head">
            <div>
              <Reveal as="span" className="overline block text-[13px] font-bold tracking-[.02em] uppercase">
                Our dual passion
              </Reveal>
              <Reveal as="h2" className="caps-display block">
                Two lines. <em className="it">One</em> standard <br />
                of <em className="it">care.</em>
              </Reveal>
              <Reveal as="p">
                Before there was an umbrella, there were two crafts: making good hair days possible, and making
                brides feel unforgettable. Everything ZoeO Allure offers today grew out of these two lines.
              </Reveal>
              <Reveal as="span" className="dual__sig">
                — two ways we make beauty easier
              </Reveal>
            </div>
            <Reveal variant="zoom" className="vinyl" aria-hidden />
          </div>

          <div className="dual__lines">
            <article className="dline">
              <Reveal className="dline__photo">
                <figure className="polaroid">
                  <span className="tape" />
                  {/* eslint-disable-next-line @next/next/no-img-element -- static marketing asset */}
                  <img src="/img/line-zoe-onirun.webp" alt="Silky straight wig on a glass mannequin" />
                  <figcaption>Zoe Onirun — est. 2021</figcaption>
                </figure>
              </Reveal>
              <Reveal as="div" className="dline__meta">
                01 · Wigs &amp; hair
              </Reveal>
              <h3 className="caps-display">
                Zoe <em className="it">Onirun</em>
              </h3>
              <Reveal as="div" className="dline__tag">
                Good hair days live here.
              </Reveal>
              <Reveal as="p">
                Rooted in outstanding wig design, hair care restoration and flawless custom lace installation. Buy a
                unit from us or bring your own — we build with structural longevity and unparalleled craftsmanship.
              </Reveal>
              <Reveal as="div" className="dline__offers">
                <span>Wig sales</span>
                <span>Wig revamp</span>
                <span>Lace installation</span>
                <span>Styling</span>
              </Reveal>
              <Reveal as="div" className="dline__ctas">
                <Link href="/shop?cat=wigs" className="inline-flex h-[46px] items-center rounded-full bg-violet-500 px-6 text-sm font-bold text-white hover:bg-violet-600">
                  Shop wigs
                </Link>
                <Link href="/services?service=wig-revamp#book" className="ed-link">
                  Book a revamp <Icon name="arrow" className="size-4" />
                </Link>
              </Reveal>
            </article>

            <article className="dline">
              <Reveal delay={120} className="dline__photo">
                <figure className="polaroid">
                  <span className="tape" style={{ rotate: "5deg" }} />
                  {/* eslint-disable-next-line @next/next/no-img-element -- static marketing asset */}
                  <img
                    src="/img/line-bridals.webp"
                    alt="Bride in a lace veil with soft glam makeup"
                    style={{ objectPosition: "50% 30%" }}
                  />
                  <figcaption>Bridals &amp; Artistry — est. 2024</figcaption>
                </figure>
              </Reveal>
              <Reveal as="div" className="dline__meta">
                02 · Bridal beauty
              </Reveal>
              <h3 className="caps-display">
                ZoeO <em className="it">Bridals &amp; Artistry</em>
              </h3>
              <Reveal as="div" className="dline__tag">
                Look like yourself, unforgettable.
              </Reveal>
              <Reveal as="p">
                Bridal hair, makeup and gele from one trusted team — so the most important morning of your life has
                one less thing to coordinate. Bespoke, high-end and built around your grace.
              </Reveal>
              <Reveal as="div" className="dline__offers">
                <span>Bridal hair</span>
                <span>Makeup</span>
                <span>Gele</span>
                <span>Trials</span>
              </Reveal>
              <Reveal as="div" className="dline__ctas">
                <Link href="/services?service=bridal#book" className="inline-flex h-[46px] items-center rounded-full bg-violet-500 px-6 text-sm font-bold text-white hover:bg-violet-600">
                  Book bridal
                </Link>
                <Link href="/blog/bridal-checklist" className="ed-link">
                  Bridal checklist <Icon name="arrow" className="size-4" />
                </Link>
              </Reveal>
            </article>
          </div>
        </div>
        {brands.length > 0 && (
          <div className="brandband">
            <Reveal
              variant="fade"
              as="div"
              className="brandband__inner mx-auto max-w-[1280px] px-[clamp(16px,5vw,80px)]"
            >
              <small>Under the ZoeO umbrella</small>
              {brands.map((brand, i) => (
                <Link key={brand} href={`/shop?brand=${encodeURIComponent(brand)}`} className={`wm wm--${(i % 5) + 1}`}>
                  {brand}
                </Link>
              ))}
            </Reveal>
          </div>
        )}
      </section>

      <section id="founder" className="founder2">
        <div className="founder2__inner mx-auto max-w-[1280px] px-[clamp(16px,5vw,80px)]">
          <Reveal variant="fade" className="founder2__art">
            <figure className="polaroid">
              <span className="tape" />
              {/* eslint-disable-next-line @next/next/no-img-element -- static marketing asset */}
              <img
                src="/img/expert-helen.webp"
                alt="Helen O. Adetunbi, Creative Director and Founder"
                style={{ objectPosition: "50% 18%" }}
              />
              <figcaption>Helen, Lagos</figcaption>
            </figure>
            <div className="film" aria-hidden>
              <span>ZOEO · 2026</span>
              {/* eslint-disable-next-line @next/next/no-img-element -- static marketing asset */}
              <img src="/img/founder.webp" alt="" style={{ objectPosition: "40% 20%" }} />
              {/* eslint-disable-next-line @next/next/no-img-element -- static marketing asset */}
              <img src="/img/founder-round.webp" alt="" />
              {/* eslint-disable-next-line @next/next/no-img-element -- static marketing asset */}
              <img src="/img/founder.webp" alt="" style={{ objectPosition: "40% 75%" }} />
            </div>
          </Reveal>
          <div>
            <Reveal as="span" className="overline block text-[13px] font-bold tracking-[.02em] text-champagne-300 uppercase">
              The artist behind it all
            </Reveal>
            <Reveal as="h2" className="caps-display block">
              Meet <em className="it">your</em> founder
            </Reveal>
            <Reveal as="div" className="founder2__name">
              Helen O. Adetunbi
            </Reveal>
            <Reveal as="div" className="founder2__role">
              Creative Director &amp; Founder
            </Reveal>
            <Reveal as="p">
              Helen started Zoe Onirun with a simple observation: women had weaves that could become beautiful wigs,
              but no one they trusted to make the transformation. She became that someone.
            </Reveal>
            <Reveal as="p">
              Every chapter since — bridal artistry, lashes, nails, products — came from listening to the women she
              serves. <strong>Beauty, made easier. All in one place.</strong>
            </Reveal>
            <Reveal as="span" className="founder2__sig">
              Helen
            </Reveal>
            <Reveal as="div" className="founder2__ctas">
              <Link
                href="/services#book"
                className="inline-flex h-12 items-center rounded-full bg-champagne-300 px-6 text-sm font-bold text-noir-900 uppercase hover:bg-champagne-100"
              >
                Book an appointment
              </Link>
              <Link href="/blog/our-journey" className="ed-link">
                Read her story <Icon name="arrow" className="size-4" />
              </Link>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
