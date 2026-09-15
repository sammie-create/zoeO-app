"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Badge } from "../badge";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { STATUS_BADGE } from "@/lib/catalog";
import { deleteFaq } from "./actions";
import { FaqModal } from "./faq-modal";
import type { Tables } from "@zoeallure/supabase";

export function FaqList({ faqs }: { faqs: Tables<"faqs">[] }) {
  const router = useRouter();
  const [openId, setOpenId] = useState<string | null>(faqs[0]?.id ?? null);
  const [editing, setEditing] = useState<Tables<"faqs"> | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Tables<"faqs"> | null>(null);

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
          + Add question
        </Button>
      </div>

      <div className="mt-6 grid max-w-[900px] gap-3">
        {faqs.length === 0 && (
          <div className="rounded-2xl border border-noir-100 px-6 py-8 text-[13px] text-noir-400">
            No questions yet.
          </div>
        )}
        {faqs.map((f, i) => {
          const status = STATUS_BADGE[f.status];
          const open = openId === f.id;
          return (
            <div key={f.id} className="rounded-2xl border border-noir-100 bg-white px-[26px] py-[22px]">
              <button
                type="button"
                onClick={() => setOpenId(open ? null : f.id)}
                className="flex w-full items-center gap-4 text-left"
              >
                <span className="font-mono text-xs text-violet-500">{String(i + 1).padStart(2, "0")}</span>
                <span className="flex-1 text-[15.5px] font-bold text-noir-800">{f.question}</span>
                <Badge label={status.label} bg={status.bg} fg={status.fg} />
                <span className="flex h-[30px] w-[30px] flex-none items-center justify-center rounded-full bg-noir-50 text-[15px] text-noir-800">
                  {open ? "−" : "+"}
                </span>
              </button>
              {open && (
                <>
                  <p className="mt-3.5 pl-7 text-[13.5px] leading-relaxed text-noir-500">{f.answer}</p>
                  <div className="mt-3 flex gap-3.5 pl-7">
                    <button
                      type="button"
                      onClick={() => {
                        setEditing(f);
                        setModalOpen(true);
                      }}
                      className="text-xs font-bold text-violet-500"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteTarget(f)}
                      className="text-xs font-bold text-status-cancelled"
                    >
                      Delete
                    </button>
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>

      <FaqModal
        open={modalOpen}
        onOpenChange={(open) => {
          setModalOpen(open);
          if (!open) setEditing(null);
        }}
        faq={editing}
      />

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Delete question?"
        description="This will be permanently removed. This cannot be undone."
        onConfirm={async () => {
          if (!deleteTarget) return;
          await deleteFaq(deleteTarget.id);
          router.refresh();
          toast.success("Question deleted");
        }}
      />
    </>
  );
}
