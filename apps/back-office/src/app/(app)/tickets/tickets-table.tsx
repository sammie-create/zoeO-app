"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { Badge } from "../badge";
import { RowMenu } from "../row-menu";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { STATUS_BADGE, TICKET_TIER } from "@/lib/catalog";
import { deleteTicket } from "./actions";
import type { Tables } from "@zoeallure/supabase";

export function TicketsTable({ tickets }: { tickets: Tables<"tickets">[] }) {
  const router = useRouter();
  const [deleteTarget, setDeleteTarget] = useState<Tables<"tickets"> | null>(null);

  return (
    <div className="rounded-[18px] border border-noir-100">
      <Table className="min-w-[900px]">
        <TableHeader>
          <TableRow className="bg-noir-50 hover:bg-noir-50">
            <TableHead className="px-5 py-[13px] text-[11px] font-bold tracking-[0.1em] text-noir-400 uppercase">
              Reference
            </TableHead>
            <TableHead className="text-[11px] font-bold tracking-[0.1em] text-noir-400 uppercase">
              Attendee
            </TableHead>
            <TableHead className="text-[11px] font-bold tracking-[0.1em] text-noir-400 uppercase">Phone</TableHead>
            <TableHead className="text-[11px] font-bold tracking-[0.1em] text-noir-400 uppercase">Tier</TableHead>
            <TableHead className="text-[11px] font-bold tracking-[0.1em] text-noir-400 uppercase">Source</TableHead>
            <TableHead className="text-[11px] font-bold tracking-[0.1em] text-noir-400 uppercase">Status</TableHead>
            <TableHead />
          </TableRow>
        </TableHeader>
        <TableBody>
          {tickets.length === 0 && (
            <TableRow>
              <TableCell colSpan={7} className="px-5 py-8 text-[13px] whitespace-normal text-noir-400">
                No ticket registrations yet.
              </TableCell>
            </TableRow>
          )}
          {tickets.map((t) => {
            const tier = TICKET_TIER[t.tier];
            const status = STATUS_BADGE[t.status];
            return (
              <TableRow key={t.id}>
                <TableCell className="px-5 py-3.5 font-mono text-xs text-noir-600">
                  <Link href={`/tickets/${t.id}`}>{t.ref}</Link>
                </TableCell>
                <TableCell className="text-[13px] font-bold text-noir-800">
                  <Link href={`/tickets/${t.id}`}>{t.name}</Link>
                </TableCell>
                <TableCell className="text-xs text-noir-600">{t.phone}</TableCell>
                <TableCell>
                  <Badge label={tier.label} bg={tier.bg} fg={tier.fg} />
                </TableCell>
                <TableCell className="text-xs text-noir-500">{t.source}</TableCell>
                <TableCell>
                  <Badge label={status.label} bg={status.bg} fg={status.fg} />
                </TableCell>
                <TableCell className="text-right">
                  <RowMenu
                    actions={[
                      { label: "View", onClick: () => router.push(`/tickets/${t.id}`) },
                      { label: "Edit", onClick: () => router.push(`/tickets/${t.id}/edit`) },
                      { label: "Delete", danger: true, onClick: () => setDeleteTarget(t) },
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
        title="Delete ticket?"
        description={`Ticket ${deleteTarget?.ref} will be permanently removed. This cannot be undone.`}
        onConfirm={async () => {
          if (!deleteTarget) return;
          await deleteTicket(deleteTarget.id);
          router.refresh();
          toast.success("Ticket deleted");
        }}
      />
    </div>
  );
}
