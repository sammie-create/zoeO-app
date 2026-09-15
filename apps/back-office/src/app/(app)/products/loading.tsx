import { FilterPillsSkeleton, PageHeaderSkeleton, TableSkeleton } from "../skeletons";

export default function ProductsLoading() {
  return (
    <div>
      <PageHeaderSkeleton withAction />
      <FilterPillsSkeleton count={5} />
      <TableSkeleton columns={6} minWidth="720px" />
    </div>
  );
}
