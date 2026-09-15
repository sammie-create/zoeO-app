import { ResetPasswordForm } from "./reset-password-form";

export default function ResetPasswordPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-white px-6 font-body text-noir-800">
      <div className="w-full max-w-[400px]">
        <div className="text-xs font-bold tracking-[0.16em] text-violet-500 uppercase">Password reset</div>
        <h2 className="mt-3 font-display text-[32px] font-normal text-noir-800">Set a new password</h2>
        <p className="mt-2 text-[13.5px] text-noir-400">
          Choose a password you haven&apos;t used before.
        </p>

        <ResetPasswordForm />
      </div>
    </div>
  );
}
