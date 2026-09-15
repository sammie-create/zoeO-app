import { Badge as ShadcnBadge } from "@/components/ui/badge";

export function Badge({ label, bg, fg }: { label: string; bg: string; fg: string }) {
  return (
    <ShadcnBadge
      variant="outline"
      className="h-auto justify-self-start rounded-full border-transparent px-[11px] py-[5px] text-[11px] font-bold whitespace-nowrap"
      style={{ background: bg, color: fg }}
    >
      {label}
    </ShadcnBadge>
  );
}

export function SectionEyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2.5">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="#7F23E0">
        <path d="M12 2l1.9 6.4L20 10l-6.1 1.6L12 18l-1.9-6.4L4 10l6.1-1.6z" />
      </svg>
      <span className="text-xs font-bold tracking-[0.2em] text-violet-500 uppercase">
        {children}
      </span>
    </div>
  );
}
