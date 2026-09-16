"use client";

import { createClient as createBrowserClient } from "@zoeallure/supabase/client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { toast } from "sonner";
import { Spinner } from "@/components/spinner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { LINE_META, STOCK_BADGE, stockLevel } from "@/lib/catalog";
import { ngn } from "@/lib/format";
import { deleteImage, uploadImage, validateUploadImage } from "@/lib/image-upload";
import { createProduct, updateProduct } from "./actions";
import type { ProductCategory, Tables } from "@zoeallure/supabase";

const CATEGORY_OPTIONS: ProductCategory[] = ["hair", "personal", "nails", "wigs"];

export function ProductForm({
  product,
  lowStockThreshold,
}: {
  product?: Tables<"products">;
  lowStockThreshold: number;
}) {
  const router = useRouter();
  const isEdit = !!product;
  const [supabase] = useState(() => createBrowserClient());
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState(product?.name ?? "");
  const [description, setDescription] = useState(product?.description ?? "");
  const [category, setCategory] = useState<ProductCategory>(product?.category ?? "hair");
  const [price, setPrice] = useState(product?.price ?? 5000);
  const [units, setUnits] = useState(product?.stock_units ?? 20);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(product?.image_url ?? null);
  const [removeImage, setRemoveImage] = useState(false);

  const level = STOCK_BADGE[stockLevel(units, lowStockThreshold)];

  function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const validationError = validateUploadImage(file);
    if (validationError) {
      toast.error(validationError);
      e.target.value = "";
      return;
    }
    setImageFile(file);
    setRemoveImage(false);
    setImagePreview(URL.createObjectURL(file));
  }

  function handleRemoveImage() {
    setImageFile(null);
    setImagePreview(null);
    setRemoveImage(true);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSaving(true);
    try {
      let imageUrl = product?.image_url ?? null;
      if (imageFile) {
        imageUrl = await uploadImage(supabase, "product-images", imageFile);
        if (product?.image_url) await deleteImage(supabase, "product-images", product.image_url);
      } else if (removeImage) {
        if (product?.image_url) await deleteImage(supabase, "product-images", product.image_url);
        imageUrl = null;
      }

      const slug = name
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
      const input = {
        name,
        description: description || null,
        category,
        price,
        stock_units: units,
        image_url: imageUrl,
        ...(isEdit ? {} : { slug: slug || `product-${Date.now()}` }),
      };
      if (isEdit) {
        await updateProduct(product.id, input);
        toast.success("Product updated");
        router.push(`/products/${product.id}`);
        router.refresh();
      } else {
        const created = await createProduct(input as Parameters<typeof createProduct>[0]);
        toast.success("Product added");
        router.push(`/products/${created.id}`);
        router.refresh();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="mt-7 grid grid-cols-1 items-start gap-8 lg:grid-cols-[.55fr_1fr]">
        <div className="relative aspect-square overflow-hidden rounded-[20px] border-[1.5px] border-dashed border-noir-200 bg-noir-50">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
          {imagePreview ? (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element -- local object URL / Supabase Storage URL, no next/image loader configured */}
              <img src={imagePreview} alt={name || "Product photo"} className="h-full w-full object-cover" />
              <div className="absolute inset-x-0 bottom-0 flex justify-center gap-2 bg-gradient-to-t from-black/55 to-transparent p-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  className="h-auto rounded-full border-white/40 bg-white/10 px-3.5 py-1.5 text-[11.5px] font-bold text-white backdrop-blur-sm hover:bg-white/20"
                >
                  Change
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleRemoveImage}
                  className="h-auto rounded-full border-white/40 bg-white/10 px-3.5 py-1.5 text-[11.5px] font-bold text-white backdrop-blur-sm hover:bg-white/20"
                >
                  Remove
                </Button>
              </div>
            </>
          ) : (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex h-full w-full flex-col items-center justify-center gap-2.5 p-5 text-center"
            >
              <span
                className="flex h-[46px] w-[46px] items-center justify-center rounded-full text-white"
                style={{ background: LINE_META[category].swatch }}
              >
                {LINE_META[category].initials}
              </span>
              <span className="text-[12.5px] font-bold text-noir-600">{LINE_META[category].line}</span>
              <span className="text-[11.5px] font-semibold text-violet-500">Click to add a photo</span>
              <span className="text-[10.5px] text-noir-400">JPG or PNG, up to 5MB</span>
            </button>
          )}
        </div>

        <div className="grid gap-4">
          <div>
            <div className="mb-1.5 text-[11px] font-bold tracking-[0.1em] text-noir-400 uppercase">
              Product name
            </div>
            <Input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-auto w-full rounded-control border-noir-200 px-3.5 py-3 text-sm font-semibold focus-visible:border-violet-500 focus-visible:ring-violet-100"
            />
          </div>

          <div>
            <div className="mb-1.5 text-[11px] font-bold tracking-[0.1em] text-noir-400 uppercase">
              Description <span className="font-medium text-noir-300 normal-case">(optional)</span>
            </div>
            <Textarea
              value={description ?? ""}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full rounded-control border-noir-200 px-3.5 py-3 text-[13px] leading-relaxed text-noir-600 focus-visible:border-violet-500 focus-visible:ring-violet-100"
            />
          </div>

          <div>
            <div className="mb-1.5 text-[11px] font-bold tracking-[0.1em] text-noir-400 uppercase">
              Category
            </div>
            <div className="flex flex-wrap gap-2">
              {CATEGORY_OPTIONS.map((c) => {
                const active = c === category;
                return (
                  <Button
                    type="button"
                    variant="outline"
                    key={c}
                    onClick={() => setCategory(c)}
                    className="h-auto rounded-full border px-4 py-2.5 text-[12.5px] font-bold capitalize"
                    style={{
                      borderColor: active ? "transparent" : "#D8D5E0",
                      background: active ? LINE_META[c].swatch : "transparent",
                      color: active ? "#fff" : "#403B4C",
                    }}
                  >
                    {c}
                  </Button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3.5">
            <div>
              <div className="mb-1.5 text-[11px] font-bold tracking-[0.1em] text-noir-400 uppercase">
                Price (₦)
              </div>
              <div className="flex items-center gap-3 rounded-control border border-noir-200 px-3.5 py-3">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => setPrice((v) => Math.max(0, v - 500))}
                  className="h-auto w-auto p-0 text-base text-noir-500 hover:bg-transparent"
                >
                  −
                </Button>
                <span className="flex-1 text-center text-sm font-bold">{ngn(price)}</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => setPrice((v) => v + 500)}
                  className="h-auto w-auto p-0 text-base text-noir-500 hover:bg-transparent"
                >
                  +
                </Button>
              </div>
            </div>
            <div>
              <div className="mb-1.5 text-[11px] font-bold tracking-[0.1em] text-noir-400 uppercase">
                Units in stock
              </div>
              <div className="flex items-center gap-3 rounded-control border border-noir-200 px-3.5 py-3">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => setUnits((v) => Math.max(0, v - 1))}
                  className="h-auto w-auto p-0 text-base text-noir-500 hover:bg-transparent"
                >
                  −
                </Button>
                <span className="flex-1 text-center text-sm font-bold">{units}</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => setUnits((v) => v + 1)}
                  className="h-auto w-auto p-0 text-base text-noir-500 hover:bg-transparent"
                >
                  +
                </Button>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between gap-3 rounded-xl border border-noir-100 bg-noir-50 px-4 py-3.5">
            <span className="text-[12.5px] text-noir-500">
              Stock status, based on units and the{" "}
              <Link href="/settings" className="font-semibold text-violet-500 hover:text-violet-600">
                low-stock threshold
              </Link>{" "}
              ({lowStockThreshold} units)
            </span>
            <span
              className="rounded-full px-[11px] py-[5px] text-[11px] font-bold whitespace-nowrap"
              style={{ background: level.bg, color: level.fg }}
            >
              {level.label}
            </span>
          </div>

          {error && <p className="text-[12.5px] font-medium text-status-cancelled">{error}</p>}

          <div className="mt-1.5 flex gap-2.5">
            <Button
              type="submit"
              disabled={saving}
              className="h-auto rounded-xl bg-violet-500 px-[30px] py-3.5 text-[13.5px] font-bold text-white hover:bg-violet-600 disabled:opacity-70"
            >
              {saving && <Spinner size={15} />}
              {saving ? "Saving…" : isEdit ? "Save changes" : "Add product"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              className="h-auto rounded-xl border-noir-200 px-[30px] py-3.5 text-[13.5px] font-bold"
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
}
