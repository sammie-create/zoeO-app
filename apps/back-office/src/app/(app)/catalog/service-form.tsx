"use client";

import { createClient as createBrowserClient } from "@zoeallure/supabase/client";
import { useRouter } from "next/navigation";
import { useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Spinner } from "@/components/spinner";
import { ngn } from "@/lib/format";
import { deleteImage, uploadImage, validateUploadImage } from "@/lib/image-upload";
import { createService, updateService } from "./actions";
import type { Tables } from "@zoeallure/supabase";

type ServiceCategory = Tables<"services">["category"];

const CATEGORY_OPTIONS: ServiceCategory[] = ["Hair", "Bridal", "Lashes", "Nails"];
const ICON_OPTIONS = ["revamp", "sparkle", "lashes", "nails", "gele", "brush"] as const;

export function ServiceForm({ service }: { service?: Tables<"services"> }) {
  const router = useRouter();
  const isEdit = !!service;
  const [supabase] = useState(() => createBrowserClient());
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState(service?.name ?? "");
  const [description, setDescription] = useState(service?.description ?? "");
  const [price, setPrice] = useState(service?.price ?? 15000);
  const [duration, setDuration] = useState(service?.duration_label ?? "60 min");
  const [durationMins, setDurationMins] = useState(service?.duration_mins ?? 60);
  const [category, setCategory] = useState<ServiceCategory>(service?.category ?? "Hair");
  const [icon, setIcon] = useState<string>(service?.icon ?? ICON_OPTIONS[0]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(service?.image_url ?? null);
  const [removeImage, setRemoveImage] = useState(false);

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

  async function submit(status: "draft" | "published") {
    setError(null);
    setSaving(true);
    try {
      let imageUrl = service?.image_url ?? null;
      if (imageFile) {
        imageUrl = await uploadImage(supabase, "service-images", imageFile);
        if (service?.image_url) await deleteImage(supabase, "service-images", service.image_url);
      } else if (removeImage) {
        if (service?.image_url) await deleteImage(supabase, "service-images", service.image_url);
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
        price,
        duration_label: duration,
        duration_mins: durationMins,
        category,
        icon,
        image_url: imageUrl,
        status,
        ...(isEdit ? {} : { slug: slug || `service-${Date.now()}` }),
      };
      if (isEdit) {
        await updateService(service.id, input);
        toast.success("Service updated");
        router.push("/catalog");
        router.refresh();
      } else {
        await createService(input as Parameters<typeof createService>[0]);
        toast.success(status === "published" ? "Service published" : "Saved as draft");
        router.push("/catalog");
        router.refresh();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setSaving(false);
    }
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    submit(service?.status ?? "published");
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6.5 grid max-w-[640px] gap-4">
      <div className="relative aspect-[16/9] overflow-hidden rounded-[20px] border-[1.5px] border-dashed border-noir-200 bg-noir-50">
        <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
        {imagePreview ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element -- local object URL / Supabase Storage URL, no next/image loader configured */}
            <img src={imagePreview} alt={name || "Service photo"} className="h-full w-full object-cover" />
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
            className="flex h-full w-full flex-col items-center justify-center gap-1.5 text-noir-400"
          >
            <span className="text-[13px] font-bold">Add a photo</span>
            <span className="text-[11.5px]">PNG or JPG, up to 5MB</span>
          </button>
        )}
      </div>

      <div>
        <div className="mb-1.5 text-[11px] font-bold tracking-[0.1em] text-noir-400 uppercase">Service name</div>
        <Input
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="h-auto w-full rounded-control border-noir-200 px-3.5 py-3 text-sm font-semibold focus-visible:border-violet-500 focus-visible:ring-violet-100"
        />
      </div>

      <div>
        <div className="mb-1.5 text-[11px] font-bold tracking-[0.1em] text-noir-400 uppercase">Description</div>
        <Textarea
          value={description ?? ""}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="w-full rounded-control border-noir-200 px-3.5 py-3 text-[13px] leading-relaxed text-noir-600 focus-visible:border-violet-500 focus-visible:ring-violet-100"
        />
      </div>

      <div>
        <div className="mb-1.5 text-[11px] font-bold tracking-[0.1em] text-noir-400 uppercase">Category</div>
        <div className="flex flex-wrap gap-2">
          {CATEGORY_OPTIONS.map((c) => (
            <Button
              type="button"
              variant="outline"
              key={c}
              onClick={() => setCategory(c)}
              className="h-auto rounded-full border px-4 py-2.5 text-[12.5px] font-bold"
              style={{
                borderColor: c === category ? "transparent" : "#D8D5E0",
                background: c === category ? "#7F23E0" : "transparent",
                color: c === category ? "#fff" : "#403B4C",
              }}
            >
              {c}
            </Button>
          ))}
        </div>
      </div>

      <div>
        <div className="mb-1.5 text-[11px] font-bold tracking-[0.1em] text-noir-400 uppercase">Icon</div>
        <div className="flex flex-wrap gap-2">
          {ICON_OPTIONS.map((i) => (
            <Button
              type="button"
              variant="outline"
              key={i}
              onClick={() => setIcon(i)}
              className="h-auto rounded-full border px-4 py-2.5 text-[12.5px] font-bold capitalize"
              style={{
                borderColor: i === icon ? "transparent" : "#D8D5E0",
                background: i === icon ? "#7F23E0" : "transparent",
                color: i === icon ? "#fff" : "#403B4C",
              }}
            >
              {i}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3.5">
        <div>
          <div className="mb-1.5 text-[11px] font-bold tracking-[0.1em] text-noir-400 uppercase">Price (₦)</div>
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
          <div className="mb-1.5 text-[11px] font-bold tracking-[0.1em] text-noir-400 uppercase">Duration label</div>
          <Input
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            className="h-auto w-full rounded-control border-noir-200 px-3.5 py-3 text-sm font-semibold focus-visible:border-violet-500 focus-visible:ring-violet-100"
          />
        </div>
        <div>
          <div className="mb-1.5 text-[11px] font-bold tracking-[0.1em] text-noir-400 uppercase">Minutes</div>
          <Input
            type="number"
            min={1}
            value={durationMins}
            onChange={(e) => setDurationMins(Math.max(1, Number(e.target.value) || 1))}
            className="h-auto w-full rounded-control border-noir-200 px-3.5 py-3 text-sm font-semibold focus-visible:border-violet-500 focus-visible:ring-violet-100"
          />
        </div>
      </div>

      {error && <p className="text-[12.5px] font-medium text-status-cancelled">{error}</p>}

      <div className="mt-1.5 flex flex-wrap gap-2.5">
        <Button
          type="submit"
          disabled={saving}
          className="h-auto rounded-xl bg-violet-500 px-[26px] py-3.5 text-[13.5px] font-bold text-white hover:bg-violet-600 disabled:opacity-70"
        >
          {saving && <Spinner size={15} />}
          {isEdit ? "Save changes" : "Publish"}
        </Button>
        {!isEdit && (
          <Button
            type="button"
            variant="outline"
            disabled={saving}
            onClick={() => submit("draft")}
            className="h-auto rounded-xl border-noir-200 px-[26px] py-3.5 text-[13.5px] font-bold"
          >
            Save as draft
          </Button>
        )}
        <Button
          type="button"
          variant="ghost"
          onClick={() => router.push("/catalog")}
          className="h-auto rounded-xl px-5 py-3.5 text-[13.5px] font-bold text-noir-400"
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
