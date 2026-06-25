"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";
import { useSearch } from "@/hooks/useSearch";
import SearchSuggestions from "@/components/search/SearchSuggestions";

interface SearchBarProps {
  initialQuery?: string;
  onClose?: () => void;
  autoFocus?: boolean;
  placeholder?: string;
}

export default function SearchBar({
  initialQuery = "",
  onClose,
  autoFocus = false,
  placeholder = "Search products…",
}: SearchBarProps) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [isFocused, setIsFocused] = useState(false);
  const { query, setQuery, suggestions, isLoading, recentSearches, saveSearch } =
    useSearch(initialQuery);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;
    saveSearch(query.trim());
    router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    onClose?.();
    inputRef.current?.blur();
  }

  function handleSelect(q: string) {
    setQuery(q);
    saveSearch(q);
    router.push(`/search?q=${encodeURIComponent(q)}`);
    onClose?.();
  }

  const showDropdown =
    isFocused && (query.trim().length >= 2 || recentSearches.length > 0);

  return (
    <div className="relative">
      <form onSubmit={handleSubmit} role="search" aria-label="Site search">
        <div className="relative flex items-center">
          <Search
            className="pointer-events-none absolute left-3 h-4 w-4 text-muted-foreground"
            aria-hidden
          />
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setTimeout(() => setIsFocused(false), 150)}
            placeholder={placeholder}
            autoFocus={autoFocus}
            aria-label="Search products"
            aria-autocomplete="list"
            className="h-10 w-full rounded-lg border border-input bg-background pl-9 pr-9 text-sm placeholder:text-muted-foreground focus:outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label="Clear search"
              className="absolute right-3 text-muted-foreground transition-colors hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </form>

      {showDropdown && (
        <div className="absolute inset-x-0 top-full z-50 mt-1 overflow-hidden rounded-lg border bg-popover shadow-md">
          <SearchSuggestions
            suggestions={suggestions}
            isLoading={isLoading}
            recentSearches={recentSearches}
            query={query}
            onSelect={handleSelect}
            onClose={() => {
              setIsFocused(false);
              onClose?.();
            }}
          />
        </div>
      )}
    </div>
  );
}
