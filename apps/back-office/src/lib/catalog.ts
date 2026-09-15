import type { ProductCategory } from "@zoeallure/supabase";

export const LINE_META: Record<ProductCategory, { line: string; initials: string; swatch: string }> = {
  hair: { line: "HELicia · Hair care", initials: "HL", swatch: "#7F23E0" },
  personal: { line: "TenTen · Personal care", initials: "TT", swatch: "#B98A2E" },
  nails: { line: "FELenee · Nail care", initials: "FL", swatch: "#C2547A" },
  wigs: { line: "Zoe Onirun · Hair extensions", initials: "ZO", swatch: "#1A1720" },
};

// Fallback only — the real value lives in site_settings.low_stock_threshold (see lib/settings.ts).
export const LOW_STOCK_THRESHOLD = 10;

export const SLOT_TIMES = ["10 AM", "12 PM", "2 PM", "4 PM", "6 PM"] as const;

export type StockLevel = "in_stock" | "low_stock" | "out_of_stock";

export function stockLevel(units: number, threshold = LOW_STOCK_THRESHOLD): StockLevel {
  if (units <= 0) return "out_of_stock";
  if (units <= threshold) return "low_stock";
  return "in_stock";
}

export const STOCK_BADGE: Record<StockLevel, { label: string; bg: string; fg: string }> = {
  in_stock: { label: "In stock", bg: "#E7F5EC", fg: "#1F7A50" },
  low_stock: { label: "Low stock", bg: "#FBF4E6", fg: "#8A6A1E" },
  out_of_stock: { label: "Out of stock", bg: "#FDEEF0", fg: "#B23A50" },
};

export const STATUS_BADGE: Record<string, { label: string; bg: string; fg: string }> = {
  pending: { label: "Pending", bg: "#FBF4E6", fg: "#8A6A1E" },
  paid: { label: "Paid", bg: "#F4ECFE", fg: "#55129B" },
  cancelled: { label: "Cancelled", bg: "#FDEEF0", fg: "#B23A50" },
  requested: { label: "Requested", bg: "#FBF4E6", fg: "#8A6A1E" },
  accepted: { label: "Accepted", bg: "#F4ECFE", fg: "#55129B" },
  completed: { label: "Completed", bg: "#E7F5EC", fg: "#1F7A50" },
  declined: { label: "Declined", bg: "#FDEEF0", fg: "#B23A50" },
  reserved: { label: "Reserved", bg: "#F7F6F9", fg: "#5B5568" },
  new: { label: "New", bg: "#F7F6F9", fg: "#5B5568" },
  contacted: { label: "Contacted", bg: "#FBF4E6", fg: "#8A6A1E" },
  confirmed: { label: "Confirmed", bg: "#E7F5EC", fg: "#1F7A50" },
  published: { label: "Published", bg: "#E7F5EC", fg: "#1F7A50" },
  draft: { label: "Draft", bg: "#F7F6F9", fg: "#5B5568" },
  processing: { label: "Processing", bg: "#FBF4E6", fg: "#8A6A1E" },
  packed: { label: "Packed", bg: "#FBF4E6", fg: "#8A6A1E" },
  out_for_delivery: { label: "Out for delivery", bg: "#F4ECFE", fg: "#55129B" },
  delivered: { label: "Delivered", bg: "#E7F5EC", fg: "#1F7A50" },
  ready_for_pickup: { label: "Ready for pickup", bg: "#FBF4E6", fg: "#8A6A1E" },
  picked_up: { label: "Picked up", bg: "#E7F5EC", fg: "#1F7A50" },
};

export const TICKET_TIER: Record<string, { label: string; bg: string; fg: string; price: number }> = {
  ga: { label: "General", bg: "#F7F6F9", fg: "#5B5568", price: 1000 },
  vip: { label: "VIP", bg: "#F4ECFE", fg: "#55129B", price: 20000 },
};

// Rotating pastel palette for content cards that don't store their own color (testimonials, journal, team).
export const CARD_PALETTE = [
  { bg: "#F4ECFE", avatarBg: "#7F23E0", avatarFg: "#FFFFFF" },
  { bg: "#FDF0F4", avatarBg: "#F2C3D2", avatarFg: "#7A3049" },
  { bg: "#FBF4E6", avatarBg: "#E8CE95", avatarFg: "#3B2C0E" },
];

export const JOURNAL_CATEGORY_SWATCH: Record<string, string> = {
  "Hair care": "#7F23E0",
  Bridal: "#C2547A",
  "Nail care": "#B98A2E",
  "Personal care": "#1A7A6B",
};
