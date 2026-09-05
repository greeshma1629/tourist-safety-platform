import Link from "next/link";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import AuthorityRiskZoneManager from "@/components/AuthorityRiskZoneManager";

export default async function AuthorityRiskZonesPage() {
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

  const { data: riskZones, error } =
    await supabase
      .from("risk_zones")
      .select(`
        id,
        name,
        description,
        latitude,
        longitude,
        radius_meters,
        risk_level,
        safety_message,
        active,
        created_at
      `)
      .order("created_at", {
        ascending: false,
      });

  if (error) {
    console.error(
      "Unable to load risk zones:",
      error
    );
  }

  return (
    <main className="min-h-screen bg-slate-100">

      <header className="border-b bg-slate-950 text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-300">
              LOCATION MONITORING
            </p>

            <h1 className="mt-1 text-xl font-bold">
              Risk Zone Management
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
            SAFETY AREAS
          </p>

          <h2 className="mt-2 text-3xl font-bold text-slate-900">
            Manage Risk Zones
          </h2>

          <p className="mt-3 max-w-3xl text-slate-600">
            Create geographic safety zones that can
            trigger location-based warnings for tourists.
          </p>

        </div>

        <AuthorityRiskZoneManager
          initialZones={(riskZones ?? []) as any}
        />

      </section>

    </main>
  );
}