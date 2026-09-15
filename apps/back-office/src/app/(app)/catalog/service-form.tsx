"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Spinner } from "@/components/spinner";
import { ngn } from "@/lib/format";
import { createService, updateService } from "./actions";
import type { Tables } from "@zoeallure/supabase";

export function ServiceForm({ service }: { service?: Tables<"services"> }) {
  const router = useRouter();
  const isEdit = !!service;

  const [name, setName] = useState(service?.name ?? "");
  const [description, setDescription] = useState(service?.description ?? "");
  const [price, setPrice] = useState(service?.price ?? 15000);
  const [duration, setDuration] = useState(service?.duration_label ?? "60 min");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(status: "draft" | "published") {
    setError(null);
    setSaving(true);
    try {
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

      <div className="grid grid-cols-2 gap-3.5">
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
          <div className="mb-1.5 text-[11px] font-bold tracking-[0.1em] text-noir-400 uppercase">Duration</div>
          <Input
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
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
