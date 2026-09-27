"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Spinner } from "@/components/spinner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { createFaq, updateFaq } from "./actions";
import type { Tables } from "@zoeallure/supabase";

export function FaqModal({
  open,
  onOpenChange,
  faq,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  faq: Tables<"faqs"> | null;
}) {
  const router = useRouter();
  const isEdit = !!faq;

  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [page, setPage] = useState<"services" | "contact" | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) {
      setQuestion(faq?.question ?? "");
      setAnswer(faq?.answer ?? "");
      setPage(faq?.page ?? null);
    }
  }, [open, faq]);

  async function submit(status: "draft" | "published") {
    setSaving(true);
    try {
      if (isEdit) {
        await updateFaq(faq.id, { question, answer, page, status });
        toast.success("Question updated");
      } else {
        await createFaq({ question, answer, page, status, sort_order: 0 });
        toast.success(status === "published" ? "Question published" : "Saved as draft");
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
            {isEdit ? "Edit question" : "Add question"}
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-3.5">
          <div>
            <div className="mb-1.5 text-[11px] font-bold tracking-[0.1em] text-noir-400 uppercase">Question</div>
            <Textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              rows={2}
              className="w-full rounded-control border-noir-200 bg-noir-50 px-3.5 py-3 text-sm font-semibold focus-visible:border-violet-500 focus-visible:ring-violet-100"
            />
          </div>
          <div>
            <div className="mb-1.5 text-[11px] font-bold tracking-[0.1em] text-noir-400 uppercase">Answer</div>
            <Textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              rows={4}
              className="w-full rounded-control border-noir-200 bg-noir-50 px-3.5 py-3 text-[13px] leading-relaxed focus-visible:border-violet-500 focus-visible:ring-violet-100"
            />
          </div>
          <div>
            <div className="mb-1.5 text-[11px] font-bold tracking-[0.1em] text-noir-400 uppercase">
              Shown on <span className="font-medium text-noir-300 normal-case">(all pages if unset)</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {[
                { value: null, label: "All pages" },
                { value: "services" as const, label: "Services" },
                { value: "contact" as const, label: "Contact" },
              ].map((opt) => {
                const active = page === opt.value;
                return (
                  <Button
                    type="button"
                    variant="outline"
                    key={opt.label}
                    onClick={() => setPage(opt.value)}
                    className={`h-auto rounded-full border px-4 py-2.5 text-[12.5px] font-bold ${
                      active ? "border-transparent bg-violet-500 text-white" : "border-noir-200 text-noir-800"
                    }`}
                  >
                    {opt.label}
                  </Button>
                );
              })}
            </div>
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
