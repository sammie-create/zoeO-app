"use client";

import { createClient as createBrowserClient } from "@zoeallure/supabase/client";
import { useRouter } from "next/navigation";
import { useRef, useState, type ChangeEvent } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RichTextEditor } from "@/components/rich-text-editor";
import { Spinner } from "@/components/spinner";
import { deleteImage, uploadImage, validateUploadImage } from "@/lib/image-upload";
import { createJournalPost, updateJournalPost } from "./actions";
import type { Database, Tables } from "@zoeallure/supabase";

type Category = Database["public"]["Tables"]["journal_posts"]["Row"]["category"];
const CATEGORIES: Category[] = ["Hair care", "Bridal", "Nail care", "Personal care"];

export function JournalForm({ post }: { post?: Tables<"journal_posts"> }) {
  const router = useRouter();
  const isEdit = !!post;
  const [supabase] = useState(() => createBrowserClient());
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState(post?.title ?? "");
  const [category, setCategory] = useState<Category>(post?.category ?? "Hair care");
  const [body, setBody] = useState(post?.body ?? "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(post?.image_url ?? null);
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
      let imageUrl = post?.image_url ?? null;
      if (imageFile) {
        imageUrl = await uploadImage(supabase, "journal-images", imageFile);
        if (post?.image_url) await deleteImage(supabase, "journal-images", post.image_url);
      } else if (removeImage) {
        if (post?.image_url) await deleteImage(supabase, "journal-images", post.image_url);
        imageUrl = null;
      }

      if (isEdit) {
        await updateJournalPost(post.id, { title, category, body, status, image_url: imageUrl });
        toast.success("Post updated");
      } else {
        await createJournalPost({ title, category, body, status, image_url: imageUrl });
        toast.success(status === "published" ? "Post published" : "Saved as draft");
      }
      router.push("/journal");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setSaving(false);
    }
  }

  return (
    <div className="mt-6.5 grid max-w-[680px] gap-4">
      <div>
        <div className="mb-1.5 text-[11px] font-bold tracking-[0.1em] text-noir-400 uppercase">Title</div>
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="h-auto w-full rounded-control border-noir-200 px-3.5 py-3 text-sm font-semibold focus-visible:border-violet-500 focus-visible:ring-violet-100"
        />
      </div>

      <div>
        <div className="mb-1.5 text-[11px] font-bold tracking-[0.1em] text-noir-400 uppercase">Cover image</div>
        <div className="flex items-center gap-4">
          <div className="h-16 w-24 flex-none overflow-hidden rounded-control border border-noir-200 bg-noir-50">
            {imagePreview && (
              // eslint-disable-next-line @next/next/no-img-element -- upload preview, not a static asset
              <img src={imagePreview} alt="" className="h-full w-full object-cover" />
            )}
          </div>
          <div className="flex flex-col items-start gap-1">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              className="h-auto rounded-full border-noir-200 px-3.5 py-1.5 text-[11.5px] font-bold"
            >
              {imagePreview ? "Change image" : "Upload image"}
            </Button>
            {imagePreview && (
              <button
                type="button"
                onClick={handleRemoveImage}
                className="text-[11px] font-semibold text-noir-400 hover:text-status-cancelled"
              >
                Remove image
              </button>
            )}
          </div>
        </div>
      </div>

      <div>
        <div className="mb-1.5 text-[11px] font-bold tracking-[0.1em] text-noir-400 uppercase">Category</div>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((c) => {
            const active = c === category;
            return (
              <Button
                key={c}
                type="button"
                variant="outline"
                onClick={() => setCategory(c)}
                className="h-auto rounded-full px-4 py-2.5 text-[12.5px] font-bold"
                style={{
                  borderColor: active ? "transparent" : "#D8D5E0",
                  background: active ? "#1A1720" : "transparent",
                  color: active ? "#fff" : "#403B4C",
                }}
              >
                {c}
              </Button>
            );
          })}
        </div>
      </div>

      <div>
        <div className="mb-1.5 text-[11px] font-bold tracking-[0.1em] text-noir-400 uppercase">Body</div>
        <RichTextEditor value={body} onChange={setBody} />
      </div>

      {error && <p className="text-[12.5px] font-medium text-status-cancelled">{error}</p>}

      <div className="mt-1.5 flex flex-wrap gap-2.5">
        <Button
          type="button"
          disabled={saving}
          onClick={() => submit("published")}
          className="h-auto rounded-xl bg-violet-500 px-[26px] py-3.5 text-[13.5px] font-bold text-white hover:bg-violet-600 disabled:opacity-70"
        >
          {saving && <Spinner size={15} />}
          Publish
        </Button>
        <Button
          type="button"
          variant="outline"
          disabled={saving}
          onClick={() => submit("draft")}
          className="h-auto rounded-xl border-noir-200 px-[26px] py-3.5 text-[13.5px] font-bold"
        >
          Save as draft
        </Button>
        <Button
          type="button"
          variant="ghost"
          onClick={() => router.push("/journal")}
          className="h-auto rounded-xl px-5 py-3.5 text-[13.5px] font-bold text-noir-400"
        >
          Cancel
        </Button>
      </div>
    </div>
  );
}
