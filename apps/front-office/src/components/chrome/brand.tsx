import Image from "next/image";
import Link from "next/link";

export function Brand({ small }: { small?: boolean }) {
  return (
    <Link href="/" aria-label="ZoeO Allure home" className="group inline-flex items-center">
      <Image
        src="/logo-wordmark.png"
        alt="ZoeO Allure"
        width={570}
        height={111}
        className={`w-auto transition-transform duration-[420ms] ease-[var(--ease)] group-hover:scale-[1.03] ${small ? "h-8" : "h-9"}`}
      />
    </Link>
  );
}
