"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { useUIStore } from "@/store/uiStore";
import type { NavItem } from "@/sanity/lib/fetch";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface MobileNavProps {
  items: NavItem[];
  storeName: string;
}

export default function MobileNav({ items, storeName }: MobileNavProps) {
  const isMobileNavOpen = useUIStore((s) => s.isMobileNavOpen);
  const openMobileNav = useUIStore((s) => s.toggleMobileNav);
  const closeMobileNav = useUIStore((s) => s.closeMobileNav);
  const pathname = usePathname();

  // Close drawer on route change
  useEffect(() => {
    closeMobileNav();
  }, [pathname, closeMobileNav]);

  return (
    <Sheet open={isMobileNavOpen} onOpenChange={(open) => !open && closeMobileNav()}>
      <SheetTrigger
        render={
          <button
            onClick={openMobileNav}
            aria-label="Open navigation menu"
            className="flex h-11 w-11 items-center justify-center rounded-md hover:bg-muted transition-colors lg:hidden"
          />
        }
      >
        <Menu className="h-5 w-5" />
      </SheetTrigger>

      <SheetContent side="left" className="w-[300px] overflow-y-auto p-0 sm:w-[340px]">
        <SheetHeader className="border-b px-4 py-4">
          <SheetTitle className="text-left text-base">{storeName}</SheetTitle>
        </SheetHeader>

        <nav className="flex flex-col px-2 py-3">
          {items.map((item) => {
            const hasChildren = (item.children?.length ?? 0) > 0;

            if (hasChildren) {
              return (
                <Accordion key={item.label}>
                  <AccordionItem value={item.label} className="border-none">
                    <AccordionTrigger className="px-3 text-sm font-medium hover:no-underline">
                      {item.label}
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="flex flex-col gap-0.5 pl-2">
                        {item.children?.map((child) => (
                          <Link
                            key={child.url}
                            href={child.url}
                            className="block rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                          >
                            {child.label}
                          </Link>
                        ))}
                        {item.url && (
                          <Link
                            href={item.url}
                            className="block rounded-md px-3 py-2 text-sm font-medium text-primary hover:bg-muted transition-colors"
                          >
                            View all {item.label}
                          </Link>
                        )}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              );
            }

            return (
              <Link
                key={item.label}
                href={item.url ?? "#"}
                className="rounded-md px-3 py-2.5 text-sm font-medium hover:bg-muted transition-colors"
              >
                {item.label}
              </Link>
            );
          })}

          {/* Quick links */}
          <div className="mx-3 my-2 border-t" />
          <Link href="/products" className="rounded-md px-3 py-2.5 text-sm hover:bg-muted transition-colors">
            All Products
          </Link>
          <Link href="/new-arrivals" className="rounded-md px-3 py-2.5 text-sm hover:bg-muted transition-colors">
            New Arrivals
          </Link>
          <Link href="/sale" className="rounded-md px-3 py-2.5 text-sm hover:bg-muted transition-colors">
            Sale
          </Link>
          <div className="mx-3 my-2 border-t" />
          <Link href="/about" className="rounded-md px-3 py-2.5 text-sm text-muted-foreground hover:bg-muted transition-colors">
            About
          </Link>
          <Link href="/contact" className="rounded-md px-3 py-2.5 text-sm text-muted-foreground hover:bg-muted transition-colors">
            Contact
          </Link>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
