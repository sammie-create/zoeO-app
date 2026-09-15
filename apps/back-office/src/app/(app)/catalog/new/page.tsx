import Link from "next/link";
import { ServiceForm } from "../service-form";

export default function NewServicePage() {
  return (
    <div>
      <Link href="/catalog" className="text-[13px] font-semibold text-noir-400 hover:text-noir-600">
        ← Back to catalog
      </Link>
      <h1 className="mt-4 font-display text-[30px] font-normal tracking-[-0.01em] sm:text-[36px]">
        Add a service
      </h1>
      <ServiceForm />
    </div>
  );
}
