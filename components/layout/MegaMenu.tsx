"use client";

import { useState, useRef, useCallback } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import type { NavItem } from "@/sanity/lib/fetch";

interface MegaMenuProps {
  items: NavItem[];
}

export default function MegaMenu({ items }: MegaMenuProps) {
  const [openId, setOpenId] = useState<string | null>(null);
  const leaveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleEnter = useCallback((id: string) => {
    if (leaveTimerRef.current) clearTimeout(leaveTimerRef.current);
    setOpenId(id);
  }, []);

  const handleLeave = useCallback(() => {
    leaveTimerRef.current = setTimeout(() => setOpenId(null), 150);
  }, []);

  function handleKeyDown(e: React.KeyboardEvent, id: string) {
    if (e.key === "Escape") setOpenId(null);
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setOpenId((prev) => (prev === id ? null : id));
    }
  }

  return (
    <nav role="navigation" aria-label="Main navigation" className="hidden lg:flex">
      <ul className="flex items-center gap-1">
        {items.map((item) => {
          const hasChildren = (item.children?.length ?? 0) > 0;
          const id = item.label;
          const isOpen = openId === id;

          return (
            <li
              key={id}
              className="relative"
              onMouseEnter={() => hasChildren && handleEnter(id)}
              onMouseLeave={handleLeave}
            >
              {hasChildren ? (
                <button
                  aria-expanded={isOpen}
                  aria-haspopup="true"
                  onKeyDown={(e) => handleKeyDown(e, id)}
                  className={cn(
                    "flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-muted",
                    isOpen && "bg-muted"
                  )}
                >
                  {item.label}
                  <ChevronDown
                    className={cn(
                      "h-3.5 w-3.5 text-muted-foreground transition-transform duration-150",
                      isOpen && "rotate-180"
                    )}
                  />
                </button>
              ) : (
                <Link
                  href={item.url ?? "#"}
                  className="flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-muted"
                >
                  {item.label}
                </Link>
              )}

              {/* Sub-menu panel */}
              {hasChildren && isOpen && (
                <div
                  role="menu"
                  className="absolute left-0 top-full z-50 mt-1 min-w-[240px] rounded-xl border bg-popover p-2 shadow-lg"
                  onMouseEnter={() => handleEnter(id)}
                  onMouseLeave={handleLeave}
                >
                  {item.children?.map((child) => (
                    <Link
                      key={child.url}
                      href={child.url}
                      role="menuitem"
                      className="block rounded-lg px-3 py-2 text-sm hover:bg-muted transition-colors"
                      onClick={() => setOpenId(null)}
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
