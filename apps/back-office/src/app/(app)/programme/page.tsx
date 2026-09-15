import { createClient as createServerClient } from "@zoeallure/supabase/server";
import Link from "next/link";
import { SectionEyebrow } from "../badge";
import { Button } from "@/components/ui/button";
import { ProgrammeCards, type ProgrammeRow } from "./programme-cards";

export const dynamic = "force-dynamic";

export default async function ProgrammePage() {
  const supabase = await createServerClient();
  const { data: programmes } = await supabase
    .from("programmes")
    .select("*")
    .order("sort_order", { ascending: true });

  const programmeIds = (programmes ?? []).map((p) => p.id);
  const { data: slots } = programmeIds.length
    ? await supabase.from("programme_slots").select("*").in("programme_id", programmeIds)
    : { data: [] };

  const rows: ProgrammeRow[] = (programmes ?? []).map((p) => ({
    ...p,
    slots: (slots ?? []).filter((s) => s.programme_id === p.id),
  }));

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <SectionEyebrow>Exhibition</SectionEyebrow>
          <h1 className="mt-3.5 font-display text-[28px] font-normal tracking-[-0.01em] sm:text-[34px] lg:text-[38px]">
            Programme
          </h1>
          <p className="mt-2 text-[13.5px] text-noir-500 sm:text-[14.5px]">
            Toggle the running slots for each track. Last week of November · Ikeja, Lagos.
          </p>
        </div>
        <Button
          asChild
          className="h-auto rounded-full bg-noir-800 px-[22px] py-3 text-[13.5px] font-bold text-white hover:bg-violet-500"
        >
          <Link href="/programme/new">+ Add programme</Link>
        </Button>
      </div>

      <div className="mt-7">
        <ProgrammeCards programmes={rows} />
      </div>
    </div>
  );
}
