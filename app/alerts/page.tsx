import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

import SafetyAlerts from "@/components/SafetyAlerts";
import TouristPageLayout from "@/components/TouristPageLayout";

export default async function AlertsPage() {
  const supabase =
    await createClient();

  const {
    data: claimsData,
  } =
    await supabase.auth.getClaims();

  if (!claimsData?.claims) {
    redirect("/login");
  }

  const { data: alerts } =
    await supabase
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
        risk_zone:risk_zones (
          id,
          name,
          latitude,
          longitude,
          radius_meters
        )
      `)
      .eq("active", true)
      .order("created_at", {
        ascending: false,
      });

  return (
    <TouristPageLayout
      eyebrow="Safety Updates"
      title="Risk & Safety Alerts"
      description="Review current safety warnings and check which alerts may be relevant to your location."
    >
      <SafetyAlerts
        initialAlerts={
          (alerts ?? []) as any
        }
      />
    </TouristPageLayout>
  );
}