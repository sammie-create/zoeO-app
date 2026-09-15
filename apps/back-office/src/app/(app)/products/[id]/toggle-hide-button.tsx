"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Spinner } from "@/components/spinner";
import { Button } from "@/components/ui/button";
import { toggleProductHidden } from "../actions";

export function ToggleHideButton({ id, hidden }: { id: string; hidden: boolean }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  return (
    <Button
      type="button"
      variant="outline"
      disabled={pending}
      onClick={async () => {
        setPending(true);
        await toggleProductHidden(id, !hidden);
        router.refresh();
        toast.success(hidden ? "Product unhidden" : "Product hidden");
        setPending(false);
      }}
      className="h-auto rounded-full border-noir-200 px-[26px] py-3.5 text-[13.5px] font-bold disabled:opacity-60"
    >
      {pending && <Spinner size={14} />}
      {hidden ? "Unhide product" : "Hide product"}
    </Button>
  );
}
