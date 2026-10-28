"use client";

import { createClient as createBrowserClient } from "@zoeallure/supabase/client";
import { useRouter } from "next/navigation";
import { useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { toast } from "sonner";
import { Icon } from "@/components/shared/icon";
import { Reveal } from "@/components/shared/reveal";
import { submitReview } from "@/lib/actions";
import { uploadImage } from "@/lib/image-upload";
import type { Product, Service } from "@/lib/queries";
import { ReviewAvatar } from "./review-avatar";
import { ReviewStars } from "./review-stars";

const PHOTOS_BUCKET = "review-photos";
const RATING_WORDS = ["", "Poor", "Fair", "Good", "Very good", "Excellent"];
const MAX_BODY = 800;

function cropToSquare(file: File): Promise<File> {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith("image/")) {
      reject(new Error("Please choose an image file."));
      return;
    }
    if (file.size > 15e6) {
      reject(new Error("That photo is too large (15MB max)."));
      return;
    }
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const side = Math.min(img.naturalWidth, img.naturalHeight);
      const canvas = document.createElement("canvas");
      canvas.width = canvas.height = 320;
      const ctx = canvas.getContext("2d");
      ctx?.drawImage(
        img,
        (img.naturalWidth - side) / 2,
        (img.naturalHeight - side) / 2,
        side,
        side,
        0,
        0,
        320,
        320,
      );
      URL.revokeObjectURL(url);
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error("We couldn't read that image. Try a JPG or PNG."));
            return;
          }
          resolve(new File([blob], `${crypto.randomUUID()}.jpg`, { type: "image/jpeg" }));
        },
        "image/jpeg",
        0.85,
      );
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("We couldn't read that image. Try a JPG or PNG."));
    };
    img.src = url;
  });
}

