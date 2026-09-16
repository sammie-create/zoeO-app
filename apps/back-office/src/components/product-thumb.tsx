import { LINE_META } from "@/lib/catalog";
import type { ProductCategory } from "@zoeallure/supabase";

export function ProductThumb({
  imageUrl,
  category,
  name,
  className,
  initialsClassName,
}: {
  imageUrl: string | null;
  category: ProductCategory;
  name: string;
  className: string;
  initialsClassName: string;
}) {
  const meta = LINE_META[category];

  if (imageUrl) {
    // eslint-disable-next-line @next/next/no-img-element -- Supabase Storage public URL, no next/image loader configured for it
    return <img src={imageUrl} alt={name} className={`${className} object-cover`} />;
  }

  return (
    <span className={className} style={{ background: meta.swatch }}>
      <span className={initialsClassName}>{meta.initials}</span>
    </span>
  );
}
