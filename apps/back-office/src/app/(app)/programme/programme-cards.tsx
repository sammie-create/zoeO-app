"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { Badge } from "../badge";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { STATUS_BADGE, SLOT_TIMES } from "@/lib/catalog";
import { deleteProgramme, toggleProgrammePublish, toggleProgrammeSlot } from "./actions";
import type { Tables } from "@zoeallure/supabase";

export type ProgrammeRow = Tables<"programmes"> & { slots: Tables<"programme_slots">[] };

export function ProgrammeCards({ programmes }: { programmes: ProgrammeRow[] }) {
  const router = useRouter();
  const [deleteTarget, setDeleteTarget] = useState<ProgrammeRow | null>(null);

  async function handleTogglePublish(p: ProgrammeRow) {
    await toggleProgrammePublish(p.id, p.status === "published" ? "draft" : "published");
    router.refresh();
    toast.success(p.status === "published" ? "Moved to draft" : "Published");
  }

  async function handleToggleSlot(
    programmeId: string,
    slotTime: (typeof SLOT_TIMES)[number],
    current: boolean,
  ) {
    await toggleProgrammeSlot(programmeId, slotTime, !current);
    router.refresh();
  }

  return (
    <>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {programmes.length === 0 && (
          <div className="rounded-2xl border border-noir-100 px-6 py-8 text-[13px] text-noir-400 md:col-span-2">
            No programme tracks yet — add your first one.
          </div>
        )}
        {programmes.map((p, i) => {
          const status = STATUS_BADGE[p.status];
          return (
            <div key={p.id} className="grid gap-4 rounded-2xl border border-noir-100 p-[26px]">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="font-mono text-[11px] text-violet-500">{`/ Programme ${String(i + 1).padStart(2, "0")}`}</div>
                  <div className="mt-1.5 font-display text-2xl">{p.name}</div>
                </div>
                <div className="flex flex-col items-end gap-1.5">
                  <span className="font-display text-xl text-noir-800">{p.price_label}</span>
                  <Badge label={status.label} bg={status.bg} fg={status.fg} />
                </div>
              </div>

              <div className="grid grid-cols-5 gap-2">
                {SLOT_TIMES.map((time) => {
                  const slot = p.slots.find((s) => s.slot_time === time);
                  const available = slot?.is_available ?? false;
                  return (
                    <button
                      key={time}
                      type="button"
                      onClick={() => handleToggleSlot(p.id, time, available)}
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

              <div className="text-[12.5px] leading-relaxed text-noir-500">{p.description}</div>

              <div className="flex gap-3.5 border-t border-[#F0EEF3] pt-2">
                <Link href={`/programme/${p.id}/edit`} className="text-[12.5px] font-bold text-violet-500">
                  Edit
                </Link>
                <button
                  type="button"
                  onClick={() => handleTogglePublish(p)}
                  className="text-[12.5px] font-bold text-noir-600"
                >
                  {p.status === "published" ? "Move to draft" : "Publish"}
                </button>
                <button
                  type="button"
                  onClick={() => setDeleteTarget(p)}
                  className="text-[12.5px] font-bold text-status-cancelled"
                >
                  Delete
                </button>
              </div>
            </div>
          );
        })}
      </div>
      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Delete programme?"
        description={`"${deleteTarget?.name}" and its slots will be permanently removed. This cannot be undone.`}
        onConfirm={async () => {
          if (!deleteTarget) return;
          await deleteProgramme(deleteTarget.id);
          router.refresh();
          toast.success("Programme deleted");
        }}
      />
    </>
  );
}
