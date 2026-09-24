"use client";

import { useState, type FormEvent } from "react";
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
  const [selected, setSelected] = useState<Service | undefined>(services.find((s) => s.id === preselectId) ?? services[0]);
  const [where, setWhere] = useState<"studio" | "home_service">("studio");
  const [date, setDate] = useState(isoToday(1));
  const [slot, setSlot] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState<{ ref: string; dateStr: string; timeStr: string } | null>(null);

  const disabledSlots = useMemoDisabled(date);

  function handlePick(id: string) {
    const s = services.find((x) => x.id === id);
    if (s) setSelected(s);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    if (!selected) return;
    if (!date || date < isoToday()) return setError("Pick a date from today onwards.");
    if (name.trim().length < 2) return setError("Please enter your name.");
    if (phone.replace(/\D/g, "").length < 7) return setError("Enter a valid phone number.");
    if (!slot) return setError("Choose a time slot.");

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
    return (
      <div className="rounded-2xl border border-white/10 p-8 text-center">
        <div className="mx-auto mb-4 grid size-14 place-items-center rounded-full bg-status-booked/15 text-status-booked">
          <Icon name="check" className="size-6" />
        </div>
        <h3 className="font-display text-2xl">You&apos;re booked in</h3>
        <p className="mt-2 text-noir-300">We&apos;ll confirm on {phone} shortly.</p>
        <div className="mt-6 rounded-xl border border-white/10 p-5 text-left">
          <strong>{name.trim()}</strong>
          <div className="mt-1 text-sm text-noir-300">
            {selected?.name} · {selected && durationLabel(selected.duration_mins)} · {where === "studio" ? "Salon" : "Home service"}
          </div>
          <div className="mt-4 flex justify-between text-sm">
            <div>
              <div className="text-noir-400">Date</div>
              <strong>{confirmed.dateStr}</strong>
            </div>
            <div>
              <div className="text-noir-400">Time</div>
              <strong>{confirmed.timeStr}</strong>
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between border-t border-white/8 pt-3">
            <span className="rounded-full bg-status-booked/15 px-3 py-1 text-[12px] font-bold text-status-booked">Confirmed</span>
            <span className="font-mono text-[13px] text-noir-400">#{confirmed.ref}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl border border-white/10 p-6 sm:p-8">
      <label className="mb-4 block">
        <span className="mb-2 block text-sm font-bold">Choose a service</span>
        <div className="flex flex-col gap-2">
          {services.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => handlePick(s.id)}
              role="radio"
              aria-checked={selected?.id === s.id}
              className={`flex items-center gap-3 rounded-xl border p-3 text-left ${
                selected?.id === s.id ? "border-violet-500 bg-violet-500/10" : "border-white/12"
              }`}
            >
              <span className="grid size-9 shrink-0 place-items-center rounded-full bg-white/8 text-violet-300">
                <Icon name={isIconName(s.icon) ? s.icon : "sparkle"} className="size-4" />
              </span>
              <span className="flex-1">
                <strong className="block text-sm">{s.name}</strong>
                <span className="text-[12px] text-noir-400">
                  {durationLabel(s.duration_mins)} · <MoneyLabel ngn={s.price} />
                </span>
              </span>
            </button>
          ))}
        </div>
      </label>

      <label className="mb-4 block">
        <span className="mb-2 block text-sm font-bold">Where</span>
        <div className="inline-flex rounded-full border border-white/16 p-1">
          <button type="button" onClick={() => setWhere("studio")} className={`rounded-full px-4 py-2 text-sm ${where === "studio" ? "bg-violet-500 text-white" : "text-noir-300"}`}>
            Salon
          </button>
          <button
            type="button"
            onClick={() => setWhere("home_service")}
            className={`rounded-full px-4 py-2 text-sm ${where === "home_service" ? "bg-violet-500 text-white" : "text-noir-300"}`}
          >
            Home service
          </button>
        </div>
      </label>

      <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <label className="text-sm">
          Date
          <input
            type="date"
            required
            min={isoToday()}
            value={date}
            onChange={(e) => {
              setDate(e.target.value);
              setSlot(null);
            }}
            className="mt-1.5 h-12 w-full rounded-lg border border-white/16 bg-transparent px-3.5"
          />
        </label>
        <label className="text-sm">
          Artist
          <select className="mt-1.5 h-12 w-full rounded-lg border border-white/16 bg-transparent px-3.5">
            <option>Any available artist</option>
            <option>Helen O. Adetunbi</option>
          </select>
        </label>
      </div>

      <div className="mb-4">
        <span className="mb-2 block text-sm font-bold">Time</span>
        <div className="grid grid-cols-4 gap-2">
          {TIMES.map((t) => (
            <button
              key={t}
              type="button"
              disabled={disabledSlots.has(t)}
              onClick={() => setSlot(t)}
              className={`h-10 rounded-lg border text-sm disabled:opacity-30 ${
                slot === t ? "border-violet-500 bg-violet-500 text-white" : "border-white/16"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <label className="text-sm">
          Full name
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Adaeze O."
            autoComplete="name"
            className="mt-1.5 h-12 w-full rounded-lg border border-white/16 bg-transparent px-3.5"
          />
        </label>
        <label className="text-sm">
          Phone / WhatsApp
          <input
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+234 000 000 0000"
            autoComplete="tel"
            className="mt-1.5 h-12 w-full rounded-lg border border-white/16 bg-transparent px-3.5"
          />
        </label>
      </div>

      {error && <p className="mb-4 text-sm font-medium text-status-cancelled">{error}</p>}

      <button
        type="submit"
        disabled={submitting || !selected}
        className="flex h-14 w-full items-center justify-center rounded-full bg-violet-500 text-sm font-bold text-white uppercase disabled:opacity-50"
      >
        {submitting ? "Booking…" : selected ? <>Continue · <MoneyLabel ngn={selected.price} /></> : "Continue"}
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
