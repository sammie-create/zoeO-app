"use client";

import { useState, type ReactNode } from "react";
import { Sidebar } from "./sidebar";
import { Topbar } from "./topbar";

type PendingOrder = { id: string; ref: string; order_date: string; phone: string };
type PendingBooking = { id: string; ref: string; scheduled_at: string; phone: string };

export function Shell({
  name,
  roleLabel,
  pendingOrders,
  pendingOrdersPreview,
  pendingBookings,
  pendingBookingsPreview,
  children,
}: {
  name: string;
  roleLabel: string;
  pendingOrders: number;
  pendingOrdersPreview: PendingOrder[];
  pendingBookings: number;
  pendingBookingsPreview: PendingBooking[];
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-white text-noir-800">
      <Sidebar
        pendingOrders={pendingOrders}
        pendingBookings={pendingBookings}
        open={open}
        onClose={() => setOpen(false)}
      />
      {open && (
        <div
          className="fixed inset-0 z-30 bg-noir-900/55 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar
          name={name}
          roleLabel={roleLabel}
          onMenuClick={() => setOpen(true)}
          pendingOrdersPreview={pendingOrdersPreview}
          pendingOrdersCount={pendingOrders}
          pendingBookingsPreview={pendingBookingsPreview}
          pendingBookingsCount={pendingBookings}
        />
        <div className="flex-1 px-4 pt-6 pb-16 sm:px-6 lg:px-9 lg:pt-[34px]">{children}</div>
      </div>
    </div>
  );
}
