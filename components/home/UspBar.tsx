import {
  Truck,
  RotateCcw,
  ShieldCheck,
  BadgeCheck,
  Star,
  Package,
  type LucideIcon,
} from "lucide-react";
import type { UspItemData } from "@/sanity/lib/fetch";

const ICON_MAP: Record<string, LucideIcon> = {
  truck: Truck,
  "rotate-ccw": RotateCcw,
  "shield-check": ShieldCheck,
  "badge-check": BadgeCheck,
  star: Star,
  package: Package,
};

interface UspBarProps {
  items: UspItemData[];
}

export default function UspBar({ items }: UspBarProps) {
  if (!items || items.length === 0) return null;

  return (
    <section aria-label="Why shop with us" className="border-y bg-muted/30 py-6">
      <div className="mx-auto max-w-screen-xl px-4 sm:px-6">
        <ul
          role="list"
          className="grid grid-cols-2 gap-4 sm:grid-cols-4 md:flex md:justify-around"
        >
          {items.map((item) => {
            const Icon = ICON_MAP[item.iconName] ?? ShieldCheck;
            return (
              <li
                key={item.iconName}
                className="flex flex-col items-center gap-2 text-center sm:flex-row sm:text-left"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold leading-tight">{item.title}</p>
                  {item.subtitle && (
                    <p className="text-xs text-muted-foreground">{item.subtitle}</p>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
