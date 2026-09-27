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
  {
    icon: "clock" as const,
    title: "Opening hours",
    text: (
      <>
        Mon – Sat · 9:00 AM – 8:00 PM
        <br />
        Sunday · By appointment
      </>
    ),
  },
];

export default async function ContactPage() {
  const faqs = await getFaqs("contact");

  return (
    <>
      <section className="page-hero">
        <div className="page-hero__frame" style={{ minHeight: 400 }}>
          {/* eslint-disable-next-line @next/next/no-img-element -- static marketing asset */}
          <img src="/img/hero-home.webp" alt="" style={{ objectPosition: "60% 30%" }} />
          <div>
            <Reveal as="span" className="block text-[13px] font-bold tracking-[.02em] uppercase text-violet-400">
              + Contact us
            </Reveal>
            <Reveal as="h1" className="display font-display block">
              We&apos;d love to <em className="it">hear from you</em>
            </Reveal>
            <Reveal as="p" className="leading-8">
              Questions about an order, a booking, or the Beauty Lounge Exhibition? Speak to a trusted stylist —
              short answers, no hype.
            </Reveal>
          </div>
        </div>
      </section>

      <section className="py-[clamp(64px,9vw,120px)] px-4 sm:px-6 lg:px-8">
        <div className="contact-grid mx-auto max-w-[1280px]">
          <div>
            <div className="contact-cards">
              {cards.map((c, i) => {
                const Wrapper = c.href ? "a" : "div";
                return (
                  <Reveal key={c.title} delay={i * 80} as={Wrapper} {...(c.href ? { href: c.href } : {})} className="c-card">
                    <span className="ic">
                      <Icon name={c.icon} className="size-4" />
                    </span>
                    <div>
                      <h4>{c.title}</h4>
                      <p>{c.text}</p>
                    </div>
                  </Reveal>
                );
              })}
            </div>
            <Reveal className="map">
              <iframe
                title="ZoeO Allure location — Ikeja, Lagos"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                src="https://maps.google.com/maps?q=Ikeja%2C%20Lagos&z=13&output=embed"
              />
            </Reveal>
          </div>

          <Reveal delay={120} className="panel">
            <Suspense>
              <ContactForm />
            </Suspense>
          </Reveal>
        </div>
      </section>

      {faqs.length > 0 && (
        <section id="faq" className="bg-bg-alt py-[clamp(64px,9vw,120px)] px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-[1280px]">
            <div className="center mb-[clamp(40px,5vw,64px)]">
              <Reveal as="span" className="block text-[13px] font-bold tracking-[.02em] text-violet-400 uppercase">
                Help &amp; FAQs
              </Reveal>
              <Reveal as="h2" className="h1 mt-3.5 block">
                Questions, answered
              </Reveal>
            </div>
            <FaqAccordion items={faqs.map((f) => ({ question: f.question, answer: f.answer }))} />
          </div>
        </section>
      )}
    </>
  );
}
