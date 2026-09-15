import { createClient as createServerClient } from "@zoeallure/supabase/server";
import { SectionEyebrow } from "../badge";
import { TeamGrid } from "./team-grid";

export const dynamic = "force-dynamic";

export default async function TeamPage() {
  const supabase = await createServerClient();
  const { data: members } = await supabase
    .from("team_members")
    .select("*")
    .order("sort_order", { ascending: true });

  return (
    <div>
      <SectionEyebrow>Content</SectionEyebrow>
      <h1 className="mt-3.5 font-display text-[28px] font-normal tracking-[-0.01em] sm:text-[34px] lg:text-[38px]">
        Team &amp; artists
      </h1>
      <p className="mt-2 text-[13.5px] text-noir-500 sm:text-[14.5px]">
        The hands behind the look — shown on the landing page.
      </p>

      <div className="mt-1">
        <TeamGrid members={members ?? []} />
      </div>
    </div>
  );
}
