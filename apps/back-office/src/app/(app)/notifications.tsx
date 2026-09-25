"use client";

import { useRouter } from "next/navigation";
import { Suspense, use } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatDate, formatDateTime } from "@/lib/format";
import type { PendingPreview } from "./topbar";

export function Notifications({
  pendingOrdersCount,
  pendingBookingsCount,
  pendingPreviewPromise,
}: {
  pendingOrdersCount: number;
  pendingBookingsCount: number;
  pendingPreviewPromise: Promise<PendingPreview>;
}) {
  const hasNotifications = pendingOrdersCount + pendingBookingsCount > 0;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label="Notifications"
          className="relative hidden cursor-pointer sm:inline-flex"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#403B4C" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 10a6 6 0 1 1 12 0c0 4 1.5 5.5 1.5 5.5h-15S6 14 6 10z" />
            <path d="M10.5 18.5a1.7 1.7 0 0 0 3 0" />
          </svg>
          {hasNotifications && (
            <span className="absolute -top-[3px] -right-[3px] h-2 w-2 rounded-full border-[1.5px] border-white bg-status-cancelled" />
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[320px] rounded-xl border-noir-100 p-1.5">
        {!hasNotifications ? (
          <div className="px-3 py-6 text-center text-[12.5px] text-noir-400">You&apos;re all caught up.</div>
        ) : (
          <Suspense fallback={<div className="px-3 py-6 text-center text-[12.5px] text-noir-400">Loading…</div>}>
            <NotificationsList
              pendingOrdersCount={pendingOrdersCount}
              pendingBookingsCount={pendingBookingsCount}
              pendingPreviewPromise={pendingPreviewPromise}
            />
          </Suspense>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function NotificationsList({
  pendingOrdersCount,
  pendingBookingsCount,
  pendingPreviewPromise,
}: {
  pendingOrdersCount: number;
  pendingBookingsCount: number;
  pendingPreviewPromise: Promise<PendingPreview>;
}) {
  const router = useRouter();
  const { pendingOrdersPreview, pendingBookingsPreview } = use(pendingPreviewPromise);

  return (
    <>
      {pendingOrdersPreview.length > 0 && (
        <>
          <DropdownMenuLabel className="px-2.5 pt-1.5 text-[10.5px] font-bold tracking-[0.1em] text-noir-400 uppercase">
            Pending orders
          </DropdownMenuLabel>
          {pendingOrdersPreview.map((o) => (
            <DropdownMenuItem
              key={o.id}
              onSelect={() => router.push(`/orders/${o.id}`)}
              className="flex flex-col items-start gap-0.5 rounded-lg px-2.5 py-2"
            >
              <span className="text-[13px] font-bold text-noir-800">Order #{o.ref}</span>
              <span className="text-[11.5px] text-noir-400">
                {o.phone} · {formatDate(o.order_date)}
              </span>
            </DropdownMenuItem>
          ))}
          {pendingOrdersCount > pendingOrdersPreview.length && (
            <DropdownMenuItem
              onSelect={() => router.push("/orders?status=pending")}
              className="rounded-lg px-2.5 py-1.5 text-[12px] font-semibold text-violet-500"
            >
              View all {pendingOrdersCount} pending orders →
            </DropdownMenuItem>
          )}
        </>
      )}

      {pendingOrdersPreview.length > 0 && pendingBookingsPreview.length > 0 && <DropdownMenuSeparator />}

      {pendingBookingsPreview.length > 0 && (
        <>
          <DropdownMenuLabel className="px-2.5 pt-1.5 text-[10.5px] font-bold tracking-[0.1em] text-noir-400 uppercase">
            Pending bookings
          </DropdownMenuLabel>
          {pendingBookingsPreview.map((b) => (
            <DropdownMenuItem
              key={b.id}
              onSelect={() => router.push("/bookings?status=requested")}
              className="flex flex-col items-start gap-0.5 rounded-lg px-2.5 py-2"
            >
              <span className="text-[13px] font-bold text-noir-800">Booking #{b.ref}</span>
              <span className="text-[11.5px] text-noir-400">
                {b.phone} · {formatDateTime(b.scheduled_at)}
              </span>
            </DropdownMenuItem>
          ))}
          {pendingBookingsCount > pendingBookingsPreview.length && (
            <DropdownMenuItem
              onSelect={() => router.push("/bookings?status=requested")}
              className="rounded-lg px-2.5 py-1.5 text-[12px] font-semibold text-violet-500"
            >
              View all {pendingBookingsCount} pending bookings →
            </DropdownMenuItem>
          )}
        </>
      )}
    </>
  );
}
