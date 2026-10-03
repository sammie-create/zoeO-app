import Image from "next/image";
import Link from "next/link";

export function Brand({ small, dimmed = false, forceDark = false }: { small?: boolean; dimmed?: boolean; forceDark?: boolean }) {
  const locked = dimmed || forceDark;

  return (
    <Link href="/" aria-label="ZoeO Allure home" className="group inline-flex items-center gap-3">
      <Image
        src="/img/logo-mark.png"
        alt=""
        width={46}
        height={46}
        className={`rounded-full transition-transform duration-[420ms] ease-[var(--ease)] group-hover:-rotate-12 ${small ? "size-[38px]" : "size-[46px]"}`}
      />
      <span
        className={`font-display leading-none tracking-[-0.01em] whitespace-nowrap text-white ${locked ? "" : "light:text-noir-900"} ${small ? "text-2xl" : "text-[30px]"}`}
      >
        ZoeO{" "}
        <em className={`font-normal italic ${dimmed ? "text-violet-300" : `text-violet-400 ${locked ? "" : "light:text-violet-600"}`}`}>
          Allure
        </em>
      </span>
    </Link>
  );
}
