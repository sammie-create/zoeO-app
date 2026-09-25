"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState, type ReactNode } from "react";
import { Icon } from "@/components/shared/icon";
import { ProductCard } from "@/components/shop/product-card";
import { categoryLabels } from "@/lib/data";
import type { Product } from "@/lib/queries";
import { MoneyLabel } from "@/components/shared/money-label";

const categories: { key: "all" | Product["category"]; label: string }[] = [
  { key: "all", label: "All" },
  { key: "hair", label: categoryLabels.hair },
  { key: "personal", label: categoryLabels.personal },
  { key: "nails", label: categoryLabels.nails },
  { key: "wigs", label: categoryLabels.wigs },
];

const PER_PAGE = 13; // 3 cards + promo card on row one, then rows of five

function PromoCard() {
  return (
    <Link href="/shop?cat=hair" className="promo-card">
      {/* eslint-disable-next-line @next/next/no-img-element -- static marketing asset */}
      <img src="/img/cat-hair.webp" alt="Hair care products" />
      <div>
        <span className="block text-[11px] font-semibold text-white uppercase">The hair care essentials</span>
        <h3 className="font-display my-2.5 text-[clamp(26px,2.2vw,32px)] font-bold">Discover Hair Care</h3>
        <p className="mb-5 max-w-[420px] text-[15px] leading-[1.5]">
          Premium ingredients crafted to restore shine, depth, and volume to your natural crown.
        </p>
        <span className="inline-flex h-11 items-center gap-2 rounded-full bg-violet-500 px-6 text-sm font-bold text-white uppercase transition-colors hover:bg-violet-600">
          Shop now <Icon name="arrow" className="size-4" />
        </span>
      </div>
    </Link>
  );
}

