"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

type Currency = "NGN" | "USD";
const RATE = 1500; // NGN per USD
const STORAGE_KEY = "za_cur";

type CurrencyContextValue = {
  currency: Currency;
  setCurrency: (c: Currency) => void;
  money: (ngn: number, opts?: { decimals?: boolean }) => string;
};

const CurrencyContext = createContext<CurrencyContextValue | null>(null);

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrencyState] = useState<Currency>("NGN");

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === "USD" || stored === "NGN") queueMicrotask(() => setCurrencyState(stored));
    } catch {
      // ignore
    }
  }, []);

  const setCurrency = useCallback((c: Currency) => {
    setCurrencyState(c);
    try {
      localStorage.setItem(STORAGE_KEY, c);
    } catch {
      // ignore
    }
  }, []);

  const money = useCallback(
    (ngn: number, opts: { decimals?: boolean } = {}) => {
      if (currency === "USD") {
        return "$" + (ngn / RATE).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
      }
      const dec = opts.decimals ? 2 : 0;
      return "₦" + ngn.toLocaleString("en-NG", { minimumFractionDigits: dec, maximumFractionDigits: dec });
    },
    [currency],
  );

  const value = useMemo(() => ({ currency, setCurrency, money }), [currency, setCurrency, money]);

  return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>;
}

export function useCurrency() {
  const ctx = useContext(CurrencyContext);
  if (!ctx) throw new Error("useCurrency must be used within CurrencyProvider");
  return ctx;
}
