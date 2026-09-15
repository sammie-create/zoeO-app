"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/spinner";
import { createTicket, updateTicket } from "./actions";
import type { Database, Tables } from "@zoeallure/supabase";

type Tier = Database["public"]["Tables"]["tickets"]["Row"]["tier"];
type Status = Database["public"]["Tables"]["tickets"]["Row"]["status"];

const TIER_OPTIONS: { key: Tier; label: string }[] = [
  { key: "ga", label: "General · ₦1,000" },
  { key: "vip", label: "VIP · ₦20,000" },
];
const STATUS_OPTIONS: { key: Status; label: string }[] = [
  { key: "reserved", label: "Reserved" },
  { key: "paid", label: "Paid" },
  { key: "cancelled", label: "Cancelled" },
];

export function TicketForm({ ticket }: { ticket?: Tables<"tickets"> }) {
  const router = useRouter();
  const isEdit = !!ticket;

  const [name, setName] = useState(ticket?.name ?? "");
  const [phone, setPhone] = useState(ticket?.phone ?? "");
  const [email, setEmail] = useState(ticket?.email ?? "");
  const [tier, setTier] = useState<Tier>(ticket?.tier ?? "ga");
  const [status, setStatus] = useState<Status>(ticket?.status ?? "reserved");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSaving(true);
    try {
      if (isEdit) {
        await updateTicket(ticket.id, { name, phone, email: email || null, tier, status });
        toast.success("Ticket updated");
        router.push(`/tickets/${ticket.id}`);
      } else {
        const created = await createTicket({
          name,
          phone,
          email: email || null,
          tier,
          status,
          source: "Back office",
          event_date: "2026-11-28",
        });
        toast.success("Ticket added");
        router.push(`/tickets/${created.id}`);
      }
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6.5 grid max-w-[560px] gap-4">
      <div>
        <div className="mb-1.5 text-[11px] font-bold tracking-[0.1em] text-noir-400 uppercase">Attendee name</div>
        <Input
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="h-auto w-full rounded-control border-noir-200 px-3.5 py-3 text-sm font-semibold focus-visible:border-violet-500 focus-visible:ring-violet-100"
        />
      </div>

      <div className="grid grid-cols-2 gap-3.5">
        <div>
          <div className="mb-1.5 text-[11px] font-bold tracking-[0.1em] text-noir-400 uppercase">Phone</div>
          <Input
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="h-auto w-full rounded-control border-noir-200 px-3.5 py-3 text-sm font-semibold focus-visible:border-violet-500 focus-visible:ring-violet-100"
          />
        </div>
        <div>
          <div className="mb-1.5 text-[11px] font-bold tracking-[0.1em] text-noir-400 uppercase">Email</div>
          <Input
            type="email"
            value={email ?? ""}
            onChange={(e) => setEmail(e.target.value)}
            className="h-auto w-full rounded-control border-noir-200 px-3.5 py-3 text-sm font-semibold focus-visible:border-violet-500 focus-visible:ring-violet-100"
          />
        </div>
      </div>

      <div>
        <div className="mb-1.5 text-[11px] font-bold tracking-[0.1em] text-noir-400 uppercase">Tier</div>
        <div className="grid grid-cols-2 gap-2.5">
          {TIER_OPTIONS.map((opt) => {
            const active = opt.key === tier;
            return (
              <Button
                key={opt.key}
                type="button"
                variant="outline"
                onClick={() => setTier(opt.key)}
                className="h-auto rounded-xl border-noir-100 py-3.5 text-center text-[13px] font-bold"
                style={{ background: active ? "#F4ECFE" : "#fff", borderColor: active ? "#CFB1FB" : "#EDEBF1" }}
              >
                {opt.label}
              </Button>
            );
          })}
        </div>
      </div>

      <div>
        <div className="mb-1.5 text-[11px] font-bold tracking-[0.1em] text-noir-400 uppercase">Status</div>
        <div className="grid grid-cols-3 gap-2.5">
          {STATUS_OPTIONS.map((opt) => {
            const active = opt.key === status;
            return (
              <Button
                key={opt.key}
                type="button"
                variant="outline"
                onClick={() => setStatus(opt.key)}
                className="h-auto rounded-xl border-noir-100 py-3 text-center text-[12.5px] font-bold"
                style={{ background: active ? "#F4ECFE" : "#fff", color: active ? "#55129B" : "#403B4C" }}
              >
                {opt.label}
              </Button>
            );
          })}
        </div>
      </div>

      {error && <p className="text-[12.5px] font-medium text-status-cancelled">{error}</p>}

      <div className="mt-1.5 flex gap-2.5">
        <Button
          type="submit"
          disabled={saving}
          className="h-auto rounded-xl bg-violet-500 px-[26px] py-3.5 text-[13.5px] font-bold text-white hover:bg-violet-600 disabled:opacity-70"
        >
          {saving && <Spinner size={15} />}
          {isEdit ? "Save changes" : "Add ticket"}
        </Button>
        <Button
          type="button"
          variant="ghost"
          onClick={() => router.push("/tickets")}
          className="h-auto rounded-xl px-5 py-3.5 text-[13.5px] font-bold text-noir-400"
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
