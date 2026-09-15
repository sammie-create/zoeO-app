import { createClient as createServerClient } from "@zoeallure/supabase/server";
import Link from "next/link";
import { notFound } from "next/navigation";
import { TicketForm } from "../../ticket-form";

export default async function EditTicketPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createServerClient();
  const { data: ticket } = await supabase.from("tickets").select("*").eq("id", id).single();
  if (!ticket) notFound();

  return (
    <div className="max-w-[560px]">
      <Link href="/tickets" className="text-[13px] font-semibold text-noir-400 hover:text-noir-600">
        ← Back to tickets
      </Link>
      <h1 className="mt-4 font-display text-[30px] font-normal tracking-[-0.01em] sm:text-[36px]">
        Edit ticket
      </h1>
      <TicketForm ticket={ticket} />
    </div>
  );
}
