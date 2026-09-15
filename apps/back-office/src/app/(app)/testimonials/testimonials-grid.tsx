"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Badge } from "../badge";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { STATUS_BADGE, CARD_PALETTE } from "@/lib/catalog";
import { getInitials } from "@/lib/format";
import { deleteTestimonial } from "./actions";
import { TestimonialModal } from "./testimonial-modal";
import type { Tables } from "@zoeallure/supabase";

export function TestimonialsGrid({ testimonials }: { testimonials: Tables<"testimonials">[] }) {
  const router = useRouter();
  const [editing, setEditing] = useState<Tables<"testimonials"> | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Tables<"testimonials"> | null>(null);

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
          + Add testimonial
        </Button>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {testimonials.length === 0 && (
          <div className="rounded-2xl border border-noir-100 px-6 py-8 text-[13px] text-noir-400 lg:col-span-3">
            No testimonials yet.
          </div>
        )}
        {testimonials.map((t, i) => {
          const status = STATUS_BADGE[t.status];
          const palette = CARD_PALETTE[i % CARD_PALETTE.length];
          return (
            <div key={t.id} className="flex flex-col gap-3.5 rounded-2xl p-6" style={{ background: palette.bg }}>
              <div className="flex items-start justify-between gap-2.5">
                <p className="font-display text-[17px] leading-snug text-noir-800">{t.quote}</p>
                <Badge label={status.label} bg={status.bg} fg={status.fg} />
              </div>
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <span
                    className="flex h-9 w-9 flex-none items-center justify-center rounded-full text-xs font-extrabold"
                    style={{ background: palette.avatarBg, color: palette.avatarFg }}
                  >
                    {getInitials(t.customer_name)}
                  </span>
                  <div>
                    <div className="text-[13px] font-bold text-noir-800">{t.customer_name}</div>
                    <div className="text-[11px] text-noir-400">{t.service_label}</div>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setEditing(t);
                      setModalOpen(true);
                    }}
                    className="text-[11.5px] font-bold text-violet-500"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeleteTarget(t)}
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

      <TestimonialModal
        open={modalOpen}
        onOpenChange={(open) => {
          setModalOpen(open);
          if (!open) setEditing(null);
        }}
        testimonial={editing}
      />

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Delete testimonial?"
        description="This will be permanently removed. This cannot be undone."
        onConfirm={async () => {
          if (!deleteTarget) return;
          await deleteTestimonial(deleteTarget.id);
          router.refresh();
          toast.success("Testimonial deleted");
        }}
      />
    </>
  );
}
