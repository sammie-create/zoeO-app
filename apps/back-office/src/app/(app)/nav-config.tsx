import type { ReactNode } from "react";

export type NavItem = {
  key: string;
  label: string;
  href: string;
  icon: ReactNode;
  badgeKey?: "pendingOrders" | "pendingBookings";
};

export type NavGroup = {
  title?: string;
  items: NavItem[];
};

function StrokeIcon({ d }: { d: string }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d={d} />
    </svg>
  );
}

export const NAV_GROUPS: NavGroup[] = [
  {
    items: [
      {
        key: "overview",
        label: "Overview",
        href: "/",
        icon: (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3.5" y="3.5" width="7.5" height="7.5" rx="1.5" />
            <rect x="13" y="3.5" width="7.5" height="7.5" rx="1.5" />
            <rect x="3.5" y="13" width="7.5" height="7.5" rx="1.5" />
            <rect x="13" y="13" width="7.5" height="7.5" rx="1.5" />
          </svg>
        ),
      },
    ],
  },
  {
    items: [
      {
        key: "analytics",
        label: "Analytics",
        href: "/analytics",
        icon: (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 20V11" /><path d="M12 20V4" /><path d="M19 20v-8" />
          </svg>
        ),
      },
      {
        key: "customers",
        label: "Customers",
        href: "/customers",
        icon: (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="8.2" r="4" /><path d="M4.2 20c0-4.4 3.5-7 7.8-7s7.8 2.6 7.8 7" />
          </svg>
        ),
      },
    ],
  },
  {
    title: "Commerce",
    items: [
      {
        key: "products",
        label: "Products",
        href: "/products",
        icon: <StrokeIcon d="M3.5 8l8.5-4.5L20.5 8v8L12 20.5 3.5 16z M3.5 8L12 12.5l8.5-4.5 M12 12.5V20.5" />,
      },
      {
        key: "orders",
        label: "Orders",
        href: "/orders",
        badgeKey: "pendingOrders",
        icon: <StrokeIcon d="M6 8h12l-1 12.5H7z M9 8V6a3 3 0 0 1 6 0v2" />,
      },
    ],
  },
  {
    title: "Services",
    items: [
      {
        key: "catalog",
        label: "Catalog",
        href: "/catalog",
        icon: <StrokeIcon d="M4 6h16M4 12h16M4 18h10" />,
      },
      {
        key: "bookings",
        label: "Bookings",
        href: "/bookings",
        badgeKey: "pendingBookings",
        icon: (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3.5" y="5" width="17" height="15.5" rx="2" /><path d="M8 3v4M16 3v4M3.5 10h17" />
          </svg>
        ),
      },
    ],
  },
  {
    title: "Exhibition",
    items: [
      {
        key: "programme",
        label: "Programme",
        href: "/programme",
        icon: <StrokeIcon d="M3.5 9a2 2 0 0 1 2-2h13a2 2 0 0 1 2 2v1.2a1.8 1.8 0 0 0 0 3.6V15a2 2 0 0 1-2 2h-13a2 2 0 0 1-2-2v-1.2a1.8 1.8 0 0 0 0-3.6z" />,
      },
      {
        key: "tickets",
        label: "Tickets",
        href: "/tickets",
        icon: (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="8.5" /><path d="M12 7v1.6M12 15.4V17M12 11v2" />
          </svg>
        ),
      },
      {
        key: "sponsorships",
        label: "Sponsorships",
        href: "/sponsorships",
        icon: (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3.5" y="7.5" width="17" height="11.5" rx="2" /><path d="M8.5 7.5V6a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v1.5" />
          </svg>
        ),
      },
    ],
  },
  {
    title: "Content",
    items: [
      {
        key: "testimonials",
        label: "Testimonials",
        href: "/testimonials",
        icon: (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" stroke="none">
            <path d="M9 7H5.5A2.5 2.5 0 0 0 3 9.5V13h4.5V17H3v.5A2.5 2.5 0 0 0 5.5 20H9a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2zm10 0h-3.5A2.5 2.5 0 0 0 13 9.5V13h4.5V17H13v.5A2.5 2.5 0 0 0 15.5 20H19a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z" />
          </svg>
        ),
      },
      {
        key: "faq",
        label: "FAQ",
        href: "/faq",
        icon: (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="8.5" /><path d="M9.6 9.4a2.4 2.4 0 0 1 4.6 1c0 1.7-2.2 1.7-2.2 3.4" /><path d="M12 16.6h.01" />
          </svg>
        ),
      },
      {
        key: "journal",
        label: "Journal",
        href: "/journal",
        icon: <StrokeIcon d="M7 3.5h6.5L19 9v11a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4.5a1 1 0 0 1 1-1z M13.5 3.5V9H19" />,
      },
      {
        key: "team",
        label: "Team",
        href: "/team",
        icon: (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="9" cy="8" r="3" /><path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6" />
            <circle cx="17" cy="8.3" r="2.6" /><path d="M15.3 14.3c2.6.4 4.7 2.7 4.7 5.7" />
          </svg>
        ),
      },
      {
        key: "about",
        label: "About stats",
        href: "/about",
        icon: (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="8.5" /><path d="M12 8h.01M11.2 11.5h1v5.3h1" />
          </svg>
        ),
      },
    ],
  },
];

export const NAV_BOTTOM: NavItem[] = [
  {
    key: "staff",
    label: "Staff management",
    href: "/staff",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <rect x="4" y="4" width="16" height="16" rx="4" /><circle cx="9.5" cy="10" r="2" />
        <path d="M6.5 16c0-1.9 1.3-3 3-3s3 1.1 3 3" /><path d="M14.5 8.5h3M14.5 11.5h3M14.5 14.5h2" />
      </svg>
    ),
  },
  {
    key: "settings",
    label: "Settings",
    href: "/settings",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3" />
        <path d="M19 12a7 7 0 0 0-.1-1.1l1.9-1.5-1.9-3.3-2.3.9a7 7 0 0 0-1.9-1.1L14.3 3H9.7l-.4 2.9a7 7 0 0 0-1.9 1.1l-2.3-.9-1.9 3.3L5.1 11a7 7 0 0 0 0 2.2l-1.9 1.5 1.9 3.3 2.3-.9a7 7 0 0 0 1.9 1.1l.4 2.8h4.6l.4-2.8a7 7 0 0 0 1.9-1.1l2.3.9 1.9-3.3-1.9-1.5c.1-.4.1-.7.1-1.2z" />
      </svg>
    ),
  },
];
