"use client";

import { useSearchParams } from "next/navigation";
import { Reveal } from "@/components/shared/reveal";
import { BookingForm } from "@/components/services/booking-form";
import type { Service } from "@/lib/queries";

const steps = [
  { n: "01", title: "Choose a service", text: "Salon or home service — your call." },
  { n: "02", title: "Pick a time", text: "Live slots, Monday to Saturday." },
  { n: "03", title: "Arrive & relax", text: "Your chair is ready when you are." },
];

export function BookingSection({ services }: { services: Service[] }) {
  const searchParams = useSearchParams();
  const preselect = searchParams.get("service") ?? undefined;

  return (
    <section id="book" className="px-4 py-[clamp(64px,9vw,120px)] sm:px-6 lg:px-8">
      <div className="ed-book mx-auto max-w-[1280px]">
        <div className="ed-book__aside">
          <Reveal as="span" className="overline block text-[13px] font-bold tracking-[.02em] uppercase">
            Book an appointment
          </Reveal>
          <Reveal as="h2" className="ed-serif block">
            Book your appointment in <em className="it not-italic">under a minute</em>
          </Reveal>
          <Reveal as="p">
            Deposit required for wig revamp and bridal makeup bookings. We&apos;ll confirm by phone or WhatsApp within
            the hour.
          </Reveal>
          <ol className="ed-steps">
            {steps.map((s, i) => (
              <Reveal key={s.n} delay={i * 80} as="li">
                <b>{s.n}</b>
                <div>
                  <strong>{s.title}</strong>
                  <span>{s.text}</span>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>

        <Reveal delay={120} className="panel">
          <BookingForm services={services} preselectId={preselect} />
        </Reveal>
      </div>
    </section>
  );
}
