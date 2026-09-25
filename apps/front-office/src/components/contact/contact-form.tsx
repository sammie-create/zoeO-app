"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { Icon } from "@/components/shared/icon";

const topics = [
  { value: "general", label: "General enquiry" },
  { value: "order", label: "An order" },
  { value: "product", label: "A product question" },
  { value: "booking", label: "A booking" },
  { value: "exhibition", label: "Register for the Exhibition" },
  { value: "wholesale", label: "Wholesale & partnerships" },
  { value: "careers", label: "Careers" },
];

export function ContactForm() {
  const searchParams = useSearchParams();
  const initialTopic = searchParams.get("topic");
  const product = searchParams.get("product");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [topic, setTopic] = useState(topics.some((t) => t.value === initialTopic) ? initialTopic! : "general");
  const [message, setMessage] = useState(product ? `Hi, I have a question about ${product}: ` : "");
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState<{ firstName: string; topicLabel: string; email: string } | null>(null);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    if (name.trim().length < 2) return setError("Please enter your name.");
    if (!/\S+@\S+\.\S+/.test(email)) return setError("Enter a valid email address.");
    if (message.trim().length < 10) return setError("Tell us a little more (10+ characters).");

    const topicLabel = topics.find((t) => t.value === topic)?.label ?? "General enquiry";
    setSent({ firstName: name.trim().split(" ")[0], topicLabel, email });
    toast.success("Message sent", { description: "We'll be in touch shortly." });
  }

  if (sent) {
    return (
      <div className="rounded-2xl border border-white/10 p-8 text-center">
        <div className="mx-auto mb-4 grid size-14 place-items-center rounded-full bg-status-booked/15 text-status-booked">
          <Icon name="check" className="size-6" />
        </div>
        <h2 className="font-display text-2xl">Message sent</h2>
        <p className="mx-auto mt-2 max-w-sm text-noir-300">
          Thank you, {sent.firstName}. We&apos;ve received your note about{" "}
          <strong className="text-white">{sent.topicLabel.toLowerCase()}</strong> and will reply to {sent.email} within
          one business day.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link href="/shop" className="h-11 rounded-full border border-white/20 px-5 text-sm font-bold uppercase leading-[2.75rem]">
            Continue shopping
          </Link>
          <Link href="/services#book" className="h-11 rounded-full bg-violet-500 px-5 text-sm font-bold text-white uppercase leading-[2.75rem]">
            Book a service
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-white/10 p-6 sm:p-8">
      <h2 className="mb-1.5 font-bold">Send a message</h2>
      <p className="mb-6 text-sm text-noir-400">We reply within one business day.</p>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <label className="text-sm">
            Full name
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Adaeze O."
              autoComplete="name"
              className="mt-1.5 h-12 w-full rounded-lg border border-white/16 bg-transparent px-3.5"
            />
          </label>
          <label className="text-sm">
            Email
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
              className="mt-1.5 h-12 w-full rounded-lg border border-white/16 bg-transparent px-3.5"
            />
          </label>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <label className="text-sm">
            Phone (optional)
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+234 000 000 0000"
              autoComplete="tel"
              className="mt-1.5 h-12 w-full rounded-lg border border-white/16 bg-transparent px-3.5"
            />
          </label>
          <label className="text-sm">
            Topic
            <select value={topic} onChange={(e) => setTopic(e.target.value)} className="mt-1.5 h-12 w-full rounded-lg border border-white/16 bg-transparent px-3.5">
              {topics.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </label>
        </div>
        <label className="text-sm">
          Message
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="How can we help?"
            rows={4}
            className="mt-1.5 w-full rounded-lg border border-white/16 bg-transparent p-3.5"
          />
        </label>
        <label className="flex items-center gap-2 text-sm text-noir-300">
          <input type="checkbox" /> Send me exclusive offers and product previews
        </label>
        {error && <p className="text-sm font-medium text-status-cancelled">{error}</p>}
        <button type="submit" className="h-14 rounded-full bg-violet-500 text-sm font-bold text-white uppercase">
          Send message
        </button>
      </form>
    </div>
  );
}
