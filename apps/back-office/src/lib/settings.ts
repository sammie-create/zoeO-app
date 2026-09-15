import type { createClient as createServerClient } from "@zoeallure/supabase/server";
import { LOW_STOCK_THRESHOLD } from "./catalog";

type Supabase = Awaited<ReturnType<typeof createServerClient>>;

export async function getLowStockThreshold(supabase: Supabase): Promise<number> {
  const { data } = await supabase.from("site_settings").select("low_stock_threshold").eq("id", true).single();
  return data?.low_stock_threshold ?? LOW_STOCK_THRESHOLD;
}
