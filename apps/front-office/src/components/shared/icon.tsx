const paths = {
  arrow: <path d="M5 12h14M13 6l6 6-6 6" />,
  arrowL: <path d="M19 12H5M11 6l-6 6 6 6" />,
  search: (
    <>
      <circle cx="11" cy="11" r="7" />
      <path d="M20 20l-3.5-3.5" />
    </>
  ),
  user: (
    <>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6" />
    </>
  ),
  bag: (
    <>
      <path d="M5 8h14l-1 12H6L5 8z" />
      <path d="M9 8V6a3 3 0 016 0v2" />
      <path d="M9 12a3 3 0 006 0" />
    </>
  ),
  menu: <path d="M4 7h16M4 12h16M4 17h10" />,
  close: <path d="M6 6l12 12M18 6L6 18" />,
  closeCircle: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M9 9l6 6M15 9l-6 6" />
    </>
  ),
  instagram: (
    <>
      <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r=".6" fill="currentColor" />
    </>
  ),
  x: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M9 9l6 6M15 9l-6 6" />
    </>
  ),
  facebook: <path d="M14 8h2V4.5h-2.5A3.5 3.5 0 0010 8v2.5H8V14h2v6.5h3.5V14H16l.5-3.5h-3V8.5c0-.3.2-.5.5-.5z" />,
  youtube: (
    <>
      <rect x="3" y="6" width="18" height="12" rx="4" />
      <path d="M10.5 9.5v5l4-2.5-4-2.5z" />
    </>
  ),
  twitter: (
    <path d="M21 6.5c-.7.3-1.4.5-2.1.6.8-.5 1.3-1.2 1.6-2-.7.4-1.5.7-2.3.9A3.6 3.6 0 0012 8.8c0 .3 0 .6.1.8A10.3 10.3 0 014.6 5.8a3.6 3.6 0 001.1 4.8c-.6 0-1.2-.2-1.6-.4 0 1.7 1.2 3.2 2.9 3.5-.5.2-1.1.2-1.6.1.5 1.4 1.8 2.5 3.4 2.5A7.3 7.3 0 013 17.8 10.3 10.3 0 008.6 19.5c6.7 0 10.4-5.6 10.4-10.4v-.5c.8-.5 1.5-1.2 2-2.1z" />
  ),
  tiktok: (
    <>
      <rect x="3" y="7" width="12" height="10" rx="2" />
      <path d="M15 10.5l6-3v9l-6-3" />
    </>
  ),
  truck: (
    <>
      <path d="M3 7h11v9H3zM14 10h4l3 3v3h-7" />
      <circle cx="7" cy="17.5" r="1.8" />
      <circle cx="17" cy="17.5" r="1.8" />
    </>
  ),
  returns: (
    <>
      <path d="M9 14L4 9l5-5" />
      <path d="M4 9h11a5 5 0 010 10h-3" />
    </>
  ),
  shield: (
    <>
      <path d="M12 3l7 3v5c0 5-3 8.5-7 10-4-1.5-7-5-7-10V6l7-3z" />
      <path d="M9 12l2 2 4-4" />
    </>
  ),
  headset: (
    <>
      <path d="M4 14v-2a8 8 0 0116 0v2" />
      <rect x="3" y="13" width="4" height="6" rx="1.5" />
      <rect x="17" y="13" width="4" height="6" rx="1.5" />
    </>
  ),
  star: <path d="M12 3.5l2.6 5.3 5.9.8-4.3 4.1 1 5.8L12 16.8l-5.2 2.7 1-5.8L3.5 9.6l5.9-.8L12 3.5z" />,
  sparkle: <path d="M12 3v18M3 12h18M5.6 5.6l12.8 12.8M18.4 5.6L5.6 18.4" />,
  sparkles: (
    <>
      <path d="M10 4l1.6 4.4L16 10l-4.4 1.6L10 16l-1.6-4.4L4 10l4.4-1.6L10 4z" />
      <path d="M18 14l.8 2.2L21 17l-2.2.8L18 20l-.8-2.2L15 17l2.2-.8L18 14z" />
    </>
  ),
  award: (
    <>
      <circle cx="12" cy="9" r="5" />
      <path d="M9 13.5L8 21l4-2 4 2-1-7.5" />
    </>
  ),
  users: (
    <>
      <circle cx="9" cy="8" r="3.5" />
      <path d="M2.5 20c.8-3.5 3.3-5.5 6.5-5.5s5.7 2 6.5 5.5" />
      <path d="M16 4.8a3.5 3.5 0 010 6.4M18 14.8c1.8.6 3 2.4 3.5 5.2" />
    </>
  ),
  wand: (
    <>
      <path d="M4 20L16 8" />
      <path d="M15 3v3M13.5 4.5h3M20 8v3M18.5 9.5h3M19 14v2M18 15h2" />
    </>
  ),
  medal: (
    <>
      <circle cx="12" cy="9" r="5.5" />
      <path d="M12 6.5v5M9.5 9h5" />
      <path d="M9 14l-1 7 4-2 4 2-1-7" />
    </>
  ),
  shieldCheck: (
    <>
      <path d="M12 3l7 3v5c0 5-3 8.5-7 10-4-1.5-7-5-7-10V6l7-3z" />
      <path d="M9 12l2 2 4-4" />
    </>
  ),
  swap: <path d="M4 9h14l-3-3M20 15H6l3 3" />,
  plus: <path d="M12 5v14M5 12h14" />,
  minus: <path d="M5 12h14" />,
  trash: <path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3" />,
  tag: (
    <>
      <path d="M3 12V4h8l10 10-8 8L3 12z" />
      <circle cx="7.5" cy="8.5" r="1.3" />
    </>
  ),
  check: <path d="M5 12.5l4.5 4.5L19 7.5" />,
  checkCircle: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M8 12.5l3 3 5-6" />
    </>
  ),
  eye: (
    <>
      <path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z" />
      <circle cx="12" cy="12" r="3" />
    </>
  ),
  drop: <path d="M12 3.5s6 6.5 6 11a6 6 0 01-12 0c0-4.5 6-11 6-11z" />,
  drops: (
    <>
      <path d="M9 8.5S5 13 5 15.5a4 4 0 008 0C13 13 9 8.5 9 8.5z" />
      <path d="M16 3.5s-3 3.3-3 5.2a3 3 0 006 0c0-1.9-3-5.2-3-5.2z" />
    </>
  ),
  heart: <path d="M12 20s-7.5-4.6-7.5-10.2A4.3 4.3 0 0112 7.3a4.3 4.3 0 017.5 2.5C19.5 15.4 12 20 12 20z" />,
  leaf: (
    <>
      <path d="M5 19c0-8 5-14 15-14 0 10-6 15-14 15" />
      <path d="M5 19c3-4 6-6.5 10-8.5" />
    </>
  ),
  pin: (
    <>
      <path d="M12 21s-7-6.3-7-12a7 7 0 0114 0c0 5.7-7 12-7 12z" />
      <circle cx="12" cy="9" r="2.5" />
    </>
  ),
  store: (
    <>
      <path d="M4 9l1.5-5h13L20 9" />
      <path d="M4 9a2.7 2.7 0 005.3 0 2.7 2.7 0 005.4 0A2.7 2.7 0 0020 9" />
      <path d="M5 11v9h14v-9" />
    </>
  ),
  share: <path d="M4 20h16M7 16V9M12 16V5M17 16v-4" />,
  help: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M9.5 9.5a2.5 2.5 0 014.8 1c0 1.8-2.3 2-2.3 3.5M12 17h.01" />
    </>
  ),
  calendar: (
    <>
      <rect x="4" y="5" width="16" height="15" rx="2.5" />
      <path d="M4 10h16M9 3v4M15 3v4" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </>
  ),
  phone: <path d="M6.5 3.5h3l1.5 4.5-2 1.5a11 11 0 005.5 5.5l1.5-2 4.5 1.5v3a2 2 0 01-2 2A16.5 16.5 0 014.5 5.5a2 2 0 012-2z" />,
  mail: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2.5" />
      <path d="M3.5 7l8.5 6 8.5-6" />
    </>
  ),
  chat: (
    <>
      <path d="M20 12a8 8 0 01-11.6 7.1L4 20l1-4A8 8 0 1120 12z" />
      <path d="M9 12h6" />
    </>
  ),
  lashes: (
    <>
      <path d="M4 15a8 8 0 0116 0" />
      <path d="M7 15l-1.5 3M12 16v3M17 15l1.5 3" />
    </>
  ),
  brush: (
    <>
      <path d="M9 3h6v5l-1.5 2v11h-3V10L9 8V3z" />
      <path d="M9 5.5h6" />
    </>
  ),
  nails: (
    <>
      <path d="M9 9V7a3 3 0 016 0v2c0 2-1 3.5-1.5 4.5h-3C10 12.5 9 11 9 9z" />
      <path d="M10.5 13.5v2.5a1.5 1.5 0 003 0v-2.5" />
    </>
  ),
  revamp: (
    <>
      <path d="M20 12a8 8 0 11-2.3-5.7" />
      <path d="M20 4v4h-4" />
    </>
  ),
  gele: (
    <>
      <path d="M4 7h11M4 12h9M4 17h13" />
      <circle cx="18" cy="12" r="2" />
    </>
  ),
  gift: (
    <>
      <rect x="4" y="9" width="16" height="11" rx="1.5" />
      <path d="M3 9h18M12 9v11M12 9S9.5 4 7.5 5.5 9 9 12 9zM12 9s2.5-5 4.5-3.5S15 9 12 9z" />
    </>
  ),
  lock: (
    <>
      <rect x="5" y="10" width="14" height="10" rx="2" />
      <path d="M8 10V7a4 4 0 018 0v3" />
    </>
  ),
  filter: <path d="M4 6h16M7 12h10M10 18h4" />,
  sun: (
    <>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2.5v2M12 19.5v2M4.6 4.6L6 6M18 18l1.4 1.4M2.5 12h2M19.5 12h2M4.6 19.4L6 18M18 6l1.4-1.4" />
    </>
  ),
  moon: <path d="M20 14.5A8 8 0 019.5 4a8 8 0 1010.5 10.5z" />,
} as const;

export type IconName = keyof typeof paths;

export function isIconName(name: string | null | undefined): name is IconName {
  return !!name && name in paths;
}

export function Icon({ name, className }: { name: IconName; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {paths[name]}
    </svg>
  );
}
