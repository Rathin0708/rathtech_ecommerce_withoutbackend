"use client";

import { useState } from "react";
import Link from "next/link";
import { X } from "lucide-react";

interface AnnouncementBarProps {
  text: string;
  linkText?: string | null;
  linkUrl?: string | null;
}

const STORAGE_KEY = "announcement-dismissed";

export default function AnnouncementBar({
  text,
  linkText,
  linkUrl,
}: AnnouncementBarProps) {
  // Lazy initializer avoids a useEffect + extra render.
  // Returns false during SSR (no window), then reads sessionStorage on the client.
  const [visible, setVisible] = useState(() => {
    if (typeof window === "undefined") return false;
    return !sessionStorage.getItem(STORAGE_KEY);
  });

  if (!visible) return null;

  function dismiss() {
    sessionStorage.setItem(STORAGE_KEY, "1");
    setVisible(false);
  }

  return (
    <div
      role="banner"
      className="relative flex items-center justify-center gap-2 bg-primary px-10 py-2 text-center text-xs font-medium text-primary-foreground sm:text-sm"
    >
      <span>
        {text}
        {linkText && linkUrl && (
          <>
            {" "}
            <Link
              href={linkUrl}
              className="underline underline-offset-2 hover:no-underline"
            >
              {linkText}
            </Link>
          </>
        )}
      </span>
      <button
        onClick={dismiss}
        aria-label="Dismiss announcement"
        className="absolute right-3 top-1/2 -translate-y-1/2 rounded p-0.5 hover:bg-primary-foreground/20 transition-colors"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
