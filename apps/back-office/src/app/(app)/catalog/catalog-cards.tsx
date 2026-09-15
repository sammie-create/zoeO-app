"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { Badge } from "../badge";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { ngn } from "@/lib/format";
import { STATUS_BADGE } from "@/lib/catalog";
import { deleteService, toggleServicePublish } from "./actions";
import type { Tables } from "@zoeallure/supabase";

export function CatalogCards({ services }: { services: Tables<"services">[] }) {
  const router = useRouter();
  const [deleteTarget, setDeleteTarget] = useState<Tables<"services"> | null>(null);

  async function handleTogglePublish(s: Tables<"services">) {
    await toggleServicePublish(s.id, s.status === "published" ? "draft" : "published");
    router.refresh();
    toast.success(s.status === "published" ? "Moved to draft" : "Published");
  }

  return (
    <>
      <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
        {services.length === 0 && (
          <div className="rounded-2xl border border-noir-100 px-6 py-8 text-[13px] text-noir-400 sm:col-span-2">
            No services yet — add your first one.
          </div>
        )}
        {services.map((s) => {
          const status = STATUS_BADGE[s.status];
          return (
            <div key={s.id} className="flex flex-col gap-2.5 rounded-2xl border border-noir-100 p-[22px] hover:border-violet-200">
              <div className="flex items-start justify-between gap-3">
                <span className="font-display text-[21px]">{s.name}</span>
                <Badge label={status.label} bg={status.bg} fg={status.fg} />
              </div>
              <div className="text-[13px] leading-relaxed text-noir-500">{s.description}</div>
              <div className="mt-1 flex items-center justify-between">
                <span className="font-mono text-[11.5px] text-noir-400">{s.duration_label}</span>
                <span className="text-[15px] font-extrabold">{ngn(s.price)}</span>
              </div>
              <div className="mt-2 flex gap-3.5 border-t border-[#F0EEF3] pt-3.5">
                <Link href={`/catalog/${s.id}/edit`} className="text-[12.5px] font-bold text-violet-500">
                  Edit
                </Link>
                <button
                  type="button"
                  onClick={() => handleTogglePublish(s)}
                  className="text-[12.5px] font-bold text-noir-600"
                >
                  {s.status === "published" ? "Move to draft" : "Publish"}
                </button>
                <button
                  type="button"
                  onClick={() => setDeleteTarget(s)}
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
        title="Delete service?"
        description={`"${deleteTarget?.name}" will be permanently removed. This cannot be undone.`}
        onConfirm={async () => {
          if (!deleteTarget) return;
          await deleteService(deleteTarget.id);
          router.refresh();
          toast.success("Service deleted");
        }}
      />
    </>
  );
}
