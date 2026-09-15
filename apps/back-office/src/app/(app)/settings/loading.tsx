import { Skeleton } from "@/components/ui/skeleton";

export default function SettingsLoading() {
  return (
    <div>
      <Skeleton className="h-3 w-20" />
      <Skeleton className="mt-3.5 h-9 w-56" />
      <Skeleton className="mt-2 h-4 w-72" />

      <div className="mt-7 grid max-w-[920px] grid-cols-1 gap-5 sm:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="grid gap-4.5 rounded-[18px] border border-noir-100 p-6.5">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-[52px] w-full rounded-xl" />
          </div>
        ))}
        <div className="flex items-center gap-3.5 rounded-[18px] border border-noir-100 p-6.5 sm:col-span-2">
          <Skeleton className="h-11 w-36 rounded-full" />
        </div>
      </div>
    </div>
  );
}
