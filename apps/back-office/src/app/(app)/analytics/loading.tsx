import { StatCardsSkeleton } from "../skeletons";
import { Skeleton } from "@/components/ui/skeleton";

function PanelSkeleton({ rows = 3 }: { rows?: number }) {
  return (
    <div className="rounded-[18px] border border-noir-100 p-6">
      <Skeleton className="h-4 w-40" />
      <div className="mt-5 grid gap-4">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i}>
            <div className="mb-1.5 flex justify-between">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-3 w-12" />
            </div>
            <Skeleton className="h-2 w-full rounded-full" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function AnalyticsLoading() {
  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <Skeleton className="h-3 w-20" />
          <Skeleton className="mt-3.5 h-9 w-72" />
          <Skeleton className="mt-2 h-4 w-80" />
        </div>
        <div className="flex gap-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-[35px] w-24 rounded-full" />
          ))}
        </div>
      </div>

      <StatCardsSkeleton count={4} />

      <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-2">
        <PanelSkeleton rows={3} />
        <PanelSkeleton rows={3} />
      </div>
      <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-2">
        <PanelSkeleton rows={5} />
        <PanelSkeleton rows={5} />
      </div>
    </div>
  );
}
