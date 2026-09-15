import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./types";

/**
 * Service-role client — bypasses RLS entirely. Server-only: import this
 * module only from Route Handlers, Server Actions, or other server code
 * that never ships to the browser (e.g. inviting staff via
 * `admin.inviteUserByEmail`, since staff sign-up isn't self-serve).
 *
 * Never import from a Client Component and never expose
 * SUPABASE_SERVICE_ROLE_KEY with a NEXT_PUBLIC_ prefix.
 */
export function createAdminClient() {
  return createSupabaseClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    },
  );
}
