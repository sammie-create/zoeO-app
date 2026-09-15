import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export function PageHeaderSkeleton({ withAction = false }: { withAction?: boolean }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-6">
      <div>
        <Skeleton className="h-3 w-24" />
        <Skeleton className="mt-4 h-9 w-64" />
        <Skeleton className="mt-3 h-4 w-80" />
      </div>
      {withAction && <Skeleton className="h-11 w-36 rounded-full" />}
    </div>
  );
}

export function FilterPillsSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="mt-6 mb-5 flex flex-wrap gap-2.5">
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton key={i} className="h-[35px] w-20 rounded-full" />
      ))}
    </div>
  );
}

export function StatCardsSkeleton({ count = 4 }: { count?: number }) {
  const lgCols = count === 6 ? "lg:grid-cols-6" : count === 3 ? "lg:grid-cols-3" : "lg:grid-cols-4";
  return (
    <div className={`mt-7 grid grid-cols-2 gap-3.5 ${lgCols}`}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex flex-col gap-2.5 rounded-2xl border border-noir-100 p-5">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-7 w-24" />
        </div>
      ))}
    </div>
  );
}

export function TableSkeleton({
  columns,
  rows = 6,
  minWidth = "900px",
}: {
  columns: number;
  rows?: number;
  minWidth?: string;
}) {
  return (
    <div className="rounded-[18px] border border-noir-100">
      <Table style={{ minWidth }}>
        <TableHeader>
          <TableRow className="bg-noir-50 hover:bg-noir-50">
            {Array.from({ length: columns }).map((_, i) => (
              <TableHead key={i} className={i === 0 ? "px-5 py-[13px]" : undefined}>
                <Skeleton className="h-3 w-16" />
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: rows }).map((_, r) => (
            <TableRow key={r}>
              {Array.from({ length: columns }).map((_, c) => (
                <TableCell key={c} className={c === 0 ? "px-5 py-3.5" : undefined}>
                  {c === 0 ? (
                    <div className="flex items-center gap-3">
                      <Skeleton className="h-[34px] w-[34px] flex-none rounded-full" />
                      <Skeleton className="h-3.5 w-28" />
                    </div>
                  ) : (
                    <Skeleton className="h-3.5 w-16" />
                  )}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export function CardGridSkeleton({
  count = 6,
  columns = 3,
  aspect,
}: {
  count?: number;
  columns?: number;
  aspect?: string;
}) {
  const colClass =
    columns === 2 ? "sm:grid-cols-2" : columns === 4 ? "sm:grid-cols-2 lg:grid-cols-4" : "sm:grid-cols-2 lg:grid-cols-3";
  return (
    <div className={`mt-7 grid grid-cols-1 gap-4 ${colClass}`}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="overflow-hidden rounded-2xl border border-noir-100">
          {aspect && <Skeleton className={`w-full rounded-none ${aspect}`} />}
          <div className="grid gap-2.5 p-5">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-2/3" />
          </div>
        </div>
      ))}
    </div>
  );
}
