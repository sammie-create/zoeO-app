"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
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

const PER_PAGE = 12;

export function ShopClient({ products }: { products: Product[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialCat = (searchParams.get("cat") as Product["category"] | null) ?? "all";
  const initialQ = searchParams.get("q") ?? "";
  const initialSort = searchParams.get("sort") ?? "featured";

  const [cat, setCat] = useState<"all" | Product["category"]>(
    categories.some((c) => c.key === initialCat) ? initialCat : "all",
  );
  const [q] = useState(initialQ);
  const [sort, setSort] = useState(initialSort);
  const [page, setPage] = useState(1);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [maxPrice, setMaxPrice] = useState(60000);
  const [stockOnly, setStockOnly] = useState(false);
  const [lowOnly, setLowOnly] = useState(false);

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
        (!q || `${p.name} ${categoryLabels[p.category]}`.toLowerCase().includes(q.toLowerCase())) &&
        p.price <= maxPrice &&
        (!stockOnly || p.stock_units > 0) &&
        (!lowOnly || p.stock_units < 10),
    );
    if (sort === "price-asc") list = [...list].sort((a, b) => a.price - b.price);
    else if (sort === "price-desc") list = [...list].sort((a, b) => b.price - a.price);
    else if (sort === "az") list = [...list].sort((a, b) => a.name.localeCompare(b.name));
    return list;
  }, [products, cat, q, sort, maxPrice, stockOnly, lowOnly]);

  const pages = Math.max(1, Math.ceil(items.length / PER_PAGE));
  const currentPage = Math.min(page, pages);
  const slice = items.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE);

  const title = q ? `Results for "${q}"` : cat === "all" ? "All Products" : categoryLabels[cat];

  function resetFilters() {
    setMaxPrice(60000);
    setStockOnly(false);
    setLowOnly(false);
    setCat("all");
    setPage(1);
    syncUrl("all", sort);
  }

  return (
    <main className="mx-auto max-w-[1280px] px-4 pt-8 pb-16 sm:px-6 sm:pt-10 lg:px-8">
      <section className="relative overflow-hidden rounded-2xl bg-noir-800 p-8 sm:p-12">
        <nav aria-label="Breadcrumb" className="mb-2 text-[13px] text-noir-400">
          <Link href="/" className="hover:text-white">
            Home
          </Link>{" "}
          › <span className="text-white">{q ? "Search" : cat === "all" ? "All" : categoryLabels[cat]}</span>
        </nav>
        <h1 className="font-display text-3xl font-bold sm:text-4xl">{title}</h1>
      </section>

      <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
        <button
          type="button"
          onClick={() => setFiltersOpen((v) => !v)}
          className={`inline-flex h-11 items-center gap-2 rounded-full border px-4 text-sm ${
            filtersOpen ? "border-violet-400 text-violet-300" : "border-white/16 text-noir-200"
          }`}
        >
          <Icon name="filter" className="size-4" />
          {filtersOpen ? "Hide Filters" : "Show Filters"}
        </button>
        <label className="flex items-center gap-2 text-sm text-noir-300">
          Sort by:
          <select
            value={sort}
            onChange={(e) => {
              setSort(e.target.value);
              setPage(1);
              syncUrl(cat, e.target.value);
            }}
            aria-label="Sort products"
            className="rounded-full border border-white/16 bg-transparent px-3 py-2 text-white"
          >
            <option value="featured">Featured</option>
            <option value="price-asc">Price: low to high</option>
            <option value="price-desc">Price: high to low</option>
            <option value="az">Alphabetical A–Z</option>
          </select>
        </label>
      </div>

      {filtersOpen && (
        <div className="mt-4 grid grid-cols-1 gap-6 rounded-2xl border border-white/10 p-6 sm:grid-cols-3">
          <div>
            <h5 className="mb-3 text-sm font-bold">Max price</h5>
            <input
              type="range"
              min={4000}
              max={60000}
              step={500}
              value={maxPrice}
              onChange={(e) => {
                setMaxPrice(Number(e.target.value));
                setPage(1);
              }}
              className="w-full accent-violet-500"
            />
            <div className="mt-1 text-sm text-noir-300">
              Up to <MoneyLabel ngn={maxPrice} />
            </div>
          </div>
          <div>
            <h5 className="mb-3 text-sm font-bold">Availability</h5>
            <label className="flex items-center gap-2 text-sm text-noir-300">
              <input type="checkbox" checked={stockOnly} onChange={(e) => setStockOnly(e.target.checked)} /> In stock only
            </label>
            <label className="mt-2 flex items-center gap-2 text-sm text-noir-300">
              <input type="checkbox" checked={lowOnly} onChange={(e) => setLowOnly(e.target.checked)} /> Almost gone (&lt; 10)
            </label>
          </div>
          <div className="flex items-end">
            <button type="button" onClick={resetFilters} className="h-10 rounded-full border border-white/16 px-4 text-sm hover:bg-white/6">
              Reset filters
            </button>
          </div>
        </div>
      )}

      <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-b border-white/8 pb-4">
        <div className="flex flex-wrap gap-2" role="tablist" aria-label="Categories">
          {categories.map((c) => (
            <button
              key={c.key}
              role="tab"
              aria-selected={cat === c.key}
              onClick={() => {
                setCat(c.key);
                setPage(1);
                syncUrl(c.key, sort);
              }}
              className={`h-9 rounded-full px-4 text-sm font-medium ${
                cat === c.key ? "bg-violet-500 text-white" : "bg-white/6 text-noir-200 hover:bg-white/10"
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
        <div aria-live="polite" className="text-sm text-noir-400">
          {items.length} product{items.length === 1 ? "" : "s"} in total
        </div>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
        {slice.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
        {slice.length === 0 && (
          <div className="col-span-full flex flex-col items-center gap-4 py-16 text-center">
            <h3 className="font-display text-2xl">Nothing matches yet</h3>
            <p className="text-noir-400">Try another category or clear your filters.</p>
            <button type="button" onClick={resetFilters} className="h-11 rounded-full bg-violet-500 px-6 text-sm font-bold text-white">
              Clear filters
            </button>
          </div>
        )}
      </div>

      {pages > 1 && (
        <nav aria-label="Pagination" className="mt-10 flex justify-center gap-2">
          <button
            disabled={currentPage === 1}
            onClick={() => setPage((p) => p - 1)}
            className="grid size-10 place-items-center rounded-full border border-white/16 disabled:opacity-30"
          >
            ‹
          </button>
          {Array.from({ length: pages }).map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={`grid size-10 place-items-center rounded-full text-sm ${
                currentPage === i + 1 ? "bg-violet-500 text-white" : "border border-white/16 text-noir-200"
              }`}
            >
              {i + 1}
            </button>
          ))}
          <button
            disabled={currentPage === pages}
            onClick={() => setPage((p) => p + 1)}
            className="grid size-10 place-items-center rounded-full border border-white/16 disabled:opacity-30"
          >
            ›
          </button>
        </nav>
      )}
    </main>
  );
}
