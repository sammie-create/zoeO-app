"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { Badge } from "../badge";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { STATUS_BADGE, JOURNAL_CATEGORY_SWATCH } from "@/lib/catalog";
import { formatDate } from "@/lib/format";
import { deleteJournalPost } from "./actions";
import type { Tables } from "@zoeallure/supabase";

export function JournalCards({ posts }: { posts: Tables<"journal_posts">[] }) {
  const router = useRouter();
  const [deleteTarget, setDeleteTarget] = useState<Tables<"journal_posts"> | null>(null);

  return (
    <>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {posts.length === 0 && (
          <div className="rounded-2xl border border-noir-100 px-6 py-8 text-[13px] text-noir-400 lg:col-span-3">
            No posts yet.
          </div>
        )}
        {posts.map((p) => {
          const status = STATUS_BADGE[p.status];
          const swatch = JOURNAL_CATEGORY_SWATCH[p.category] ?? "#7F23E0";
          return (
            <div key={p.id} className="overflow-hidden rounded-[18px] border border-noir-100">
              <div className="flex aspect-video items-center justify-center" style={{ background: swatch }}>
                <span className="font-display text-[15px] text-white/85">{p.category}</span>
              </div>
              <div className="p-[18px]">
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="rounded-full bg-[#F4ECFE] px-3 py-[5px] text-[11px] font-bold text-[#55129B]">
                    {p.category}
                  </span>
                  <span className="text-[11.5px] text-noir-400">{formatDate(p.published_at)}</span>
                  <Badge label={status.label} bg={status.bg} fg={status.fg} />
                </div>
                <div className="mt-2.5 font-display text-[17px] leading-tight text-noir-800">{p.title}</div>
                <div className="mt-3.5 flex items-center justify-between">
                  <Link href={`/journal/${p.id}/edit`} className="text-xs font-bold text-violet-500">
                    Edit post
                  </Link>
                  <button
                    type="button"
                    onClick={() => setDeleteTarget(p)}
                    className="text-[11.5px] text-noir-400 hover:text-status-cancelled"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Delete post?"
        description={`"${deleteTarget?.title}" will be permanently removed. This cannot be undone.`}
        onConfirm={async () => {
          if (!deleteTarget) return;
          await deleteJournalPost(deleteTarget.id);
          router.refresh();
          toast.success("Post deleted");
        }}
      />
    </>
  );
}
