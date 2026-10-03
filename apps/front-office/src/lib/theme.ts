import { useSyncExternalStore } from "react";

export type Theme = "light" | "dark";

const STORAGE_KEY = "za_theme";
const CHANGE_EVENT = "za:theme-change";

export function getTheme(): Theme {
  if (typeof document === "undefined") return "dark";
  return document.documentElement.dataset.theme === "light" ? "light" : "dark";
}

type ThemeClickOrigin = { clientX?: number; clientY?: number };

export function setTheme(theme: Theme, origin?: ThemeClickOrigin) {
  const root = document.documentElement;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const apply = () => {
    root.dataset.theme = theme;
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      // storage unavailable (private mode, etc.) — theme still applies for this load
    }
    document.dispatchEvent(new Event(CHANGE_EVENT));
  };

  if (reduceMotion) {
    apply();
    return;
  }

  if (document.startViewTransition) {
    const x = origin?.clientX ?? window.innerWidth - 60;
    const y = origin?.clientY ?? 40;
    const r = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));
    const transition = document.startViewTransition(apply);
    transition.ready
      .then(() =>
        root.animate(
          { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${r}px at ${x}px ${y}px)`] },
          { duration: 620, easing: "cubic-bezier(.22,.7,.28,1)", pseudoElement: "::view-transition-new(root)" },
        ),
      )
      .catch(() => {});
    return;
  }

  root.classList.add("theme-anim");
  apply();
  setTimeout(() => root.classList.remove("theme-anim"), 480);
}

export function toggleTheme(origin?: ThemeClickOrigin) {
  setTheme(getTheme() === "light" ? "dark" : "light", origin);
}

function subscribe(callback: () => void) {
  document.addEventListener(CHANGE_EVENT, callback);
  return () => document.removeEventListener(CHANGE_EVENT, callback);
}

export function useTheme() {
  return useSyncExternalStore(subscribe, getTheme, () => "dark" as Theme);
}
