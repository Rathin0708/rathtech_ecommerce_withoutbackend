import Link from "next/link";
import EmptyState from "@/components/shared/EmptyState";

export default function ProductNotFound() {
  return (
    <div className="mx-auto max-w-screen-xl px-4 py-16 sm:px-6">
      <EmptyState
        title="Product Not Found"
        description="This product may have been removed or the link is incorrect."
        action={
          <Link
            href="/products"
            className="inline-flex h-8 items-center justify-center rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/80"
          >
            Browse All Products
          </Link>
        }
      />
    </div>
  );
}
