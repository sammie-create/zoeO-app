"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { Badge } from "../badge";
import { RowMenu } from "../row-menu";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { LINE_META, STOCK_BADGE, stockLevel } from "@/lib/catalog";
import { ngn } from "@/lib/format";
import { deleteProduct, toggleProductHidden } from "./actions";
import type { Tables } from "@zoeallure/supabase";

export function ProductsTable({
  products,
  lowStockThreshold,
}: {
  products: Tables<"products">[];
  lowStockThreshold: number;
}) {
  const router = useRouter();
  const [deleteTarget, setDeleteTarget] = useState<Tables<"products"> | null>(null);

  async function handleToggleHide(id: string, hidden: boolean) {
    await toggleProductHidden(id, !hidden);
    router.refresh();
    toast.success(hidden ? "Product unhidden" : "Product hidden");
  }

  async function handleDelete(id: string) {
    await deleteProduct(id);
    router.refresh();
    toast.success("Product deleted");
  }

  return (
    <div className="rounded-[18px] border border-noir-100">
      <Table className="min-w-[720px]">
        <TableHeader>
          <TableRow className="bg-noir-50 hover:bg-noir-50">
            <TableHead className="px-5 py-[13px] text-[11px] font-bold tracking-[0.1em] text-noir-400 uppercase">
              Product
            </TableHead>
            <TableHead className="text-[11px] font-bold tracking-[0.1em] text-noir-400 uppercase">Price</TableHead>
            <TableHead className="text-[11px] font-bold tracking-[0.1em] text-noir-400 uppercase">Stock</TableHead>
            <TableHead className="text-[11px] font-bold tracking-[0.1em] text-noir-400 uppercase">Units</TableHead>
            <TableHead className="text-[11px] font-bold tracking-[0.1em] text-noir-400 uppercase">
              Visibility
            </TableHead>
            <TableHead />
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} className="px-5 py-8 text-[13px] whitespace-normal text-noir-400">
                No products yet — add your first one.
              </TableCell>
            </TableRow>
          )}
          {products.map((p) => {
            const meta = LINE_META[p.category];
            const level = STOCK_BADGE[stockLevel(p.stock_units, lowStockThreshold)];
            return (
              <TableRow key={p.id} style={p.is_hidden ? { opacity: 0.55 } : undefined}>
                <TableCell className="px-5 py-3.5">
                  <Link href={`/products/${p.id}`} className="flex min-w-0 items-center gap-3">
                    <span
                      className="flex h-[38px] w-[38px] flex-none items-center justify-center rounded-[10px] text-[11px] font-extrabold text-white"
                      style={{ background: meta.swatch }}
                    >
                      {meta.initials}
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate text-[13.5px] font-bold text-noir-800">{p.name}</span>
                      <span className="mt-0.5 block text-[11.5px] text-noir-400">{meta.line}</span>
                    </span>
                  </Link>
                </TableCell>
                <TableCell className="text-[13px] font-bold text-noir-800">{ngn(p.price)}</TableCell>
                <TableCell>
                  <Badge label={level.label} bg={level.bg} fg={level.fg} />
                </TableCell>
                <TableCell className="text-xs text-noir-600">{p.stock_units}</TableCell>
                <TableCell>
                  <Badge
                    label={p.is_hidden ? "Hidden" : "Visible"}
                    bg={p.is_hidden ? "#F7F6F9" : "#E7F5EC"}
                    fg={p.is_hidden ? "#5B5568" : "#1F7A50"}
                  />
                </TableCell>
                <TableCell className="text-right">
                  <RowMenu
                    actions={[
                      { label: "View", onClick: () => router.push(`/products/${p.id}`) },
                      { label: "Edit", onClick: () => router.push(`/products/${p.id}/edit`) },
                      {
                        label: p.is_hidden ? "Unhide" : "Hide",
                        onClick: () => handleToggleHide(p.id, p.is_hidden),
                      },
                      { label: "Delete", danger: true, onClick: () => setDeleteTarget(p) },
                    ]}
                  />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Delete product?"
        description={`"${deleteTarget?.name}" will be permanently removed. This cannot be undone.`}
        onConfirm={async () => {
          if (deleteTarget) await handleDelete(deleteTarget.id);
        }}
      />
    </div>
  );
}
