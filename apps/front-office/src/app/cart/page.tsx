import { CartClient } from "@/components/cart/cart-client";
import { getProducts } from "@/lib/queries";

export const metadata = { title: "Your Cart — ZoeO Allure" };

export default async function CartPage() {
  const products = await getProducts();
  return <CartClient products={products} />;
}
