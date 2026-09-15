import { createClient as createServerClient } from "@zoeallure/supabase/server";
import Link from "next/link";
import { SectionEyebrow } from "../badge";
import { Button } from "@/components/ui/button";
import { CatalogCards } from "./catalog-cards";

export const dynamic = "force-dynamic";

export default async function CatalogPage() {
  const supabase = await createServerClient();
  const { data: services } = await supabase.from("services").select("*").order("created_at", { ascending: false });

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <SectionEyebrow>Services</SectionEyebrow>
          <h1 className="mt-3.5 font-display text-[28px] font-normal tracking-[-0.01em] sm:text-[34px] lg:text-[38px]">
            Service catalog
          </h1>
          <p className="mt-2 text-[13.5px] text-noir-500 sm:text-[14.5px]">
            The bookable services shown on the storefront, with price and duration.
          </p>
        </div>
        <Button
          asChild
          className="h-auto rounded-full bg-noir-800 px-[22px] py-3 text-[13.5px] font-bold text-white hover:bg-violet-500"
        >
          <Link href="/catalog/new">+ Add service</Link>
        </Button>
      </div>

      <div className="mt-7">
        <CatalogCards services={services ?? []} />
      </div>
    </div>
  );
}
