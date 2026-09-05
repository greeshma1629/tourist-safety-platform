import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

import IncidentReporter from "@/components/IncidentReporter";
import TouristPageLayout from "@/components/TouristPageLayout";

export default async function IncidentsPage() {
  const supabase =
    await createClient();

  const {
    data: claimsData,
  } =
    await supabase.auth.getClaims();

  if (!claimsData?.claims) {
    redirect("/login");
  }

  const userId =
    claimsData.claims.sub;

  const { data: incidents } =
    await supabase
      .from("incidents")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", {
        ascending: false,
      });

  return (
    <TouristPageLayout
      eyebrow="Report & Track"
      title="Incident Reporting"
      description="Report safety-related incidents and track their review status through the platform."
    >
      <IncidentReporter
        initialIncidents={
          incidents ?? []
        }
      />
    </TouristPageLayout>
  );
}