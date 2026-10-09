"use client";

import { createClient as createBrowserClient } from "@zoeallure/supabase/client";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Spinner } from "@/components/spinner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { deleteImage, uploadImage, validateUploadImage } from "@/lib/image-upload";
import { createTestimonial, updateTestimonial } from "./actions";
import type { Tables } from "@zoeallure/supabase";

export function TestimonialModal({
  open,
  onOpenChange,
  testimonial,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  testimonial: Tables<"testimonials"> | null;
}) {
  const router = useRouter();
  const isEdit = !!testimonial;
  const [supabase] = useState(() => createBrowserClient());
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState("");
  const [quote, setQuote] = useState("");
  const [service, setService] = useState("");
  const [saving, setSaving] = useState(false);

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [removeImage, setRemoveImage] = useState(false);
  const [posX, setPosX] = useState(50);
  const [posY, setPosY] = useState(25);

  useEffect(() => {
    if (open) {
      setName(testimonial?.customer_name ?? "");
      setQuote(testimonial?.quote ?? "");
      setService(testimonial?.service_label ?? "");
      setImageFile(null);
      setImagePreview(testimonial?.photo_url ?? null);
      setRemoveImage(false);
      setPosX(testimonial?.photo_pos_x ?? 50);
      setPosY(testimonial?.photo_pos_y ?? 25);
    }
  }, [open, testimonial]);

  function handleFocalClick(e: React.MouseEvent<HTMLDivElement>) {
    if (!imagePreview) return;
    const rect = e.currentTarget.getBoundingClientRect();
    setPosX(Math.max(0, Math.min(100, Math.round(((e.clientX - rect.left) / rect.width) * 100))));
    setPosY(Math.max(0, Math.min(100, Math.round(((e.clientY - rect.top) / rect.height) * 100))));
  }

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
    setSaving(true);
    try {
      let photoUrl = testimonial?.photo_url ?? null;
      if (imageFile) {
        photoUrl = await uploadImage(supabase, "testimonial-photos", imageFile);
        if (testimonial?.photo_url) await deleteImage(supabase, "testimonial-photos", testimonial.photo_url);
      } else if (removeImage) {
        if (testimonial?.photo_url) await deleteImage(supabase, "testimonial-photos", testimonial.photo_url);
        photoUrl = null;
      }

      const input = {
        customer_name: name,
        quote,
        service_label: service || null,
        photo_url: photoUrl,
        photo_pos_x: posX,
        photo_pos_y: posY,
        status,
      };
      if (isEdit) {
        await updateTestimonial(testimonial.id, input);
        toast.success("Testimonial updated");
      } else {
        await createTestimonial(input);
        toast.success(status === "published" ? "Testimonial published" : "Saved as draft");
      }
      router.refresh();
      onOpenChange(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[520px] rounded-[22px] p-8">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl font-normal">
            {isEdit ? "Edit testimonial" : "Add testimonial"}
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-3.5">
          <div>
            <div className="mb-1.5 text-[11px] font-bold tracking-[0.1em] text-noir-400 uppercase">
              Customer photo <span className="font-medium text-noir-300 normal-case">(optional)</span>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
            <div className="flex items-start gap-3">
              <div
                className={`relative size-28 flex-none overflow-hidden rounded-[14px] border-[1.5px] border-dashed border-noir-200 bg-noir-50 ${imagePreview ? "cursor-crosshair" : ""}`}
                onClick={handleFocalClick}
              >
                {imagePreview && (
                  <>
                    {/* eslint-disable-next-line @next/next/no-img-element -- local object URL / Supabase Storage URL, no next/image loader configured */}
                    <img
                      src={imagePreview}
                      alt={name || "Customer photo"}
                      className="pointer-events-none size-full object-cover"
                      style={{ objectPosition: `${posX}% ${posY}%` }}
                    />
                    <span
                      className="pointer-events-none absolute size-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-violet-500 shadow-[0_0_0_1px_rgba(0,0,0,.25)]"
                      style={{ left: `${posX}%`, top: `${posY}%` }}
                    />
                  </>
                )}
              </div>
              <div className="flex flex-col items-start gap-2">
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    className="h-auto rounded-full border-noir-200 px-3.5 py-1.5 text-[11.5px] font-bold"
                  >
                    {imagePreview ? "Change" : "Upload"}
                  </Button>
                  {imagePreview && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleRemoveImage}
                      className="h-auto rounded-full border-noir-200 px-3.5 py-1.5 text-[11.5px] font-bold"
                    >
                      Remove
                    </Button>
                  )}
                </div>
                {imagePreview && (
                  <p className="text-[11px] leading-snug text-noir-400">
                    Click anywhere on the photo to set its crop focal point.
                  </p>
                )}
              </div>
            </div>
          </div>
          <div>
            <div className="mb-1.5 text-[11px] font-bold tracking-[0.1em] text-noir-400 uppercase">
              Customer name
            </div>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-auto w-full rounded-control border-noir-200 bg-noir-50 px-3.5 py-3 text-sm font-semibold focus-visible:border-violet-500 focus-visible:ring-violet-100"
            />
          </div>
          <div>
            <div className="mb-1.5 text-[11px] font-bold tracking-[0.1em] text-noir-400 uppercase">Testimony</div>
            <Textarea
              value={quote}
              onChange={(e) => setQuote(e.target.value)}
              rows={3}
              className="w-full rounded-control border-noir-200 bg-noir-50 px-3.5 py-3 text-[13px] leading-relaxed focus-visible:border-violet-500 focus-visible:ring-violet-100"
            />
          </div>
          <div>
            <div className="mb-1.5 text-[11px] font-bold tracking-[0.1em] text-noir-400 uppercase">
              Service / company <span className="font-medium text-noir-300 normal-case">(optional)</span>
            </div>
            <Input
              value={service}
              onChange={(e) => setService(e.target.value)}
              className="h-auto w-full rounded-control border-noir-200 bg-noir-50 px-3.5 py-3 text-sm font-semibold focus-visible:border-violet-500 focus-visible:ring-violet-100"
            />
          </div>
          <div className="mt-1 flex gap-2.5">
            <Button
              type="button"
              disabled={saving}
              onClick={() => submit("published")}
              className="h-auto rounded-xl bg-violet-500 px-6 py-3 text-[13px] font-bold text-white hover:bg-violet-600"
            >
              {saving && <Spinner size={14} />}
              Publish
            </Button>
            <Button
              type="button"
              variant="outline"
              disabled={saving}
              onClick={() => submit("draft")}
              className="h-auto rounded-xl border-noir-200 px-6 py-3 text-[13px] font-bold"
            >
              Save as draft
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
