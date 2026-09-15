import { FilterPillsSkeleton, PageHeaderSkeleton, TableSkeleton } from "../skeletons";

export default function BookingsLoading() {
  return (
    <div>
      <PageHeaderSkeleton />
      <FilterPillsSkeleton count={5} />
      <TableSkeleton columns={7} minWidth="1000px" />
    </div>
  );
}
