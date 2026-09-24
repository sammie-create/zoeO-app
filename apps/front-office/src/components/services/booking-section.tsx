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
    <section id="book" className="px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
      <div className="mx-auto grid max-w-[1280px] grid-cols-1 gap-12 lg:grid-cols-[.9fr_1.1fr]">
        <div>
          <Reveal as="span" className="block text-sm font-bold text-violet-400 uppercase">
            Book an appointment
          </Reveal>
          <Reveal as="h2" className="font-display mt-3 block text-3xl font-bold sm:text-4xl">Book your appointment in under a minute</Reveal>
          <Reveal as="p" className="mt-4 text-noir-300">
            Deposit required for wig revamp and bridal makeup bookings. We&apos;ll confirm by phone or WhatsApp within
            the hour.
          </Reveal>
          <ol className="mt-8 flex flex-col gap-5">
            {steps.map((s, i) => (
              <Reveal key={s.n} delay={i * 80} as="li" className="flex gap-4">
                <b className="font-display text-2xl text-violet-400">{s.n}</b>
                <div>
                  <strong className="block">{s.title}</strong>
                  <span className="text-[13px] text-noir-400">{s.text}</span>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>

        <Reveal delay={120}>
          <BookingForm services={services} preselectId={preselect} />
        </Reveal>
      </div>
    </section>
  );
}
