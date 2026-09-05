"use client";

import {
  useMemo,
  useState,
} from "react";

import {
  AlertTriangle,
  LocateFixed,
  Radio,
  ShieldCheck,
} from "lucide-react";

import { useRouter } from "next/navigation";

import { createClient } from "@/lib/supabase/client";

type SOSRequest = {
  id: string;
  status:
    | "pending"
    | "acknowledged"
    | "resolved"
    | "cancelled";
  latitude: number;
  longitude: number;
  accuracy_meters: number | null;
  message: string | null;
  created_at: string;
};

type Props = {
  touristName: string;
  initialActiveSOS:
    | SOSRequest
    | null;
};

export default function SOSPanel({
  touristName,
  initialActiveSOS,
}: Props) {
  const supabase = useMemo(
    () => createClient(),
    []
  );

  const router = useRouter();

  const [message, setMessage] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  async function sendSOS() {
    setError("");

    if (
      initialActiveSOS
    ) {
      setError(
        "You already have an active SOS request."
      );

      return;
    }

    const confirmed =
      window.confirm(
        "Send an emergency SOS request with your current location?"
      );

    if (!confirmed) {
      return;
    }

    setLoading(true);

    const {
      data: { user },
    } =
      await supabase.auth.getUser();

    if (!user) {
      setError(
        "You must be logged in."
      );

      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { error } =
          await supabase
            .from(
              "sos_requests"
            )
            .insert({
              user_id:
                user.id,
              latitude:
                position.coords
                  .latitude,
              longitude:
                position.coords
                  .longitude,
              accuracy_meters:
                position.coords
                  .accuracy,
              message:
                message.trim() ||
                null,
            });

        if (error) {
          setError(
            error.message
          );
        } else {
          setMessage("");
          router.refresh();
        }

        setLoading(false);
      },
      () => {
        setError(
          "Location access is required to send the SOS request."
        );

        setLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
      }
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_0.75fr]">
      <section className="relative overflow-hidden rounded-[30px] bg-gradient-to-br from-red-600 via-red-600 to-rose-700 p-7 text-white shadow-2xl shadow-red-600/20 sm:p-9">
        <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-white/10 blur-3xl" />

        <div className="relative z-10">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 backdrop-blur">
            <AlertTriangle
              size={26}
            />
          </div>

          <h2 className="mt-6 text-3xl font-bold">
            Emergency SOS
          </h2>

          <p className="mt-3 max-w-xl leading-relaxed text-red-100">
            Use this feature if you need
            urgent safety assistance.
            Your approximate browser
            location will be included.
          </p>

          <textarea
            value={message}
            onChange={(event) =>
              setMessage(
                event.target.value
              )
            }
            rows={4}
            placeholder="Optional short message..."
            className="mt-7 w-full rounded-2xl border border-white/20 bg-white/10 px-4 py-4 text-white outline-none placeholder:text-red-200 backdrop-blur focus:border-white/50"
          />

          {error && (
            <div className="mt-5 rounded-xl bg-white/15 p-4 text-sm">
              {error}
            </div>
          )}

          <button
            type="button"
            onClick={sendSOS}
            disabled={
              loading ||
              !!initialActiveSOS
            }
            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-white px-6 py-4 font-bold text-red-700 shadow-xl transition hover:bg-red-50 disabled:opacity-60"
          >
            <LocateFixed
              size={19}
            />

            {loading
              ? "Sending SOS..."
              : initialActiveSOS
                ? "SOS Already Active"
                : "Send Emergency SOS"}
          </button>
        </div>
      </section>

      <section className="glass-panel rounded-[30px] p-7">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-blue-600">
          Request Status
        </p>

        <h3 className="mt-2 text-2xl font-bold text-slate-950">
          {initialActiveSOS
            ? "SOS Active"
            : "No Active SOS"}
        </h3>

        {initialActiveSOS ? (
          <div className="mt-6">
            <div
              className={
                initialActiveSOS.status ===
                "acknowledged"
                  ? "rounded-2xl border border-blue-200 bg-blue-50/75 p-5"
                  : "rounded-2xl border border-amber-200 bg-amber-50/80 p-5"
              }
            >
              <div className="flex items-center gap-3">
                <Radio
                  className={
                    initialActiveSOS.status ===
                    "acknowledged"
                      ? "text-blue-600"
                      : "text-amber-600"
                  }
                />

                <div>
                  <p className="text-xs font-bold uppercase text-slate-400">
                    Status
                  </p>

                  <p className="font-bold capitalize text-slate-900">
                    {
                      initialActiveSOS.status
                    }
                  </p>
                </div>
              </div>
            </div>

            <p className="mt-5 text-sm text-slate-600">
              Sent by{" "}
              <span className="font-semibold">
                {touristName}
              </span>
            </p>

            <p className="mt-2 text-sm text-slate-500">
              {new Date(
                initialActiveSOS.created_at
              ).toLocaleString()}
            </p>
          </div>
        ) : (
          <div className="mt-8 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100/70 text-green-600">
              <ShieldCheck
                size={27}
              />
            </div>

            <p className="mt-4 font-bold text-slate-800">
              Ready when needed
            </p>

            <p className="mt-2 text-sm leading-relaxed text-slate-500">
              There is currently no
              emergency request associated
              with your account.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}