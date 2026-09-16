import { createClient as createServerClient } from "@zoeallure/supabase/server";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "../../badge";
import { Button } from "@/components/ui/button";
import { ProductThumb } from "@/components/product-thumb";
import { LINE_META, STOCK_BADGE, stockLevel } from "@/lib/catalog";
import { getLowStockThreshold } from "@/lib/settings";
import { ngn } from "@/lib/format";
import { ToggleHideButton } from "./toggle-hide-button";

export const dynamic = "force-dynamic";

export default async function ProductViewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createServerClient();
  const [{ data: product }, lowStockThreshold] = await Promise.all([
    supabase.from("products").select("*").eq("id", id).single(),
    getLowStockThreshold(supabase),
  ]);

  if (!product) notFound();

  const meta = LINE_META[product.category];
  const level = STOCK_BADGE[stockLevel(product.stock_units, lowStockThreshold)];

  return (
    <div>
      <Link href="/products" className="text-[13px] font-semibold text-noir-400 hover:text-noir-600">
        ← Back to products
      </Link>
      <div className="mt-6 grid grid-cols-1 items-start gap-8 lg:max-w-[920px] lg:grid-cols-[.55fr_1fr]">
        <ProductThumb
          imageUrl={product.image_url}
          category={product.category}
          name={product.name}
          className="flex aspect-square items-center justify-center rounded-[20px]"
          initialsClassName="font-display text-[44px] text-white/85"
        />
        <div>
          <div className="flex items-center gap-2.5">
            <span className="font-mono text-[11px] text-violet-500">{meta.line}</span>
            <Badge
              label={product.is_hidden ? "Hidden" : "Visible"}
              bg={product.is_hidden ? "#F7F6F9" : "#E7F5EC"}
              fg={product.is_hidden ? "#5B5568" : "#1F7A50"}
            />
          </div>
          <h1 className="mt-3 font-display text-[30px] leading-tight font-normal sm:text-[38px]">
            {product.name}
          </h1>
          <div className="mt-3 text-xl font-extrabold sm:text-[22px]">{ngn(product.price)}</div>
          {product.description && (
            <p className="mt-4.5 max-w-[56ch] text-[14.5px] leading-relaxed text-noir-500">
              {product.description}
            </p>
          )}

          <div className="mt-5.5 flex flex-wrap items-center gap-6 rounded-2xl border border-noir-100 bg-noir-50 p-4.5">
            <div>
              <div className="text-[11px] text-noir-400">Stock status</div>
              <span
                className="mt-1.5 inline-block rounded-full px-[11px] py-[5px] text-[11px] font-bold"
                style={{ background: level.bg, color: level.fg }}
              >
                {level.label}
              </span>
            </div>
            <div>
              <div className="text-[11px] text-noir-400">Units in stock</div>
              <div className="mt-1.5 text-[15px] font-bold">{product.stock_units}</div>
            </div>
            <div>
              <div className="text-[11px] text-noir-400">Low-stock alert at</div>
              <div className="mt-1.5 text-[15px] font-bold">{lowStockThreshold} units</div>
            </div>
          </div>

          <div className="mt-6.5 flex flex-wrap gap-2.5">
            <Button
              asChild
              className="h-auto rounded-full bg-violet-500 px-[26px] py-3.5 text-[13.5px] font-bold text-white hover:bg-violet-600"
            >
              <Link href={`/products/${product.id}/edit`}>Edit product</Link>
            </Button>
            <ToggleHideButton id={product.id} hidden={product.is_hidden} />
          </div>
        </div>
      </div>
    </div>
  );
}
