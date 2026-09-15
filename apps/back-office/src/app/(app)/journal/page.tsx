import { createClient as createServerClient } from "@zoeallure/supabase/server";
import Link from "next/link";
import { SectionEyebrow } from "../badge";
import { Button } from "@/components/ui/button";
import { JournalCards } from "./journal-cards";

export const dynamic = "force-dynamic";

export default async function JournalPage() {
  const supabase = await createServerClient();
  const { data: posts } = await supabase
    .from("journal_posts")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <SectionEyebrow>Content</SectionEyebrow>
          <h1 className="mt-3.5 font-display text-[28px] font-normal tracking-[-0.01em] sm:text-[34px] lg:text-[38px]">
            Journal
          </h1>
          <p className="mt-2 text-[13.5px] text-noir-500 sm:text-[14.5px]">
            Beauty notes shown on the landing page and linked from About.
          </p>
        </div>
        <Button
          asChild
          className="h-auto rounded-full bg-noir-800 px-[22px] py-3 text-[13.5px] font-bold text-white hover:bg-violet-500"
        >
          <Link href="/journal/new">+ New post</Link>
        </Button>
      </div>

      <div className="mt-7">
        <JournalCards posts={posts ?? []} />
      </div>
    </div>
  );
}
