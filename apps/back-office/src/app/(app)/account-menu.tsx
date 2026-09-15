"use client";

import { createClient as createBrowserClient } from "@zoeallure/supabase/client";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/);
  return (parts[0]?.[0] ?? "").concat(parts[1]?.[0] ?? "").toUpperCase();
}

export function AccountMenu({ name, roleLabel }: { name: string; roleLabel: string }) {
  const router = useRouter();

  async function handleSignOut() {
    const supabase = createBrowserClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className="h-auto items-center gap-2.5 rounded-full border-noir-100 py-1.5 pr-1.5 pl-1.5 hover:bg-noir-50 sm:pr-3.5"
        >
          <span className="flex h-[30px] w-[30px] flex-none items-center justify-center rounded-full bg-violet-500 text-[12px] font-extrabold text-white">
            {getInitials(name)}
          </span>
          <span className="hidden text-left sm:block">
            <span className="block text-[12.5px] leading-tight font-bold text-noir-800">{name}</span>
            <span className="block text-[10.5px] leading-tight text-noir-400">{roleLabel}</span>
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44 rounded-xl border-noir-100 p-1.5">
        <DropdownMenuItem
          onClick={handleSignOut}
          className="rounded-lg px-3 py-2 text-[13px] font-semibold text-status-cancelled focus:bg-[#FDEEF0] focus:text-status-cancelled"
        >
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
