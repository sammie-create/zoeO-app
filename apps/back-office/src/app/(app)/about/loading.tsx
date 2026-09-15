import { PageHeaderSkeleton } from "../skeletons";
import { Skeleton } from "@/components/ui/skeleton";

export default function AboutStatsLoading() {
  return (
    <div>
      <PageHeaderSkeleton />
      <div className="mt-7 grid max-w-[900px] grid-cols-1 gap-3.5 sm:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4.5 rounded-2xl border border-noir-100 p-[22px]">
            <Skeleton className="h-9 w-[70px] flex-none" />
            <div className="grid flex-1 gap-1.5">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
