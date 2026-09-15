"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Badge } from "../badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { STATUS_BADGE } from "@/lib/catalog";
import { cycleSponsorStatus } from "./actions";
import type { Tables } from "@zoeallure/supabase";

export function SponsorsTable({ sponsors }: { sponsors: Tables<"sponsors">[] }) {
  const router = useRouter();

  async function handleCycle(s: Tables<"sponsors">) {
    const next = await cycleSponsorStatus(s.id, s.status as "new" | "contacted" | "confirmed");
    router.refresh();
    toast.success(`Marked ${next}`);
  }

  return (
    <div className="overflow-hidden rounded-[18px] border border-noir-100">
      <Table>
        <TableHeader>
          <TableRow className="bg-noir-50 hover:bg-noir-50">
            <TableHead className="px-5 py-[13px] text-[11px] font-bold tracking-[0.1em] text-noir-400 uppercase">
              Brand
            </TableHead>
            <TableHead className="text-[11px] font-bold tracking-[0.1em] text-noir-400 uppercase">
              Interested in
            </TableHead>
            <TableHead className="text-[11px] font-bold tracking-[0.1em] text-noir-400 uppercase">
              Contact
            </TableHead>
            <TableHead className="text-[11px] font-bold tracking-[0.1em] text-noir-400 uppercase">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sponsors.length === 0 && (
            <TableRow>
              <TableCell colSpan={4} className="px-5 py-8 text-[13px] whitespace-normal text-noir-400">
                No sponsor enquiries yet.
              </TableCell>
            </TableRow>
          )}
          {sponsors.map((s) => {
            const status = STATUS_BADGE[s.status];
            return (
              <TableRow key={s.id} onClick={() => handleCycle(s)} className="cursor-pointer">
                <TableCell className="px-5 py-3.5 text-[13px] font-bold text-noir-800">{s.brand}</TableCell>
                <TableCell className="text-xs text-noir-600">{s.tier}</TableCell>
                <TableCell>
                  <div className="text-xs text-noir-600">{s.contact_name}</div>
                  <div className="mt-0.5 text-[11px] text-noir-400">{s.email}</div>
                </TableCell>
                <TableCell>
                  <Badge label={`${status.label} ↻`} bg={status.bg} fg={status.fg} />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
