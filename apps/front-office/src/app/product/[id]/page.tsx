import Link from "next/link";
import { notFound } from "next/navigation";
import { Icon } from "@/components/shared/icon";
import { MoneyLabel } from "@/components/shared/money-label";
import { ProductCard } from "@/components/shop/product-card";
import { ProductActions, ShareButton } from "@/components/product/product-actions";
import { careCopy, categoryLabels } from "@/lib/data";
import { getProduct, getProducts } from "@/lib/queries";

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await getProduct(id);
  if (!product) notFound();

  const allProducts = await getProducts();
  const related = allProducts.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4);
  const care = careCopy[product.category];

  return (
    <main className="mx-auto max-w-[1280px] px-4 py-10 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_.93fr]">
        <div className="overflow-hidden rounded-2xl bg-noir-800">
          {product.image_url ? (
            // eslint-disable-next-line @next/next/no-img-element -- Supabase Storage URL, no next/image loader configured
            <img src={product.image_url} alt={product.name} className="aspect-square w-full object-cover" />
          ) : (
            <div className="aspect-square w-full bg-noir-700" />
          )}
        </div>

        <div>
          <nav aria-label="Breadcrumb" className="mb-2 text-[13px] text-noir-400">
            <Link href="/shop" className="hover:text-white">
              Shop
            </Link>{" "}
            ›{" "}
            <Link href={`/shop?cat=${product.category}`} className="hover:text-white">
              {categoryLabels[product.category]}
            </Link>
          </nav>
          <span className="text-sm font-semibold text-violet-400 uppercase">{categoryLabels[product.category]}</span>
          {product.brand && (
            <div className="mt-1.5 text-[13px] font-semibold text-champagne-100 uppercase">{product.brand}</div>
          )}
          <h1 className="font-display mt-2 text-3xl font-bold sm:text-4xl">{product.name}</h1>
          <div className="mt-3 text-2xl font-bold text-champagne-100">
            <MoneyLabel ngn={product.price} decimals />
          </div>
          {product.description && <p className="mt-4 leading-[1.7] text-noir-200">{product.description}</p>}

          <div className="mt-6 rounded-2xl border border-white/10 p-5">
            <h4 className="mb-3 font-bold">Recommended care &amp; routine</h4>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {care.map(([h, t]) => (
                <div key={h}>
                  <h6 className="mb-1 text-sm font-bold text-violet-300">{h}</h6>
                  <p className="text-[13px] text-noir-300">{t}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6">
            <ProductActions productId={product.id} productName={product.name} maxQty={product.stock_units} />
          </div>

          <div className="mt-5 flex flex-col gap-2 text-sm text-noir-300">
            <div className="flex items-center gap-2">
              <span className="size-2 animate-pulse rounded-full bg-status-booked" />
              {product.stock_units > 0 ? `${product.stock_units} in stock — ships out tomorrow` : "Currently out of stock"}
            </div>
            <div className="flex items-center gap-1.5">
              <Icon name="store" className="size-4" /> Store pickup available at ZoeO Allure Boutique, Lagos
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-4 border-t border-white/8 pt-5 text-[13px] text-noir-300">
            <span className="inline-flex items-center gap-1.5">
              <Icon name="truck" className="size-4" /> Fast Delivery
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Icon name="shield" className="size-4" /> 30 Days Return
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Icon name="checkCircle" className="size-4" /> 2 Year Warranty
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Icon name="leaf" className="size-4" /> 100% Organic
            </span>
          </div>

          <div className="mt-5 flex items-center gap-5 border-t border-white/8 pt-5">
            <Link
              href={`/contact?topic=product&product=${encodeURIComponent(product.name)}`}
              className="inline-flex items-center gap-1.5 text-[13px] text-noir-300 hover:text-white"
            >
              <Icon name="help" className="size-4" /> Ask a question
            </Link>
            <ShareButton productName={product.name} />
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <div className="mt-20">
          <h2 className="font-display mb-6 text-2xl font-bold">You may also like</h2>
          <div className="grid grid-cols-2 gap-5 sm:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </main>
  );
}
