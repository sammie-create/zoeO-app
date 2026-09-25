import Link from "next/link";
import { notFound } from "next/navigation";
import { Icon } from "@/components/shared/icon";
import { MoneyLabel } from "@/components/shared/money-label";
import { ProductCard } from "@/components/shop/product-card";
import { ProductActions, ShareButton } from "@/components/product/product-actions";
import { careCopy, categoryLabels } from "@/lib/data";
import { getProduct, getProducts } from "@/lib/queries";
import type { ProductCategory } from "@zoeallure/supabase";

const pdCategoryLabels: Record<ProductCategory, string> = {
  hair: "Luxury Hair Care",
  personal: "Personal Care",
  nails: "Nail Artistry",
  wigs: "Extensions & Wigs",
};

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await getProduct(id);
  if (!product) notFound();

  const allProducts = await getProducts();
  const related = allProducts.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4);
  const care = careCopy[product.category];

  return (
    <main className="mx-auto max-w-[calc(1280px_+_clamp(16px,5vw,80px)*2)] px-[clamp(16px,5vw,80px)] pt-14 pb-20">
      <div className="pd grid grid-cols-1 gap-[clamp(32px,4vw,64px)] lg:grid-cols-[1fr_.93fr]">
        <div className="aspect-[711/568] overflow-hidden rounded-[18px] bg-noir-800">
          {product.image_url ? (
            // eslint-disable-next-line @next/next/no-img-element -- Supabase Storage URL, no next/image loader configured
            <img src={product.image_url} alt={product.name} className="size-full object-cover" />
          ) : (
            <div className="size-full bg-noir-700" />
          )}
        </div>

        <div className="lg:sticky lg:top-28 lg:self-start">
          <nav aria-label="Breadcrumb" className="crumbs">
            <Link href="/shop">Shop</Link> ›{" "}
            <Link href={`/shop?cat=${product.category}`}>{categoryLabels[product.category]}</Link>
          </nav>
          <span className="text-[13px] font-bold tracking-[.02em] text-violet-400 uppercase">
            {product.brand ? `${product.brand} ` : ""}
            {pdCategoryLabels[product.category]}
          </span>
          <h1 className="pd__title">{product.name}</h1>
          <div className="pd__price">
            <MoneyLabel ngn={product.price} decimals />
          </div>
          {product.description && <p className="pd__desc">{product.description}</p>}

          <div className="care">
            <h4>Recommended care &amp; routine</h4>
            <div className="care__cols">
              {care.map(([h, t]) => (
                <div key={h}>
                  <h6>{h}</h6>
                  <p>{t}</p>
                </div>
              ))}
            </div>
          </div>

          <ProductActions productId={product.id} productName={product.name} maxQty={product.stock_units} />

          <div className="stock">
            <div>
              <span className="pulse-dot size-2 animate-pulse rounded-full" />
              {product.stock_units > 0 ? `${product.stock_units} in stock — ships out tomorrow` : "Currently out of stock"}
            </div>
            <div className="muted">
              <Icon name="store" className="size-4" /> Store pickup available at ZoeO Allure Boutique, Lagos
            </div>
          </div>

          <div className="badges">
            <span>
              <Icon name="truck" className="size-4" /> Fast Delivery
            </span>
            <span>
              <Icon name="shield" className="size-4" /> 30 Days Return
            </span>
            <span>
              <Icon name="checkCircle" className="size-4" /> 2 Year Warranty
            </span>
            <span>
              <Icon name="leaf" className="size-4" /> 100% Organic
            </span>
          </div>

          <div className="pd-links">
            <Link href={`/contact?topic=product&product=${encodeURIComponent(product.name)}`}>
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
