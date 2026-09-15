import { FilterPillsSkeleton, PageHeaderSkeleton, TableSkeleton } from "../skeletons";

export default function OrdersLoading() {
  return (
    <div>
      <PageHeaderSkeleton />
      <FilterPillsSkeleton count={4} />
      <TableSkeleton columns={9} minWidth="1000px" />
    </div>
  );
}
