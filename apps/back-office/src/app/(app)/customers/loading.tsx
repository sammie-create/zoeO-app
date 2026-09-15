import { PageHeaderSkeleton, TableSkeleton } from "../skeletons";

export default function CustomersLoading() {
  return (
    <div>
      <PageHeaderSkeleton />
      <div className="mt-7">
        <TableSkeleton columns={6} minWidth="900px" />
      </div>
    </div>
  );
}
