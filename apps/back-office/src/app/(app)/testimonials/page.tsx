import { createClient as createServerClient } from "@zoeallure/supabase/server";
import { SectionEyebrow } from "../badge";
import { TestimonialsGrid } from "./testimonials-grid";

export const dynamic = "force-dynamic";

export default async function TestimonialsPage() {
  const supabase = await createServerClient();
  const { data: testimonials } = await supabase
    .from("testimonials")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <SectionEyebrow>Content</SectionEyebrow>
          <h1 className="mt-3.5 font-display text-[28px] font-normal tracking-[-0.01em] sm:text-[34px] lg:text-[38px]">
            Testimonials
          </h1>
          <p className="mt-2 text-[13.5px] text-noir-500 sm:text-[14.5px]">
            Shown on the landing page review section.
          </p>
        </div>
      </div>

      <div className="mt-1">
        <TestimonialsGrid testimonials={testimonials ?? []} />
      </div>
    </div>
  );
}
