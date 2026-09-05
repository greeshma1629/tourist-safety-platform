import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

import SafetyMap from "@/components/SafetyMap";
import TouristPageLayout from "@/components/TouristPageLayout";

export default async function SafetyMapPage() {
  const supabase =
    await createClient();

  const {
    data: claimsData,
  } =
    await supabase.auth.getClaims();

  if (!claimsData?.claims) {
    redirect("/login");
  }

  const { data: riskZones } =
    await supabase
      .from("risk_zones")
      .select(
        "id, name, description, latitude, longitude, radius_meters, risk_level, safety_message"
      )
      .eq("active", true);

  return (
    <TouristPageLayout
      eyebrow="Location Safety"
      title="Safety Around You"
      description="Use your location to understand nearby registered risk zones and receive location-based safety information."
    >
      <SafetyMap
        riskZones={
          riskZones ?? []
        }
      />
    </TouristPageLayout>
  );
}