import { createClient as createServerClient } from "@zoeallure/supabase/server";
import Link from "next/link";
import { getLowStockThreshold } from "@/lib/settings";
import { ProductForm } from "../product-form";

export default async function NewProductPage() {
  const supabase = await createServerClient();
  const lowStockThreshold = await getLowStockThreshold(supabase);

  return (
    <div>
      <Link href="/products" className="text-[13px] font-semibold text-noir-400 hover:text-noir-600">
        ← Back to products
      </Link>
      <h1 className="mt-4 font-display text-[30px] font-normal tracking-[-0.01em] sm:text-[36px]">
        Add a product
      </h1>
      <p className="mt-2 text-sm text-noir-500">New products are visible on the storefront immediately — hide them from the product menu if it&apos;s not ready yet.</p>
      <ProductForm lowStockThreshold={lowStockThreshold} />
    </div>
  );
}
