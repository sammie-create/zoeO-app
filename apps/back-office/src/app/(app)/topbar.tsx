import { AccountMenu } from "./account-menu";
import { GlobalSearch } from "./global-search";
import { Notifications } from "./notifications";

export type PendingOrder = { id: string; ref: string; order_date: string; phone: string };
export type PendingBooking = { id: string; ref: string; scheduled_at: string; phone: string };
export type PendingPreview = { pendingOrdersPreview: PendingOrder[]; pendingBookingsPreview: PendingBooking[] };

export function Topbar({
  name,
  roleLabel,
  onMenuClick,
  pendingOrdersCount,
  pendingBookingsCount,
  pendingPreviewPromise,
}: {
  name: string;
  roleLabel: string;
  onMenuClick: () => void;
  pendingOrdersCount: number;
  pendingBookingsCount: number;
  pendingPreviewPromise: Promise<PendingPreview>;
}) {
  return (
    <div className="sticky top-0 z-10 flex items-center justify-between gap-3 border-b border-noir-100 bg-white/92 px-4 py-3 backdrop-blur-md sm:gap-6 sm:px-6 sm:py-4 lg:px-9">
      <button
        type="button"
        onClick={onMenuClick}
        aria-label="Open menu"
        className="flex h-9 w-9 flex-none items-center justify-center rounded-lg text-noir-600 hover:bg-noir-50 lg:hidden"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
          <path d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      <GlobalSearch />

      <div className="flex flex-none items-center gap-3 sm:gap-[18px]">
        <Notifications
          pendingOrdersCount={pendingOrdersCount}
          pendingBookingsCount={pendingBookingsCount}
          pendingPreviewPromise={pendingPreviewPromise}
        />
        <AccountMenu name={name} roleLabel={roleLabel} />
      </div>
    </div>
  );
}
