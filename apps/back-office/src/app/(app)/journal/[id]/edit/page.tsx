import { createClient as createServerClient } from "@zoeallure/supabase/server";
import Link from "next/link";
import { notFound } from "next/navigation";
import { JournalForm } from "../../journal-form";

export default async function EditJournalPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createServerClient();
  const { data: post } = await supabase.from("journal_posts").select("*").eq("id", id).single();
  if (!post) notFound();

  return (
    <div>
      <Link href="/journal" className="text-[13px] font-semibold text-noir-400 hover:text-noir-600">
        ← Back to journal
      </Link>
      <h1 className="mt-4 font-display text-[30px] font-normal tracking-[-0.01em] sm:text-[36px]">
        Edit post
      </h1>
      <JournalForm post={post} />
    </div>
  );
}
