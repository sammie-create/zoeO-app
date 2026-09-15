import { createClient as createServerClient } from "@zoeallure/supabase/server";
import Link from "next/link";
import { SectionEyebrow } from "../badge";
import { Button } from "@/components/ui/button";
import { ProductsTable } from "./products-table";
import { getLowStockThreshold } from "@/lib/settings";
import type { ProductCategory } from "@zoeallure/supabase";

export const dynamic = "force-dynamic";

const CATEGORIES: { key: ProductCategory | "all"; label: string }[] = [
  { key: "all", label: "All" },
  { key: "hair", label: "Hair" },
  { key: "personal", label: "Personal" },
  { key: "nails", label: "Nails" },
  { key: "wigs", label: "Wigs" },
];

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ cat?: string }>;
}) {
  const { cat } = await searchParams;
  const activeCat = (cat ?? "all") as ProductCategory | "all";

  const supabase = await createServerClient();
  let query = supabase.from("products").select("*").order("created_at", { ascending: false });
  if (activeCat !== "all") query = query.eq("category", activeCat);
  const { data: products } = await query;

  const { count: totalCount } = await supabase.from("products").select("*", { count: "exact", head: true });
  const { count: visibleCount } = await supabase
    .from("products")
    .select("*", { count: "exact", head: true })
    .eq("is_hidden", false);
  const lowStockThreshold = await getLowStockThreshold(supabase);

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <SectionEyebrow>Commerce</SectionEyebrow>
          <h1 className="mt-3.5 font-display text-[28px] font-normal tracking-[-0.01em] sm:text-[34px] lg:text-[38px]">
            Products
          </h1>
          <p className="mt-2 text-[13.5px] text-noir-500 sm:text-[14.5px]">
            The four lines, one shelf — {totalCount ?? 0} products, {visibleCount ?? 0} visible on the
            storefront.
          </p>
        </div>
        <Button
          asChild
          className="h-auto rounded-full bg-noir-800 px-[22px] py-3 text-[13.5px] font-bold text-white hover:bg-violet-500"
        >
          <Link href="/products/new">+ Add product</Link>
        </Button>
      </div>

      <div className="mt-6 mb-5 flex flex-wrap gap-2.5">
        {CATEGORIES.map((c) => {
          const active = c.key === activeCat;
          return (
            <Button
              asChild
              variant="outline"
              key={c.key}
              className="h-auto rounded-full border px-[18px] py-[9px] text-[12.5px] font-bold"
              style={{
                borderColor: active ? "transparent" : "#D8D5E0",
                background: active ? "#1A1720" : "transparent",
                color: active ? "#fff" : "#403B4C",
              }}
            >
              <Link href={c.key === "all" ? "/products" : `/products?cat=${c.key}`}>{c.label}</Link>
            </Button>
          );
        })}
      </div>

      <ProductsTable products={products ?? []} lowStockThreshold={lowStockThreshold} />
    </div>
  );
}
