"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_BOTTOM, NAV_GROUPS, type NavItem } from "./nav-config";

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

function NavLink({
  item,
  active,
  badgeCount,
  onNavigate,
}: {
  item: NavItem;
  active: boolean;
  badgeCount?: number;
  onNavigate: () => void;
}) {
  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      className={`flex items-center gap-3 rounded-[10px] px-3 py-2.5 text-[13.5px] font-bold transition-colors ${
        active ? "bg-violet-500/22 text-white" : "text-[#ADA7BB] hover:bg-white/[0.06]"
      }`}
    >
      <span className={active ? "text-[#C9A6F5]" : "text-[#6B647E]"}>{item.icon}</span>
      <span>{item.label}</span>
      {badgeCount ? (
        <span className="ml-auto flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-violet-500/28 px-1.5 text-[10.5px] font-extrabold text-violet-100">
          {badgeCount}
        </span>
      ) : null}
    </Link>
  );
}

export function Sidebar({
  pendingOrders,
  pendingBookings,
  open,
  onClose,
}: {
  pendingOrders: number;
  pendingBookings: number;
  open: boolean;
  onClose: () => void;
}) {
  const pathname = usePathname();
  const badgeFor = (item: NavItem) =>
    item.badgeKey === "pendingOrders"
      ? pendingOrders
      : item.badgeKey === "pendingBookings"
        ? pendingBookings
        : undefined;

  return (
    <div
      className={`fixed inset-y-0 left-0 z-40 flex h-screen w-[264px] flex-none transform flex-col overflow-y-auto border-r border-white/[0.06] bg-noir-900 text-noir-300 transition-transform duration-200 ease-out lg:sticky lg:top-0 lg:translate-x-0 ${
        open ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div className="flex items-center gap-[11px] px-6 pt-[26px] pb-5">
        <div className="min-w-0 flex-1">
          {/* eslint-disable-next-line @next/next/no-img-element -- static brand asset, no next/image optimization needed */}
          <img src="/logo-wordmark.png" alt="ZoeO Allure" className="h-7 w-auto" />
          <div className="mt-[5px] font-mono text-[10.5px] tracking-[0.1em] text-noir-500 uppercase">
            Back office
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close menu"
          className="flex h-8 w-8 flex-none items-center justify-center rounded-full text-noir-400 hover:bg-white/[0.06] lg:hidden"
        >
          ×
        </button>
      </div>

      <div className="flex flex-1 flex-col gap-[22px] px-3.5 pt-2 pb-5">
        {NAV_GROUPS.map((group, i) => (
          <div key={i} className="flex flex-col gap-0.5">
            {group.title && (
              <div className="mb-1.5 px-3 text-[10.5px] font-bold tracking-[0.16em] text-[#4B4558] uppercase">
                {group.title}
              </div>
            )}
            {group.items.map((item) => (
              <NavLink
                key={item.key}
                item={item}
                active={isActive(pathname, item.href)}
                badgeCount={badgeFor(item)}
                onNavigate={onClose}
              />
            ))}
          </div>
        ))}

        <div className="mt-auto flex flex-col gap-0.5 border-t border-white/[0.07] pt-2.5">
          {NAV_BOTTOM.map((item) => (
            <NavLink
              key={item.key}
              item={item}
              active={isActive(pathname, item.href)}
              onNavigate={onClose}
            />
          ))}
        </div>
      </div>

      <div className="border-t border-white/[0.07] px-5 pt-4 pb-[22px]">
        <a href="#" className="flex items-center gap-2 text-xs font-semibold text-[#8880A0] hover:text-white">
          View storefront <span className="text-[13px]">↗</span>
        </a>
      </div>
    </div>
  );
}
