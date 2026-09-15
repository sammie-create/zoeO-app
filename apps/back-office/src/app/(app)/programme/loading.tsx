import { PageHeaderSkeleton } from "../skeletons";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProgrammeLoading() {
  return (
    <div>
      <PageHeaderSkeleton withAction />
      <div className="mt-7 grid grid-cols-1 gap-4 md:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="grid gap-4 rounded-2xl border border-noir-100 p-[26px]">
            <div className="flex items-start justify-between gap-3">
              <div className="grid gap-1.5">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-6 w-32" />
              </div>
              <div className="grid justify-items-end gap-1.5">
                <Skeleton className="h-5 w-20" />
                <Skeleton className="h-5 w-16 rounded-full" />
              </div>
            </div>
            <div className="grid grid-cols-5 gap-2">
              {Array.from({ length: 5 }).map((_, s) => (
                <Skeleton key={s} className="h-[46px] rounded-[10px]" />
              ))}
            </div>
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-3/4" />
          </div>
        ))}
      </div>
    </div>
  );
}
