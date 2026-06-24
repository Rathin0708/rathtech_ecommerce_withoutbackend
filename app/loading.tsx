import { Skeleton } from "@/components/ui/skeleton";

export default function HomePageLoading() {
  return (
    <div className="space-y-0">
      {/* Hero skeleton */}
      <Skeleton className="aspect-[16/7] w-full rounded-none sm:aspect-[16/6] md:aspect-[16/5]" />

      {/* USP bar */}
      <div className="border-y bg-muted/30 py-6">
        <div className="mx-auto flex max-w-screen-xl justify-around gap-4 px-4 sm:px-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex flex-col items-center gap-2 sm:flex-row">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="space-y-1">
                <Skeleton className="h-3.5 w-24" />
                <Skeleton className="h-3 w-16" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Category chips */}
      <div className="py-8 sm:py-10">
        <div className="mx-auto max-w-screen-xl px-4 sm:px-6">
          <Skeleton className="mb-5 h-6 w-40" />
          <div className="flex gap-3 sm:grid sm:grid-cols-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex shrink-0 flex-col items-center gap-2">
                <Skeleton className="h-20 w-20 rounded-xl sm:h-24 sm:w-full" />
                <Skeleton className="h-3.5 w-16" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Featured products */}
      <div className="py-8 sm:py-10">
        <div className="mx-auto max-w-screen-xl px-4 sm:px-6">
          <div className="mb-6 flex items-end justify-between">
            <Skeleton className="h-7 w-36" />
            <Skeleton className="h-4 w-16" />
          </div>
          <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="overflow-hidden rounded-xl border">
                <Skeleton className="aspect-square w-full" />
                <div className="space-y-2 p-3">
                  <Skeleton className="h-3 w-16" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-20" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
