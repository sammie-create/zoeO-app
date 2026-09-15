"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/spinner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { inviteStaff, updateStaffRole } from "./actions";
import type { Tables } from "@zoeallure/supabase";

const ROLE_OPTIONS: { key: string; label: string }[] = [
  { key: "owner", label: "Owner" },
  { key: "studio_manager", label: "Studio Manager" },
  { key: "staff", label: "Staff" },
];

export function StaffModal({
  open,
  onOpenChange,
  editing,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editing: (Tables<"staff_profiles"> & { email: string }) | null;
}) {
  const router = useRouter();
  const isEdit = !!editing;

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("staff");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) {
      setName(editing?.name ?? "");
      setEmail(editing?.email ?? "");
      setRole(editing?.role_id ?? "staff");
    }
  }, [open, editing]);

  async function submit() {
    setSaving(true);
    try {
      if (isEdit) {
        await updateStaffRole(editing.id, role);
        toast.success("Role updated");
      } else {
        await inviteStaff(name, email, role);
        toast.success("Invite sent");
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
            {isEdit ? "Edit role" : "Invite staff"}
          </DialogTitle>
          {!isEdit && (
            <DialogDescription className="text-[13px] text-noir-500">
              An invite email will be sent — it lets them set a password and sign in with the role below.
            </DialogDescription>
          )}
        </DialogHeader>
        <div className="grid gap-3.5">
          {!isEdit && (
            <>
              <div>
                <div className="mb-1.5 text-[11px] font-bold tracking-[0.1em] text-noir-400 uppercase">
                  Full name
                </div>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="h-auto w-full rounded-control border-noir-200 bg-noir-50 px-3.5 py-3 text-sm font-semibold focus-visible:border-violet-500 focus-visible:ring-violet-100"
                />
              </div>
              <div>
                <div className="mb-1.5 text-[11px] font-bold tracking-[0.1em] text-noir-400 uppercase">
                  Email address
                </div>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-auto w-full rounded-control border-noir-200 bg-noir-50 px-3.5 py-3 text-sm font-semibold focus-visible:border-violet-500 focus-visible:ring-violet-100"
                />
              </div>
            </>
          )}
          <div>
            <div className="mb-1.5 text-[11px] font-bold tracking-[0.1em] text-noir-400 uppercase">Role</div>
            <div className="flex flex-wrap gap-2">
              {ROLE_OPTIONS.map((r) => {
                const active = r.key === role;
                return (
                  <Button
                    key={r.key}
                    type="button"
                    variant="outline"
                    onClick={() => setRole(r.key)}
                    className="h-auto rounded-full px-4 py-2.5 text-[12.5px] font-bold"
                    style={{
                      borderColor: active ? "transparent" : "#D8D5E0",
                      background: active ? "#1A1720" : "transparent",
                      color: active ? "#fff" : "#403B4C",
                    }}
                  >
                    {r.label}
                  </Button>
                );
              })}
            </div>
          </div>
          <Button
            type="button"
            disabled={saving}
            onClick={submit}
            className="mt-1 h-auto w-fit rounded-xl bg-violet-500 px-6 py-3.5 text-[13.5px] font-bold text-white hover:bg-violet-600"
          >
            {saving && <Spinner size={14} />}
            {isEdit ? "Save role" : "Send invite"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
