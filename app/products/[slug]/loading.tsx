import { Skeleton } from "@/components/ui/skeleton";

export default function ProductLoading() {
  return (
    <div className="mx-auto max-w-screen-xl px-4 py-6 sm:px-6">
      <Skeleton className="mb-6 h-4 w-48" />

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Gallery skeleton */}
        <div className="space-y-3">
          <Skeleton className="aspect-square w-full rounded-xl" />
          <div className="flex gap-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="aspect-square w-16 rounded-lg" />
            ))}
          </div>
        </div>

        {/* Info skeleton */}
        <div className="space-y-4">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-7 w-32" />
          <Skeleton className="h-16 w-full" />
          <div className="space-y-2 pt-4">
            <Skeleton className="h-10 w-full" />
            <div className="flex gap-2">
              <Skeleton className="h-11 flex-1" />
              <Skeleton className="h-11 flex-1" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
