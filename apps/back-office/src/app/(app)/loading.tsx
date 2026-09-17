import { PageHeaderSkeleton, StatCardsSkeleton, TableSkeleton } from "./skeletons";

// Generic on purpose: this fallback also briefly covers every nested route
// while the shared layout's own data is resolving (Next wraps everything
// below this segment in the same Suspense boundary), not just /overview —
// so it must not look distinctly dashboard-shaped.
export default function AppLoading() {
  return (
    <div>
      <PageHeaderSkeleton />
      <StatCardsSkeleton />
      <div className="mt-5">
        <TableSkeleton columns={5} minWidth="600px" />
      </div>
    </div>
  );
}
