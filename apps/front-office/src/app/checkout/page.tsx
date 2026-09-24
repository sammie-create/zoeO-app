import { CheckoutClient } from "@/components/checkout/checkout-client";
import { getProducts } from "@/lib/queries";

export const metadata = { title: "Checkout — ZoeO Allure" };

export default async function CheckoutPage() {
  const products = await getProducts();
  return <CheckoutClient products={products} />;
}
