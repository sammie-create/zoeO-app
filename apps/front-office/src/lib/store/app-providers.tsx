"use client";

import type { ReactNode } from "react";
import { Toaster } from "@/components/ui/sonner";
import { CartProvider } from "./cart";
import { CurrencyProvider } from "./currency";

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <CurrencyProvider>
      <CartProvider>
        {children}
        <Toaster />
      </CartProvider>
    </CurrencyProvider>
  );
}
