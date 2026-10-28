import { Icon } from "@/components/shared/icon";

export function ReviewStars({ rating, size = "md" }: { rating: number; size?: "sm" | "md" | "lg" }) {
  const dims = size === "sm" ? "size-3.5" : size === "lg" ? "size-5" : "size-4";
  return (
    <span className="inline-flex gap-[3px]" role="img" aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((i) => {
        const fill = Math.max(0, Math.min(1, rating - (i - 1)));
        return (
          <span key={i} className={`relative ${dims}`}>
            <Icon name="star" className={`${dims} fill-current text-noir-600 light:text-noir-200`} />
            {fill > 0 && (
              <span className="absolute inset-0 overflow-hidden" style={{ width: `${fill * 100}%` }}>
                <Icon name="star" className={`${dims} fill-current text-champagne-500`} />
              </span>
            )}
          </span>
        );
      })}
    </span>
  );
}
