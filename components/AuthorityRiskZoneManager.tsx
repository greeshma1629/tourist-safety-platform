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
  description: string | null;
  latitude: number;
  longitude: number;
  radius_meters: number;
  risk_level: "low" | "medium" | "high";
  safety_message: string | null;
  active: boolean;
  created_at: string;
};

type Props = {
  initialZones: RiskZone[];
};

export default function AuthorityRiskZoneManager({
  initialZones,
}: Props) {
  const supabase = useMemo(
    () => createClient(),
    []
  );

  const router = useRouter();

  const [name, setName] = useState("");
  const [description, setDescription] =
    useState("");

  const [latitude, setLatitude] =
    useState("");

  const [longitude, setLongitude] =
    useState("");

  const [radius, setRadius] =
    useState("500");

  const [riskLevel, setRiskLevel] =
    useState<"low" | "medium" | "high">(
      "medium"
    );

  const [safetyMessage, setSafetyMessage] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [errorMessage, setErrorMessage] =
    useState("");

  const [successMessage, setSuccessMessage] =
    useState("");

  async function createZone(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setErrorMessage("");
    setSuccessMessage("");

    const lat = Number(latitude);
    const lng = Number(longitude);
    const radiusValue = Number(radius);

    if (!name.trim()) {
      setErrorMessage(
        "Please enter a zone name."
      );
      return;
    }

    if (
      Number.isNaN(lat) ||
      lat < -90 ||
      lat > 90
    ) {
      setErrorMessage(
        "Please enter a valid latitude."
      );
      return;
    }

    if (
      Number.isNaN(lng) ||
      lng < -180 ||
      lng > 180
    ) {
      setErrorMessage(
        "Please enter a valid longitude."
      );
      return;
    }

    if (
      Number.isNaN(radiusValue) ||
      radiusValue <= 0
    ) {
      setErrorMessage(
        "Please enter a valid radius."
      );
      return;
    }

    setLoading(true);

    const { error } = await supabase.rpc(
      "create_risk_zone",
      {
        zone_name: name.trim(),

        zone_description:
          description.trim() || null,

        zone_latitude: lat,

        zone_longitude: lng,

        zone_radius: radiusValue,

        zone_risk_level: riskLevel,

        zone_safety_message:
          safetyMessage.trim() || null,
      }
    );

    if (error) {
      setErrorMessage(error.message);
      setLoading(false);
      return;
    }

    setName("");
    setDescription("");
    setLatitude("");
    setLongitude("");
    setRadius("500");
    setRiskLevel("medium");
    setSafetyMessage("");

    setSuccessMessage(
      "Risk zone created successfully."
    );

    setLoading(false);

    router.refresh();
  }

  async function disableZone(
    zoneId: string
  ) {
    if (
      !window.confirm(
        "Disable this risk zone?"
      )
    ) {
      return;
    }

    const { error } = await supabase.rpc(
      "disable_risk_zone",
      {
        zone_id: zoneId,
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
          Create Risk Zone
        </h3>

        <p className="mt-2 text-sm text-slate-500">
          Define an area that tourists should
          be warned about.
        </p>

        <form
          onSubmit={createZone}
          className="mt-6 space-y-5"
        >

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Zone Name
            </label>

            <input
              value={name}
              onChange={(event) =>
                setName(event.target.value)
              }
              required
              placeholder="Example: Crowded Market Area"
              className="w-full rounded-lg border border-slate-300 px-4 py-3"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Description
            </label>

            <textarea
              value={description}
              onChange={(event) =>
                setDescription(
                  event.target.value
                )
              }
              rows={3}
              placeholder="Describe why this area requires attention."
              className="w-full rounded-lg border border-slate-300 px-4 py-3"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Latitude
              </label>

              <input
                type="number"
                step="any"
                value={latitude}
                onChange={(event) =>
                  setLatitude(
                    event.target.value
                  )
                }
                required
                placeholder="12.9716"
                className="w-full rounded-lg border border-slate-300 px-4 py-3"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Longitude
              </label>

              <input
                type="number"
                step="any"
                value={longitude}
                onChange={(event) =>
                  setLongitude(
                    event.target.value
                  )
                }
                required
                placeholder="77.5946"
                className="w-full rounded-lg border border-slate-300 px-4 py-3"
              />
            </div>

          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Radius (metres)
            </label>

            <input
              type="number"
              min="1"
              value={radius}
              onChange={(event) =>
                setRadius(event.target.value)
              }
              required
              className="w-full rounded-lg border border-slate-300 px-4 py-3"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Risk Level
            </label>

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
                Low
              </option>

              <option value="medium">
                Medium
              </option>

              <option value="high">
                High
              </option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Safety Message
            </label>

            <textarea
              value={safetyMessage}
              onChange={(event) =>
                setSafetyMessage(
                  event.target.value
                )
              }
              rows={3}
              placeholder="Example: Avoid isolated areas and remain aware of your belongings."
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
              ? "Creating..."
              : "Create Risk Zone"}
          </button>

        </form>

      </section>

      <section>

        <div className="mb-5">

          <h3 className="text-xl font-bold text-slate-900">
            Existing Risk Zones
          </h3>

          <p className="mt-1 text-sm text-slate-500">
            {initialZones.length} zone
            {initialZones.length === 1
              ? ""
              : "s"}{" "}
            registered
          </p>

        </div>

        <div className="space-y-4">

          {initialZones.map((zone) => (

            <article
              key={zone.id}
              className="rounded-2xl bg-white p-6 shadow-sm"
            >

              <div className="flex flex-col justify-between gap-4 sm:flex-row">

                <div>

                  <div className="flex flex-wrap gap-2">

                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold uppercase">
                      {zone.risk_level}
                    </span>

                    <span
                      className={
                        zone.active
                          ? "rounded-full bg-green-100 px-3 py-1 text-xs font-bold uppercase text-green-700"
                          : "rounded-full bg-slate-200 px-3 py-1 text-xs font-bold uppercase text-slate-600"
                      }
                    >
                      {zone.active
                        ? "Active"
                        : "Disabled"}
                    </span>

                  </div>

                  <h4 className="mt-3 text-xl font-bold text-slate-900">
                    {zone.name}
                  </h4>

                  {zone.description && (
                    <p className="mt-2 text-sm text-slate-600">
                      {zone.description}
                    </p>
                  )}

                  <p className="mt-4 font-mono text-sm text-slate-500">
                    {zone.latitude.toFixed(6)},{" "}
                    {zone.longitude.toFixed(6)}
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    Radius:{" "}
                    {zone.radius_meters} metres
                  </p>

                </div>

                {zone.active && (
                  <button
                    type="button"
                    onClick={() =>
                      disableZone(zone.id)
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