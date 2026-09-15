import { createClient as createServerClient } from "@zoeallure/supabase/server";
import { SectionEyebrow } from "../badge";
import { AboutStatsGrid } from "./about-stats-grid";

export const dynamic = "force-dynamic";

export default async function AboutStatsPage() {
  const supabase = await createServerClient();
  const { data: stats } = await supabase
    .from("about_stats")
    .select("*")
    .order("sort_order", { ascending: true });

  return (
    <div>
      <SectionEyebrow>Content</SectionEyebrow>
      <h1 className="mt-3.5 font-display text-[28px] font-normal tracking-[-0.01em] sm:text-[34px] lg:text-[38px]">
        About us — rotating stats
      </h1>
      <p className="mt-2 text-[13.5px] text-noir-500 sm:text-[14.5px]">
        The four figures shown in the landing page&apos;s violet stat card and the About page grid. Click a card to
        edit it.
      </p>

      <AboutStatsGrid stats={stats ?? []} />
    </div>
  );
}
