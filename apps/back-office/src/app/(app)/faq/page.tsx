import { createClient as createServerClient } from "@zoeallure/supabase/server";
import { SectionEyebrow } from "../badge";
import { FaqList } from "./faq-list";

export const dynamic = "force-dynamic";

export default async function FaqPage() {
  const supabase = await createServerClient();
  const { data: faqs } = await supabase.from("faqs").select("*").order("sort_order", { ascending: true });

  return (
    <div>
      <SectionEyebrow>Content</SectionEyebrow>
      <h1 className="mt-3.5 font-display text-[28px] font-normal tracking-[-0.01em] sm:text-[34px] lg:text-[38px]">
        FAQ
      </h1>
      <p className="mt-2 text-[13.5px] text-noir-500 sm:text-[14.5px]">
        Shown on the landing page, above the WhatsApp consultation prompt.
      </p>

      <div className="mt-1">
        <FaqList faqs={faqs ?? []} />
      </div>
    </div>
  );
}
