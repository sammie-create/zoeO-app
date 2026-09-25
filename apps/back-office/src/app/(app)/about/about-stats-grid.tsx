"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Spinner } from "@/components/spinner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { updateAboutStat } from "./actions";
import type { Tables } from "@zoeallure/supabase";

export function AboutStatsGrid({ stats }: { stats: Tables<"about_stats">[] }) {
  const router = useRouter();
  const [editing, setEditing] = useState<Tables<"about_stats"> | null>(null);
  const [figure, setFigure] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [chip, setChip] = useState("");
  const [countFrom, setCountFrom] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (editing) {
      setFigure(editing.figure);
      setTitle(editing.title);
      setDescription(editing.description);
      setChip(editing.chip ?? "");
      setCountFrom(editing.count_from != null ? String(editing.count_from) : "");
    }
  }, [editing]);

  async function save() {
    if (!editing) return;
    setSaving(true);
    try {
      await updateAboutStat(editing.id, {
        figure,
        title,
        description,
        chip: chip || null,
        count_from: countFrom ? Number(countFrom) : null,
      });
      toast.success("Stat updated");
      router.refresh();
      setEditing(null);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <div className="mt-7 grid max-w-[900px] grid-cols-1 gap-3.5 sm:grid-cols-2">
        {stats.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => setEditing(s)}
            className="flex items-center gap-4.5 rounded-2xl border border-noir-100 p-[22px] text-left hover:border-violet-200"
          >
            <span className="min-w-[70px] flex-none font-display text-4xl font-bold text-violet-500">
              {s.figure}
            </span>
            <div>
              <div className="text-[14.5px] font-bold text-noir-800">{s.title}</div>
              <p className="mt-1.5 text-[12.5px] leading-relaxed text-noir-400">{s.description}</p>
            </div>
          </button>
        ))}
      </div>

      <Dialog open={!!editing} onOpenChange={(open) => !open && setEditing(null)}>
        <DialogContent className="max-w-[460px] rounded-[22px] p-8">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl font-normal">Edit stat</DialogTitle>
          </DialogHeader>
          <div className="grid gap-3.5">
            <div>
              <div className="mb-1.5 text-[11px] font-bold tracking-[0.1em] text-noir-400 uppercase">Figure</div>
              <Input
                value={figure}
                onChange={(e) => setFigure(e.target.value)}
                className="h-auto w-full rounded-control border-noir-200 bg-noir-50 px-3.5 py-3 text-sm font-semibold focus-visible:border-violet-500 focus-visible:ring-violet-100"
              />
            </div>
            <div>
              <div className="mb-1.5 text-[11px] font-bold tracking-[0.1em] text-noir-400 uppercase">Title</div>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="h-auto w-full rounded-control border-noir-200 bg-noir-50 px-3.5 py-3 text-sm font-semibold focus-visible:border-violet-500 focus-visible:ring-violet-100"
              />
            </div>
            <div>
              <div className="mb-1.5 text-[11px] font-bold tracking-[0.1em] text-noir-400 uppercase">
                Description
              </div>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full rounded-control border-noir-200 bg-noir-50 px-3.5 py-3 text-[13px] leading-relaxed focus-visible:border-violet-500 focus-visible:ring-violet-100"
              />
            </div>
            <div className="grid grid-cols-2 gap-3.5">
              <div>
                <div className="mb-1.5 text-[11px] font-bold tracking-[0.1em] text-noir-400 uppercase">
                  Chip label <span className="font-medium text-noir-300 normal-case">(optional)</span>
                </div>
                <Input
                  value={chip}
                  onChange={(e) => setChip(e.target.value)}
                  placeholder="e.g. HELicia"
                  className="h-auto w-full rounded-control border-noir-200 bg-noir-50 px-3.5 py-3 text-sm font-semibold focus-visible:border-violet-500 focus-visible:ring-violet-100"
                />
              </div>
              <div>
                <div className="mb-1.5 text-[11px] font-bold tracking-[0.1em] text-noir-400 uppercase">
                  Count from <span className="font-medium text-noir-300 normal-case">(optional)</span>
                </div>
                <Input
                  type="number"
                  value={countFrom}
                  onChange={(e) => setCountFrom(e.target.value)}
                  placeholder="e.g. 2000"
                  className="h-auto w-full rounded-control border-noir-200 bg-noir-50 px-3.5 py-3 text-sm font-semibold focus-visible:border-violet-500 focus-visible:ring-violet-100"
                />
              </div>
            </div>
            <Button
              type="button"
              disabled={saving}
              onClick={save}
              className="h-auto w-fit rounded-xl bg-violet-500 px-6 py-3 text-[13px] font-bold text-white hover:bg-violet-600"
            >
              {saving && <Spinner size={14} />}
              Save
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
