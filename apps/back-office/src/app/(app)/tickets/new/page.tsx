import Link from "next/link";
import { TicketForm } from "../ticket-form";

export default function NewTicketPage() {
  return (
    <div className="max-w-[560px]">
      <Link href="/tickets" className="text-[13px] font-semibold text-noir-400 hover:text-noir-600">
        ← Back to tickets
      </Link>
      <h1 className="mt-4 font-display text-[30px] font-normal tracking-[-0.01em] sm:text-[36px]">
        Add a ticket
      </h1>
      <TicketForm />
    </div>
  );
}
