"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { Icon, isIconName } from "@/components/shared/icon";
import { MoneyLabel } from "@/components/shared/money-label";
import { placeBooking } from "@/lib/actions";
import type { Service } from "@/lib/queries";

const TIMES = ["09:00", "10:30", "12:00", "13:30", "15:00", "16:30", "18:00", "19:30"];

function durationLabel(mins: number) {
  return mins >= 60 ? `${Math.floor(mins / 60)}h${mins % 60 ? ` ${mins % 60}min` : ""}` : `${mins} min`;
}

function isoToday(offsetDays = 0) {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().slice(0, 10);
}

export function BookingForm({ services, preselectId }: { services: Service[]; preselectId?: string }) {
  const [selectedId, setSelectedId] = useState(preselectId ?? services[0]?.id);
  const [prevPreselectId, setPrevPreselectId] = useState(preselectId);
  if (preselectId !== prevPreselectId) {
    setPrevPreselectId(preselectId);
    if (preselectId && services.some((s) => s.id === preselectId)) setSelectedId(preselectId);
  }
  const selected = services.find((s) => s.id === selectedId) ?? services[0];
  const [where, setWhere] = useState<"studio" | "home_service">("studio");
  const [date, setDate] = useState(isoToday(1));
  const [slot, setSlot] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [slotInvalid, setSlotInvalid] = useState(false);
  const [confirmed, setConfirmed] = useState<{ ref: string; dateStr: string; timeStr: string } | null>(null);

  const disabledSlots = useMemoDisabled(date);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    if (!selected) return;
    if (!date || date < isoToday()) return setError("Pick a date from today onwards.");
    if (name.trim().length < 2) return setError("Please enter your name.");
    if (phone.replace(/\D/g, "").length < 7) return setError("Enter a valid phone number.");
    if (!slot) {
      setSlotInvalid(true);
      return setError("Choose a time slot.");
    }
    setSlotInvalid(false);

    setSubmitting(true);
    try {
      const scheduledAt = new Date(`${date}T${slot}:00`).toISOString();
      const booking = await placeBooking({
        name,
        phone,
        email: null,
        serviceId: selected.id,
        scheduledAt,
        locationType: where,
        locationDetail: where === "home_service" ? "Home service" : "ZoeO Allure Studio, Ikeja",
        notes: null,
      });
      const d = new Date(`${date}T12:00`);
      const dateStr = d.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" });
      const [hh, mm] = slot.split(":");
      const h12 = ((Number(hh) + 11) % 12) + 1;
      const timeStr = `${h12}:${mm} ${Number(hh) >= 12 ? "PM" : "AM"}`;
      setConfirmed({ ref: booking.ref, dateStr, timeStr });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong booking your slot.");
    } finally {
      setSubmitting(false);
    }
  }

  if (confirmed) {
    const initials = name
      .trim()
      .split(/\s+/)
      .map((s) => s[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();

    return (
      <div className="confirm">
        <span className="ic">
          <Icon name="check" className="size-7" />
        </span>
        <h3 className="font-display text-2xl">You&apos;re booked in</h3>
        <p className="mt-2 text-noir-300">We&apos;ll confirm on {phone} shortly.</p>
        <div className="appt">
          <div className="appt__who">
            <span className="avatar">{initials}</span>
            <div>
              <strong>{name.trim()}</strong>
              <div className="text-noir-300">
                {selected?.name} · {selected && durationLabel(selected.duration_mins)} ·{" "}
                {where === "studio" ? "Salon" : "Home service"}
              </div>
            </div>
          </div>
          <div className="appt__dt">
            <div>
              <small>Date</small>
              <strong>{confirmed.dateStr}</strong>
            </div>
            <div>
              <small>Time</small>
              <strong>{confirmed.timeStr}</strong>
            </div>
          </div>
          <div className="appt__foot">
            <span className="chip chip--booked">Confirmed</span>
            <span className="mono text-noir-400">#{confirmed.ref}</span>
          </div>
        </div>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Link
            href="/services#book"
            className="inline-flex h-12 items-center rounded-full border border-white/20 px-6 text-sm font-bold uppercase hover:bg-white/6"
          >
            Book another
          </Link>
          <Link
            href="/shop"
            className="inline-flex h-12 items-center rounded-full bg-violet-500 px-6 text-sm font-bold text-white uppercase hover:bg-violet-600"
          >
            Shop products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="book__form" noValidate>
      <div className="field">
        <label>Choose a service</label>
        <div className="svc-pick" role="radiogroup">
          {services.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setSelectedId(s.id)}
              role="radio"
              aria-checked={selected?.id === s.id}
              className={`svc-opt ${selected?.id === s.id ? "is-active" : ""}`}
            >
              <span className="ic">
                <Icon name={isIconName(s.icon) ? s.icon : "sparkle"} className="size-4" />
              </span>
              <span>
                <strong>{s.name}</strong>
                <small>
                  {durationLabel(s.duration_mins)} · <MoneyLabel ngn={s.price} />
                </small>
              </span>
              <span className="radio" />
            </button>
          ))}
        </div>
      </div>

      <div className="field">
        <label>Where</label>
        <div className="seg" role="radiogroup">
          <button type="button" onClick={() => setWhere("studio")} className={where === "studio" ? "is-active" : ""}>
            Salon
          </button>
          <button
            type="button"
            onClick={() => setWhere("home_service")}
            className={where === "home_service" ? "is-active" : ""}
          >
            Home service
          </button>
        </div>
      </div>

      <div className="row2">
        <div className="field">
          <label htmlFor="b-date">Date</label>
          <input
            id="b-date"
            className="input"
            type="date"
            required
            min={isoToday()}
            value={date}
            onChange={(e) => {
              setDate(e.target.value);
              setSlot(null);
            }}
          />
        </div>
        <div className="field">
          <label htmlFor="b-artist">Artist</label>
          <select id="b-artist" className="select">
            <option>Any available artist</option>
            <option>Helen O. Adetunbi</option>
          </select>
        </div>
      </div>

      <div className={`field ${slotInvalid ? "is-invalid" : ""}`}>
        <label>Time</label>
        <div className="slots">
          {TIMES.map((t) => (
            <button
              key={t}
              type="button"
              disabled={disabledSlots.has(t)}
              onClick={() => {
                setSlot(t);
                setSlotInvalid(false);
              }}
              className={slot === t ? "is-active" : ""}
            >
              {t}
            </button>
          ))}
        </div>
        <span className="err">Choose a time slot.</span>
      </div>

      <div className="row2">
        <div className="field">
          <label htmlFor="b-name">Full name</label>
          <input
            id="b-name"
            className="input"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Adaeze O."
            autoComplete="name"
          />
        </div>
        <div className="field">
          <label htmlFor="b-phone">Phone / WhatsApp</label>
          <input
            id="b-phone"
            className="input"
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+234 000 000 0000"
            autoComplete="tel"
          />
        </div>
      </div>

      {error && <p className="text-sm font-medium text-status-cancelled">{error}</p>}

      <button
        type="submit"
        disabled={submitting || !selected}
        className="h-14 w-full rounded-full bg-violet-500 text-[15px] font-bold text-white uppercase transition-colors hover:bg-violet-600 disabled:opacity-50"
      >
        {submitting ? (
          "Booking…"
        ) : selected ? (
          <>
            Continue · <MoneyLabel ngn={selected.price} />
          </>
        ) : (
          "Continue"
        )}
      </button>
    </form>
  );
}

function useMemoDisabled(date: string) {
  const seed = date.split("-").reduce((a, b) => a + Number(b), 0);
  const disabled = new Set<string>();
  TIMES.forEach((t, i) => {
    if ((seed + i * 3) % 5 === 0) disabled.add(t);
  });
  return disabled;
}
