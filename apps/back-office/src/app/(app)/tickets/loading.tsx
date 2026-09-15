import { FilterPillsSkeleton, PageHeaderSkeleton, TableSkeleton } from "../skeletons";

export default function TicketsLoading() {
  return (
    <div>
      <PageHeaderSkeleton withAction />
      <FilterPillsSkeleton count={4} />
      <TableSkeleton columns={7} minWidth="900px" />
    </div>
  );
}
