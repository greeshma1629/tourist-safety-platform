"use client";

import {
  FormEvent,
  useMemo,
  useState,
} from "react";

import { useRouter } from "next/navigation";

import { createClient } from "@/lib/supabase/client";

type RiskZone = {
  id: string;
  name: string;
};

type Alert = {
  id: string;
  title: string;
  message: string;
  risk_level: "low" | "medium" | "high";
  safety_advice: string | null;
  starts_at: string;
  expires_at: string | null;
  active: boolean;
  created_at: string;

  risk_zone:
    | {
        id: string;
        name: string;
      }
    | null;
};

type Props = {
  initialAlerts: Alert[];
  riskZones: RiskZone[];
};

export default function AuthorityAlertManager({
  initialAlerts,
  riskZones,
}: Props) {
  const supabase = useMemo(
    () => createClient(),
    []
  );

  const router = useRouter();

  const [title, setTitle] =
    useState("");

  const [message, setMessage] =
    useState("");

  const [riskLevel, setRiskLevel] =
    useState<"low" | "medium" | "high">(
      "medium"
    );

  const [riskZoneId, setRiskZoneId] =
    useState("");

  const [safetyAdvice, setSafetyAdvice] =
    useState("");

  const [expiresAt, setExpiresAt] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [errorMessage, setErrorMessage] =
    useState("");

  const [successMessage, setSuccessMessage] =
    useState("");

  async function createAlert(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setErrorMessage("");
    setSuccessMessage("");

    if (!title.trim()) {
      setErrorMessage(
        "Please enter an alert title."
      );
      return;
    }

    if (!message.trim()) {
      setErrorMessage(
        "Please enter an alert message."
      );
      return;
    }

    setLoading(true);

    const { error } = await supabase.rpc(
      "create_safety_alert",
      {
        alert_title: title.trim(),

        alert_message: message.trim(),

        alert_risk_level:
          riskLevel,

        alert_risk_zone_id:
          riskZoneId || null,

        alert_safety_advice:
          safetyAdvice.trim() || null,

        alert_expires_at:
          expiresAt
            ? new Date(
                expiresAt
              ).toISOString()
            : null,
      }
    );

    if (error) {
      setErrorMessage(error.message);
      setLoading(false);
      return;
    }

    setTitle("");
    setMessage("");
    setRiskLevel("medium");
    setRiskZoneId("");
    setSafetyAdvice("");
    setExpiresAt("");

    setSuccessMessage(
      "Safety alert published successfully."
    );

    setLoading(false);

    router.refresh();
  }

  async function disableAlert(
    alertId: string
  ) {
    if (
      !window.confirm(
        "Disable this safety alert?"
      )
    ) {
      return;
    }

    const { error } = await supabase.rpc(
      "disable_safety_alert",
      {
        alert_id: alertId,
      }
    );

    if (error) {
      setErrorMessage(error.message);
      return;
    }

    router.refresh();
  }

  return (
    <div className="grid gap-8 xl:grid-cols-[0.8fr_1.2fr]">

      <section className="rounded-2xl bg-white p-7 shadow-sm">

        <h3 className="text-xl font-bold text-slate-900">
          Publish Alert
        </h3>

        <form
          onSubmit={createAlert}
          className="mt-6 space-y-5"
        >

          <input
            value={title}
            onChange={(event) =>
              setTitle(event.target.value)
            }
            required
            placeholder="Alert title"
            className="w-full rounded-lg border border-slate-300 px-4 py-3"
          />

          <textarea
            value={message}
            onChange={(event) =>
              setMessage(
                event.target.value
              )
            }
            required
            rows={4}
            placeholder="Describe the safety warning."
            className="w-full rounded-lg border border-slate-300 px-4 py-3"
          />

          <select
            value={riskLevel}
            onChange={(event) =>
              setRiskLevel(
                event.target.value as
                  | "low"
                  | "medium"
                  | "high"
              )
            }
            className="w-full rounded-lg border border-slate-300 px-4 py-3"
          >
            <option value="low">
              Low Risk
            </option>

            <option value="medium">
              Medium Risk
            </option>

            <option value="high">
              High Risk
            </option>
          </select>

          <select
            value={riskZoneId}
            onChange={(event) =>
              setRiskZoneId(
                event.target.value
              )
            }
            className="w-full rounded-lg border border-slate-300 px-4 py-3"
          >

            <option value="">
              General Alert — No Risk Zone
            </option>

            {riskZones.map((zone) => (
              <option
                key={zone.id}
                value={zone.id}
              >
                {zone.name}
              </option>
            ))}

          </select>

          <textarea
            value={safetyAdvice}
            onChange={(event) =>
              setSafetyAdvice(
                event.target.value
              )
            }
            rows={3}
            placeholder="Safety advice (optional)"
            className="w-full rounded-lg border border-slate-300 px-4 py-3"
          />

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Expiry
            </label>

            <input
              type="datetime-local"
              value={expiresAt}
              onChange={(event) =>
                setExpiresAt(
                  event.target.value
                )
              }
              className="w-full rounded-lg border border-slate-300 px-4 py-3"
            />
          </div>

          {errorMessage && (
            <div className="rounded-lg bg-red-50 p-4 text-sm text-red-700">
              {errorMessage}
            </div>
          )}

          {successMessage && (
            <div className="rounded-lg bg-green-50 p-4 text-sm text-green-700">
              {successMessage}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-blue-600 px-5 py-3 font-bold text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {loading
              ? "Publishing..."
              : "Publish Safety Alert"}
          </button>

        </form>

      </section>

      <section>

        <h3 className="mb-5 text-xl font-bold text-slate-900">
          Existing Alerts
        </h3>

        <div className="space-y-4">

          {initialAlerts.map((alert) => (

            <article
              key={alert.id}
              className="rounded-2xl bg-white p-6 shadow-sm"
            >

              <div className="flex flex-col justify-between gap-4 sm:flex-row">

                <div>

                  <div className="flex flex-wrap gap-2">

                    <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold uppercase text-blue-700">
                      {alert.risk_level}
                    </span>

                    <span
                      className={
                        alert.active
                          ? "rounded-full bg-green-100 px-3 py-1 text-xs font-bold uppercase text-green-700"
                          : "rounded-full bg-slate-200 px-3 py-1 text-xs font-bold uppercase text-slate-600"
                      }
                    >
                      {alert.active
                        ? "Active"
                        : "Disabled"}
                    </span>

                  </div>

                  <h4 className="mt-3 text-xl font-bold text-slate-900">
                    {alert.title}
                  </h4>

                  <p className="mt-2 text-sm leading-relaxed text-slate-600">
                    {alert.message}
                  </p>

                  {alert.risk_zone && (
                    <p className="mt-3 text-sm font-semibold text-blue-600">
                      Zone:{" "}
                      {alert.risk_zone.name}
                    </p>
                  )}

                </div>

                {alert.active && (
                  <button
                    type="button"
                    onClick={() =>
                      disableAlert(alert.id)
                    }
                    className="h-fit rounded-lg border border-red-200 px-4 py-2 text-sm font-bold text-red-600 hover:bg-red-50"
                  >
                    Disable
                  </button>
                )}

              </div>

            </article>

          ))}

        </div>

      </section>

    </div>
  );
}