import { cn } from "@/lib/utils";
import type { BadgeType } from "@/types";

// -600/-700 variants ensure ≥4.5:1 contrast ratio against white for small text (WCAG AA)
const BADGE_CONFIG: Record<
  BadgeType,
  { label: string; className: string }
> = {
  new: { label: "New", className: "bg-emerald-600 text-white" },
  sale: { label: "Sale", className: "bg-red-600 text-white" },
  bestSeller: { label: "Best Seller", className: "bg-amber-800 text-white" },
  limitedEdition: {
    label: "Limited",
    className: "bg-purple-600 text-white",
  },
  comingSoon: { label: "Coming Soon", className: "bg-slate-600 text-white" },
};

interface ProductBadgeProps {
  badge: string | null | undefined;
  className?: string;
}

export default function ProductBadge({ badge, className }: ProductBadgeProps) {
  if (!badge) return null;
  const config = BADGE_CONFIG[badge as BadgeType];
  if (!config) return null;

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
        config.className,
        className
      )}
    >
      {config.label}
    </span>
  );
}
