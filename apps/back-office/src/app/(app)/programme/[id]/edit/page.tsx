import { createClient as createServerClient } from "@zoeallure/supabase/server";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProgrammeForm } from "../../programme-form";

export default async function EditProgrammePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createServerClient();
  const [{ data: programme }, { data: slots }] = await Promise.all([
    supabase.from("programmes").select("*").eq("id", id).single(),
    supabase.from("programme_slots").select("*").eq("programme_id", id),
  ]);
  if (!programme) notFound();

  return (
    <div>
      <Link href="/programme" className="text-[13px] font-semibold text-noir-400 hover:text-noir-600">
        ← Back to programme
      </Link>
      <h1 className="mt-4 font-display text-[30px] font-normal tracking-[-0.01em] sm:text-[36px]">
        Edit {programme.name}
      </h1>
      <ProgrammeForm programme={{ ...programme, slots: slots ?? [] }} />
    </div>
  );
}