export function ShopClient({ products }: { products: Product[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialCat = (searchParams.get("cat") as Product["category"] | null) ?? "all";
  const initialQ = searchParams.get("q") ?? "";
  const initialSort = searchParams.get("sort") ?? "featured";
  const initialBrand = searchParams.get("brand");

  const [cat, setCat] = useState<"all" | Product["category"]>(
    categories.some((c) => c.key === initialCat) ? initialCat : "all",
  );
  const [q] = useState(initialQ);
  const [sort, setSort] = useState(initialSort);
  const [page, setPage] = useState(1);
  const [filtersOpen, setFiltersOpen] = useState(!!initialBrand);
  const [brands, setBrands] = useState<Set<string>>(new Set(initialBrand ? [initialBrand] : []));
  const [maxPrice, setMaxPrice] = useState(60000);
  const [stockOnly, setStockOnly] = useState(false);
  const [lowOnly, setLowOnly] = useState(false);

  const allBrands = useMemo(
    () => Array.from(new Set(products.map((p) => p.brand).filter((b): b is string => !!b))).sort(),
    [products],
  );

  const featured = useMemo(() => products.find((p) => p.is_bestseller) ?? products[0], [products]);

  function syncUrl(nextCat: typeof cat, nextSort: string) {
    const params = new URLSearchParams();
    if (nextCat !== "all") params.set("cat", nextCat);
    if (q) params.set("q", q);
    if (nextSort !== "featured") params.set("sort", nextSort);
    router.replace(params.size ? `/shop?${params.toString()}` : "/shop", { scroll: false });
  }

  const items = useMemo(() => {
    let list = products.filter(
      (p) =>
        (cat === "all" || p.category === cat) &&
        (!q || `${p.name} ${p.brand ?? ""} ${categoryLabels[p.category]}`.toLowerCase().includes(q.toLowerCase())) &&
        (brands.size === 0 || (p.brand && brands.has(p.brand))) &&
        p.price <= maxPrice &&
        (!stockOnly || p.stock_units > 0) &&
        (!lowOnly || p.stock_units < 10),
    );
    if (sort === "price-asc") list = [...list].sort((a, b) => a.price - b.price);
    else if (sort === "price-desc") list = [...list].sort((a, b) => b.price - a.price);
    else if (sort === "az") list = [...list].sort((a, b) => a.name.localeCompare(b.name));
    else if (sort === "best") list = [...list].sort((a, b) => Number(b.is_bestseller) - Number(a.is_bestseller));
    return list;
  }, [products, cat, q, sort, brands, maxPrice, stockOnly, lowOnly]);

  const pages = Math.max(1, Math.ceil(items.length / PER_PAGE));
  const currentPage = Math.min(page, pages);
  const slice = items.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE);

  const title = q ? `Results for "${q}"` : cat === "all" ? "All Products" : categoryLabels[cat];
  const showPromo = currentPage === 1 && cat !== "personal" && cat !== "nails" && cat !== "wigs" && !q && slice.length >= 3;

  const gridItems: ReactNode[] = [];
  slice.forEach((p, i) => {
    gridItems.push(<ProductCard key={p.id} product={p} index={i} />);
    if (showPromo && i === 2) gridItems.push(<PromoCard key="promo" />);
  });

  function toggleBrand(b: string) {
    setBrands((prev) => {
      const next = new Set(prev);
      if (next.has(b)) next.delete(b);
      else next.add(b);
      return next;
    });
    setPage(1);
  }

  function resetFilters() {
    setMaxPrice(60000);
    setStockOnly(false);
    setLowOnly(false);
    setBrands(new Set());
    setCat("all");
    setPage(1);
    syncUrl("all", sort);
  }

  return (
    <main className="mx-auto max-w-[calc(1280px_+_clamp(16px,5vw,80px)*2)] px-[clamp(16px,5vw,80px)] pt-10 pb-16">
      <section className="shop-hero">
        {/* eslint-disable-next-line @next/next/no-img-element -- static marketing asset */}
        <img className="bg" src="/img/gallery-3.webp" alt="" />
        <div>
          <nav aria-label="Breadcrumb" className="crumbs">
            <Link href="/">Home</Link> ›{" "}
            <Link href="/shop">Collections</Link> ›{" "}
            <span className="cur">{q ? "Search" : cat === "all" ? "All" : categoryLabels[cat]}</span>
          </nav>
          <h1 className="font-display text-[clamp(34px,4.6vw,60px)] leading-[1.08] font-bold">{title}</h1>
        </div>
        {featured && (
          <Link href={`/product/${featured.id}`} className="feat-card">
            {featured.image_url ? (
              // eslint-disable-next-line @next/next/no-img-element -- Supabase Storage URL, no next/image loader configured
              <img src={featured.image_url} alt="" />
            ) : (
              <div className="size-[72px] rounded-[10px] bg-noir-700" />
            )}
            <div>
              <span className="chip chip--violet">FEATURED</span>
              <strong>{featured.name}</strong>
              <span className="p">
                <MoneyLabel ngn={featured.price} />
              </span>
            </div>
          </Link>
        )}
      </section>

      <div className="shop-bar">
        <button
          type="button"
          className={`pill-btn ${filtersOpen ? "is-on" : ""}`}
          aria-expanded={filtersOpen}
          aria-controls="filters"
          onClick={() => setFiltersOpen((v) => !v)}
        >
          <Icon name="filter" className="size-4" />
          <span>{filtersOpen ? "Hide Filters" : "Show Filters"}</span>
        </button>
        <label className="sort">
          Sort by:
          <select
            value={sort}
            onChange={(e) => {
              setSort(e.target.value);
              setPage(1);
              syncUrl(cat, e.target.value);
            }}
            aria-label="Sort products"
          >
            <option value="featured">Featured</option>
            <option value="best">Best selling</option>
            <option value="price-asc">Price: low to high</option>
            <option value="price-desc">Price: high to low</option>
            <option value="az">Alphabetical A–Z</option>
          </select>
        </label>
      </div>

      <div id="filters" className={`filters ${filtersOpen ? "is-open" : ""}`}>
        <div>
          <div className="filters__panel">
            <div>
              <h5>Brand</h5>
              {allBrands.length === 0 ? (
                <p className="text-sm text-noir-400">No brands yet</p>
              ) : (
                allBrands.map((b) => (
                  <label key={b} className="check">
                    <input type="checkbox" checked={brands.has(b)} onChange={() => toggleBrand(b)} /> {b}
                  </label>
                ))
              )}
            </div>
            <div>
              <h5>Max price</h5>
              <input
                type="range"
                className="range"
                min={4000}
                max={60000}
                step={500}
                value={maxPrice}
                onChange={(e) => {
                  setMaxPrice(Number(e.target.value));
                  setPage(1);
                }}
              />
              <div className="range-val">
                Up to{" "}
                <strong>
                  <MoneyLabel ngn={maxPrice} />
                </strong>
              </div>
            </div>
            <div>
              <h5>Availability</h5>
              <label className="check">
                <input type="checkbox" checked={stockOnly} onChange={(e) => setStockOnly(e.target.checked)} /> In
                stock only
              </label>
              <label className="check">
                <input type="checkbox" checked={lowOnly} onChange={(e) => setLowOnly(e.target.checked)} /> Almost
                gone (&lt; 10)
              </label>
            </div>
            <div className="flex flex-col justify-end gap-2.5">
              <button
                type="button"
                onClick={resetFilters}
                className="h-10 rounded-full border border-white/16 px-4 text-sm hover:bg-white/6"
              >
                Reset filters
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="cat-tabs-row">
        <div className="cat-tabs" role="tablist" aria-label="Categories">
          {categories.map((c) => (
            <button
              key={c.key}
              role="tab"
              aria-selected={cat === c.key}
              className={`cat-tab ${cat === c.key ? "is-active" : ""}`}
              onClick={() => {
                setCat(c.key);
                setPage(1);
                syncUrl(c.key, sort);
              }}
            >
              {c.label}
            </button>
          ))}
        </div>
        <div className="count" aria-live="polite">
          {items.length} product{items.length === 1 ? "" : "s"} in total
        </div>
      </div>

      <div className="pgrid">
        {gridItems}
        {slice.length === 0 && (
          <div className="empty">
            <h3 className="font-display text-2xl">Nothing matches yet</h3>
            <p>Try another category or clear your filters.</p>
            <button
              type="button"
              onClick={resetFilters}
              className="mt-5 h-11 rounded-full bg-violet-500 px-6 text-sm font-bold text-white"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>

      {pages > 1 && (
        <nav aria-label="Pagination" className="pager">
          <button disabled={currentPage === 1} onClick={() => setPage((p) => p - 1)} aria-label="Previous page">
            ‹
          </button>
          {Array.from({ length: pages }).map((_, i) => (
            <button
              key={i}
              className={currentPage === i + 1 ? "is-active" : ""}
              onClick={() => setPage(i + 1)}
              aria-label={`Page ${i + 1}`}
            >
              {i + 1}
            </button>
          ))}
          <button disabled={currentPage === pages} onClick={() => setPage((p) => p + 1)} aria-label="Next page">
            ›
          </button>
        </nav>
      )}
    </main>
  );
}
