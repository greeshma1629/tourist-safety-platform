import Link from "next/link";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import AuthoritySOSManager from "@/components/AuthoritySOSManager";

export default async function AuthoritySOSPage() {
  const supabase = await createClient();

  const { data: claimsData, error: claimsError } =
    await supabase.auth.getClaims();

  if (claimsError || !claimsData?.claims) {
    redirect("/login");
  }

  const userId = claimsData.claims.sub;

  const { data: profile, error: profileError } =
    await supabase
      .from("profiles")
      .select("role")
      .eq("id", userId)
      .single();

  if (
    profileError ||
    !profile ||
    profile.role !== "authority"
  ) {
    redirect("/dashboard");
  }

  const { data: sosRequests, error } =
    await supabase
      .from("sos_requests")
      .select(`
        id,
        latitude,
        longitude,
        accuracy_meters,
        message,
        status,
        created_at,
        acknowledged_at,
        resolved_at,
        profile:profiles (
          full_name,
          phone,
          nationality
        )
      `)
      .order("created_at", {
        ascending: false,
      });

  if (error) {
    console.error(
      "Unable to load SOS requests:",
      error
    );
  }

  return (
    <main className="min-h-screen bg-slate-100">

      <header className="border-b bg-slate-950 text-white">

        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-red-300">
              EMERGENCY MONITORING
            </p>

            <h1 className="mt-1 text-xl font-bold">
              SOS Management
            </h1>
          </div>

          <Link
            href="/authority"
            className="rounded-lg border border-white/20 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
          >
            Back to Authority Dashboard
          </Link>

        </div>

      </header>

      <section className="mx-auto max-w-7xl px-6 py-10">

        <div className="mb-8">

          <p className="font-semibold text-red-600">
            ACTIVE RESPONSE
          </p>

          <h2 className="mt-2 text-3xl font-bold text-slate-900">
            Emergency SOS Requests
          </h2>

          <p className="mt-3 max-w-3xl text-slate-600">
            Review emergency requests submitted
            by tourists and update their response
            status.
          </p>

        </div>

        <AuthoritySOSManager
          initialRequests={(sosRequests ?? []) as any}
        />

      </section>

    </main>
  );
}