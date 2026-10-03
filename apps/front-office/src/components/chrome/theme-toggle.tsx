"use client";

import { Icon } from "@/components/shared/icon";
import { toggleTheme, useTheme } from "@/lib/theme";

export function ThemeToggle({ disableLight = false, className = "grid" }: { disableLight?: boolean; className?: string }) {
  // Only used for the aria attributes — an accessibility requirement that
  // has to be a real DOM attribute computed in JS. All visual state (which
  // icon shows, the button's text colour) is driven purely by the `light:`
  // CSS variant below, keyed off [data-theme="light"] — no React state
  // involved in how it looks.
  const theme = useTheme();
  const isLight = theme === "light";

  return (
    <button
      type="button"
      onClick={(e) => toggleTheme({ clientX: e.clientX, clientY: e.clientY })}
      aria-pressed={isLight}
      aria-label={isLight ? "Switch to dark theme" : "Switch to light theme"}
      className={`relative size-9 place-items-center overflow-hidden rounded-full text-white transition-colors hover:bg-white/8 hover:text-violet-200 ${
        disableLight ? "" : "light:text-noir-900 light:hover:bg-noir-900/6 light:hover:text-violet-600"
      } ${className}`}
    >
      <Icon
        name="moon"
        className="absolute m-auto size-[22px] rotate-0 scale-100 opacity-100 transition-[transform,opacity] duration-[420ms,280ms] ease-[var(--ease)] light:rotate-90 light:scale-[0.6] light:opacity-0"
      />
      <Icon
        name="sun"
        className="absolute m-auto size-[22px] -rotate-90 scale-[0.6] opacity-0 transition-[transform,opacity] duration-[420ms,280ms] ease-[var(--ease)] light:rotate-0 light:scale-100 light:opacity-100"
      />
    </button>
  );
}
