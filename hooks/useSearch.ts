"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { fetchSearchSuggestions } from "@/sanity/lib/fetch";
import type { ProductCard } from "@/sanity/lib/fetch";

const RECENT_KEY = "rathtech-recent-searches";
const MAX_RECENT = 5;

function getRecentSearches(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(RECENT_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

function saveRecentSearch(query: string): string[] {
  const recent = getRecentSearches().filter((q) => q !== query);
  const next = [query, ...recent].slice(0, MAX_RECENT);
  localStorage.setItem(RECENT_KEY, JSON.stringify(next));
  return next;
}

export function useSearch(initialQuery = "") {
  const [query, setQuery] = useState(initialQuery);
  // Stores fetched suggestions (may be stale when query < 2; see `suggestions` derived below)
  const [_suggestions, _setSuggestions] = useState<ProductCard[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  // Lazy initializer: [] on SSR, localStorage values on client.
  const [recentSearches, setRecentSearches] = useState<string[]>(getRecentSearches);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    // Don't set state synchronously in the short-query branch.
    // Instead, skip fetching and let `suggestions` derivation handle the empty display.
    if (query.trim().length < 2) return;

    // setIsLoading(true) goes inside the callback to avoid synchronous setState in effect
    debounceRef.current = setTimeout(async () => {
      setIsLoading(true);
      try {
        const results = await fetchSearchSuggestions(query.trim());
        _setSuggestions(results);
      } catch {
        _setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query]);

  // Derive: hide stale results when query is too short
  const suggestions = query.trim().length >= 2 ? _suggestions : [];
  const loading = query.trim().length >= 2 && isLoading;

  const saveSearch = useCallback((q: string) => {
    const next = saveRecentSearch(q);
    setRecentSearches(next);
  }, []);

  const clearRecentSearches = useCallback(() => {
    localStorage.removeItem(RECENT_KEY);
    setRecentSearches([]);
  }, []);

  return {
    query,
    setQuery,
    suggestions,
    isLoading: loading,
    recentSearches,
    saveSearch,
    clearRecentSearches,
  };
}
