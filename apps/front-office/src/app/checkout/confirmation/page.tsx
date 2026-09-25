import Link from "next/link";
import { Icon } from "@/components/shared/icon";

export const metadata = { title: "Order Confirmed — ZoeO Allure" };

export default async function ConfirmationPage({
  searchParams,
}: {
  searchParams: Promise<{ ref?: string; pay?: string; total?: string; mode?: string; email?: string }>;
}) {
  const { ref, pay, total, mode, email } = await searchParams;

  if (!ref) {
    return (
      <main className="mx-auto max-w-[1280px] px-4 py-20 text-center sm:px-6 lg:px-8">
        <h1 className="font-display text-2xl">No order to show</h1>
        <Link href="/shop" className="mt-6 inline-block h-12 rounded-full bg-violet-500 px-6 text-sm font-bold text-white uppercase leading-[3rem]">
          Shop products
        </Link>
      </main>
    );
  }

  const totalLabel = total ? `₦${Number(total).toLocaleString("en-NG")}` : "";

  return (
    <main className="mx-auto max-w-[calc(1280px_+_clamp(16px,5vw,80px)*2)] px-[clamp(16px,5vw,80px)] py-20">
      <div className="confirm panel mx-auto max-w-[720px]">
        <span className="ic">
          <Icon name="check" className="size-7" />
        </span>
        <span className="text-[13px] font-semibold tracking-[.18em] text-violet-400 uppercase">Order confirmed</span>
        <h1 className="font-display mt-3.5 mb-3 text-3xl font-bold sm:text-4xl">
          Thank you — <span className="text-violet-300 italic">it&apos;s on its way.</span>
        </h1>
        <p className="mx-auto max-w-[520px] text-noir-300">
          A confirmation for <strong className="text-white">{totalLabel}</strong> via {pay} is headed to {email}.{" "}
          {mode === "pickup" ? "We'll message you when it's ready for pickup in Ikeja." : "Your order ships out tomorrow."}
        </p>
        <p className="mono my-7 text-violet-300">#{ref}</p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link href="/shop" className="h-12 rounded-full bg-violet-500 px-6 text-sm font-bold text-white uppercase leading-[3rem]">
            Continue shopping
          </Link>
          <Link href="/services#book" className="h-12 rounded-full border border-white/20 px-6 text-sm font-bold uppercase leading-[3rem]">
            Book a service
          </Link>
        </div>
      </div>
    </main>
  );
}
