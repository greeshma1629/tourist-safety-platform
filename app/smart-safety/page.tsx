import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

import SmartSafetyAssistant from "@/components/SmartSafetyAssistant";
import TouristPageLayout from "@/components/TouristPageLayout";

export default async function SmartSafetyPage() {
  const supabase =
    await createClient();

  const {
    data: { user },
  } =
    await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <TouristPageLayout
      eyebrow="AI-Powered Safety"
      title="Smart Safety Assistant"
      description="Describe a travel safety concern and receive an AI-assisted risk assessment with practical guidance."
    >
      <SmartSafetyAssistant />
    </TouristPageLayout>
  );
}