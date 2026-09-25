"use client";

import { useCurrency } from "@/lib/store/currency";

export function MoneyLabel({ ngn, decimals }: { ngn: number; decimals?: boolean }) {
  const { money } = useCurrency();
  return <>{money(ngn, { decimals })}</>;
}
