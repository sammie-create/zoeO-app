"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Badge } from "../badge";
import { Button } from "@/components/ui/button";
import { RowMenu } from "../row-menu";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getInitials } from "@/lib/format";
import { removeStaff } from "./actions";
import { StaffModal } from "./staff-modal";
import type { Tables } from "@zoeallure/supabase";

export type StaffRow = Tables<"staff_profiles"> & {
  email: string;
  roleLabel: string;
  lastSignIn: string | null;
};

export function StaffTable({ staff, currentUserId }: { staff: StaffRow[]; currentUserId: string }) {
  const router = useRouter();
  const [editing, setEditing] = useState<StaffRow | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [removeTarget, setRemoveTarget] = useState<StaffRow | null>(null);

  return (
    <>
      <div className="flex justify-end">
        <Button
          type="button"
          onClick={() => {
            setEditing(null);
            setModalOpen(true);
          }}
          className="h-auto rounded-full bg-noir-800 px-[22px] py-3 text-[13.5px] font-bold text-white hover:bg-violet-500"
        >
          + Invite staff
        </Button>
      </div>

      <div className="mt-6 rounded-[18px] border border-noir-100">
        <Table className="min-w-[900px]">
          <TableHeader>
            <TableRow className="bg-noir-50 hover:bg-noir-50">
              <TableHead className="px-5 py-[13px] text-[11px] font-bold tracking-[0.1em] text-noir-400 uppercase">
                Name
              </TableHead>
              <TableHead className="text-[11px] font-bold tracking-[0.1em] text-noir-400 uppercase">Email</TableHead>
              <TableHead className="text-[11px] font-bold tracking-[0.1em] text-noir-400 uppercase">Role</TableHead>
              <TableHead className="text-[11px] font-bold tracking-[0.1em] text-noir-400 uppercase">
                Last active
              </TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {staff.map((s) => (
              <TableRow key={s.id}>
                <TableCell className="px-5 py-3.5">
                  <div className="flex items-center gap-3">
                    <span className="flex h-[34px] w-[34px] flex-none items-center justify-center rounded-full bg-violet-500 text-[11.5px] font-extrabold text-white">
                      {getInitials(s.name)}
                    </span>
                    <span className="text-[13px] font-bold text-noir-800">
                      {s.name}
                      {s.id === currentUserId && <span className="ml-1.5 text-[11px] text-noir-300">(you)</span>}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="max-w-[220px] truncate text-xs text-noir-600">{s.email}</TableCell>
                <TableCell>
                  <Badge label={s.roleLabel} bg="#F4ECFE" fg="#55129B" />
                </TableCell>
                <TableCell className="text-xs text-noir-600">
                  {s.lastSignIn ? new Date(s.lastSignIn).toLocaleString("en-GB") : "Never signed in"}
                </TableCell>
                <TableCell className="text-right">
                  <RowMenu
                    actions={[
                      {
                        label: "Edit role",
                        onClick: () => {
                          setEditing(s);
                          setModalOpen(true);
                        },
                      },
                      {
                        label: "Remove access",
                        danger: true,
                        onClick: () => setRemoveTarget(s),
                      },
                    ]}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <StaffModal
        open={modalOpen}
        onOpenChange={(open) => {
          setModalOpen(open);
          if (!open) setEditing(null);
        }}
        editing={editing}
      />

      <ConfirmDialog
        open={!!removeTarget}
        onOpenChange={(open) => !open && setRemoveTarget(null)}
        title="Remove staff access?"
        description={`"${removeTarget?.name}" will lose access to the back office. Their account isn't deleted — they just won't be staff anymore.`}
        confirmLabel="Remove"
        onConfirm={async () => {
          if (!removeTarget) return;
          await removeStaff(removeTarget.id);
          router.refresh();
          toast.success("Access removed");
        }}
      />
    </>
  );
}
