"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Spinner } from "@/components/spinner";
import { createJournalPost, updateJournalPost } from "./actions";
import type { Database, Tables } from "@zoeallure/supabase";

type Category = Database["public"]["Tables"]["journal_posts"]["Row"]["category"];
const CATEGORIES: Category[] = ["Hair care", "Bridal", "Nail care", "Personal care"];

export function JournalForm({ post }: { post?: Tables<"journal_posts"> }) {
  const router = useRouter();
  const isEdit = !!post;

  const [title, setTitle] = useState(post?.title ?? "");
  const [category, setCategory] = useState<Category>(post?.category ?? "Hair care");
  const [body, setBody] = useState(post?.body ?? "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(status: "draft" | "published") {
    setError(null);
    setSaving(true);
    try {
      if (isEdit) {
        await updateJournalPost(post.id, { title, category, body, status });
        toast.success("Post updated");
      } else {
        await createJournalPost({ title, category, body, status });
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
        <Textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={6}
          className="w-full rounded-control border-noir-200 px-3.5 py-3 text-[13px] leading-relaxed text-noir-600 focus-visible:border-violet-500 focus-visible:ring-violet-100"
        />
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
