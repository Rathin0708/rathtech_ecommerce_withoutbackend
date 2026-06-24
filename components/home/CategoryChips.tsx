import Link from "next/link";
import SanityImage from "@/components/shared/SanityImage";
import { getCategoryUrl } from "@/lib/getCategoryUrl";

interface CategoryChip {
  _id: string;
  name: string;
  slug: string;
  image?: {
    asset: unknown;
    alt?: string | null;
    lqip?: string | null;
  } | null;
}

interface CategoryChipsProps {
  categories: CategoryChip[];
}

export default function CategoryChips({ categories }: CategoryChipsProps) {
  if (!categories || categories.length === 0) return null;

  return (
    <section aria-label="Shop by category" className="py-8 sm:py-10">
      <div className="mx-auto max-w-screen-xl px-4 sm:px-6">
        <h2 className="mb-5 text-lg font-semibold sm:text-xl">Shop by Category</h2>
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none sm:grid sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {categories.map((cat) => (
            <Link
              key={cat._id}
              href={getCategoryUrl(cat.slug)}
              className="group flex shrink-0 flex-col items-center gap-2 rounded-xl p-2 transition-colors hover:bg-muted sm:shrink"
            >
              <div className="relative aspect-square w-20 overflow-hidden rounded-xl bg-muted sm:w-full">
                {cat.image ? (
                  <SanityImage
                    image={cat.image}
                    alt={cat.name}
                    fill
                    sizes="(max-width: 640px) 80px, (max-width: 768px) 33vw, 16vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-muted text-2xl font-bold text-muted-foreground">
                    {cat.name.charAt(0)}
                  </div>
                )}
              </div>
              <span className="text-center text-xs font-medium leading-tight sm:text-sm">
                {cat.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
