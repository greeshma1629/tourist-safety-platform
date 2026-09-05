import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

import EmergencyContacts from "@/components/EmergencyContacts";
import TouristPageLayout from "@/components/TouristPageLayout";

export default async function EmergencyContactsPage() {
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

  const { data: contacts } =
    await supabase
      .from("emergency_contacts")
      .select("*")
      .eq("user_id", userId)
      .order("is_primary", {
        ascending: false,
      })
      .order("created_at", {
        ascending: false,
      });

  return (
    <TouristPageLayout
      eyebrow="Trusted Contacts"
      title="Emergency Contacts"
      description="Manage trusted people who may be useful to contact if you need assistance during your journey."
    >
      <EmergencyContacts
        initialContacts={
          contacts ?? []
        }
      />
    </TouristPageLayout>
  );
}