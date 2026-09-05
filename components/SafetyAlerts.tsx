"use client";

import {
  useMemo,
  useState,
} from "react";

import {
  AlertTriangle,
  LocateFixed,
  ShieldCheck,
} from "lucide-react";

type RiskZone = {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  radius_meters: number;
} | null;

type Alert = {
  id: string;
  title: string;
  message: string;
  risk_level:
    | "low"
    | "medium"
    | "high";
  safety_advice: string | null;
  starts_at: string;
  expires_at: string | null;
  active: boolean;
  risk_zone: RiskZone;
};

type Props = {
  initialAlerts: Alert[];
};

function distanceMeters(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
) {
  const radius =
    6371000;

  const rad = (
    value: number
  ) =>
    (value * Math.PI) / 180;

  const dLat =
    rad(lat2 - lat1);

  const dLon =
    rad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(rad(lat1)) *
      Math.cos(rad(lat2)) *
      Math.sin(dLon / 2) ** 2;

  return (
    radius *
    2 *
    Math.atan2(
      Math.sqrt(a),
      Math.sqrt(1 - a)
    )
  );
}

export default function SafetyAlerts({
  initialAlerts,
}: Props) {
  const [
    relevantIds,
    setRelevantIds,
  ] =
    useState<string[]>([]);

  const [
    checkedLocation,
    setCheckedLocation,
  ] = useState(false);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  function checkLocation() {
    setLoading(true);
    setError("");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const latitude =
          position.coords.latitude;

        const longitude =
          position.coords.longitude;

        const ids =
          initialAlerts
            .filter((alert) => {
              if (
                !alert.risk_zone
              ) {
                return true;
              }

              const distance =
                distanceMeters(
                  latitude,
                  longitude,
                  alert.risk_zone
                    .latitude,
                  alert.risk_zone
                    .longitude
                );

              return (
                distance <=
                alert.risk_zone
                  .radius_meters
              );
            })
            .map(
              (alert) =>
                alert.id
            );

        setRelevantIds(ids);
        setCheckedLocation(true);
        setLoading(false);
      },
      () => {
        setError(
          "Unable to access your location."
        );

        setLoading(false);
      }
    );
  }

  const alerts = useMemo(
    () =>
      [...initialAlerts].sort(
        (a, b) => {
          const aRelevant =
            relevantIds.includes(
              a.id
            );

          const bRelevant =
            relevantIds.includes(
              b.id
            );

          if (
            aRelevant !==
            bRelevant
          ) {
            return aRelevant
              ? -1
              : 1;
          }

          const priority = {
            high: 3,
            medium: 2,
            low: 1,
          };

          return (
            priority[
              b.risk_level
            ] -
            priority[
              a.risk_level
            ]
          );
        }
      ),
    [
      initialAlerts,
      relevantIds,
    ]
  );

  return (
    <div className="space-y-6">
      <section className="glass-panel rounded-[28px] p-6">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-xl font-bold text-slate-950">
              Location Relevance
            </h2>

            <p className="mt-2 text-sm leading-relaxed text-slate-500">
              Check your approximate
              location to bring nearby
              alerts to the top.
            </p>
          </div>

          <button
            type="button"
            onClick={
              checkLocation
            }
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-bold text-white shadow-lg shadow-blue-500/20 hover:bg-blue-700 disabled:opacity-50"
          >
            <LocateFixed
              size={17}
            />

            {loading
              ? "Checking..."
              : "Check My Location"}
          </button>
        </div>

        {checkedLocation && (
          <div className="mt-5 flex items-center gap-2 rounded-xl border border-green-200 bg-green-50/80 p-4 text-sm font-medium text-green-700">
            <ShieldCheck
              size={17}
            />

            Location relevance updated.
          </div>
        )}

        {error && (
          <div className="mt-5 rounded-xl border border-red-200 bg-red-50/90 p-4 text-sm text-red-700">
            {error}
          </div>
        )}
      </section>

      {alerts.length === 0 ? (
        <div className="glass-panel rounded-[28px] p-12 text-center">
          <ShieldCheck className="mx-auto text-green-600" />

          <h3 className="mt-4 text-xl font-bold text-slate-950">
            No active alerts
          </h3>

          <p className="mt-2 text-sm text-slate-500">
            There are currently no
            active safety notices.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {alerts.map((alert) => {
            const relevant =
              checkedLocation &&
              relevantIds.includes(
                alert.id
              );

            const style =
              alert.risk_level ===
              "high"
                ? "border-red-200 bg-red-50/80"
                : alert.risk_level ===
                    "medium"
                  ? "border-amber-200 bg-amber-50/80"
                  : "border-blue-200 bg-blue-50/75";

            return (
              <article
                key={alert.id}
                className={`rounded-[24px] border p-6 shadow-sm backdrop-blur-xl ${style}`}
              >
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-white/70 px-3 py-1 text-xs font-bold uppercase text-slate-700">
                    {
                      alert.risk_level
                    }{" "}
                    risk
                  </span>

                  {relevant && (
                    <span className="rounded-full bg-slate-950 px-3 py-1 text-xs font-bold text-white">
                      Relevant to your location
                    </span>
                  )}
                </div>

                <div className="mt-4 flex items-start gap-3">
                  <AlertTriangle
                    className={
                      alert.risk_level ===
                      "high"
                        ? "mt-1 shrink-0 text-red-600"
                        : alert.risk_level ===
                            "medium"
                          ? "mt-1 shrink-0 text-amber-600"
                          : "mt-1 shrink-0 text-blue-600"
                    }
                    size={20}
                  />

                  <div>
                    <h3 className="text-xl font-bold text-slate-950">
                      {alert.title}
                    </h3>

                    <p className="mt-2 leading-relaxed text-slate-700">
                      {alert.message}
                    </p>
                  </div>
                </div>

                {alert.safety_advice && (
                  <div className="mt-5 rounded-xl bg-white/55 p-4">
                    <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                      Safety Advice
                    </p>

                    <p className="mt-2 text-sm leading-relaxed text-slate-700">
                      {
                        alert.safety_advice
                      }
                    </p>
                  </div>
                )}

                {alert.risk_zone && (
                  <p className="mt-4 text-sm font-semibold text-slate-600">
                    Zone:{" "}
                    {
                      alert.risk_zone
                        .name
                    }
                  </p>
                )}
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}