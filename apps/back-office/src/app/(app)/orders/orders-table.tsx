"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { Badge } from "../badge";
import { RowMenu } from "../row-menu";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { STATUS_BADGE } from "@/lib/catalog";
import { formatDate, ngn } from "@/lib/format";
import { deleteOrder } from "./actions";
import type { Tables } from "@zoeallure/supabase";

export type OrderRow = Tables<"orders"> & { customerName: string | null; total: number };

export function OrdersTable({ orders }: { orders: OrderRow[] }) {
  const router = useRouter();
  const [deleteTarget, setDeleteTarget] = useState<OrderRow | null>(null);

  return (
    <div className="rounded-[18px] border border-noir-100">
      <Table className="min-w-[1000px]">
        <TableHeader>
          <TableRow className="bg-noir-50 hover:bg-noir-50">
            <TableHead className="px-5 py-[13px] text-[11px] font-bold tracking-[0.1em] text-noir-400 uppercase">
              Reference
            </TableHead>
            <TableHead className="text-[11px] font-bold tracking-[0.1em] text-noir-400 uppercase">
              Customer
            </TableHead>
            <TableHead className="text-[11px] font-bold tracking-[0.1em] text-noir-400 uppercase">Date</TableHead>
            <TableHead className="text-[11px] font-bold tracking-[0.1em] text-noir-400 uppercase">Phone</TableHead>
            <TableHead className="text-[11px] font-bold tracking-[0.1em] text-noir-400 uppercase">
              Fulfilment
            </TableHead>
            <TableHead className="text-[11px] font-bold tracking-[0.1em] text-noir-400 uppercase">
              Payment
            </TableHead>
            <TableHead className="text-[11px] font-bold tracking-[0.1em] text-noir-400 uppercase">
              Delivery
            </TableHead>
            <TableHead className="text-[11px] font-bold tracking-[0.1em] text-noir-400 uppercase">Total</TableHead>
            <TableHead />
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.length === 0 && (
            <TableRow>
              <TableCell colSpan={9} className="px-5 py-8 text-[13px] whitespace-normal text-noir-400">
                No orders yet.
              </TableCell>
            </TableRow>
          )}
          {orders.map((o) => {
            const pay = STATUS_BADGE[o.payment_status];
            const delivery = STATUS_BADGE[o.delivery_status];
            return (
              <TableRow key={o.id}>
                <TableCell className="px-5 py-3.5 font-mono text-xs text-noir-600">
                  <Link href={`/orders/${o.id}`}>{o.ref}</Link>
                </TableCell>
                <TableCell className="max-w-[180px] truncate text-[13px] font-bold text-noir-800">
                  <Link href={`/orders/${o.id}`}>{o.customerName ?? "—"}</Link>
                </TableCell>
                <TableCell className="text-xs text-noir-600">{formatDate(o.order_date)}</TableCell>
                <TableCell className="text-xs text-noir-600">{o.phone}</TableCell>
                <TableCell className="text-xs text-noir-600">{o.fulfilment_detail}</TableCell>
                <TableCell>
                  <Badge label={pay.label} bg={pay.bg} fg={pay.fg} />
                </TableCell>
                <TableCell>
                  <Badge label={delivery.label} bg={delivery.bg} fg={delivery.fg} />
                </TableCell>
                <TableCell className="text-[13px] font-bold text-noir-800">{ngn(o.total)}</TableCell>
                <TableCell className="text-right">
                  <RowMenu
                    actions={[
                      { label: "View details", onClick: () => router.push(`/orders/${o.id}`) },
                      { label: "Delete", danger: true, onClick: () => setDeleteTarget(o) },
                    ]}
                  />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Delete order?"
        description={`Order ${deleteTarget?.ref} will be permanently removed. This cannot be undone.`}
        onConfirm={async () => {
          if (!deleteTarget) return;
          await deleteOrder(deleteTarget.id);
          router.refresh();
          toast.success("Order deleted");
        }}
      />
    </div>
  );
}
