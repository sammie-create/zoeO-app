"use client";

import { toast } from "sonner";
import { useCart } from "@/lib/store/cart";

export function AddToCartButton({
  productId,
  productName,
  className,
  children = "Add to cart",
}: {
  productId: string;
  productName: string;
  className?: string;
  children?: React.ReactNode;
}) {
  const { add } = useCart();

  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        add(productId);
        toast.success("Added to cart", { description: productName });
      }}
      className={className}
    >
      {children}
    </button>
  );
}
