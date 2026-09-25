import { Suspense } from "react";
import { ShopClient } from "@/components/shop/shop-client";
import { getProducts } from "@/lib/queries";

export const metadata = { title: "Shop All Products — ZoeO Allure" };

export default async function ShopPage() {
  const products = await getProducts();

  return (
    <Suspense>
      <ShopClient products={products} />
    </Suspense>
  );
}
