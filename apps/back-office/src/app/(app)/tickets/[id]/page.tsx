import { createClient as createServerClient } from "@zoeallure/supabase/server";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "../../badge";
import { Button } from "@/components/ui/button";
import { STATUS_BADGE, TICKET_TIER } from "@/lib/catalog";
import { formatDate } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function TicketViewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createServerClient();
  const { data: ticket } = await supabase.from("tickets").select("*").eq("id", id).single();
  if (!ticket) notFound();

  const tier = TICKET_TIER[ticket.tier];
  const status = STATUS_BADGE[ticket.status];

  return (
    <div className="max-w-[560px]">
      <Link href="/tickets" className="text-[13px] font-semibold text-noir-400 hover:text-noir-600">
        ← Back to tickets
      </Link>
      <div className="mt-4.5 rounded-[20px] border border-noir-100 p-[30px]">
        <div className="flex items-center justify-between">
          <span className="font-mono text-[13px] text-noir-600">{ticket.ref}</span>
          <Badge label={status.label} bg={status.bg} fg={status.fg} />
        </div>
        <div className="mt-4 font-display text-[28px]">{ticket.name}</div>
        <div className="mt-2">
          <Badge label={tier.label} bg={tier.bg} fg={tier.fg} />
        </div>

        <div className="mt-4.5 grid gap-2.5 text-[13.5px] text-noir-600">
          <div className="flex justify-between">
            <span className="text-noir-400">Phone</span>
            <span className="font-bold">{ticket.phone}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-noir-400">Email</span>
            <span className="font-bold">{ticket.email ?? "—"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-noir-400">Source</span>
            <span className="font-bold">{ticket.source ?? "—"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-noir-400">Registered</span>
            <span className="font-bold">{formatDate(ticket.created_at)}</span>
          </div>
        </div>

        <Button
          asChild
          className="mt-5.5 h-auto rounded-full bg-violet-500 px-[26px] py-3.5 text-[13.5px] font-bold text-white hover:bg-violet-600"
        >
          <Link href={`/tickets/${ticket.id}/edit`}>Edit ticket</Link>
        </Button>
      </div>
    </div>
  );
}
