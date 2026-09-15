import { createClient as createServerClient } from "@zoeallure/supabase/server";
import { SectionEyebrow } from "../badge";
import { SponsorsTable } from "./sponsors-table";

export const dynamic = "force-dynamic";

export default async function SponsorshipsPage() {
  const supabase = await createServerClient();
  const { data: sponsors, count } = await supabase
    .from("sponsors")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false });

  return (
    <div>
      <SectionEyebrow>Exhibition</SectionEyebrow>
      <h1 className="mt-3.5 font-display text-[28px] font-normal tracking-[-0.01em] sm:text-[34px] lg:text-[38px]">
        Sponsorships &amp; partners
      </h1>
      <p className="mt-2 text-[13.5px] text-noir-500 sm:text-[14.5px]">
        {count ?? 0} enquiries across Headline, Gold, Silver and in-kind tiers, plus vendor and creator interest.
        Click a row to move it to the next stage.
      </p>

      <div className="mt-6">
        <SponsorsTable sponsors={sponsors ?? []} />
      </div>
    </div>
  );
}
