"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  AlertTriangle,
  Bot,
  ContactRound,
  FileWarning,
  Fingerprint,
  Home,
  LifeBuoy,
  Map,
  Shield,
  UserRound,
} from "lucide-react";

const navigation = [
  {
    name: "Overview",
    href: "/dashboard",
    icon: Home,
  },
  {
    name: "My Profile",
    href: "/profile",
    icon: UserRound,
  },
  {
    name: "Digital Tourist ID",
    href: "/digital-id",
    icon: Fingerprint,
  },
  {
    name: "Safety Map",
    href: "/safety-map",
    icon: Map,
  },
  {
    name: "Safety Alerts",
    href: "/alerts",
    icon: AlertTriangle,
  },
  {
    name: "Incident Reports",
    href: "/incidents",
    icon: FileWarning,
  },
  {
    name: "Emergency Contacts",
    href: "/emergency-contacts",
    icon: ContactRound,
  },
  {
    name: "Safety Resources",
    href: "/resources",
    icon: LifeBuoy,
  },
  {
    name: "Smart Safety AI",
    href: "/smart-safety",
    icon: Bot,
  },
];

export default function TouristSidebar() {
  const pathname = usePathname();

  return (
    <aside className="sticky top-0 hidden h-screen w-[280px] shrink-0 p-4 lg:block">
      <div className="glass-panel flex h-full flex-col rounded-[30px]">
        <div className="px-5 py-6">
          <Link
            href="/dashboard"
            className="flex items-center gap-3"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-violet-600 text-white shadow-lg shadow-blue-500/20">
              <Shield size={21} />
            </div>

            <div>
              <p className="font-bold tracking-tight text-slate-950">
                SafeJourney
              </p>

              <p className="text-[11px] font-medium text-slate-500">
                Tourist Safety Platform
              </p>
            </div>
          </Link>
        </div>

        <div className="px-3">
          <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">
            Safety Hub
          </p>

          <nav className="space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;

              const active =
                pathname === item.href ||
                pathname.startsWith(
                  `${item.href}/`
                );

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={
                    active
                      ? "flex items-center gap-3 rounded-2xl bg-slate-950 px-3.5 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-950/10"
                      : "flex items-center gap-3 rounded-2xl px-3.5 py-3 text-sm font-medium text-slate-600 transition hover:bg-white/55 hover:text-slate-950"
                  }
                >
                  <Icon
                    size={18}
                    strokeWidth={1.9}
                  />

                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="mt-auto p-3">
          <Link
            href="/sos"
            className="flex items-center justify-center gap-2 rounded-2xl bg-red-600 px-4 py-4 text-sm font-bold text-white shadow-lg shadow-red-600/20 transition hover:-translate-y-0.5 hover:bg-red-700"
          >
            <AlertTriangle size={19} />

            Emergency SOS
          </Link>

          <div className="mt-3 rounded-2xl border border-white/60 bg-white/40 p-4 backdrop-blur-xl">
            <p className="text-xs font-bold text-slate-700">
              Safety reminder
            </p>

            <p className="mt-1 text-xs leading-relaxed text-slate-500">
              Stay aware of local guidance
              and keep trusted contacts
              updated.
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}