export function ReviewForm({ services, products }: { services: Service[]; products: Product[] }) {
  const router = useRouter();
  const [supabase] = useState(() => createBrowserClient());
  const fileRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState("");
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [body, setBody] = useState("");
  const [subject, setSubject] = useState("");
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [photoError, setPhotoError] = useState<string | null>(null);
  const [invalid, setInvalid] = useState<Set<string>>(new Set());
  const [submitting, setSubmitting] = useState(false);

  async function handlePhotoChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingPhoto(true);
    setPhotoError(null);
    try {
      const cropped = await cropToSquare(file);
      setPhotoFile(cropped);
      setPhotoPreview(URL.createObjectURL(cropped));
    } catch (err) {
      setPhotoError(err instanceof Error ? err.message : "Could not read that photo.");
    } finally {
      setUploadingPhoto(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  function removePhoto() {
    setPhotoFile(null);
    setPhotoPreview(null);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const next = new Set<string>();
    if (name.trim().length === 0) next.add("name");
    if (rating === 0) next.add("rating");
    if (body.trim().length < 10) next.add("body");
    setInvalid(next);
    if (next.size > 0) return;

    setSubmitting(true);
    try {
      let photoUrl: string | null = null;
      if (photoFile) {
        photoUrl = await uploadImage(supabase, PHOTOS_BUCKET, photoFile);
      }
      const [kind, id] = subject.split(":");
      await submitReview({
        customerName: name.trim(),
        rating,
        body: body.trim(),
        photoUrl,
        serviceId: kind === "svc" ? id : null,
        productId: kind === "product" ? id : null,
      });

      toast.success(`Thank you, ${name.trim().split(/\s+/)[0]}`, { description: "Your review is now on the page." });
      setName("");
      setRating(0);
      setBody("");
      setSubject("");
      removePhoto();
      setInvalid(new Set());
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not post your review.");
    } finally {
      setSubmitting(false);
    }
  }

  const displayedRating = hoverRating || rating;
  const previewName = name.trim() || "Your name";
  const subjectLabel =
    subject &&
    (subject.startsWith("svc:")
      ? services.find((s) => s.id === subject.slice(4))?.name
      : products.find((p) => p.id === subject.slice(8))?.name);

  return (
    <div className="rv-write grid gap-10 lg:grid-cols-[1fr_1.15fr] lg:gap-20">
      <Reveal className="lg:sticky lg:top-28 lg:self-start">
        <span className="inline-flex h-6.5 items-center rounded-full bg-violet-500/15 px-3.5 text-[11px] font-bold tracking-[.14em] text-violet-300 uppercase light:bg-violet-500/12 light:text-violet-600">
          Share your experience
        </span>
        <h2 className="h1 mt-4.5 mb-3.5 text-foreground">
          Leave a <em className="text-violet-400 italic">review</em>
        </h2>
        <p className="max-w-[440px] text-noir-300 light:text-noir-600">
          Tell us about your visit or your order. Your words help the next client choose with confidence.
        </p>

        <div className="mt-9 max-w-[440px]">
          <small className="mb-2.5 block text-[11px] font-semibold tracking-[.08em] text-muted-foreground uppercase">
            Preview
          </small>
          <div className="rounded-card border border-[var(--line)] bg-surface p-6">
            <div className="flex flex-col gap-4.5">
              <ReviewStars rating={displayedRating} />
              <p
                className={`line-clamp-8 text-[15px] leading-[1.65] ${
                  body ? "text-noir-200 light:text-noir-600" : "text-muted-foreground"
                }`}
              >
                {body || "Your review will appear here as you type."}
              </p>
              <span className="flex min-w-0 items-center gap-3">
                <ReviewAvatar name={previewName} photoUrl={photoPreview} />
                <span className="min-w-0">
                  <strong className="block truncate text-[15px] text-foreground">{previewName}</strong>
                  <span className="block truncate text-[13px] text-muted-foreground">
                    {subjectLabel || "ZoeO Allure client"}
                  </span>
                </span>
              </span>
            </div>
          </div>
        </div>
      </Reveal>

      <Reveal delay={120} className="panel">
        <form className="grid gap-5.5" noValidate onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="rv-file">Profile photo (optional)</label>
            <div className="flex items-center gap-4.5">
              <ReviewAvatar name={previewName} photoUrl={photoPreview} size="xl" />
              <div>
                <div className="flex flex-wrap items-center gap-2 gap-y-3">
                  <label className="inline-flex h-9.5 cursor-pointer items-center gap-1.5 rounded-full border border-[var(--line-strong)] px-4 text-[13px] font-semibold text-foreground transition-colors hover:border-violet-400">
                    <input
                      ref={fileRef}
                      type="file"
                      accept="image/*"
                      className="sr-only"
                      onChange={handlePhotoChange}
                      disabled={uploadingPhoto}
                    />
                    <Icon name="user" className="size-4" />
                    {uploadingPhoto ? "Processing…" : photoPreview ? "Change photo" : "Upload photo"}
                  </label>
                  {photoPreview && (
                    <button
                      type="button"
                      onClick={removePhoto}
                      className="text-[13px] font-semibold text-muted-foreground hover:text-foreground"
                    >
                      Remove
                    </button>
                  )}
                </div>
                <p className="mt-1.5 text-[13px] leading-[1.5] text-muted-foreground">
                  No photo? We&apos;ll show your initials instead.
                </p>
                {photoError && <p className="mt-1.5 text-[13px] font-medium text-status-cancelled">{photoError}</p>}
              </div>
            </div>
          </div>

          <div className={`field ${invalid.has("name") ? "is-invalid" : ""}`}>
            <label htmlFor="rv-name">Your name</label>
            <input
              id="rv-name"
              className="input"
              placeholder="Adaeze O."
              autoComplete="name"
              maxLength={40}
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setInvalid((s) => {
                  const next = new Set(s);
                  next.delete("name");
                  return next;
                });
              }}
            />
            <span className="err">Please enter your name.</span>
          </div>

          <fieldset className={`field ${invalid.has("rating") ? "is-invalid" : ""}`}>
            <legend className="mb-2 text-[14px] font-medium text-noir-200 light:text-noir-700">Your rating</legend>
            <div className="flex items-center gap-1" onMouseLeave={() => setHoverRating(0)}>
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  title={RATING_WORDS[n]}
                  onMouseEnter={() => setHoverRating(n)}
                  onClick={() => {
                    setRating(n);
                    setInvalid((s) => {
                      const next = new Set(s);
                      next.delete("rating");
                      return next;
                    });
                  }}
                  className="grid size-10 place-items-center rounded-control text-noir-600 transition-colors light:text-noir-200"
                >
                  <Icon
                    name="star"
                    className={`size-5 ${n <= displayedRating ? "fill-current text-champagne-500" : "fill-current"}`}
                  />
                  <span className="sr-only">
                    {n} star{n > 1 ? "s" : ""} — {RATING_WORDS[n]}
                  </span>
                </button>
              ))}
              <span className="ml-2 text-[14px] text-muted-foreground">{RATING_WORDS[displayedRating] ?? ""}</span>
            </div>
            <span className="err">Choose a star rating.</span>
          </fieldset>

          <div className="field">
            <label htmlFor="rv-svc">What was it for? (optional)</label>
            <select id="rv-svc" className="select" value={subject} onChange={(e) => setSubject(e.target.value)}>
              <option value="">Choose a service or product</option>
              <optgroup label="Services">
                {services.map((s) => (
                  <option key={s.id} value={`svc:${s.id}`}>
                    {s.name}
                  </option>
                ))}
              </optgroup>
              <optgroup label="Products">
                {products.map((p) => (
                  <option key={p.id} value={`product:${p.id}`}>
                    {p.name}
                  </option>
                ))}
              </optgroup>
            </select>
          </div>

          <div className={`field ${invalid.has("body") ? "is-invalid" : ""}`}>
            <label htmlFor="rv-text">Your review</label>
            <textarea
              id="rv-text"
              className="textarea"
              placeholder="What did you love? What should the next client know?"
              maxLength={MAX_BODY}
              value={body}
              onChange={(e) => {
                setBody(e.target.value);
                setInvalid((s) => {
                  const next = new Set(s);
                  next.delete("body");
                  return next;
                });
              }}
            />
            <span className="err">Tell us a little more (10+ characters).</span>
            <span className="text-right text-[12px] text-muted-foreground">
              {body.length} / {MAX_BODY}
            </span>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="h-[58px] rounded-full bg-violet-500 text-[17px] font-bold text-white uppercase transition-colors hover:bg-violet-600 disabled:opacity-60"
          >
            {submitting ? "Posting…" : "Post review"}
          </button>
        </form>
      </Reveal>
    </div>
  );
}
