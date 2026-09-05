import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

import ProfileForm from "@/components/ProfileForm";
import TouristPageLayout from "@/components/TouristPageLayout";

export default async function ProfilePage() {
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
      .select(
        "full_name, phone, date_of_birth, nationality"
      )
      .eq("id", userId)
      .single();

  if (!profile) {
    redirect("/dashboard");
  }

  return (
    <TouristPageLayout
      eyebrow="Your Profile"
      title="Tourist Information"
      description="Keep your travel and safety information up to date. Your profile supports your digital tourist ID and other safety features."
    >
      <div className="max-w-4xl">
        <ProfileForm
          initialProfile={{
            full_name:
              profile.full_name ?? "",
            phone:
              profile.phone ?? "",
            date_of_birth:
              profile.date_of_birth ?? "",
            nationality:
              profile.nationality ?? "",
          }}
        />
      </div>
    </TouristPageLayout>
  );
}