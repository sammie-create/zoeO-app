import { PageHeaderSkeleton } from "../skeletons";
import { Skeleton } from "@/components/ui/skeleton";

export default function CatalogLoading() {
  return (
    <div>
      <PageHeaderSkeleton withAction />
      <div className="mt-7 grid grid-cols-1 gap-3.5 sm:grid-cols-2">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="flex flex-col gap-2.5 rounded-2xl border border-noir-100 p-[22px]">
            <div className="flex items-start justify-between gap-3">
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-5 w-16 rounded-full" />
            </div>
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-2/3" />
            <div className="mt-1 flex items-center justify-between">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-4 w-16" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
