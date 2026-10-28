"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { CARD_PALETTE } from "@/lib/catalog";
import { getInitials } from "@/lib/format";
import { deleteReview } from "./actions";

type Review = {
  id: string;
  customer_name: string;
  rating: number;
  body: string;
  photo_url: string | null;
  service_id: string | null;
  product_id: string | null;
  created_at: string;
};

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <svg key={n} width="13" height="13" viewBox="0 0 24 24" fill={n <= rating ? "#D4AF6A" : "#E5E1EC"}>
          <path d="M12 3.5l2.6 5.3 5.9.8-4.3 4.1 1 5.8L12 16.8l-5.2 2.7 1-5.8L3.5 9.6l5.9-.8L12 3.5z" />
        </svg>
      ))}
    </div>
  );
}

export function ReviewsGrid({
  reviews,
  services,
  products,
}: {
  reviews: Review[];
  services: { id: string; name: string }[];
  products: { id: string; name: string }[];
}) {
  const router = useRouter();
  const [deleteTarget, setDeleteTarget] = useState<Review | null>(null);

  function subjectLabel(r: Review) {
    if (r.service_id) return services.find((s) => s.id === r.service_id)?.name ?? "ZoeO Allure client";
    if (r.product_id) return products.find((p) => p.id === r.product_id)?.name ?? "ZoeO Allure client";
    return "ZoeO Allure client";
  }

  return (
    <>
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {reviews.length === 0 && (
          <div className="rounded-2xl border border-noir-100 px-6 py-8 text-[13px] text-noir-400 lg:col-span-3">
            No reviews yet.
          </div>
        )}
        {reviews.map((r, i) => {
          const palette = CARD_PALETTE[i % CARD_PALETTE.length];
          return (
            <div key={r.id} className="flex flex-col gap-3.5 rounded-2xl p-6" style={{ background: palette.bg }}>
              <div className="flex items-start justify-between gap-2.5">
                <Stars rating={r.rating} />
                <span className="text-[11px] text-noir-400">
                  {new Date(r.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                </span>
              </div>
              <p className="line-clamp-5 text-[14.5px] leading-snug text-noir-800">{r.body}</p>
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  {r.photo_url ? (
                    // eslint-disable-next-line @next/next/no-img-element -- Supabase Storage URL
                    <img src={r.photo_url} alt="" className="h-9 w-9 flex-none rounded-full object-cover" />
                  ) : (
                    <span
                      className="flex h-9 w-9 flex-none items-center justify-center rounded-full text-xs font-extrabold"
                      style={{ background: palette.avatarBg, color: palette.avatarFg }}
                    >
                      {getInitials(r.customer_name)}
                    </span>
                  )}
                  <div>
                    <div className="text-[13px] font-bold text-noir-800">{r.customer_name}</div>
                    <div className="text-[11px] text-noir-400">{subjectLabel(r)}</div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setDeleteTarget(r)}
                  className="text-[11.5px] font-bold text-noir-400 hover:text-status-cancelled"
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
        title="Delete review?"
        description="This will be permanently removed from the storefront. This cannot be undone."
        onConfirm={async () => {
          if (!deleteTarget) return;
          await deleteReview(deleteTarget.id);
          router.refresh();
          toast.success("Review deleted");
        }}
      />
    </>
  );
}
