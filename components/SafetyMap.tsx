"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  Circle,
  CircleMarker,
  MapContainer,
  Popup,
  TileLayer,
  useMap,
} from "react-leaflet";

import {
  LocateFixed,
  MapPin,
  ShieldCheck,
} from "lucide-react";

type RiskZone = {
  id: string;
  name: string;
  description: string | null;
  latitude: number;
  longitude: number;
  radius_meters: number;
  risk_level:
    | "low"
    | "medium"
    | "high";
  safety_message: string | null;
};

type Props = {
  riskZones: RiskZone[];
};

type UserLocation = {
  latitude: number;
  longitude: number;
  accuracy: number;
};

function distanceMeters(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
) {
  const radius =
    6371000;

  const toRadians = (
    value: number
  ) =>
    (value * Math.PI) / 180;

  const deltaLat =
    toRadians(lat2 - lat1);

  const deltaLon =
    toRadians(lon2 - lon1);

  const a =
    Math.sin(deltaLat / 2) ** 2 +
    Math.cos(
      toRadians(lat1)
    ) *
      Math.cos(
        toRadians(lat2)
      ) *
      Math.sin(deltaLon / 2) **
        2;

  const c =
    2 *
    Math.atan2(
      Math.sqrt(a),
      Math.sqrt(1 - a)
    );

  return radius * c;
}

function Recenter({
  location,
}: {
  location: UserLocation | null;
}) {
  const map = useMap();

  useEffect(() => {
    if (location) {
      map.setView(
        [
          location.latitude,
          location.longitude,
        ],
        15
      );
    }
  }, [location, map]);

  return null;
}

export default function SafetyMap({
  riskZones,
}: Props) {
  const [
    location,
    setLocation,
  ] =
    useState<UserLocation | null>(
      null
    );

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [nearbyZones, setNearbyZones] =
    useState<RiskZone[]>([]);

  function checkLocation() {
    setLoading(true);
    setError("");

    if (
      !navigator.geolocation
    ) {
      setError(
        "Location is not supported by this browser."
      );

      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const nextLocation = {
          latitude:
            position.coords
              .latitude,
          longitude:
            position.coords
              .longitude,
          accuracy:
            position.coords
              .accuracy,
        };

        setLocation(
          nextLocation
        );

        const nearby =
          riskZones.filter(
            (zone) => {
              const distance =
                distanceMeters(
                  nextLocation.latitude,
                  nextLocation.longitude,
                  zone.latitude,
                  zone.longitude
                );

              return (
                distance <=
                zone.radius_meters
              );
            }
          );

        setNearbyZones(nearby);
        setLoading(false);
      },
      () => {
        setError(
          "Unable to access your location. Please check browser permissions."
        );

        setLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
      }
    );
  }

  const highestRisk =
    nearbyZones.some(
      (zone) =>
        zone.risk_level ===
        "high"
    )
      ? "high"
      : nearbyZones.some(
            (zone) =>
              zone.risk_level ===
              "medium"
          )
        ? "medium"
        : nearbyZones.some(
              (zone) =>
                zone.risk_level ===
                "low"
            )
          ? "low"
          : "safe";

  return (
    <div className="space-y-6">
      <section className="glass-panel rounded-[28px] p-6">
        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">
          <div>
            <p className="text-sm font-bold text-slate-950">
              Current Safety Status
            </p>

            <div className="mt-3 flex items-center gap-3">
              <div
                className={
                  highestRisk === "high"
                    ? "h-3 w-3 rounded-full bg-red-500"
                    : highestRisk === "medium"
                      ? "h-3 w-3 rounded-full bg-amber-500"
                      : highestRisk === "low"
                        ? "h-3 w-3 rounded-full bg-blue-500"
                        : "h-3 w-3 rounded-full bg-green-500"
                }
              />

              <p className="text-2xl font-bold capitalize text-slate-950">
                {location
                  ? highestRisk
                  : "Not checked"}
              </p>
            </div>

            <p className="mt-2 text-sm text-slate-500">
              {location
                ? nearbyZones.length ===
                  0
                  ? "You are not currently inside a registered risk zone."
                  : `You are inside ${nearbyZones.length} registered risk zone(s).`
                : "Check your location to evaluate nearby zones."}
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
              size={18}
            />

            {loading
              ? "Locating..."
              : "Check My Location"}
          </button>
        </div>

        {error && (
          <div className="mt-5 rounded-xl border border-red-200 bg-red-50/90 p-4 text-sm text-red-700">
            {error}
          </div>
        )}
      </section>

      <section className="glass-panel overflow-hidden rounded-[28px] p-2">
        <div className="h-[520px] overflow-hidden rounded-[22px]">
          <MapContainer
            center={[20, 0]}
            zoom={2}
            scrollWheelZoom
            className="h-full w-full"
          >
            <TileLayer
              attribution="&copy; OpenStreetMap contributors"
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <Recenter
              location={location}
            />

            {location && (
              <CircleMarker
                center={[
                  location.latitude,
                  location.longitude,
                ]}
                radius={9}
                pathOptions={{
                  color: "#ffffff",
                  fillColor:
                    "#2563eb",
                  fillOpacity: 1,
                  weight: 4,
                }}
              >
                <Popup>
                  Your current
                  approximate location
                </Popup>
              </CircleMarker>
            )}

            {riskZones.map(
              (zone) => (
                <Circle
                  key={zone.id}
                  center={[
                    zone.latitude,
                    zone.longitude,
                  ]}
                  radius={
                    zone.radius_meters
                  }
                  pathOptions={{
                    color:
                      zone.risk_level ===
                      "high"
                        ? "#dc2626"
                        : zone.risk_level ===
                            "medium"
                          ? "#d97706"
                          : "#2563eb",
                    fillOpacity: 0.15,
                  }}
                >
                  <Popup>
                    <strong>
                      {zone.name}
                    </strong>

                    <br />

                    Risk:{" "}
                    {zone.risk_level}

                    {zone.safety_message && (
                      <>
                        <br />
                        {
                          zone.safety_message
                        }
                      </>
                    )}
                  </Popup>
                </Circle>
              )
            )}
          </MapContainer>
        </div>
      </section>

      {nearbyZones.length > 0 && (
        <section className="grid gap-4 md:grid-cols-2">
          {nearbyZones.map(
            (zone) => (
              <article
                key={zone.id}
                className="glass-card rounded-[22px] p-5"
              >
                <div className="flex items-center gap-3">
                  <MapPin
                    className="text-red-500"
                    size={19}
                  />

                  <div>
                    <p className="font-bold text-slate-950">
                      {zone.name}
                    </p>

                    <p className="text-xs font-semibold uppercase text-slate-400">
                      {
                        zone.risk_level
                      }{" "}
                      risk
                    </p>
                  </div>
                </div>

                {zone.safety_message && (
                  <p className="mt-4 text-sm leading-relaxed text-slate-600">
                    {
                      zone.safety_message
                    }
                  </p>
                )}
              </article>
            )
          )}
        </section>
      )}

      {location &&
        nearbyZones.length ===
          0 && (
          <div className="glass-card rounded-[22px] p-5">
            <div className="flex items-center gap-3">
              <ShieldCheck className="text-green-600" />

              <p className="font-semibold text-slate-700">
                No registered risk
                zone currently contains
                your location.
              </p>
            </div>
          </div>
        )}
    </div>
  );
}