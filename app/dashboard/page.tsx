import Link from "next/link";
import { redirect } from "next/navigation";

import {
  AlertTriangle,
  ArrowRight,
  Bot,
  FileWarning,
  Fingerprint,
  LifeBuoy,
  Map,
  ShieldCheck,
  UserRound,
  UsersRound,
} from "lucide-react";

import { createClient } from "@/lib/supabase/server";

import LogoutButton from "@/components/LogoutButton";
import TouristShell from "@/components/TouristShell";

export default async function DashboardPage() {
  const supabase =
    await createClient();

  const {
    data: claimsData,
    error: claimsError,
  } =
    await supabase.auth.getClaims();

  if (
    claimsError ||
    !claimsData?.claims
  ) {
    redirect("/login");
  }

  const userId =
    claimsData.claims.sub;

  const {
    data: profile,
    error: profileError,
  } = await supabase
    .from("profiles")
    .select(
      "full_name, role, nationality"
    )
    .eq("id", userId)
    .single();

  if (
    profileError ||
    !profile
  ) {
    redirect("/login");
  }

  if (
    profile.role === "authority"
  ) {
    redirect("/authority");
  }

  const [
    alertsResult,
    incidentsResult,
    sosResult,
  ] = await Promise.all([
    supabase
      .from("safety_alerts")
      .select("id", {
        count: "exact",
        head: true,
      })
      .eq("active", true),

    supabase
      .from("incidents")
      .select("id", {
        count: "exact",
        head: true,
      })
      .eq("user_id", userId)
      .in("status", [
        "submitted",
        "reviewing",
      ]),

    supabase
      .from("sos_requests")
      .select("id", {
        count: "exact",
        head: true,
      })
      .eq("user_id", userId)
      .in("status", [
        "pending",
        "acknowledged",
      ]),
  ]);

  const activeAlerts =
    alertsResult.count ?? 0;

  const openIncidents =
    incidentsResult.count ?? 0;

  const activeSOS =
    (sosResult.count ?? 0) > 0;

  const firstName =
    profile.full_name
      ?.trim()
      .split(" ")[0] ||
    "Traveller";

  const features = [
    {
      title: "Safety Map",
      description:
        "Check your surroundings and nearby risk zones.",
      href: "/safety-map",
      icon: Map,
    },
    {
      title: "Digital Tourist ID",
      description:
        "Open your secure QR-based tourist identity.",
      href: "/digital-id",
      icon: Fingerprint,
    },
    {
      title: "Safety Alerts",
      description:
        "Review warnings relevant to your journey.",
      href: "/alerts",
      icon: AlertTriangle,
    },
    {
      title: "Incident Reports",
      description:
        "Report and track safety-related incidents.",
      href: "/incidents",
      icon: FileWarning,
    },
    {
      title: "Smart Safety AI",
      description:
        "Get AI-assisted guidance for safety concerns.",
      href: "/smart-safety",
      icon: Bot,
    },
    {
      title: "Safety Resources",
      description:
        "Access useful travel safety guidance.",
      href: "/resources",
      icon: LifeBuoy,
    },
  ];

  return (
    <TouristShell>
      <div className="mx-auto max-w-[1500px] px-5 py-6 sm:px-8 lg:px-8 lg:py-8">
        <header className="glass-panel relative overflow-hidden rounded-[30px] px-6 py-6 sm:flex sm:items-center sm:justify-between">
          <div className="absolute -right-16 -top-20 h-52 w-52 rounded-full bg-blue-400/15 blur-3xl" />

          <div className="relative z-10">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-blue-600">
              Tourist Safety Center
            </p>

            <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
              Good to see you,{" "}
              <span className="gradient-text">
                {firstName}.
              </span>
            </h1>

            <p className="mt-2 text-slate-600">
              Here&apos;s your current
              safety overview.
            </p>
          </div>

          <div className="relative z-10 mt-5 flex items-center gap-3 sm:mt-0">
            <Link
              href="/profile"
              className="glass-button flex h-11 w-11 items-center justify-center rounded-xl text-slate-700"
              aria-label="Profile"
            >
              <UserRound size={19} />
            </Link>

            <LogoutButton />
          </div>
        </header>

        <section className="mt-6 grid gap-4 md:grid-cols-3">
          <div className="glass-card rounded-[24px] p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-slate-500">
                Safety Status
              </p>

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-100/70 text-green-600">
                <ShieldCheck size={18} />
              </div>
            </div>

            <p className="mt-6 text-2xl font-bold text-slate-950">
              {activeSOS
                ? "SOS Active"
                : "Ready"}
            </p>

            <p className="mt-1 text-sm text-slate-500">
              {activeSOS
                ? "Emergency assistance request active."
                : "No active emergency request."}
            </p>
          </div>

          <div className="glass-card rounded-[24px] p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-slate-500">
                Active Alerts
              </p>

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100/70 text-amber-600">
                <AlertTriangle size={18} />
              </div>
            </div>

            <p className="mt-6 text-3xl font-bold text-slate-950">
              {activeAlerts}
            </p>

            <Link
              href="/alerts"
              className="mt-1 inline-flex text-sm font-bold text-blue-600"
            >
              View alerts
            </Link>
          </div>

          <div className="glass-card rounded-[24px] p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-slate-500">
                Open Reports
              </p>

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100/70 text-blue-600">
                <FileWarning size={18} />
              </div>
            </div>

            <p className="mt-6 text-3xl font-bold text-slate-950">
              {openIncidents}
            </p>

            <Link
              href="/incidents"
              className="mt-1 inline-flex text-sm font-bold text-blue-600"
            >
              Track reports
            </Link>
          </div>
        </section>

        <section className="relative mt-6 overflow-hidden rounded-[30px] border border-white/20 bg-gradient-to-br from-slate-950/95 via-slate-900/95 to-blue-950/90 text-white shadow-2xl shadow-blue-950/15 backdrop-blur-2xl">
          <div className="absolute -right-20 -top-28 h-72 w-72 rounded-full bg-blue-500/20 blur-3xl" />

          <div className="absolute bottom-[-130px] left-[35%] h-64 w-64 rounded-full bg-violet-500/15 blur-3xl" />

          <div className="relative z-10 px-7 py-10 sm:px-10 sm:py-12">
            <p className="text-sm font-semibold text-blue-300">
              YOUR JOURNEY, SAFER
            </p>

            <h2 className="mt-3 max-w-3xl text-3xl font-bold tracking-tight sm:text-4xl">
              Safety support that travels
              with you.
            </h2>

            <p className="mt-4 max-w-2xl leading-relaxed text-slate-300">
              Check risk zones, receive
              safety alerts, access your
              digital tourist identity and
              request assistance from one
              connected platform.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href="/safety-map"
                className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-blue-50"
              >
                Open Safety Map
                <ArrowRight size={17} />
              </Link>

              <Link
                href="/sos"
                className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-red-700"
              >
                Emergency SOS
              </Link>
            </div>
          </div>
        </section>

        <section className="mt-9">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-blue-600">
            Quick Access
          </p>

          <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-950">
            Your safety tools
          </h2>

          <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {features.map((feature) => {
              const Icon =
                feature.icon;

              return (
                <Link
                  key={feature.href}
                  href={feature.href}
                  className="glass-card glass-card-hover group rounded-[24px] p-6"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/60 text-slate-700 shadow-sm transition group-hover:bg-slate-950 group-hover:text-white">
                    <Icon size={20} />
                  </div>

                  <h3 className="mt-5 text-lg font-bold text-slate-950">
                    {feature.title}
                  </h3>

                  <p className="mt-2 text-sm leading-relaxed text-slate-500">
                    {feature.description}
                  </p>

                  <div className="mt-5 flex items-center gap-1.5 text-sm font-bold text-blue-600">
                    Open feature
                    <ArrowRight size={15} />
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        <section className="mt-8 grid gap-4 sm:grid-cols-2">
          <Link
            href="/emergency-contacts"
            className="glass-card glass-card-hover flex items-center justify-between gap-5 rounded-[24px] p-6"
          >
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100/70 text-blue-600">
                <UsersRound size={21} />
              </div>

              <div>
                <p className="font-bold text-slate-950">
                  Emergency Contacts
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  Manage your trusted contacts.
                </p>
              </div>
            </div>

            <ArrowRight
              size={18}
              className="text-slate-400"
            />
          </Link>

          <Link
            href="/profile"
            className="glass-card glass-card-hover flex items-center justify-between gap-5 rounded-[24px] p-6"
          >
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-100/70 text-violet-600">
                <UserRound size={21} />
              </div>

              <div>
                <p className="font-bold text-slate-950">
                  Tourist Profile
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  Keep your safety information updated.
                </p>
              </div>
            </div>

            <ArrowRight
              size={18}
              className="text-slate-400"
            />
          </Link>
        </section>
      </div>
    </TouristShell>
  );
}