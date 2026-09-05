import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

import DigitalIdCard from "@/components/DigitalIdCard";
import TouristPageLayout from "@/components/TouristPageLayout";

export default async function DigitalIdPage() {
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
        "full_name, nationality"
      )
      .eq("id", userId)
      .single();

  if (!profile) {
    redirect("/dashboard");
  }

  let { data: touristId } =
    await supabase
      .from("tourist_ids")
      .select(
        "public_code, status, issued_at"
      )
      .eq("user_id", userId)
      .maybeSingle();

  if (!touristId) {
    const { data: created } =
      await supabase
        .from("tourist_ids")
        .insert({
          user_id: userId,
        })
        .select(
          "public_code, status, issued_at"
        )
        .single();

    touristId = created;
  }

  if (!touristId) {
    redirect("/dashboard");
  }

  return (
    <TouristPageLayout
      eyebrow="Digital Identity"
      title="Your Digital Tourist ID"
      description="Access your secure QR-based tourist identity. The QR uses a public verification reference instead of exposing private safety information."
    >
      <DigitalIdCard
        fullName={
          profile.full_name ||
          "Tourist"
        }
        nationality={
          profile.nationality ||
          "Not provided"
        }
        publicCode={
          touristId.public_code
        }
        status={
          touristId.status
        }
        issuedAt={
          touristId.issued_at
        }
      />
    </TouristPageLayout>
  );
}