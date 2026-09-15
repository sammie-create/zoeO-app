import { PageHeaderSkeleton } from "../skeletons";
import { Skeleton } from "@/components/ui/skeleton";

export default function TestimonialsLoading() {
  return (
    <div>
      <PageHeaderSkeleton />
      <div className="mt-6 flex justify-end">
        <Skeleton className="h-11 w-40 rounded-full" />
      </div>
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex flex-col gap-3.5 rounded-2xl bg-noir-50 p-6">
            <div className="flex items-start justify-between gap-2.5">
              <Skeleton className="h-12 w-full bg-noir-200" />
              <Skeleton className="h-5 w-16 flex-none rounded-full bg-noir-200" />
            </div>
            <div className="flex items-center gap-2.5">
              <Skeleton className="h-9 w-9 flex-none rounded-full bg-noir-200" />
              <div className="grid gap-1.5">
                <Skeleton className="h-3 w-24 bg-noir-200" />
                <Skeleton className="h-2.5 w-20 bg-noir-200" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
