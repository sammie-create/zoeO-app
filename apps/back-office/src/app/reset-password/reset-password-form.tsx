"use client";

import { createClient as createBrowserClient } from "@zoeallure/supabase/client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import { toast } from "sonner";
import { Spinner } from "@/components/spinner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Status = "checking" | "ready" | "invalid";

export function ResetPasswordForm() {
  const router = useRouter();
  const [supabase] = useState(() => createBrowserClient());
  const [status, setStatus] = useState<Status>("checking");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // The recovery/invite link lands here as a PKCE `code` query param —
    // the @supabase/ssr browser client is PKCE-configured, so it's
    // exchanged for a session manually before the form can be used.
    async function establishSession() {
      const code = new URLSearchParams(window.location.search).get("code");

      if (code) {
        const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
        window.history.replaceState(null, "", window.location.pathname);
        setStatus(exchangeError ? "invalid" : "ready");
        return;
      }

      const { data } = await supabase.auth.getSession();
      setStatus(data.session ? "ready" : "invalid");
    }

    establishSession();
  }, [supabase]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords don't match.");
      return;
    }

    setLoading(true);
    const { error: updateError } = await supabase.auth.updateUser({ password });
    setLoading(false);

    if (updateError) {
      toast.error(updateError.message);
      return;
    }

    toast.success("Password updated. You're signed in.");
    router.push("/");
    router.refresh();
  }

  if (status === "checking") {
    return (
      <div className="mt-7 flex items-center gap-2.5 text-[13.5px] text-noir-500">
        <Spinner size={16} />
        Verifying your link…
      </div>
    );
  }

  if (status === "invalid") {
    return (
      <div className="mt-7">
        <p className="text-[13.5px] leading-relaxed text-noir-600">
          This link is invalid or has expired. Request a new one to continue.
        </p>
        <Link
          href="/forgot-password"
          className="mt-5 inline-block text-[12.5px] font-bold text-violet-500 hover:text-violet-600"
        >
          Request a new link
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-7 grid gap-3.5">
      <div>
        <Label
          htmlFor="password"
          className="mb-1.5 block text-[11px] font-bold tracking-[0.1em] text-noir-400 uppercase"
        >
          New password
        </Label>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          className="h-auto w-full rounded-control border-noir-200 bg-noir-50 px-[15px] py-[13px] text-base text-noir-800 focus-visible:border-violet-500 focus-visible:ring-violet-100"
        />
      </div>

      <div>
        <Label
          htmlFor="confirm"
          className="mb-1.5 block text-[11px] font-bold tracking-[0.1em] text-noir-400 uppercase"
        >
          Confirm password
        </Label>
        <Input
          id="confirm"
          name="confirm"
          type="password"
          autoComplete="new-password"
          required
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          placeholder="••••••••"
          className="h-auto w-full rounded-control border-noir-200 bg-noir-50 px-[15px] py-[13px] text-base text-noir-800 focus-visible:border-violet-500 focus-visible:ring-violet-100"
        />
      </div>

      {error && <p className="text-[12.5px] font-medium text-status-cancelled">{error}</p>}

      <Button
        type="submit"
        disabled={loading}
        className="mt-1.5 h-auto rounded-xl bg-violet-500 py-[15px] text-sm font-bold text-white hover:bg-violet-600 disabled:opacity-70"
      >
        {loading && <Spinner size={16} />}
        {loading ? "Saving…" : "Set password"}
      </Button>
    </form>
  );
}
