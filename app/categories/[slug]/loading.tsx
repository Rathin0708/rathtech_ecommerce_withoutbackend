import { Skeleton } from "@/components/ui/skeleton";

export default function CategoryLoading() {
  return (
    <div>
      <Skeleton className="h-48 w-full sm:h-64" />
      <div className="mx-auto max-w-screen-xl px-4 py-6 sm:px-6">
        <Skeleton className="mb-4 h-4 w-48" />
        <Skeleton className="mb-6 h-8 w-64" />
        <div className="flex gap-8">
          <div className="hidden w-[240px] shrink-0 space-y-4 lg:block">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-5 w-20" />
                {Array.from({ length: 4 }).map((__, j) => (
                  <Skeleton key={j} className="h-4 w-full" />
                ))}
              </div>
            ))}
          </div>
          <div className="min-w-0 flex-1">
            <div className="mb-4 flex justify-between">
              <Skeleton className="h-8 w-24" />
              <Skeleton className="h-8 w-[180px]" />
            </div>
            <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="aspect-square w-full rounded-xl" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
