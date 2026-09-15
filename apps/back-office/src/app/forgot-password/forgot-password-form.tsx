"use client";

import { createClient as createBrowserClient } from "@zoeallure/supabase/client";
import Link from "next/link";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { Spinner } from "@/components/spinner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);

    const supabase = createBrowserClient();
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    setLoading(false);
    if (resetError) {
      toast.error(resetError.message);
      return;
    }
    setSent(true);
  }

  if (sent) {
    return (
      <div className="mt-7">
        <p className="text-[13.5px] leading-relaxed text-noir-600">
          If an account exists for <strong>{email}</strong>, we&apos;ve sent a link to reset the password. Check
          your inbox (and spam folder).
        </p>
        <Link href="/login" className="mt-5 inline-block text-[12.5px] font-bold text-violet-500 hover:text-violet-600">
          ← Back to sign in
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-7 grid gap-3.5">
      <div>
        <Label
          htmlFor="email"
          className="mb-1.5 block text-[11px] font-bold tracking-[0.1em] text-noir-400 uppercase"
        >
          Email address
        </Label>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="amara@zoeoallure.com"
          className="h-auto w-full rounded-control border-noir-200 bg-noir-50 px-[15px] py-[13px] text-sm text-noir-800 placeholder:text-noir-300 focus-visible:border-violet-500 focus-visible:ring-violet-100"
        />
      </div>

      <Button
        type="submit"
        disabled={loading}
        className="mt-1.5 h-auto rounded-xl bg-violet-500 py-[15px] text-sm font-bold text-white hover:bg-violet-600 disabled:opacity-70"
      >
        {loading && <Spinner size={16} />}
        {loading ? "Sending…" : "Send reset link"}
      </Button>

      <Link href="/login" className="mt-1 text-center text-[12.5px] font-bold text-noir-400 hover:text-noir-600">
        ← Back to sign in
      </Link>
    </form>
  );
}
