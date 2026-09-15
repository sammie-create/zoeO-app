import { PageHeaderSkeleton } from "../skeletons";
import { Skeleton } from "@/components/ui/skeleton";

export default function TeamLoading() {
  return (
    <div>
      <PageHeaderSkeleton />
      <div className="mt-6 flex justify-end">
        <Skeleton className="h-11 w-32 rounded-full" />
      </div>
      <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="overflow-hidden rounded-[18px] border border-noir-100">
            <Skeleton className="aspect-[3/4] w-full rounded-none" />
            <div className="grid gap-1.5 p-4">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
