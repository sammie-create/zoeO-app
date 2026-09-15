import { PageHeaderSkeleton, TableSkeleton } from "../skeletons";
import { Skeleton } from "@/components/ui/skeleton";

export default function StaffLoading() {
  return (
    <div>
      <PageHeaderSkeleton />
      <div className="mt-7 flex justify-end">
        <Skeleton className="h-11 w-32 rounded-full" />
      </div>
      <div className="mt-6">
        <TableSkeleton columns={5} minWidth="900px" />
      </div>
    </div>
  );
}
