export type BadgeType =
  | "new"
  | "sale"
  | "bestSeller"
  | "limitedEdition"
  | "comingSoon";

export type SortOption =
  | "newest"
  | "price-asc"
  | "price-desc"
  | "best-sellers"
  | "name-asc";

export interface CartVariant {
  size?: string;
  color?: string;
  label?: string;
  value?: string;
  sku?: string;
}

export interface CartItem {
  id: string;
  slug: string;
  name: string;
  image: string;
  price: number;
  salePrice: number | null;
  quantity: number;
  variant: CartVariant | null;
}

export interface FilterState {
  category?: string[];
  size?: string[];
  color?: string[];
  tag?: string[];
  minPrice?: number;
  maxPrice?: number;
  available?: boolean;
  sort?: SortOption;
  page?: number;
}
