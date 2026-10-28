import type { Product, Review, Service } from "@/lib/queries";

/**
 * A review-shaped card for the /reviews grid. Customer-submitted reviews map
 * straight to `Review`; staff-written testimonials are adapted into this
 * shape too (see testimonialToDisplayReview) so both render identically —
 * `subject_label` carries the testimonial's free-text service_label since
 * those aren't tied to a real service_id/product_id row.
 */
export type DisplayReview = Review & { subject_label?: string | null };

export function reviewInitials(name: string) {
  const parts = name
    .trim()
    .split(/\s+/)
    .map((p) => p.replace(/[^\p{L}\p{N}]/gu, ""))
    .filter(Boolean);
  if (!parts.length) return "";
  return (parts.length > 1 ? parts[0][0] + parts[1][0] : parts[0].slice(0, 2)).toUpperCase();
}

const TONES = ["a", "b", "c"] as const;
export type ReviewAvatarTone = (typeof TONES)[number];

export function reviewAvatarTone(name: string): ReviewAvatarTone {
  const hash = [...name].reduce((sum, c) => sum + c.charCodeAt(0), 0);
  return TONES[hash % TONES.length];
}

export function reviewSubjectLabel(
  review: { service_id: string | null; product_id: string | null; subject_label?: string | null },
  services: Service[],
  products: Product[],
) {
  if (review.subject_label) return review.subject_label;
  if (review.service_id) return services.find((s) => s.id === review.service_id)?.name ?? "ZoeO Allure client";
  if (review.product_id) return products.find((p) => p.id === review.product_id)?.name ?? "ZoeO Allure client";
  return "ZoeO Allure client";
}

export function reviewAverage(reviews: DisplayReview[]) {
  if (reviews.length === 0) return 0;
  return reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
}

export function testimonialToDisplayReview(t: {
  id: string;
  customer_name: string;
  quote: string;
  service_label: string | null;
  photo_url: string | null;
  created_at: string;
}): DisplayReview {
  return {
    id: `testimonial-${t.id}`,
    customer_name: t.customer_name,
    rating: 4.5,
    body: t.quote,
    photo_url: t.photo_url,
    service_id: null,
    product_id: null,
    created_at: t.created_at,
    subject_label: t.service_label,
  };
}
