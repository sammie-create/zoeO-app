import { createClient as createServerClient } from "@zoeallure/supabase/server";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ServiceForm } from "../../service-form";

export default async function EditServicePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createServerClient();
  const { data: service } = await supabase.from("services").select("*").eq("id", id).single();
  if (!service) notFound();

  return (
    <div>
      <Link href="/catalog" className="text-[13px] font-semibold text-noir-400 hover:text-noir-600">
        ← Back to catalog
      </Link>
      <h1 className="mt-4 font-display text-[30px] font-normal tracking-[-0.01em] sm:text-[36px]">
        Edit {service.name}
      </h1>
      <ServiceForm service={service} />
    </div>
  );
}
