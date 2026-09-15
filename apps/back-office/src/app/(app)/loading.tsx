import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

function MiniTable({ columns, minWidth }: { columns: number; minWidth: string }) {
  return (
    <Table style={{ minWidth }}>
      <TableHeader>
        <TableRow className="bg-noir-50 hover:bg-noir-50">
          {Array.from({ length: columns }).map((_, i) => (
            <TableHead key={i} className={i === 0 ? "px-5 py-3 sm:px-6" : undefined}>
              <Skeleton className="h-3 w-14" />
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {Array.from({ length: 5 }).map((_, r) => (
          <TableRow key={r}>
            {Array.from({ length: columns }).map((_, c) => (
              <TableCell key={c} className={c === 0 ? "px-5 py-3.5 sm:px-6" : undefined}>
                <Skeleton className="h-3.5 w-20" />
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export default function OverviewLoading() {
  return (
    <div>
      <Skeleton className="h-3 w-20" />
      <Skeleton className="mt-3.5 h-9 w-72" />
      <Skeleton className="mt-2 h-4 w-96" />

      <div className="mt-7 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="flex flex-col gap-2.5 rounded-[18px] bg-[linear-gradient(150deg,#7F23E0,#55129B_62%,#3F0E74)] p-6">
          <Skeleton className="h-3 w-28 bg-white/25" />
          <Skeleton className="h-8 w-32 bg-white/25" />
          <Skeleton className="h-3 w-36 bg-white/20" />
        </div>
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex flex-col gap-2.5 rounded-[18px] border border-noir-100 p-6">
            <Skeleton className="h-3 w-28" />
            <Skeleton className="h-8 w-16" />
            <Skeleton className="h-3 w-32" />
          </div>
        ))}
      </div>

      <div className="mt-5 flex flex-col items-start gap-4 rounded-[18px] border border-noir-100 bg-noir-50 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div className="grid gap-2">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-3 w-48" />
        </div>
        <div className="flex flex-wrap gap-2.5">
          <Skeleton className="h-[42px] w-32 rounded-full" />
          <Skeleton className="h-[42px] w-28 rounded-full" />
          <Skeleton className="h-[42px] w-36 rounded-full" />
        </div>
      </div>

      <div className="mt-5 overflow-hidden rounded-[18px] border border-noir-100">
        <div className="flex items-center justify-between gap-3 px-5 py-[18px] sm:px-6">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-16" />
        </div>
        <MiniTable columns={5} minWidth="600px" />
      </div>

      <div className="mt-5 overflow-hidden rounded-[18px] border border-noir-100">
        <div className="flex items-center justify-between gap-3 px-5 py-[18px] sm:px-6">
          <Skeleton className="h-4 w-56" />
          <Skeleton className="h-3 w-24" />
        </div>
        <MiniTable columns={3} minWidth="480px" />
      </div>

      <div className="mt-5 overflow-hidden rounded-[18px] border border-noir-100">
        <div className="px-5 py-[18px] sm:px-6">
          <Skeleton className="h-4 w-32" />
        </div>
        <MiniTable columns={2} minWidth="440px" />
      </div>
    </div>
  );
}
