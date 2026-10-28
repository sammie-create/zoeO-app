import { createClient as createServerClient } from "@zoeallure/supabase/server";
import { SectionEyebrow } from "../badge";
import { ReviewsGrid } from "./reviews-grid";

export const dynamic = "force-dynamic";

export default async function ReviewsPage() {
  const supabase = await createServerClient();
  const [{ data: reviews }, { data: services }, { data: products }] = await Promise.all([
    supabase.from("reviews").select("*").order("created_at", { ascending: false }),
    supabase.from("services").select("id, name"),
    supabase.from("products").select("id, name"),
  ]);

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <SectionEyebrow>Content</SectionEyebrow>
          <h1 className="mt-3.5 font-display text-[28px] font-normal tracking-[-0.01em] sm:text-[34px] lg:text-[38px]">
            Reviews
          </h1>
          <p className="mt-2 text-[13.5px] text-noir-500 sm:text-[14.5px]">
            Submitted by customers on the storefront reviews page. They publish immediately — delete anything
            spammy or inappropriate here.
          </p>
        </div>
      </div>

      <div className="mt-1">
        <ReviewsGrid reviews={reviews ?? []} services={services ?? []} products={products ?? []} />
      </div>
    </div>
  );
}
