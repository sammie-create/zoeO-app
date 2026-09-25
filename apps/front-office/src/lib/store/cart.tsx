"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type CartItem = { id: string; qty: number };

type CartContextValue = {
  items: CartItem[];
  count: number;
  add: (id: string, qty?: number) => void;
  setQty: (id: string, qty: number) => void;
  remove: (id: string) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

const STORAGE_KEY = "za_cart";

function readCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as CartItem[]) : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    queueMicrotask(() => {
      setItems(readCart());
      setMounted(true);
    });
  }, []);

  const persist = useCallback((next: CartItem[]) => {
    setItems(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // ignore
    }
  }, []);

  const add = useCallback(
    (id: string, qty = 1) => {
      setItems((prev) => {
        const hit = prev.find((i) => i.id === id);
        const next = hit
          ? prev.map((i) => (i.id === id ? { ...i, qty: Math.min(99, i.qty + qty) } : i))
          : [...prev, { id, qty }];
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        } catch {
          // ignore
        }
        return next;
      });
    },
    [],
  );

  const setQty = useCallback(
    (id: string, qty: number) => {
      persist(items.map((i) => (i.id === id ? { ...i, qty: Math.max(1, Math.min(99, qty)) } : i)));
    },
    [items, persist],
  );

  const remove = useCallback(
    (id: string) => {
      persist(items.filter((i) => i.id !== id));
    },
    [items, persist],
  );

  const clear = useCallback(() => persist([]), [persist]);

  const count = useMemo(() => items.reduce((n, i) => n + i.qty, 0), [items]);

  const value = useMemo(
    () => ({ items: mounted ? items : [], count: mounted ? count : 0, add, setQty, remove, clear }),
    [items, mounted, count, add, setQty, remove, clear],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
