import Link from "next/link";
import { Suspense } from "react";
import { FaqAccordion } from "@/components/shared/faq-accordion";
import { Icon } from "@/components/shared/icon";
import { Reveal } from "@/components/shared/reveal";
import { BookingSection } from "@/components/services/booking-section";
import { ServiceMenu } from "@/components/services/service-menu";
import { ServicesTestimonials } from "@/components/services/services-testimonials";
import { getFaqs, getServices, getTestimonials } from "@/lib/queries";
import { MoneyLabel } from "@/components/shared/money-label";

export const metadata = { title: "Beauty Services — ZoeO Allure" };

const gallery = ["nails-art", "gallery-5", "client-1", "gallery-3", "line-zoe-onirun"];

const bigMarquee = ["The ZoeO Experience.", "Beauty in all its forms."];
const smallMarquee = ["Wigs & revamp", "Bridal artistry", "Gele styling", "Lash extensions", "Nails", "Wig installation"];
const closingMarquee = ["Your chair is waiting.", "Beauty, made easier."];

const forYouPoints = [
  "A busy professional craving beauty that fits your day-to-day life.",
  "A bride who wants hair, makeup and gele from one trusted team.",
  "Holding onto a favourite unit that deserves a second life.",
  "Tired of coordinating five different vendors for one event.",
];
const bigDayPoints = [
  "Bridal hair styling, wig installation and trial sessions.",
  "Full bridal makeup — and touch-ups for your second look.",
  "Gele tying for you and your bridal party.",
  "Lashes and nails in the week before, on one timeline.",
];

function Marquee({ words, reverse = false }: { words: string[]; reverse?: boolean }) {
  return (
    <div className="ed-marquee" aria-hidden>
      <div className={`ed-marquee__track ${reverse ? "[animation-direction:reverse]" : ""}`}>
        {Array.from({ length: 4 }).flatMap((_, i) =>
          words.map((w, wi) => (
            <span key={`${i}-${wi}`}>
              {wi === words.length - 1 ? <em className="it not-italic">{w}</em> : w}
            </span>
          )),
        )}
      </div>
    </div>
  );
}

function SmallMarquee() {
  return (
    <div className="ed-marquee ed-marquee--sm" aria-hidden>
      <div className="ed-marquee__track">
        {Array.from({ length: 6 }).flatMap((_, i) => smallMarquee.map((w) => <span key={`${i}-${w}`}>{w}</span>))}
      </div>
    </div>
  );
}

