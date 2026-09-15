import { createClient as createServerClient } from "@zoeallure/supabase/server";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getLowStockThreshold } from "@/lib/settings";
import { ProductForm } from "../../product-form";

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createServerClient();
  const [{ data: product }, lowStockThreshold] = await Promise.all([
    supabase.from("products").select("*").eq("id", id).single(),
    getLowStockThreshold(supabase),
  ]);

  if (!product) notFound();

  return (
    <div>
      <Link
        href={`/products/${id}`}
        className="text-[13px] font-semibold text-noir-400 hover:text-noir-600"
      >
        ← Back to product
      </Link>
      <h1 className="mt-4 font-display text-[30px] font-normal tracking-[-0.01em] sm:text-[36px]">
        Edit {product.name}
      </h1>
      <ProductForm product={product} lowStockThreshold={lowStockThreshold} />
    </div>
  );
}
