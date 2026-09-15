import { createClient as createServerClient } from "@zoeallure/supabase/server";
import Link from "next/link";
import { notFound } from "next/navigation";
import { computeCustomerAggregates } from "@/lib/customer-aggregates";
import { formatDateTime, getInitials, ngn } from "@/lib/format";
import { MessagePanel } from "./message-panel";

export const dynamic = "force-dynamic";

export default async function CustomerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createServerClient();
  const { data: customer } = await supabase.from("customer_profiles").select("*").eq("id", id).single();
  if (!customer) notFound();

  const aggregates = await computeCustomerAggregates(supabase);
  const agg = aggregates[id] ?? { spend: 0, lastActive: null, tags: [], history: [] };

  return (
    <div className="max-w-[640px]">
      <Link href="/customers" className="text-[13px] font-semibold text-noir-400 hover:text-noir-600">
        ← Back to customers
      </Link>
      <div className="mt-4.5 rounded-[20px] border border-noir-100 p-7">
        <div className="flex items-center gap-4">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-violet-500 text-[17px] font-extrabold text-white">
            {getInitials(customer.name)}
          </span>
          <div>
            <div className="font-display text-xl text-noir-800">{customer.name}</div>
            <div className="mt-0.5 text-[13px] text-noir-400">{customer.phone}</div>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-1.5">
          {agg.tags.map((tag) => (
            <span key={tag} className="rounded-full bg-[#F4ECFE] px-3 py-[5px] text-[11px] font-bold text-[#55129B]">
              {tag}
            </span>
          ))}
        </div>

        <div className="mt-4.5 flex justify-between rounded-xl border border-noir-100 bg-noir-50 p-4">
          <div>
            <div className="text-[11px] text-noir-400">Total spend</div>
            <div className="mt-1 text-base font-extrabold">{ngn(agg.spend)}</div>
          </div>
          <div>
            <div className="text-[11px] text-noir-400">Last activity</div>
            <div className="mt-1.5 text-[13px] font-bold">
              {agg.lastActive ? formatDateTime(agg.lastActive) : "—"}
            </div>
          </div>
        </div>

        <div className="mt-5 text-[11px] font-bold tracking-[0.1em] text-noir-400 uppercase">History</div>
        <div className="mt-2.5 grid gap-2">
          {agg.history.length === 0 && <p className="text-[12.5px] text-noir-400">No activity yet.</p>}
          {agg.history.map((h, i) => (
            <div
              key={i}
              className="flex justify-between gap-3 rounded-[10px] border border-noir-100 bg-noir-50 px-3 py-2.5 text-[12.5px]"
            >
              <span className="text-noir-600">{h.text}</span>
              <span className="font-mono text-[11px] text-noir-400">{formatDateTime(h.date)}</span>
            </div>
          ))}
        </div>
      </div>

      <MessagePanel name={customer.name} phone={customer.phone} />
    </div>
  );
}
