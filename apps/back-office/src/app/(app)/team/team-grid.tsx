"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Badge } from "../badge";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { STATUS_BADGE } from "@/lib/catalog";
import { deleteTeamMember } from "./actions";
import { TeamModal } from "./team-modal";
import type { Tables } from "@zoeallure/supabase";

export function TeamGrid({ members }: { members: Tables<"team_members">[] }) {
  const router = useRouter();
  const [editing, setEditing] = useState<Tables<"team_members"> | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Tables<"team_members"> | null>(null);

  return (
    <>
      <div className="flex justify-end">
        <Button
          type="button"
          onClick={() => {
            setEditing(null);
            setModalOpen(true);
          }}
          className="h-auto rounded-full bg-noir-800 px-[22px] py-3 text-[13.5px] font-bold text-white hover:bg-violet-500"
        >
          + Add artist
        </Button>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {members.length === 0 && (
          <div className="rounded-2xl border border-noir-100 px-6 py-8 text-[13px] text-noir-400 lg:col-span-4">
            No team members yet.
          </div>
        )}
        {members.map((m) => {
          const status = STATUS_BADGE[m.status];
          return (
            <div key={m.id} className="overflow-hidden rounded-[18px] border border-noir-100">
              <div className="relative flex aspect-[3/4] items-center justify-center" style={{ background: m.accent_color }}>
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white/[0.18] text-base font-extrabold text-white">
                  {m.initials}
                </span>
                <span className="absolute top-2.5 right-2.5">
                  <Badge label={status.label} bg={status.bg} fg={status.fg} />
                </span>
              </div>
              <div className="p-4">
                <div className="font-display text-[17px] text-noir-800">{m.name}</div>
                <div className="mt-0.5 text-xs text-noir-400">{m.title}</div>
                <div className="mt-3 flex gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setEditing(m);
                      setModalOpen(true);
                    }}
                    className="text-[11.5px] font-bold text-violet-500"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeleteTarget(m)}
                    className="text-[11.5px] font-bold text-noir-400 hover:text-status-cancelled"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <TeamModal
        open={modalOpen}
        onOpenChange={(open) => {
          setModalOpen(open);
          if (!open) setEditing(null);
        }}
        member={editing}
      />

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Remove team member?"
        description={`"${deleteTarget?.name}" will be permanently removed. This cannot be undone.`}
        onConfirm={async () => {
          if (!deleteTarget) return;
          await deleteTeamMember(deleteTarget.id);
          router.refresh();
          toast.success("Team member removed");
        }}
      />
    </>
  );
}
