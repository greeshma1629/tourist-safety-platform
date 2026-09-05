import Link from "next/link";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import AuthorityIncidentManagerClient from "@/components/AuthorityIncidentManagerClient";

export default async function AuthorityIncidentsPage() {
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

  const { data: incidents, error } =
    await supabase
      .from("incidents")
      .select(`
        id,
        incident_type,
        title,
        description,
        occurred_at,
        latitude,
        longitude,
        accuracy_meters,
        evidence_path,
        status,
        priority,
        created_at,
        reviewed_at,
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
      "Unable to load incidents:",
      error
    );
  }

  const incidentsWithEvidence =
    await Promise.all(
      (incidents ?? []).map(
        async (incident: any) => {
          let evidenceUrl: string | null =
            null;

          if (incident.evidence_path) {
            const {
              data: signedData,
            } = await supabase.storage
              .from("incident-evidence")
              .createSignedUrl(
                incident.evidence_path,
                600
              );

            evidenceUrl =
              signedData?.signedUrl ??
              null;
          }

          return {
            ...incident,
            evidence_url: evidenceUrl,
          };
        }
      )
    );

  return (
    <main className="min-h-screen bg-slate-100">

      <header className="border-b bg-slate-950 text-white">

        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">

          <div>

            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-300">
              INCIDENT MONITORING
            </p>

            <h1 className="mt-1 text-xl font-bold">
              Incident Management
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

          <p className="font-semibold text-blue-600">
            REPORT REVIEW
          </p>

          <h2 className="mt-2 text-3xl font-bold text-slate-900">
            Tourist Incident Reports
          </h2>

          <p className="mt-3 max-w-3xl text-slate-600">
            Review submitted incidents,
            assess their priority and update
            their investigation status.
          </p>

        </div>

       <AuthorityIncidentManagerClient
  initialIncidents={incidentsWithEvidence}
/>

      </section>

    </main>
  );
}