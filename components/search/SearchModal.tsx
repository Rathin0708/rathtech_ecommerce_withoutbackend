"use client";

import { Search } from "lucide-react";
import { useUIStore } from "@/store/uiStore";
import SearchBar from "@/components/search/SearchBar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function SearchModal() {
  const isOpen = useUIStore((s) => s.isSearchOpen);
  const closeSearch = useUIStore((s) => s.closeSearch);
  const openSearch = useUIStore((s) => s.openSearch);

  return (
    <>
      <button
        onClick={openSearch}
        aria-label="Open search"
        className="flex h-11 w-11 items-center justify-center rounded-md transition-colors hover:bg-muted"
      >
        <Search className="h-5 w-5" />
      </button>

      <Dialog open={isOpen} onOpenChange={(open) => !open && closeSearch()}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="sr-only">Search</DialogTitle>
          </DialogHeader>
          <SearchBar
            autoFocus={isOpen}
            onClose={closeSearch}
            placeholder="Search products, categories…"
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
