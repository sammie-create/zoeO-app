"use client";

import { createClient as createBrowserClient } from "@zoeallure/supabase/client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { Spinner } from "@/components/spinner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);

    const supabase = createBrowserClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      toast.error(signInError.message);
      setLoading(false);
      return;
    }

    router.push("/");
    router.refresh();
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

      <div>
        <Label
          htmlFor="password"
          className="mb-1.5 block text-[11px] font-bold tracking-[0.1em] text-noir-400 uppercase"
        >
          Password
        </Label>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          className="h-auto w-full rounded-control border-noir-200 bg-noir-50 px-[15px] py-[13px] text-base text-noir-800 focus-visible:border-violet-500 focus-visible:ring-violet-100"
        />
      </div>

      <div className="flex flex-wrap items-center justify-end gap-2.5">
        {/*<Label className="flex items-center gap-2 text-[12.5px] font-normal text-noir-500">*/}
        {/*  <input type="checkbox" defaultChecked className="accent-violet-500" />*/}
        {/*  Keep me signed in*/}
        {/*</Label>*/}
        <Link
          href="/forgot-password"
          className="text-[12.5px] font-bold text-violet-500 hover:text-violet-600"
        >
          Forgot password?
        </Link>
      </div>

      <Button
        type="submit"
        disabled={loading}
        className="mt-1.5 h-auto rounded-xl bg-violet-500 py-[15px] text-sm font-bold text-white hover:bg-violet-600 disabled:opacity-70"
      >
        {loading && <Spinner size={16} />}
        {loading ? "Signing in…" : "Sign in"}
      </Button>
    </form>
  );
}

