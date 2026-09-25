"use client";

import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

type ChromeUiContextValue = {
  searchOpen: boolean;
  setSearchOpen: (v: boolean) => void;
  menuOpen: boolean;
  setMenuOpen: (v: boolean) => void;
};

const ChromeUiContext = createContext<ChromeUiContextValue | null>(null);

export function ChromeUiProvider({ children }: { children: ReactNode }) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const value = useMemo(
    () => ({ searchOpen, setSearchOpen, menuOpen, setMenuOpen }),
    [searchOpen, menuOpen],
  );

  return <ChromeUiContext.Provider value={value}>{children}</ChromeUiContext.Provider>;
}

export function useChromeUi() {
  const ctx = useContext(ChromeUiContext);
  if (!ctx) throw new Error("useChromeUi must be used within ChromeUiProvider");
  return ctx;
}
