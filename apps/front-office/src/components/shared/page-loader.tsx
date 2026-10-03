export function PageLoader() {
  return (
    <div className="relative flex min-h-[60vh] w-full items-center justify-center">
      {/* Both gifs render; visibility is driven purely by the `light:` CSS
         variant (same approach as ThemeToggle's sun/moon icons) so the
         correct one shows instantly, with no dependency on a client-side
         hook settling after hydration. */}
      {/* eslint-disable-next-line @next/next/no-img-element -- animated gif, next/image would strip the animation */}
      <img src="/loading/zoeo-loader-dark.gif" alt="Loading" width={96} height={96} className="size-24 light:hidden" />
      {/* eslint-disable-next-line @next/next/no-img-element -- animated gif, next/image would strip the animation */}
      <img
        src="/loading/zoeo-loader-light.gif"
        alt="Loading"
        width={96}
        height={96}
        className="absolute hidden size-24 light:block"
      />
    </div>
  );
}
