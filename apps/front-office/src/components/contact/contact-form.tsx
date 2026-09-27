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
  const [newsletter, setNewsletter] = useState(false);
  const [invalid, setInvalid] = useState<Set<string>>(new Set());
  const [sent, setSent] = useState<{ firstName: string; topicLabel: string; email: string } | null>(null);

  const messagePlaceholder =
    topic === "exhibition"
      ? "Tell us your name, how many guests, and anything you would love to see at the Beauty Lounge Exhibition."
      : "How can we help?";

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const next = new Set<string>();
    if (name.trim().length < 2) next.add("name");
    if (!/\S+@\S+\.\S+/.test(email)) next.add("email");
    if (message.trim().length < 10) next.add("message");
    setInvalid(next);
    if (next.size > 0) return;

    const topicLabel = topics.find((t) => t.value === topic)?.label ?? "General enquiry";
    setSent({ firstName: name.trim().split(" ")[0], topicLabel, email });
    toast.success("Message sent", { description: "We'll be in touch shortly." });
  }

  if (sent) {
    return (
      <div className="confirm">
        <span className="ic">
          <Icon name="check" className="size-7" />
        </span>
        <h2 className="font-display text-2xl">Message sent</h2>
        <p className="mx-auto mt-2.5 max-w-sm text-noir-300">
          Thank you, {sent.firstName}. We&apos;ve received your note about{" "}
          <strong className="text-white">{sent.topicLabel.toLowerCase()}</strong> and will reply to {sent.email}{" "}
          within one business day.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link
            href="/shop"
            className="inline-flex h-11 items-center rounded-full border border-white/20 px-5 text-sm font-bold uppercase hover:bg-white/6"
          >
            Continue shopping
          </Link>
          <Link
            href="/services#book"
            className="inline-flex h-11 items-center rounded-full bg-violet-500 px-5 text-sm font-bold text-white uppercase hover:bg-violet-600"
          >
            Book a service
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <h2 className="h2 mb-2">Send a message</h2>
      <p className="mb-7 text-sm text-noir-400">We reply within one business day.</p>
      <form onSubmit={handleSubmit} className="book__form" noValidate>
        <div className="row2">
          <div className={`field ${invalid.has("name") ? "is-invalid" : ""}`}>
            <label htmlFor="c-name">Full name</label>
            <input
              id="c-name"
              className="input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Adaeze O."
              autoComplete="name"
            />
            <span className="err">Please enter your name.</span>
          </div>
          <div className={`field ${invalid.has("email") ? "is-invalid" : ""}`}>
            <label htmlFor="c-email">Email</label>
            <input
              id="c-email"
              className="input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
            />
            <span className="err">Enter a valid email address.</span>
          </div>
        </div>
        <div className="row2">
          <div className="field">
            <label htmlFor="c-phone">Phone (optional)</label>
            <input
              id="c-phone"
              className="input"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+234 000 000 0000"
              autoComplete="tel"
            />
          </div>
          <div className="field">
            <label htmlFor="c-topic">Topic</label>
            <select id="c-topic" className="select" value={topic} onChange={(e) => setTopic(e.target.value)}>
              {topics.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className={`field ${invalid.has("message") ? "is-invalid" : ""}`}>
          <label htmlFor="c-msg">Message</label>
          <textarea
            id="c-msg"
            className="textarea"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={messagePlaceholder}
          />
          <span className="err">Tell us a little more (10+ characters).</span>
        </div>
        <label className="check">
          <input type="checkbox" checked={newsletter} onChange={(e) => setNewsletter(e.target.checked)} /> Send me
          exclusive offers and product previews
        </label>
        <button
          type="submit"
          className="h-14 rounded-full bg-violet-500 text-[15px] font-bold text-white uppercase transition-colors hover:bg-violet-600"
        >
          Send message
        </button>
      </form>
    </>
  );
}
