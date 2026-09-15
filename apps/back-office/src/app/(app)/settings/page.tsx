import { createClient as createServerClient } from "@zoeallure/supabase/server";
import { SectionEyebrow } from "../badge";
import { SettingsForm } from "./settings-form";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const supabase = await createServerClient();
  const { data: settings } = await supabase.from("site_settings").select("*").eq("id", true).single();

  return (
    <div>
      <SectionEyebrow>Settings</SectionEyebrow>
      <h1 className="mt-3.5 font-display text-[28px] font-normal tracking-[-0.01em] sm:text-[34px] lg:text-[38px]">
        Site settings
      </h1>
      <p className="mt-2 text-[13.5px] text-noir-500 sm:text-[14.5px]">Controls that feed straight into the storefront.</p>

      {settings && <SettingsForm settings={settings} />}
    </div>
  );
}
