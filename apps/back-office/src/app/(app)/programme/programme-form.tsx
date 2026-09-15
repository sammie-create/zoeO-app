"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Spinner } from "@/components/spinner";
import { SLOT_TIMES } from "@/lib/catalog";
import { createProgramme, toggleProgrammeSlot, updateProgramme } from "./actions";
import type { Tables } from "@zoeallure/supabase";
import type { ProgrammeRow } from "./programme-cards";

export function ProgrammeForm({ programme }: { programme?: ProgrammeRow }) {
  const router = useRouter();
  const isEdit = !!programme;

  const [name, setName] = useState(programme?.name ?? "");
  const [description, setDescription] = useState(programme?.description ?? "");
  const [priceLabel, setPriceLabel] = useState(programme?.price_label ?? "₦1,000 /entry");
  const [slots, setSlots] = useState<boolean[]>(
    SLOT_TIMES.map((time) => {
      if (!programme) return true;
      return programme.slots.find((s) => s.slot_time === time)?.is_available ?? true;
    }),
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function toggleSlot(i: number) {
    const next = slots[i];
    setSlots((prev) => prev.map((v, idx) => (idx === i ? !v : v)));
    if (isEdit && programme) {
      await toggleProgrammeSlot(programme.id, SLOT_TIMES[i], !next);
    }
  }

  async function submit(status: "draft" | "published") {
    setError(null);
    setSaving(true);
    try {
      const input = { name, description: description || null, price_label: priceLabel, status, sort_order: programme?.sort_order ?? 0 };
      if (isEdit) {
        await updateProgramme(programme.id, input);
        toast.success("Programme updated");
      } else {
        await createProgramme(input as Omit<Tables<"programmes">, "id" | "created_at" | "updated_at">, slots);
        toast.success(status === "published" ? "Programme published" : "Saved as draft");
      }
      router.push("/programme");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setSaving(false);
    }
  }

  return (
    <div className="mt-6.5 grid max-w-[640px] gap-4">
      <div>
        <div className="mb-1.5 text-[11px] font-bold tracking-[0.1em] text-noir-400 uppercase">Track name</div>
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="h-auto w-full rounded-control border-noir-200 px-3.5 py-3 text-sm font-semibold focus-visible:border-violet-500 focus-visible:ring-violet-100"
        />
      </div>

      <div>
        <div className="mb-1.5 text-[11px] font-bold tracking-[0.1em] text-noir-400 uppercase">Description</div>
        <Textarea
          value={description ?? ""}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="w-full rounded-control border-noir-200 px-3.5 py-3 text-[13px] leading-relaxed text-noir-600 focus-visible:border-violet-500 focus-visible:ring-violet-100"
        />
      </div>

      <div>
        <div className="mb-1.5 text-[11px] font-bold tracking-[0.1em] text-noir-400 uppercase">Price / entry</div>
        <Input
          value={priceLabel}
          onChange={(e) => setPriceLabel(e.target.value)}
          className="h-auto w-full rounded-control border-noir-200 px-3.5 py-3 text-sm font-semibold focus-visible:border-violet-500 focus-visible:ring-violet-100"
        />
      </div>

      <div>
        <div className="mb-2.5 text-[11px] font-bold tracking-[0.1em] text-noir-400 uppercase">Day schedule</div>
        <div className="grid grid-cols-5 gap-2">
          {SLOT_TIMES.map((time, i) => {
            const available = slots[i];
            return (
              <button
                key={time}
                type="button"
                onClick={() => toggleSlot(i)}
                className="rounded-[10px] border px-1 py-2.5 text-center"
                style={{
                  background: available ? "#F4ECFE" : "#F7F6F9",
                  borderColor: available ? "#CFB1FB" : "#EDEBF1",
                }}
              >
                <div className="text-[11px] font-bold" style={{ color: available ? "#55129B" : "#5B5568" }}>
                  {time}
                </div>
                <div
                  className="mt-1 text-[9.5px] font-bold tracking-[0.08em] uppercase"
                  style={{ color: available ? "#7F23E0" : "#B4AFC0" }}
                >
                  {available ? "Open" : "Full"}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {error && <p className="text-[12.5px] font-medium text-status-cancelled">{error}</p>}

      <div className="mt-1.5 flex flex-wrap gap-2.5">
        <Button
          type="button"
          disabled={saving}
          onClick={() => submit("published")}
          className="h-auto rounded-xl bg-violet-500 px-[26px] py-3.5 text-[13.5px] font-bold text-white hover:bg-violet-600 disabled:opacity-70"
        >
          {saving && <Spinner size={15} />}
          {isEdit ? "Save & publish" : "Publish"}
        </Button>
        <Button
          type="button"
          variant="outline"
          disabled={saving}
          onClick={() => submit("draft")}
          className="h-auto rounded-xl border-noir-200 px-[26px] py-3.5 text-[13.5px] font-bold"
        >
          Save as draft
        </Button>
        <Button
          type="button"
          variant="ghost"
          onClick={() => router.push("/programme")}
          className="h-auto rounded-xl px-5 py-3.5 text-[13.5px] font-bold text-noir-400"
        >
          Cancel
        </Button>
      </div>
    </div>
  );
}
