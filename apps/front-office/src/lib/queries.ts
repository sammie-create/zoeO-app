import { createClient } from "@zoeallure/supabase/server";
import type { ProductCategory, Tables } from "@zoeallure/supabase";

export type Product = Tables<"products">;
export type Service = Tables<"services">;
export type Testimonial = Tables<"testimonials">;
export type Post = Tables<"journal_posts">;
export type Faq = Tables<"faqs">;
export type AboutStat = Tables<"about_stats">;
export type SiteSettings = Tables<"site_settings">;
export type Review = Tables<"reviews">;

export async function getProducts() {
  const supabase = await createClient();
  const { data } = await supabase.from("products").select("*").order("created_at", { ascending: false });
  return data ?? [];
}

export async function getCategoryAvailability(): Promise<Record<ProductCategory, boolean>> {
  const supabase = await createClient();
  const { data } = await supabase.from("products").select("category").eq("status", "available");
  const available = new Set((data ?? []).map((p) => p.category));
  return {
    hair: available.has("hair"),
    personal: available.has("personal"),
    nails: available.has("nails"),
    wigs: available.has("wigs"),
  };
}

export async function getComingSoonProducts(limit = 8) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("products")
    .select("*")
    .eq("status", "coming_soon")
    .order("created_at", { ascending: false })
    .limit(limit);
  return data ?? [];
}

export async function getProductBrands() {
  const supabase = await createClient();
  const { data } = await supabase.from("products").select("brand").not("brand", "is", null);
  const brands = Array.from(new Set((data ?? []).map((p) => p.brand).filter((b): b is string => !!b)));
  return brands.sort();
}

export async function getProduct(id: string) {
  const supabase = await createClient();
  const { data } = await supabase.from("products").select("*").eq("id", id).single();
  return data;
}

export async function getBestsellers(limit = 4) {
  const supabase = await createClient();
  const { data: flagged } = await supabase
    .from("products")
    .select("*")
    .eq("is_bestseller", true)
    .order("created_at", { ascending: false })
    .limit(limit);
  if (flagged && flagged.length >= limit) return flagged;

  const { data: recent } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);
  return recent ?? [];
}

export async function getServices() {
  const supabase = await createClient();
  const { data } = await supabase.from("services").select("*").order("created_at", { ascending: false });
  return data ?? [];
}

export async function getService(id: string) {
  const supabase = await createClient();
  const { data } = await supabase.from("services").select("*").eq("id", id).single();
  return data;
}

export async function getTestimonials(limit?: number) {
  const supabase = await createClient();
  let query = supabase.from("testimonials").select("*").order("created_at", { ascending: false });
  if (limit) query = query.limit(limit);
  const { data } = await query;
  return data ?? [];
}

export async function getPosts() {
  const supabase = await createClient();
  const { data } = await supabase.from("journal_posts").select("*").order("published_at", { ascending: false });
  return data ?? [];
}

export async function getPost(id: string) {
  const supabase = await createClient();
  const { data } = await supabase.from("journal_posts").select("*").eq("id", id).single();
  return data;
}

export async function getFaqs(page?: "services" | "contact") {
  const supabase = await createClient();
  let query = supabase.from("faqs").select("*").order("sort_order", { ascending: true });
  if (page) query = query.or(`page.eq.${page},page.is.null`);
  const { data } = await query;
  return data ?? [];
}

export async function getAboutStats() {
  const supabase = await createClient();
  const { data } = await supabase.from("about_stats").select("*").order("sort_order", { ascending: true });
  return data ?? [];
}

export async function getReviews() {
  const supabase = await createClient();
  const { data } = await supabase.from("reviews").select("*").order("created_at", { ascending: false });
  return data ?? [];
}

export async function getSiteSettings() {
  const supabase = await createClient();
  const { data } = await supabase.from("site_settings").select("*").single();
  return data;
}