export default async function ServicesPage() {
  const [services, testimonials, faqItems] = await Promise.all([getServices(), getTestimonials(), getFaqs()]);

  const bridalService = services.find((s) => s.category === "Bridal") ?? services[0];
  const cheapest = services.reduce<typeof services[number] | undefined>(
    (min, s) => (!min || s.price < min.price ? s : min),
    undefined,
  );

  return (
    <>
      <section className="svc-hero">
        {/* eslint-disable-next-line @next/next/no-img-element -- static marketing asset */}
        <img src="/img/glow-banner.webp" alt="Close-up of a woman with glowing skin and glossy red lips" />
        <div className="svc-hero__body">
          <Reveal
            variant="fade"
            as="span"
            className="overline overline--wide inline-flex items-center gap-2 text-[13px] font-semibold tracking-[.18em] uppercase"
          >
            <span className="size-1.5 rounded-full bg-current" />
            Now booking · Lagos
          </Reveal>
          <Reveal as="h1" className="ed-serif block">
            Beauty, made easier. <br />
            <em className="it not-italic">All in one place.</em>
          </Reveal>
          <Reveal as="p" delay={300}>
            Wigs, bridal glam, gele, lashes and nails — handled by one trusted team, so you spend less time
            coordinating and more time enjoying the moment.
          </Reveal>
          <Reveal as="p" delay={380}>
            <strong>One destination. Multiple beauty needs. One less thing to worry about.</strong>
          </Reveal>
          <Reveal delay={460} className="svc-hero__ctas">
            <Link href="#book" className="ed-link">
              Book your session <Icon name="arrow" className="size-4" />
            </Link>
            <Link href="#menu" className="ed-link">
              Explore the menu <Icon name="arrow" className="size-4" />
            </Link>
          </Reveal>
        </div>
      </section>
      <div className="ed-band">Book · Relax · Glow</div>

      <Marquee words={bigMarquee} />

      <section className="py-[clamp(64px,9vw,120px)] px-4 sm:px-6 lg:px-8">
        <div className="ed-intro mx-auto max-w-[1280px]">
          <div className="ed-intro__imgs">
            <figure>
              {/* eslint-disable-next-line @next/next/no-img-element -- static marketing asset */}
              <img src="/img/portrait-braids.webp" alt="Woman with long braids and glossy makeup" />
            </figure>
            <figure>
              {/* eslint-disable-next-line @next/next/no-img-element -- static marketing asset */}
              <img
                src="/img/line-bridals.webp"
                alt="Bride with veil and soft glam"
                style={{ objectPosition: "50% 30%" }}
              />
            </figure>
          </div>
          <div className="ed-intro__text">
            <Reveal as="p">
              Whether it&apos;s your wedding day, a special event, a photoshoot or your everyday beauty needs, you
              shouldn&apos;t have to manage a logistics team to look the way you want. ZoeO brings every beauty
              service together under one brand — from bridal makeup and hair to wigs, nails, lashes, gele styling and
              more.
            </Reveal>
            <Reveal as="p" className="ed-serif it-line">
              Sit back. We&apos;ve got you.
            </Reveal>
            <Reveal>
              <Link href="#menu" className="ed-link">
                Explore the experience <Icon name="arrow" className="size-4" />
              </Link>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="px-4 pb-[clamp(64px,8vw,110px)] sm:px-6 lg:px-8">
        <div className="mx-auto max-w-[1280px]">
          <Reveal variant="fade" className="ed-feature__img">
            <div>
              {/* eslint-disable-next-line @next/next/no-img-element -- static marketing asset */}
              <img src="/img/svc-lash.webp" alt="Close-up of full, feathery lash extensions" />
            </div>
            <Link href="#book" className="ed-badge" aria-label="Book in under a minute">
              <svg className="ring" viewBox="0 0 100 100" aria-hidden>
                <defs>
                  <path id="badge-ring" d="M50,50 m-38,0 a38,38 0 1,1 76,0 a38,38 0 1,1 -76,0" />
                </defs>
                <text>
                  <textPath href="#badge-ring" textLength={236} lengthAdjust="spacing">
                    Book in under a minute ·
                  </textPath>
                </text>
              </svg>
              <Icon name="calendar" className="icon" />
            </Link>
          </Reveal>
          <div className="ed-feature__row">
            <Reveal as="h2" className="ed-serif block">
              The Allure <em className="it not-italic">Menu.</em>
            </Reveal>
            <Reveal as="p">
              Every service is performed by artists trained across techniques, so your look is customised to your
              texture, your style and your occasion. Pick one service or build a full day of beauty — hair, face and
              finishing touches, coordinated for you.
            </Reveal>
          </div>
        </div>
      </section>

      <SmallMarquee />

      <section id="menu" className="ed-dark">
        <div className="mx-auto max-w-[1280px] px-[clamp(16px,5vw,80px)] pt-[clamp(40px,5vw,72px)] pb-[clamp(64px,8vw,110px)]">
          <div className="section-head">
            <div>
              <Reveal as="span" className="overline block text-[13px] font-bold tracking-[.02em] uppercase">
                Premium in-salon &amp; home service
              </Reveal>
              <Reveal as="h2" className="h1 ed-serif mt-3.5 block">
                Choose your <em className="it not-italic">service</em>
              </Reveal>
            </div>
            <Reveal as="span" className="avail">
              <span className="pulse-dot size-2 animate-pulse rounded-full bg-status-booked" />
              3 slots left today
            </Reveal>
          </div>
          <ServiceMenu services={services} />
        </div>
      </section>

      <section className="ed-blocks">
        <div className="ed-block ed-block--petal">
          <h3>
            ZoeO is perfect for you <br />
            <em className="it not-italic">if you&apos;re:</em>
          </h3>
          <ul>
            {forYouPoints.map((p, i) => (
              <Reveal key={p} as="li" delay={i * 80}>
                {p}
              </Reveal>
            ))}
          </ul>
        </div>
        <div className="ed-block ed-block--img">
          {/* eslint-disable-next-line @next/next/no-img-element -- static marketing asset */}
          <img src="/img/value-community.webp" alt="Portrait with a gold statement collar" style={{ objectPosition: "50% 30%" }} />
        </div>
        <div className="ed-block ed-block--img bw">
          {/* eslint-disable-next-line @next/next/no-img-element -- static marketing asset */}
          <img src="/img/pureglow-banner.webp" alt="Smiling woman, black and white portrait" style={{ objectPosition: "50% 30%" }} />
        </div>
        <div className="ed-block ed-block--champ">
          <h3>
            Planning a big day? <br />
            <em className="it not-italic">We handle:</em>
          </h3>
          <ul>
            {bigDayPoints.map((p, i) => (
              <Reveal key={p} as="li" delay={i * 80}>
                {p}
              </Reveal>
            ))}
          </ul>
        </div>
      </section>
      <div className="ed-band ed-band--violet">A chair that&apos;s already ready for you</div>

      <section className="ed-light">
        <div className="ed-pk-head">
          <Reveal as="span" className="overline overline--wide block text-[13px] font-bold tracking-[.02em] uppercase">
            Ways to book
          </Reveal>
          <h2 className="ed-serif mt-3">Choose your experience</h2>
          <Reveal as="p">One visit, a full bridal team, or a year of priority care.</Reveal>
        </div>
        <div className="mx-auto max-w-[1280px]">
          <div className="ed-pk">
            <Reveal as="div" className="ed-pk__col">
              <figure>
                {/* eslint-disable-next-line @next/next/no-img-element -- static marketing asset */}
                <img src="/img/hero-home.webp" alt="Woman with glowing, finished makeup" style={{ objectPosition: "62% 30%" }} />
              </figure>
              <h3>Single Visit</h3>
              <div className="sub">One service, done beautifully</div>
              <p>Perfect for a first experience or a refresh when you need it most. Choose any service from the menu.</p>
              <span className="ed-dot" />
              {cheapest && (
                <div className="price">
                  From <span><MoneyLabel ngn={cheapest.price} /></span>
                </div>
              )}
              <Link href="#book" className="ed-link">
                Book a session
              </Link>
            </Reveal>
            <Reveal as="div" delay={120} className="ed-pk__col">
              <figure>
                {/* eslint-disable-next-line @next/next/no-img-element -- static marketing asset */}
                <img src="/img/p-bridal-updo.webp" alt="Pinned bridal updo with pearl pins" />
              </figure>
              <h3>The Bridal Package</h3>
              <div className="sub">Hair, makeup &amp; gele — one team</div>
              <p>Trials, a wedding-day timeline and your finishing touches, coordinated so you never chase a vendor.</p>
              <span className="ed-dot" />
              {bridalService && (
                <div className="price">
                  From <span><MoneyLabel ngn={bridalService.price} /></span>
                </div>
              )}
              <Link href={bridalService ? `/services?service=${bridalService.id}#book` : "#book"} className="ed-link">
                Book the package
              </Link>
            </Reveal>
            <Reveal as="div" delay={240} className="ed-pk__col">
              <figure>
                {/* eslint-disable-next-line @next/next/no-img-element -- static marketing asset */}
                <img src="/img/gallery-3.webp" alt="HELicia elixir and cream set on marble" />
              </figure>
              <h3>Allure Circle</h3>
              <div className="sub">Membership for regulars</div>
              <p>Members save 15% on every visit, get priority booking and early access to signature product drops.</p>
              <span className="ed-dot" />
              <div className="price">
                <MoneyLabel ngn={5000} /> / year
              </div>
              <Link href="/contact?topic=allure-circle" className="ed-link">
                Join the circle
              </Link>
            </Reveal>
          </div>
        </div>
      </section>

      <ServicesTestimonials testimonials={testimonials} />
      <div className="ed-band">The beauty of one trusted team</div>

      <Suspense>
        <BookingSection services={services} />
      </Suspense>

      {faqItems.length > 0 && (
        <section className="ed-light py-[clamp(64px,9vw,120px)] px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-[1280px]">
            <div className="center mb-[clamp(40px,5vw,64px)]">
              <Reveal as="span" className="overline overline--wide block text-[13px] font-bold tracking-[.02em] uppercase">
                FAQ
              </Reveal>
              <h2 className="h2 ed-serif mt-3">Find the answers you seek.</h2>
            </div>
            <div className="ed-faq">
              <figure className="ed-faq__img">
                {/* eslint-disable-next-line @next/next/no-img-element -- static marketing asset */}
                <img src="/img/value-quality.webp" alt="Portrait with bold red lip" style={{ objectPosition: "50% 25%" }} />
              </figure>
              <FaqAccordion items={faqItems.map((f) => ({ question: f.question, answer: f.answer }))} />
            </div>
          </div>
        </section>
      )}

      <Marquee words={closingMarquee} reverse />

      <section className="py-[clamp(64px,9vw,120px)] px-4 sm:px-6 lg:px-8">
        <div className="ed-close mx-auto max-w-[1280px]">
          <div>
            <Reveal as="p">
              Step into a space of care, calm and craft — and leave with a look you&apos;ll carry confidently into
              every occasion.
            </Reveal>
            <Reveal as="div" className="it-line">
              Beauty, made easier.
            </Reveal>
            <Reveal>
              <Link href="#book" className="ed-link">
                Book your session now <Icon name="arrow" className="size-4" />
              </Link>
            </Reveal>
          </div>
          <div className="ed-close__imgs">
            <figure>
              {/* eslint-disable-next-line @next/next/no-img-element -- static marketing asset */}
              <img src="/img/salon-journey.webp" alt="The warmly lit ZoeO salon suite" />
            </figure>
            <figure className="mt-[60px]">
              {/* eslint-disable-next-line @next/next/no-img-element -- static marketing asset */}
              <img
                src="/img/p-deep-wave-lace-front.webp"
                alt="Freshly installed deep wave lace front"
                style={{ objectPosition: "50% 20%" }}
              />
            </figure>
          </div>
        </div>
      </section>

      <div className="ed-strip-head">
        <span className="text-[12px] font-bold tracking-[.18em] text-noir-400 uppercase">
          Join our community · @zoeoallure
        </span>
      </div>
      <div className="ed-strip">
        {gallery.map((g) => (
          <a
            key={g}
            href="https://instagram.com/zoeoallure"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="ZoeO Allure on Instagram"
          >
            {/* eslint-disable-next-line @next/next/no-img-element -- static marketing asset */}
            <img src={`/img/${g}.webp`} alt="" />
          </a>
        ))}
      </div>
    </>
  );
}
