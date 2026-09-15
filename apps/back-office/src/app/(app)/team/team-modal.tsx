"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/spinner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { createTeamMember, updateTeamMember } from "./actions";
import type { Tables } from "@zoeallure/supabase";

export function TeamModal({
  open,
  onOpenChange,
  member,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  member: Tables<"team_members"> | null;
}) {
  const router = useRouter();
  const isEdit = !!member;

  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) {
      setName(member?.name ?? "");
      setRole(member?.title ?? "");
    }
  }, [open, member]);

  async function submit(status: "draft" | "published") {
    setSaving(true);
    try {
      if (isEdit) {
        await updateTeamMember(member.id, { name, title: role, status });
        toast.success("Team member updated");
      } else {
        await createTeamMember({ name, title: role, status, accent_color: "#7F23E0" });
        toast.success(status === "published" ? "Published" : "Saved as draft");
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
      <DialogContent className="max-w-[480px] rounded-[22px] p-8">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl font-normal">
            {isEdit ? "Edit artist" : "Add artist"}
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-3.5">
          <div>
            <div className="mb-1.5 text-[11px] font-bold tracking-[0.1em] text-noir-400 uppercase">Name</div>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-auto w-full rounded-control border-noir-200 bg-noir-50 px-3.5 py-3 text-sm font-semibold focus-visible:border-violet-500 focus-visible:ring-violet-100"
            />
          </div>
          <div>
            <div className="mb-1.5 text-[11px] font-bold tracking-[0.1em] text-noir-400 uppercase">Role</div>
            <Input
              value={role}
              onChange={(e) => setRole(e.target.value)}
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
