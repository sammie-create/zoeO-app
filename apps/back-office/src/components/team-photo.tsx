export function TeamPhoto({
  photoUrl,
  accentColor,
  initials,
  name,
  className,
  initialsClassName,
}: {
  photoUrl: string | null;
  accentColor: string;
  initials: string;
  name: string;
  className: string;
  initialsClassName: string;
}) {
  if (photoUrl) {
    // eslint-disable-next-line @next/next/no-img-element -- Supabase Storage public URL, no next/image loader configured for it
    return <img src={photoUrl} alt={name} className={`${className} object-cover`} />;
  }

  return (
    <span className={className} style={{ background: accentColor }}>
      <span className={initialsClassName}>{initials}</span>
    </span>
  );
}
