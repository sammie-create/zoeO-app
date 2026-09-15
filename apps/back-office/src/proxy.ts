import { updateSession } from "@zoeallure/supabase/middleware";
import { NextResponse, type NextRequest } from "next/server";

const PUBLIC_PATHS = ["/login", "/forgot-password", "/reset-password"];

// Refreshes the Supabase auth session on every request and redirects
// unauthenticated staff to /login.
export async function proxy(request: NextRequest) {
  const { supabaseResponse, user } = await updateSession(request);

  const isPublicPath = PUBLIC_PATHS.includes(request.nextUrl.pathname);
  if (!user && !isPublicPath) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|gif|svg|webp|ico)$).*)"],
};
