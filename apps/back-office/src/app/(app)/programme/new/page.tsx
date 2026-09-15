import Link from "next/link";
import { ProgrammeForm } from "../programme-form";

export default function NewProgrammePage() {
  return (
    <div>
      <Link href="/programme" className="text-[13px] font-semibold text-noir-400 hover:text-noir-600">
        ← Back to programme
      </Link>
      <h1 className="mt-4 font-display text-[30px] font-normal tracking-[-0.01em] sm:text-[36px]">
        New programme track
      </h1>
      <ProgrammeForm />
    </div>
  );
}
