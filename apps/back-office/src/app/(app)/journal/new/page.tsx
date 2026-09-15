import Link from "next/link";
import { JournalForm } from "../journal-form";

export default function NewJournalPostPage() {
  return (
    <div>
      <Link href="/journal" className="text-[13px] font-semibold text-noir-400 hover:text-noir-600">
        ← Back to journal
      </Link>
      <h1 className="mt-4 font-display text-[30px] font-normal tracking-[-0.01em] sm:text-[36px]">
        New post
      </h1>
      <JournalForm />
    </div>
  );
}
