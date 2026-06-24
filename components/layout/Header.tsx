import Link from "next/link";
import { Search } from "lucide-react";
import { fetchSiteSettings } from "@/sanity/lib/fetch";
import SanityImage from "@/components/shared/SanityImage";
import AnnouncementBar from "@/components/layout/AnnouncementBar";
import MegaMenu from "@/components/layout/MegaMenu";
import MobileNav from "@/components/layout/MobileNav";
import CartIcon from "@/components/cart/CartIcon";

export default async function Header() {
  let settings = null;
  try {
    settings = await fetchSiteSettings();
  } catch {
    // Sanity not configured yet — render minimal header
  }

  const storeName = settings?.storeName ?? "Store";
  const navItems = settings?.primaryNav ?? [];
  const announcementBar = settings?.announcementBar;

  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur-sm">
      {/* Announcement Bar */}
      {announcementBar?.isVisible && announcementBar.text && (
        <AnnouncementBar
          text={announcementBar.text}
          linkText={announcementBar.linkText}
          linkUrl={announcementBar.linkUrl}
        />
      )}

      {/* Main header row */}
      <div className="mx-auto flex h-16 max-w-screen-xl items-center justify-between gap-4 px-4 sm:px-6">
        {/* Mobile nav trigger */}
        <MobileNav items={navItems} storeName={storeName} />

        {/* Logo */}
        <Link
          href="/"
          className="flex shrink-0 items-center gap-2"
          aria-label={`${storeName} — home`}
        >
          {settings?.logo ? (
            <SanityImage
              image={settings.logo}
              alt={settings.logo.alt ?? storeName}
              width={120}
              height={40}
              priority
              className="h-8 w-auto object-contain"
            />
          ) : (
            <span className="text-lg font-bold tracking-tight">{storeName}</span>
          )}
        </Link>

        {/* Desktop mega-menu — centred */}
        <div className="hidden flex-1 justify-center lg:flex">
          <MegaMenu items={navItems} />
        </div>

        {/* Right-side icons */}
        <div className="flex items-center gap-1">
          {/* Search button (opens modal in Phase 4) */}
          <Link
            href="/search"
            aria-label="Search products"
            className="flex h-11 w-11 items-center justify-center rounded-md hover:bg-muted transition-colors"
          >
            <Search className="h-5 w-5" />
          </Link>

          {/* Cart */}
          <CartIcon />
        </div>
      </div>
    </header>
  );
}
