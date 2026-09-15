"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Badge } from "../badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { STATUS_BADGE } from "@/lib/catalog";
import { formatDateTime, ngn } from "@/lib/format";
import { deleteBooking, updateBookingStatus } from "./actions";
import type { Tables } from "@zoeallure/supabase";

export type BookingRow = Tables<"bookings"> & { serviceName: string; customerName: string | null };

export function BookingsTable({ bookings }: { bookings: BookingRow[] }) {
  const router = useRouter();
  const [selected, setSelected] = useState<BookingRow | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<BookingRow | null>(null);
  const [pending, setPending] = useState(false);

  async function setStatus(status: Tables<"bookings">["status"]) {
    if (!selected) return;
    setPending(true);
    await updateBookingStatus(selected.id, status);
    router.refresh();
    toast.success(`Booking ${status}`);
    setPending(false);
    setSelected(null);
  }

  return (
    <>
      <div className="rounded-[18px] border border-noir-100">
        <Table className="min-w-[1000px]">
          <TableHeader>
            <TableRow className="bg-noir-50 hover:bg-noir-50">
              <TableHead className="px-5 py-[13px] text-[11px] font-bold tracking-[0.1em] text-noir-400 uppercase">
                Booking ID
              </TableHead>
              <TableHead className="text-[11px] font-bold tracking-[0.1em] text-noir-400 uppercase">
                Customer
              </TableHead>
              <TableHead className="text-[11px] font-bold tracking-[0.1em] text-noir-400 uppercase">
                Phone
              </TableHead>
              <TableHead className="text-[11px] font-bold tracking-[0.1em] text-noir-400 uppercase">
                Service
              </TableHead>
              <TableHead className="text-[11px] font-bold tracking-[0.1em] text-noir-400 uppercase">
                When
              </TableHead>
              <TableHead className="text-[11px] font-bold tracking-[0.1em] text-noir-400 uppercase">
                Where
              </TableHead>
              <TableHead className="text-[11px] font-bold tracking-[0.1em] text-noir-400 uppercase">
                Status
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bookings.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="px-5 py-8 text-[13px] whitespace-normal text-noir-400">
                  No bookings yet.
                </TableCell>
              </TableRow>
            )}
            {bookings.map((b) => {
              const status = STATUS_BADGE[b.status];
              return (
                <TableRow key={b.id} onClick={() => setSelected(b)} className="cursor-pointer">
                  <TableCell className="px-5 py-3.5 font-mono text-xs text-noir-600">{b.ref}</TableCell>
                  <TableCell className="max-w-[160px] truncate text-[13px] font-bold text-noir-800">
                    {b.customerName ?? "—"}
                  </TableCell>
                  <TableCell className="text-xs text-noir-600">{b.phone}</TableCell>
                  <TableCell className="text-xs text-noir-600">{b.serviceName}</TableCell>
                  <TableCell className="text-xs text-noir-600">{formatDateTime(b.scheduled_at)}</TableCell>
                  <TableCell className="text-xs text-noir-600">{b.location_detail}</TableCell>
                  <TableCell>
                    <Badge label={status.label} bg={status.bg} fg={status.fg} />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      <Dialog open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent className="max-w-[560px] rounded-[22px] p-8">
          {selected && (
            <>
              <DialogHeader>
                <div className="flex items-center justify-between gap-3">
                  <span className="font-mono text-xs text-violet-500">{selected.ref}</span>
                  <Badge
                    label={STATUS_BADGE[selected.status].label}
                    bg={STATUS_BADGE[selected.status].bg}
                    fg={STATUS_BADGE[selected.status].fg}
                  />
                </div>
                <DialogTitle className="mt-2.5 font-display text-2xl font-normal">
                  {selected.serviceName}
                </DialogTitle>
              </DialogHeader>

              <div className="rounded-xl border border-noir-100 bg-noir-50 p-4">
                <div className="text-[15px] font-bold text-noir-800">{selected.customerName ?? "Walk-in"}</div>
                <div className="mt-1 text-[12.5px] text-noir-400">{selected.phone}</div>
              </div>

              <div className="grid gap-2.5 text-[13px] text-noir-600">
                <div className="flex justify-between">
                  <span className="text-noir-400">Date &amp; time</span>
                  <span className="font-bold">{formatDateTime(selected.scheduled_at)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-noir-400">Location</span>
                  <span className="font-bold">{selected.location_detail}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-noir-400">Deposit</span>
                  <span className="font-bold">{ngn(selected.deposit_amount)}</span>
                </div>
              </div>

              {selected.notes && (
                <div className="border-t border-noir-100 pt-3.5 text-[12.5px] leading-relaxed text-noir-500">
                  {selected.notes}
                </div>
              )}

              <div className="mt-1 grid grid-cols-3 gap-2.5">
                <Button
                  type="button"
                  variant="outline"
                  disabled={pending}
                  onClick={() => setStatus("accepted")}
                  className="h-auto rounded-xl border-noir-100 bg-[#F4ECFE] py-3 text-[12.5px] font-bold text-[#55129B] hover:bg-[#F4ECFE]/80"
                >
                  Accept
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  disabled={pending}
                  onClick={() => setStatus("completed")}
                  className="h-auto rounded-xl border-noir-100 bg-[#E7F5EC] py-3 text-[12.5px] font-bold text-[#1F7A50] hover:bg-[#E7F5EC]/80"
                >
                  Mark completed
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  disabled={pending}
                  onClick={() => setStatus("declined")}
                  className="h-auto rounded-xl border-noir-100 bg-[#FDEEF0] py-3 text-[12.5px] font-bold text-[#B23A50] hover:bg-[#FDEEF0]/80"
                >
                  Decline
                </Button>
              </div>

              <button
                type="button"
                onClick={() => {
                  setDeleteTarget(selected);
                  setSelected(null);
                }}
                className="text-[12.5px] font-bold text-status-cancelled"
              >
                Delete booking
              </button>
            </>
          )}
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Delete booking?"
        description={`Booking ${deleteTarget?.ref} will be permanently removed. This cannot be undone.`}
        onConfirm={async () => {
          if (!deleteTarget) return;
          await deleteBooking(deleteTarget.id);
          router.refresh();
          toast.success("Booking deleted");
        }}
      />
    </>
  );
}
