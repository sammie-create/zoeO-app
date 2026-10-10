import { CheckoutClient } from "@/components/checkout/checkout-client";
import { getProducts, getSiteSettings } from "@/lib/queries";

export const metadata = { title: "Checkout — ZoeO Allure" };

export default async function CheckoutPage() {
  const [products, settings] = await Promise.all([getProducts(), getSiteSettings()]);
  return <CheckoutClient products={products} settings={settings} />;
}
