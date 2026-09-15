import { createClient as createServerClient } from "@zoeallure/supabase/server";
import Link from "next/link";
import { SectionEyebrow } from "../badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { computeCustomerAggregates } from "@/lib/customer-aggregates";
import { formatDate, getInitials, ngn } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function CustomersPage() {
  const supabase = await createServerClient();
  const { data: customers, count } = await supabase
    .from("customer_profiles")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false });

  const aggregates = await computeCustomerAggregates(supabase);

  return (
    <div>
      <SectionEyebrow>Customers</SectionEyebrow>
      <h1 className="mt-3.5 font-display text-[28px] font-normal tracking-[-0.01em] sm:text-[34px] lg:text-[38px]">
        Customers
      </h1>
      <p className="mt-2 text-[13.5px] text-noir-500 sm:text-[14.5px]">
        Everyone who has ordered, booked or registered — {count ?? 0} people so far.
      </p>

      <div className="mt-7 rounded-[18px] border border-noir-100">
        <Table className="min-w-[900px]">
          <TableHeader>
            <TableRow className="bg-noir-50 hover:bg-noir-50">
              <TableHead className="px-5 py-[13px] text-[11px] font-bold tracking-[0.1em] text-noir-400 uppercase">
                Customer
              </TableHead>
              <TableHead className="text-[11px] font-bold tracking-[0.1em] text-noir-400 uppercase">Phone</TableHead>
              <TableHead className="text-[11px] font-bold tracking-[0.1em] text-noir-400 uppercase">Tags</TableHead>
              <TableHead className="text-[11px] font-bold tracking-[0.1em] text-noir-400 uppercase">
                Total spend
              </TableHead>
              <TableHead className="text-[11px] font-bold tracking-[0.1em] text-noir-400 uppercase">
                Last activity
              </TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {(customers ?? []).length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="px-5 py-8 text-[13px] whitespace-normal text-noir-400">
                  No customers yet.
                </TableCell>
              </TableRow>
            )}
            {(customers ?? []).map((c) => {
              const agg = aggregates[c.id] ?? { spend: 0, lastActive: null, tags: [] };
              return (
                <TableRow key={c.id}>
                  <TableCell className="px-5 py-3.5">
                    <Link href={`/customers/${c.id}`} className="flex items-center gap-3">
                      <span className="flex h-[34px] w-[34px] flex-none items-center justify-center rounded-full bg-violet-500 text-[11.5px] font-extrabold text-white">
                        {getInitials(c.name)}
                      </span>
                      <span className="text-[13px] font-bold text-noir-800">{c.name}</span>
                    </Link>
                  </TableCell>
                  <TableCell className="text-xs text-noir-600">{c.phone}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1.5">
                      {agg.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full bg-[#F4ECFE] px-2.5 py-1 text-[10.5px] font-bold text-[#55129B]"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="text-[13px] font-bold text-noir-800">{ngn(agg.spend)}</TableCell>
                  <TableCell className="text-xs text-noir-600">
                    {agg.lastActive ? formatDate(agg.lastActive) : "—"}
                  </TableCell>
                  <TableCell className="text-noir-300">
                    <Link href={`/customers/${c.id}`}>→</Link>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
