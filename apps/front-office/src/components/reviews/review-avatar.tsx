import { Icon } from "@/components/shared/icon";
import { reviewAvatarTone, reviewInitials, type ReviewAvatarTone } from "@/lib/review-utils";

const SIZE = {
  sm: "size-[34px] text-[12px]",
  md: "size-11 text-[15px]",
  lg: "size-16 text-xl",
  xl: "size-[76px] text-2xl",
} as const;

const TONE: Record<ReviewAvatarTone, string> = {
  a: "bg-gradient-to-br from-violet-400 to-violet-700 text-white",
  b: "bg-champagne-100 text-[#3a2a0c]",
  c: "bg-gradient-to-br from-violet-700 to-violet-900 text-violet-100",
};

export function ReviewAvatar({
  name,
  photoUrl,
  size = "md",
  className = "",
}: {
  name: string;
  photoUrl?: string | null;
  size?: keyof typeof SIZE;
  className?: string;
}) {
  if (photoUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element -- Supabase Storage URL, no next/image loader configured
      <img
        src={photoUrl}
        alt=""
        loading="lazy"
        className={`${SIZE[size]} shrink-0 rounded-full object-cover ${className}`}
      />
    );
  }

  const initials = reviewInitials(name);
  if (!initials) {
    return (
      <span
        className={`grid shrink-0 place-items-center rounded-full bg-gradient-to-br from-violet-700 to-violet-900 text-violet-100 ${SIZE[size]} ${className}`}
        aria-hidden
      >
        <Icon name="user" className="size-1/2" />
      </span>
    );
  }

  return (
    <span
      className={`grid shrink-0 place-items-center rounded-full font-bold tracking-[.02em] ${TONE[reviewAvatarTone(name)]} ${SIZE[size]} ${className}`}
      aria-hidden
    >
      {initials}
    </span>
  );
}
