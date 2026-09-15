"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export type RowMenuAction = { label: string; onClick: () => void; danger?: boolean };

export function RowMenu({ actions }: { actions: RowMenuAction[] }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={(e) => e.stopPropagation()}
          className="h-8 w-8 justify-self-end rounded-lg hover:bg-noir-50"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="#5B5568">
            <circle cx="12" cy="5" r="1.8" />
            <circle cx="12" cy="12" r="1.8" />
            <circle cx="12" cy="19" r="1.8" />
          </svg>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-44 rounded-xl border-noir-100 p-1.5 shadow-[0_18px_40px_rgba(26,23,32,.16)]"
      >
        {actions.map((a, i) => (
          <DropdownMenuItem
            key={i}
            onClick={(e) => {
              e.stopPropagation();
              a.onClick();
            }}
            className={`rounded-lg px-3 py-2 text-[13px] font-semibold ${
              a.danger ? "text-status-cancelled focus:bg-[#FDEEF0] focus:text-status-cancelled" : "text-noir-800"
            }`}
          >
            {a.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
