import Link from "next/link";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import LogoutButton from "@/components/LogoutButton";

export default async function AuthorityPage() {
  const supabase = await createClient();

  const { data: claimsData, error: claimsError } =
    await supabase.auth.getClaims();

  if (claimsError || !claimsData?.claims) {
    redirect("/login");
  }

  const userId = claimsData.claims.sub;

  const { data: authorityProfile, error: profileError } =
    await supabase
      .from("profiles")
      .select("full_name, role")
      .eq("id", userId)
      .single();

  if (
    profileError ||
    !authorityProfile ||
    authorityProfile.role !== "authority"
  ) {
    redirect("/dashboard");
  }

  const [
    activeSOSResult,
    incidentResult,
    alertResult,
    touristResult,
    recentSOSResult,
    recentIncidentResult,
  ] = await Promise.all([
    supabase
      .from("sos_requests")
      .select("id", {
        count: "exact",
        head: true,
      })
      .in("status", [
        "pending",
        "acknowledged",
      ]),

    supabase
      .from("incidents")
      .select("id", {
        count: "exact",
        head: true,
      })
      .in("status", [
        "submitted",
        "reviewing",
      ]),

    supabase
      .from("safety_alerts")
      .select("id", {
        count: "exact",
        head: true,
      })
      .eq("active", true),

    supabase
      .from("profiles")
      .select("id", {
        count: "exact",
        head: true,
      })
      .eq("role", "tourist"),

    supabase
      .from("sos_requests")
      .select(`
        id,
        status,
        message,
        created_at,
        profile:profiles (
          full_name
        )
      `)
      .order("created_at", {
        ascending: false,
      })
      .limit(5),

    supabase
      .from("incidents")
      .select(`
        id,
        title,
        incident_type,
        status,
        priority,
        created_at,
        profile:profiles (
          full_name
        )
      `)
      .order("created_at", {
        ascending: false,
      })
      .limit(5),
  ]);

  const activeSOS =
    activeSOSResult.count ?? 0;

  const openIncidents =
    incidentResult.count ?? 0;

  const activeAlerts =
    alertResult.count ?? 0;

  const registeredTourists =
    touristResult.count ?? 0;

  const recentSOS =
    recentSOSResult.data ?? [];

  const recentIncidents =
    recentIncidentResult.data ?? [];

  return (
    <main className="min-h-screen bg-slate-100">

      <header className="border-b bg-slate-950 text-white">

        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-300">
              AUTHORITY MONITORING
            </p>

            <h1 className="mt-1 text-xl font-bold">
              Tourist Safety Platform
            </h1>
          </div>

          <div className="flex items-center gap-5">

            <div className="hidden text-right sm:block">

              <p className="text-sm font-semibold">
                {authorityProfile.full_name ||
                  "Authority"}
              </p>

              <p className="text-xs text-slate-400">
                Authorised Personnel
              </p>

            </div>

            <LogoutButton />

          </div>

        </div>

      </header>

      <section className="mx-auto max-w-7xl px-6 py-10">

        <div>

          <p className="font-semibold text-blue-600">
            OPERATIONS OVERVIEW
          </p>

          <h2 className="mt-2 text-3xl font-bold text-slate-900">
            Safety Monitoring Dashboard
          </h2>

          <p className="mt-3 text-slate-600">
            Monitor emergency requests,
            incidents, safety alerts and
            tourist activity.
          </p>

        </div>

        <div className="mt-7 flex flex-wrap gap-3">

            <Link
                href="/authority/sos"
                className="inline-flex rounded-lg bg-red-600 px-5 py-3 font-semibold text-white transition hover:bg-red-700"
            >
                Manage SOS Requests
            </Link>

            <Link
  href="/authority/incidents"
  className="inline-flex rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700"
>
  Manage Incidents
</Link>

<Link
  href="/authority/risk-zones"
  className="inline-flex rounded-lg bg-slate-800 px-5 py-3 font-semibold text-white transition hover:bg-slate-900"
>
  Manage Risk Zones
</Link>

<Link
  href="/authority/alerts"
  className="inline-flex rounded-lg bg-amber-600 px-5 py-3 font-semibold text-white transition hover:bg-amber-700"
>
  Manage Safety Alerts
</Link>

        </div>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">

          <div className="rounded-2xl bg-white p-6 shadow-sm">

            <p className="text-sm font-semibold text-slate-500">
              Active SOS
            </p>

            <p className="mt-3 text-4xl font-bold text-red-600">
              {activeSOS}
            </p>

            <p className="mt-2 text-sm text-slate-500">
              Pending or acknowledged
            </p>

          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm">

            <p className="text-sm font-semibold text-slate-500">
              Open Incidents
            </p>

            <p className="mt-3 text-4xl font-bold text-amber-600">
              {openIncidents}
            </p>

            <p className="mt-2 text-sm text-slate-500">
              Submitted or under review
            </p>

          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm">

            <p className="text-sm font-semibold text-slate-500">
              Active Alerts
            </p>

            <p className="mt-3 text-4xl font-bold text-blue-600">
              {activeAlerts}
            </p>

            <p className="mt-2 text-sm text-slate-500">
              Current safety notices
            </p>

          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm">

            <p className="text-sm font-semibold text-slate-500">
              Registered Tourists
            </p>

            <p className="mt-3 text-4xl font-bold text-slate-900">
              {registeredTourists}
            </p>

            <p className="mt-2 text-sm text-slate-500">
              Tourist accounts
            </p>

          </div>

        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-2">

          <section>

            <div className="mb-4">

              <h3 className="text-xl font-bold text-slate-900">
                Recent SOS Requests
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Latest emergency activity.
              </p>

            </div>

            {recentSOS.length === 0 ? (

              <div className="rounded-2xl bg-white p-8 text-center shadow-sm">

                <p className="font-semibold text-slate-700">
                  No SOS requests
                </p>

              </div>

            ) : (

              <div className="space-y-3">

                {recentSOS.map((sos: any) => (

                  <article
                    key={sos.id}
                    className="rounded-2xl bg-white p-5 shadow-sm"
                  >

                    <div className="flex items-start justify-between gap-4">

                      <div>

                        <p className="font-bold text-slate-900">
                          {sos.profile?.full_name ||
                            "Tourist"}
                        </p>

                        <p className="mt-1 text-sm text-slate-500">
                          {sos.message ||
                            "Emergency assistance requested"}
                        </p>

                      </div>

                      <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-bold uppercase text-red-700">
                        {sos.status}
                      </span>

                    </div>

                    <p className="mt-4 text-xs text-slate-400">
                      {new Date(
                        sos.created_at
                      ).toLocaleString()}
                    </p>

                  </article>

                ))}

              </div>

            )}

          </section>

          <section>

            <div className="mb-4">

              <h3 className="text-xl font-bold text-slate-900">
                Recent Incident Reports
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Latest tourist reports.
              </p>

            </div>

            {recentIncidents.length === 0 ? (

              <div className="rounded-2xl bg-white p-8 text-center shadow-sm">

                <p className="font-semibold text-slate-700">
                  No incident reports
                </p>

              </div>

            ) : (

              <div className="space-y-3">

                {recentIncidents.map(
                  (incident: any) => (

                    <article
                      key={incident.id}
                      className="rounded-2xl bg-white p-5 shadow-sm"
                    >

                      <div className="flex items-start justify-between gap-4">

                        <div>

                          <p className="text-xs font-bold uppercase tracking-wide text-blue-600">
                            {incident.incident_type
                              .replaceAll("_", " ")}
                          </p>

                          <h4 className="mt-1 font-bold text-slate-900">
                            {incident.title}
                          </h4>

                          <p className="mt-1 text-sm text-slate-500">
                            Reported by{" "}
                            {incident.profile
                              ?.full_name ||
                              "Tourist"}
                          </p>

                        </div>

                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold uppercase text-slate-700">
                          {incident.status}
                        </span>

                      </div>

                      <p className="mt-4 text-xs text-slate-400">
                        {new Date(
                          incident.created_at
                        ).toLocaleString()}
                      </p>

                    </article>

                  )
                )}

              </div>

            )}

          </section>

        </div>

      </section>

    </main>
  );
}