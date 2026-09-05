import Link from "next/link";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import AuthorityAlertManager from "@/components/AuthorityAlertManager";

export default async function AuthorityAlertsPage() {
  const supabase = await createClient();

  const { data: claimsData, error: claimsError } =
    await supabase.auth.getClaims();

  if (claimsError || !claimsData?.claims) {
    redirect("/login");
  }

  const userId = claimsData.claims.sub;

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", userId)
    .single();

  if (
    !profile ||
    profile.role !== "authority"
  ) {
    redirect("/dashboard");
  }

  const { data: alerts } = await supabase
    .from("safety_alerts")
    .select(`
      id,
      title,
      message,
      risk_level,
      safety_advice,
      starts_at,
      expires_at,
      active,
      created_at,
      risk_zone:risk_zones (
        id,
        name
      )
    `)
    .order("created_at", {
      ascending: false,
    });

  const { data: riskZones } = await supabase
    .from("risk_zones")
    .select("id, name")
    .eq("active", true)
    .order("name");

  return (
    <main className="min-h-screen bg-slate-100">

      <header className="border-b bg-slate-950 text-white">

        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-300">
              SAFETY COMMUNICATION
            </p>

            <h1 className="mt-1 text-xl font-bold">
              Safety Alert Management
            </h1>
          </div>

          <Link
            href="/authority"
            className="rounded-lg border border-white/20 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10"
          >
            Back to Authority Dashboard
          </Link>

        </div>

      </header>

      <section className="mx-auto max-w-7xl px-6 py-10">

        <div className="mb-8">

          <p className="font-semibold text-blue-600">
            SAFETY UPDATES
          </p>

          <h2 className="mt-2 text-3xl font-bold text-slate-900">
            Publish Safety Alerts
          </h2>

          <p className="mt-3 text-slate-600">
            Create safety notices and optionally
            associate them with a registered risk zone.
          </p>

        </div>

        <AuthorityAlertManager
          initialAlerts={(alerts ?? []) as any}
          riskZones={riskZones ?? []}
        />

      </section>

    </main>
  );
}