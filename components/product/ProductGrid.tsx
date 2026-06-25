import ProductCard from "@/components/product/ProductCard";
import type { ProductCard as ProductCardType } from "@/sanity/lib/fetch";

interface ProductGridProps {
  products: ProductCardType[];
  columns?: 2 | 3 | 4;
  priority?: boolean;
}

const colClasses = {
  2: "grid-cols-2",
  3: "grid-cols-2 md:grid-cols-3",
  4: "grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
};

export default function ProductGrid({
  products,
  columns = 4,
  priority = false,
}: ProductGridProps) {
  if (products.length === 0) return null;

  return (
    <div className={`grid ${colClasses[columns]} gap-3 sm:gap-4`}>
      {products.map((product, i) => (
        <ProductCard
          key={product._id}
          product={product}
          priority={priority && i === 0}
        />
      ))}
    </div>
  );
}
