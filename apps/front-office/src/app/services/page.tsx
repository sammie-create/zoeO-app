import { Suspense } from "react";
import { FaqAccordion } from "@/components/shared/faq-accordion";
import { Reveal } from "@/components/shared/reveal";
import { BookingSection } from "@/components/services/booking-section";
import { ServiceMenu } from "@/components/services/service-menu";
import { Testimonials } from "@/components/home/testimonials";
import { getFaqs, getServices, getTestimonials } from "@/lib/queries";

export const metadata = { title: "Beauty Services — ZoeO Allure" };

const gallery = ["nails-art", "gallery-5", "client-1", "gallery-3", "line-zoe-onirun"];

export default async function ServicesPage() {
  const [services, testimonials, faqs] = await Promise.all([getServices(), getTestimonials(), getFaqs()]);

  return (
    <>
      <section className="relative flex min-h-[70vh] items-center justify-center overflow-hidden text-center">
        {/* eslint-disable-next-line @next/next/no-img-element -- static marketing asset */}
        <img src="/img/glow-banner.webp" alt="" className="absolute inset-0 size-full object-cover" />
        <div className="absolute inset-0 bg-black/55" />
        <div className="relative mx-auto max-w-[700px] px-4 py-24">
          <Reveal variant="fade" className="inline-flex items-center gap-2 text-[13px] font-semibold tracking-[.18em] text-violet-300 uppercase">
            <span className="size-1.5 rounded-full bg-current" /> Now booking · Lagos
          </Reveal>
          <Reveal as="h1" className="font-display mt-4 block text-4xl font-bold sm:text-5xl lg:text-[60px]">Beauty, made easier. All in one place.</Reveal>
          <Reveal as="p" delay={300} className="mt-5 text-white/85">
            Wigs, bridal glam, gele, lashes and nails — handled by one trusted team, so you spend less time
            coordinating and more time enjoying the moment.
          </Reveal>
          <Reveal delay={460} className="mt-8 flex flex-wrap justify-center gap-6">
            <a href="#book" className="font-semibold text-violet-300 underline">
              Book your session
            </a>
            <a href="#menu" className="font-semibold text-violet-300 underline">
              Explore the menu
            </a>
          </Reveal>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <div className="mx-auto mb-10 max-w-[640px] text-center">
          <Reveal as="span" className="block text-sm font-bold text-violet-400 uppercase">
            Premium in-salon &amp; home service
          </Reveal>
          <Reveal as="h2" className="font-display mt-3 block text-3xl font-bold sm:text-4xl">Choose your service</Reveal>
        </div>
        <div className="mx-auto max-w-[1280px]">
          <ServiceMenu services={services} />
        </div>
      </section>

      {testimonials.length > 0 && <Testimonials testimonials={testimonials} />}

      <Suspense>
        <BookingSection services={services} />
      </Suspense>

      {faqs.length > 0 && (
        <section id="faq" className="px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
          <div className="mx-auto max-w-[760px]">
            <div className="mb-10 text-center">
              <Reveal as="span" className="block text-sm font-bold text-violet-400 uppercase">
                FAQ
              </Reveal>
              <Reveal as="h2" className="font-display mt-3 block text-3xl font-bold">Find the answers you seek.</Reveal>
            </div>
            <FaqAccordion items={faqs.map((f) => ({ question: f.question, answer: f.answer }))} />
          </div>
        </section>
      )}

      <section className="px-4 pb-16 sm:px-6 lg:px-8">
        <p className="mb-4 text-center text-sm text-noir-400">Join our community · @zoeoallure</p>
        <div className="mx-auto grid max-w-[1280px] grid-cols-3 gap-2 sm:grid-cols-5">
          {gallery.map((g) => (
            <a
              key={g}
              href="https://instagram.com/zoeoallure"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="ZoeO Allure on Instagram"
              className="aspect-square overflow-hidden rounded-lg"
            >
              {/* eslint-disable-next-line @next/next/no-img-element -- static marketing asset */}
              <img src={`/img/${g}.webp`} alt="" className="size-full object-cover transition-transform hover:scale-105" />
            </a>
          ))}
        </div>
      </section>
    </>
  );
}
