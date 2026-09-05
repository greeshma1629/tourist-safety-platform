import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

import SafetyResources from "@/components/SafetyResources";
import TouristPageLayout from "@/components/TouristPageLayout";

export default async function ResourcesPage() {
  const supabase =
    await createClient();

  const {
    data: claimsData,
  } =
    await supabase.auth.getClaims();

  if (!claimsData?.claims) {
    redirect("/login");
  }

  const { data: resources } =
    await supabase
      .from("safety_resources")
      .select("*")
      .eq("active", true)
      .order("priority", {
        ascending: false,
      });

  return (
    <TouristPageLayout
      eyebrow="Travel Safety"
      title="Safety Resources"
      description="Access useful travel safety information, guidance and emergency resources from one place."
    >
      <SafetyResources
        resources={
          resources ?? []
        }
      />
    </TouristPageLayout>
  );
}