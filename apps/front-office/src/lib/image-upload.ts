import type { createClient as createBrowserClient } from "@zoeallure/supabase/client";

type SupabaseClient = ReturnType<typeof createBrowserClient>;

export const MAX_UPLOAD_IMAGE_BYTES = 5 * 1024 * 1024;

export function validateUploadImage(file: File): string | null {
  if (!file.type.startsWith("image/")) return "Please choose an image file.";
  if (file.size > MAX_UPLOAD_IMAGE_BYTES) return "Image must be under 5MB.";
  return null;
}

/** Like validateUploadImage, but also allows a PDF — for proof-of-payment receipts. */
export function validateUploadProof(file: File): string | null {
  if (!file.type.startsWith("image/") && file.type !== "application/pdf") {
    return "Please choose an image or PDF file.";
  }
  if (file.size > MAX_UPLOAD_IMAGE_BYTES) return "File must be under 5MB.";
  return null;
}

export async function uploadImage(supabase: SupabaseClient, bucket: string, file: File): Promise<string> {
  const ext = file.name.split(".").pop() || "jpg";
  const path = `${crypto.randomUUID()}.${ext}`;

  const { error } = await supabase.storage.from(bucket).upload(path, file, { upsert: false });
  if (error) throw new Error(error.message);

  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}
