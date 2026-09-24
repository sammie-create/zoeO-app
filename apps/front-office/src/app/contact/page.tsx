import { Suspense } from "react";
import { Icon } from "@/components/shared/icon";
import { FaqAccordion } from "@/components/shared/faq-accordion";
import { Reveal } from "@/components/shared/reveal";
import { ContactForm } from "@/components/contact/contact-form";
import { getFaqs } from "@/lib/queries";

export const metadata = { title: "Contact Us — ZoeO Allure" };

const cards = [
  { icon: "phone" as const, title: "Call or WhatsApp", text: "+234 000 000 0000", href: "tel:+2340000000000" },
  { icon: "mail" as const, title: "Email", text: "hello@zoeoallure.com", href: "mailto:hello@zoeoallure.com" },
  { icon: "pin" as const, title: "Visit the boutique", text: "ZoeO Allure Boutique, Ikeja, Lagos" },
  { icon: "clock" as const, title: "Opening hours", text: "Mon – Sat · 9:00 AM – 8:00 PM · Sunday by appointment" },
];

export default async function ContactPage() {
  const faqs = await getFaqs();

  return (
    <>
      <section className="relative flex min-h-[400px] items-center overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element -- static marketing asset */}
        <img src="/img/hero-home.webp" alt="" className="absolute inset-0 size-full object-cover" style={{ objectPosition: "60% 30%" }} />
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative mx-auto max-w-[600px] px-4 py-16 sm:px-6 lg:px-8">
          <Reveal as="span" className="block text-sm font-bold text-violet-300 uppercase">
            + Contact us
          </Reveal>
          <Reveal as="h1" className="font-display mt-3 block text-4xl font-bold sm:text-5xl">We&apos;d love to hear from you</Reveal>
          <Reveal as="p" className="mt-4 text-white/85">
            Questions about an order, a booking, or the Beauty Lounge Exhibition? Speak to a trusted stylist — short
            answers, no hype.
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-[1280px] px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_1.2fr]">
          <div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {cards.map((c, i) => {
                const Wrapper = c.href ? "a" : "div";
                return (
                  <Reveal key={c.title} delay={i * 80} as={Wrapper} {...(c.href ? { href: c.href } : {})} className="flex gap-3 rounded-2xl border border-white/10 p-5">
                    <span className="grid size-10 shrink-0 place-items-center rounded-full bg-white/8 text-violet-300">
                      <Icon name={c.icon} className="size-4" />
                    </span>
                    <div>
                      <h4 className="mb-1 text-sm font-bold">{c.title}</h4>
                      <p className="text-[13px] text-noir-300">{c.text}</p>
                    </div>
                  </Reveal>
                );
              })}
            </div>
            <Reveal className="mt-6 overflow-hidden rounded-2xl border border-white/10">
              <iframe
                title="ZoeO Allure location — Ikeja, Lagos"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                src="https://maps.google.com/maps?q=Ikeja%2C%20Lagos&z=13&output=embed"
                className="h-[320px] w-full grayscale"
              />
            </Reveal>
          </div>

          <Reveal delay={120}>
            <Suspense>
              <ContactForm />
            </Suspense>
          </Reveal>
        </div>
      </section>

      {faqs.length > 0 && (
        <section id="faq" className="bg-noir-800/60 px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
          <div className="mx-auto max-w-[760px]">
            <div className="mb-10 text-center">
              <Reveal as="span" className="block text-sm font-bold text-violet-400 uppercase">
                Help &amp; FAQs
              </Reveal>
              <Reveal as="h2" className="font-display mt-3 block text-3xl font-bold">Questions, answered</Reveal>
            </div>
            <FaqAccordion items={faqs.map((f) => ({ question: f.question, answer: f.answer }))} />
          </div>
        </section>
      )}
    </>
  );
}
