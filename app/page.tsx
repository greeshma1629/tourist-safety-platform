import Link from "next/link";

import {
  AlertTriangle,
  ArrowRight,
  Bot,
  Fingerprint,
  MapPinned,
  Radio,
  Shield,
  ShieldCheck,
  Siren,
} from "lucide-react";

const features = [
  {
    title: "Location Safety",
    description:
      "Understand nearby registered risk zones.",
    icon: MapPinned,
  },
  {
    title: "Emergency SOS",
    description:
      "Send an emergency request with your location.",
    icon: Siren,
  },
  {
    title: "Digital Tourist ID",
    description:
      "Secure QR-based identity verification.",
    icon: Fingerprint,
  },
  {
    title: "Safety Alerts",
    description:
      "Receive location-aware warnings and guidance.",
    icon: AlertTriangle,
  },
  {
    title: "Smart Safety AI",
    description:
      "AI-assisted safety guidance for uncertain situations.",
    icon: Bot,
  },
  {
    title: "Authority Response",
    description:
      "Connect reports with authorised monitoring.",
    icon: Radio,
  },
];

export default function HomePage() {
  return (
    <main className="tourist-background min-h-screen overflow-hidden">
      <header className="relative z-50 px-5 pt-5 sm:px-8 lg:px-12">
        <div className="glass-panel mx-auto flex max-w-[1450px] items-center justify-between rounded-[24px] px-5 py-4">
          <Link
            href="/"
            className="flex items-center gap-3"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-violet-600 text-white shadow-lg shadow-blue-500/20">
              <Shield size={20} />
            </div>

            <div>
              <p className="font-bold text-slate-950">
                SafeJourney
              </p>

              <p className="text-[10px] text-slate-500">
                Tourist Safety Platform
              </p>
            </div>
          </Link>

          <div className="flex items-center gap-2">
            <Link
              href="/login"
              className="glass-button hidden rounded-xl px-4 py-2.5 text-sm font-bold text-slate-700 sm:inline-flex"
            >
              Sign In
            </Link>

            <Link
              href="/register"
              className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-slate-950/10"
            >
              Get Started

              <ArrowRight
                size={16}
              />
            </Link>
          </div>
        </div>
      </header>

      <section className="mx-auto grid min-h-[740px] max-w-[1450px] items-center gap-14 px-6 py-16 lg:grid-cols-[1fr_0.9fr] lg:px-12">
        <div className="fade-up">
          <div className="glass-button inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold uppercase tracking-[0.15em] text-blue-700">
            <ShieldCheck
              size={15}
            />

            Travel with confidence
          </div>

          <h1 className="mt-7 max-w-4xl text-5xl font-bold leading-[0.98] tracking-[-0.045em] text-slate-950 sm:text-6xl lg:text-7xl">
            Safety that travels{" "}
            <span className="gradient-text block">
              with you.
            </span>
          </h1>

          <p className="mt-7 max-w-xl text-lg leading-8 text-slate-600">
            One connected platform for
            safety alerts, emergency
            assistance, digital identity
            and smarter travel decisions.
          </p>

          <div className="mt-9 flex flex-wrap gap-3">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-6 py-4 text-sm font-bold text-white shadow-xl shadow-blue-500/20 hover:bg-blue-700"
            >
              Start Your Journey

              <ArrowRight
                size={17}
              />
            </Link>

            <Link
              href="/login"
              className="glass-button rounded-2xl px-6 py-4 text-sm font-bold text-slate-700"
            >
              Access Platform
            </Link>
          </div>
        </div>

        <div className="relative fade-up">
          <div className="absolute inset-10 rounded-full bg-blue-500/15 blur-[80px]" />

          <div className="glass-panel-strong relative overflow-hidden rounded-[34px] p-5">
            <div className="rounded-[27px] bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-300">
                    Live Safety Center
                  </p>

                  <p className="mt-2 text-xl font-bold">
                    Journey Overview
                  </p>
                </div>

                <ShieldCheck
                  size={22}
                />
              </div>

              <div className="mt-8 grid grid-cols-2 gap-3">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-xs text-slate-400">
                    Safety Status
                  </p>

                  <p className="mt-3 font-bold text-green-300">
                    Ready
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-xs text-slate-400">
                    Safety Tools
                  </p>

                  <p className="mt-3 text-2xl font-bold">
                    09
                  </p>
                </div>
              </div>

              <div className="relative mt-4 h-64 overflow-hidden rounded-3xl bg-[#172033]">
                <div
                  className="absolute inset-0 opacity-20"
                  style={{
                    backgroundImage:
                      "linear-gradient(rgba(255,255,255,.18) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.18) 1px, transparent 1px)",
                    backgroundSize:
                      "38px 38px",
                  }}
                />

                <div className="absolute left-[12%] top-[25%] h-20 w-20 rounded-full border border-amber-400/30 bg-amber-400/10" />

                <div className="absolute right-[12%] top-[17%] h-28 w-28 rounded-full border border-red-400/30 bg-red-400/10" />

                <div className="absolute left-[47%] top-[44%]">
                  <div className="relative">
                    <div className="absolute -inset-6 rounded-full bg-blue-500/20 pulse-soft" />

                    <div className="relative flex h-12 w-12 items-center justify-center rounded-full border-4 border-white bg-blue-600">
                      <MapPinned
                        size={17}
                      />
                    </div>
                  </div>
                </div>

                <div className="absolute bottom-4 left-4 right-4 rounded-2xl border border-white/10 bg-slate-950/75 p-4 backdrop-blur">
                  <p className="text-xs text-slate-400">
                    Location-aware protection
                  </p>

                  <p className="mt-1 font-bold">
                    Safety monitoring ready
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 pb-24 lg:px-12">
        <div className="mx-auto max-w-[1450px]">
          <div className="text-center">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-600">
              One Safety Ecosystem
            </p>

            <h2 className="mt-3 text-3xl font-bold text-slate-950 sm:text-4xl">
              Everything you need when
              safety matters.
            </h2>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {features.map((feature) => {
              const Icon =
                feature.icon;

              return (
                <div
                  key={feature.title}
                  className="glass-card glass-card-hover rounded-[26px] p-7"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/65 text-blue-600 shadow-sm">
                    <Icon
                      size={21}
                    />
                  </div>

                  <h3 className="mt-5 text-lg font-bold text-slate-950">
                    {feature.title}
                  </h3>

                  <p className="mt-2 text-sm leading-relaxed text-slate-600">
                    {
                      feature.description
                    }
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="px-6 pb-12 lg:px-12">
        <div className="mx-auto max-w-[1450px] overflow-hidden rounded-[34px] bg-gradient-to-br from-slate-950 to-blue-950 px-8 py-14 text-white shadow-2xl shadow-blue-950/15 sm:px-12">
          <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-center">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.17em] text-blue-300">
                Safer journeys start here
              </p>

              <h2 className="mt-3 text-3xl font-bold">
                Travel informed.
                Stay connected.
              </h2>
            </div>

            <Link
              href="/register"
              className="inline-flex w-fit items-center gap-2 rounded-2xl bg-white px-6 py-4 text-sm font-bold text-slate-950"
            >
              Create Tourist Account

              <ArrowRight
                size={17}
              />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}