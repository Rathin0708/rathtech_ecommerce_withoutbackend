import type { Metadata } from "next";
import { fetchSiteSettings } from "@/sanity/lib/fetch";
import CartPageContent from "@/components/cart/CartPageContent";

export const metadata: Metadata = {
  title: "Your Cart",
  robots: { index: false },
};

export default async function CartPage() {
  let storeNumber = "";
  try {
    const settings = await fetchSiteSettings();
    storeNumber = settings?.whatsappNumber ?? "";
  } catch {
    // Sanity not configured
  }

  return <CartPageContent storeNumber={storeNumber} />;
}
