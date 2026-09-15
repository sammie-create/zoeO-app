import { PageHeaderSkeleton } from "../skeletons";
import { Skeleton } from "@/components/ui/skeleton";

export default function JournalLoading() {
  return (
    <div>
      <PageHeaderSkeleton withAction />
      <div className="mt-7 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="overflow-hidden rounded-[18px] border border-noir-100">
            <Skeleton className="aspect-video w-full rounded-none" />
            <div className="grid gap-2.5 p-[18px]">
              <div className="flex gap-2.5">
                <Skeleton className="h-5 w-20 rounded-full" />
                <Skeleton className="h-5 w-16 rounded-full" />
              </div>
              <Skeleton className="h-4 w-4/5" />
              <div className="mt-1 flex justify-between">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-3 w-12" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
