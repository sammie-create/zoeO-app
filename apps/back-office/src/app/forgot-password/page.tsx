import { createClient as createServerClient } from "@zoeallure/supabase/server";
import { redirect } from "next/navigation";
import { ForgotPasswordForm } from "./forgot-password-form";

export default async function ForgotPasswordPage() {
  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-white px-6 font-body text-noir-800">
      <div className="w-full max-w-[400px]">
        <div className="text-xs font-bold tracking-[0.16em] text-violet-500 uppercase">Password reset</div>
        <h2 className="mt-3 font-display text-[32px] font-normal text-noir-800">Forgot password?</h2>
        <p className="mt-2 text-[13.5px] text-noir-400">
          Enter the email your admin set up for you and we&apos;ll send a reset link.
        </p>

        <ForgotPasswordForm />
      </div>
    </div>
  );
}
