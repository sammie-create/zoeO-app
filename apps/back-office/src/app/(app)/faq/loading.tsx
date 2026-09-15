import { PageHeaderSkeleton } from "../skeletons";
import { Skeleton } from "@/components/ui/skeleton";

export default function FaqLoading() {
  return (
    <div>
      <PageHeaderSkeleton />
      <div className="mt-6 flex justify-end">
        <Skeleton className="h-11 w-40 rounded-full" />
      </div>
      <div className="mt-6 grid max-w-[900px] gap-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 rounded-2xl border border-noir-100 px-[26px] py-[22px]">
            <Skeleton className="h-3 w-5" />
            <Skeleton className="h-4 flex-1" />
            <Skeleton className="h-5 w-16 rounded-full" />
            <Skeleton className="h-[30px] w-[30px] flex-none rounded-full" />
          </div>
        ))}
      </div>
    </div>
  );
}
