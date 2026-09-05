import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

import SOSPanel from "@/components/SOSPanel";
import TouristPageLayout from "@/components/TouristPageLayout";

export default async function SOSPage() {
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

  const { data: profile } =
    await supabase
      .from("profiles")
      .select("full_name")
      .eq("id", userId)
      .single();

  const { data: activeSOS } =
    await supabase
      .from("sos_requests")
      .select("*")
      .eq("user_id", userId)
      .in("status", [
        "pending",
        "acknowledged",
      ])
      .order("created_at", {
        ascending: false,
      })
      .limit(1)
      .maybeSingle();

  return (
    <TouristPageLayout
      eyebrow="Emergency Assistance"
      title="Emergency SOS"
      description="Request urgent safety assistance and attach your approximate current location to the request."
    >
      <SOSPanel
        touristName={
          profile?.full_name ||
          "Tourist"
        }
        initialActiveSOS={
          activeSOS
        }
      />
    </TouristPageLayout>
  );
}