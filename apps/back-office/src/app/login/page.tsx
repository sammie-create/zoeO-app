import { createClient as createServerClient } from "@zoeallure/supabase/server";
import { redirect } from "next/navigation";
import { LoginForm } from "./login-form";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/");
  }

  const { error } = await searchParams;

  return (
    <div className="flex min-h-screen flex-wrap font-body text-noir-800">
      <div className="relative flex min-h-[520px] flex-1 basis-[460px] flex-col justify-between overflow-hidden bg-[#190630] p-14 px-12">
        {/* eslint-disable-next-line @next/next/no-img-element -- art-directed crop/zoom needs exact transform values */}
        <img
          src="/bride.png"
          alt=""
          className="absolute top-1/2 left-1/2 z-0 h-[128%] w-auto max-w-none  object-cover"
          style={{ transform: "translate(-50%,-46%)", filter: "saturate(.9)" }}
        />
        <div
          className="absolute inset-0 z-[1]"
          style={{
            background:
              "linear-gradient(165deg,rgba(63,14,116,.5),rgba(85,18,155,.3) 45%,rgba(25,6,48,.55))",
            mixBlendMode: "multiply",
          }}
        />
        <div
          className="absolute inset-0 z-[2]"
          style={{
            background:
              "linear-gradient(180deg,rgba(25,6,48,.6) 0%,rgba(25,6,48,.1) 26%,rgba(25,6,48,.2) 55%,rgba(25,6,48,.88) 100%)",
          }}
        />
        <div
          className="absolute inset-0 z-[2]"
          style={{
            background:
              "linear-gradient(90deg,#190630 0%,rgba(25,6,48,.25) 22%,rgba(25,6,48,.25) 78%,#190630 100%)",
          }}
        />

        <div className="relative z-[3] flex items-center justify-center">
          {/* eslint-disable-next-line @next/next/no-img-element -- static brand asset, no next/image optimization needed */}
          <img src="/logo-wordmark.png" alt="ZoeO Allure" className="h-10 w-auto" />
        </div>

        <div className="relative z-[3] px-6 text-center">
          <h1 className="mx-auto max-w-[22ch] font-display text-[clamp(36px,4.2vw,50px)] leading-[1.12] font-bold text-white">
            Run the studio, the shelf and the exhibition
            <br />— all from one place.
          </h1>
          <p className="mx-auto mt-5 max-w-[40ch] text-[14.5px] leading-[1.7] text-violet-100">
            Orders, bookings, products and exhibitions management — sign in to pick
            up where you left off.
          </p>
        </div>

        <div className="relative z-[3] text-center font-mono text-[11px] text-violet-200">
          © 2026 ZoeO Allure · Ikeja, Lagos
        </div>
      </div>

      <div className="flex flex-1 basis-[420px] items-center justify-center p-14 px-8">
        <div className="w-full max-w-[400px]">
          <div className="text-xs font-bold tracking-[0.16em] text-violet-500 uppercase">
            Welcome back
          </div>
          <h2 className="mt-3 font-display text-[32px] font-normal text-noir-800">
            Sign in
          </h2>
          <p className="mt-2 text-[13.5px] text-noir-400">
            Use the email and password your admin set up for you.
          </p>

          {error === "link-expired" && (
            <div className="mt-4 rounded-xl border border-[#F2C3D2] bg-[#FDEEF0] px-4 py-3 text-[12.5px] font-medium text-status-cancelled">
              That link has expired or was already used. Request a new one below.
            </div>
          )}

          <LoginForm />

          <div className="mt-7 border-t border-noir-100 pt-[22px] text-center text-[12.5px] text-noir-400">
            Invited as staff? Use the link in your email to set a password first.
          </div>
        </div>
      </div>
    </div>
  );
}
