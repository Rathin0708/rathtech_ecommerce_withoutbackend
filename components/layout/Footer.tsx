import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { fetchSiteSettings } from "@/sanity/lib/fetch";

// Inline SVGs for brand icons (removed from lucide-react v1+)
function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
      <circle cx="12" cy="12" r="4"/>
      <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none"/>
    </svg>
  );
}
function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
    </svg>
  );
}
function TwitterIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  );
}
function YoutubeIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
      <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/>
      <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="white"/>
    </svg>
  );
}

export default async function Footer() {
  let settings = null;
  try {
    settings = await fetchSiteSettings();
  } catch {
    // Sanity not configured — show minimal footer
  }

  const storeName = settings?.storeName ?? "Store";
  const social = settings?.socialLinks;
  const footerNav = settings?.footerNav ?? [];
  const year = new Date().getFullYear();

  const defaultFooterLinks = [
    { groupTitle: "Shop", links: [{ label: "All Products", url: "/products" }, { label: "New Arrivals", url: "/new-arrivals" }, { label: "Sale", url: "/sale" }] },
    { groupTitle: "Info", links: [{ label: "About Us", url: "/about" }, { label: "Contact", url: "/contact" }, { label: "FAQ", url: "/faq" }] },
    { groupTitle: "Policy", links: [{ label: "Returns", url: "/returns" }, { label: "Privacy Policy", url: "/privacy" }, { label: "Terms", url: "/terms" }] },
  ];

  const groups = footerNav.length > 0 ? footerNav : defaultFooterLinks;

  return (
    <footer className="border-t bg-muted/30">
      <div className="mx-auto max-w-screen-xl px-4 py-12 sm:px-6">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand column */}
          <div className="space-y-4">
            <p className="text-lg font-bold">{storeName}</p>
            {settings?.tagline && (
              <p className="text-sm text-muted-foreground">{settings.tagline}</p>
            )}
            {/* WhatsApp CTA */}
            {settings?.whatsappNumber && (
              <a
                href={`https://wa.me/${settings.whatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-md bg-[#25D366] px-3 py-2 text-xs font-medium text-white hover:bg-[#20b858] transition-colors"
              >
                <MessageCircle className="h-4 w-4" />
                WhatsApp us
              </a>
            )}
            {/* Social links */}
            {social && (
              <div className="flex gap-3">
                {social.instagram && (
                  <a href={social.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-muted-foreground hover:text-foreground transition-colors">
                    <InstagramIcon />
                  </a>
                )}
                {social.facebook && (
                  <a href={social.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="text-muted-foreground hover:text-foreground transition-colors">
                    <FacebookIcon />
                  </a>
                )}
                {social.twitter && (
                  <a href={social.twitter} target="_blank" rel="noopener noreferrer" aria-label="Twitter / X" className="text-muted-foreground hover:text-foreground transition-colors">
                    <TwitterIcon />
                  </a>
                )}
                {social.youtube && (
                  <a href={social.youtube} target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="text-muted-foreground hover:text-foreground transition-colors">
                    <YoutubeIcon />
                  </a>
                )}
              </div>
            )}
          </div>

          {/* Navigation groups */}
          {groups.map((group) => (
            <div key={group.groupTitle} className="space-y-3">
              <p className="text-sm font-semibold">{group.groupTitle}</p>
              <ul className="space-y-2">
                {group.links?.map((link) => (
                  <li key={link.url}>
                    <Link
                      href={link.url}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 border-t pt-6 text-center text-xs text-muted-foreground">
          © {year} {storeName}. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
