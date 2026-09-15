import { PageHeaderSkeleton, TableSkeleton } from "../skeletons";

export default function SponsorshipsLoading() {
  return (
    <div>
      <PageHeaderSkeleton />
      <div className="mt-6">
        <TableSkeleton columns={4} minWidth="700px" />
      </div>
    </div>
  );
}
