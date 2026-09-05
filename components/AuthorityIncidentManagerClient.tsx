"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { createClient } from "@/lib/supabase/client";

type TouristProfile = {
  full_name: string | null;
  phone: string | null;
  nationality: string | null;
} | null;

type Incident = {
  id: string;
  incident_type: string;
  title: string;
  description: string;

  occurred_at: string | null;

  latitude: number | null;
  longitude: number | null;
  accuracy_meters: number | null;

  evidence_path: string | null;
  evidence_url: string | null;

  status:
    | "submitted"
    | "reviewing"
    | "resolved"
    | "closed";

  priority:
    | "normal"
    | "high"
    | "urgent";

  created_at: string;
  reviewed_at: string | null;
  resolved_at: string | null;

  profile: TouristProfile;
};

type AuthorityIncidentManagerProps = {
  initialIncidents: Incident[];
};

export default function AuthorityIncidentManagerClient({
  initialIncidents,
}: AuthorityIncidentManagerProps) {
  const supabase = useMemo(() => createClient(), []);
  const router = useRouter();

  const [filter, setFilter] = useState<
    "open" | "submitted" | "reviewing" | "resolved" | "all"
  >("open");

  const [updatingId, setUpdatingId] =
    useState<string | null>(null);

  const [errorMessage, setErrorMessage] =
    useState("");

  function formatIncidentType(value: string) {
    return value
      .replaceAll("_", " ")
      .replace(/\b\w/g, (letter) =>
        letter.toUpperCase()
      );
  }

  async function updateStatus(
    incidentId: string,
    newStatus: "reviewing" | "resolved"
  ) {
    setErrorMessage("");

    const confirmation =
      newStatus === "reviewing"
        ? "Start reviewing this incident?"
        : "Mark this incident as resolved?";

    if (!window.confirm(confirmation)) {
      return;
    }

    setUpdatingId(incidentId);

    const { error } = await supabase.rpc(
      "update_incident_status",
      {
        incident_id: incidentId,
        new_status: newStatus,
      }
    );

    if (error) {
      setErrorMessage(error.message);
      setUpdatingId(null);
      return;
    }

    setUpdatingId(null);
    router.refresh();
  }

  async function updatePriority(
    incidentId: string,
    newPriority: "normal" | "high" | "urgent"
  ) {
    setErrorMessage("");
    setUpdatingId(incidentId);

    const { error } = await supabase.rpc(
      "update_incident_priority",
      {
        incident_id: incidentId,
        new_priority: newPriority,
      }
    );

    if (error) {
      setErrorMessage(error.message);
      setUpdatingId(null);
      return;
    }

    setUpdatingId(null);
    router.refresh();
  }

  const filteredIncidents =
    initialIncidents.filter((incident) => {
      if (filter === "all") {
        return true;
      }

      if (filter === "open") {
        return (
          incident.status === "submitted" ||
          incident.status === "reviewing"
        );
      }

      return incident.status === filter;
    });

  const submittedCount =
    initialIncidents.filter(
      (incident) =>
        incident.status === "submitted"
    ).length;

  const reviewingCount =
    initialIncidents.filter(
      (incident) =>
        incident.status === "reviewing"
    ).length;

  const urgentCount =
    initialIncidents.filter(
      (incident) =>
        incident.priority === "urgent" &&
        incident.status !== "resolved"
    ).length;

  return (
    <div>

      <section className="grid gap-4 sm:grid-cols-3">

        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <p className="text-sm font-semibold text-slate-500">
            Submitted
          </p>

          <p className="mt-2 text-3xl font-bold text-amber-600">
            {submittedCount}
          </p>
        </div>

        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <p className="text-sm font-semibold text-slate-500">
            Under Review
          </p>

          <p className="mt-2 text-3xl font-bold text-blue-600">
            {reviewingCount}
          </p>
        </div>

        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <p className="text-sm font-semibold text-slate-500">
            Urgent Open Reports
          </p>

          <p className="mt-2 text-3xl font-bold text-red-600">
            {urgentCount}
          </p>
        </div>

      </section>

      <section className="mt-6 rounded-2xl bg-white p-5 shadow-sm">

        <div className="flex flex-wrap gap-2">

          <button
            type="button"
            onClick={() => setFilter("open")}
            className={
              filter === "open"
                ? "rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
                : "rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700"
            }
          >
            Open
          </button>

          <button
            type="button"
            onClick={() =>
              setFilter("submitted")
            }
            className={
              filter === "submitted"
                ? "rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
                : "rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700"
            }
          >
            Submitted
          </button>

          <button
            type="button"
            onClick={() =>
              setFilter("reviewing")
            }
            className={
              filter === "reviewing"
                ? "rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
                : "rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700"
            }
          >
            Reviewing
          </button>

          <button
            type="button"
            onClick={() =>
              setFilter("resolved")
            }
            className={
              filter === "resolved"
                ? "rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
                : "rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700"
            }
          >
            Resolved
          </button>

          <button
            type="button"
            onClick={() => setFilter("all")}
            className={
              filter === "all"
                ? "rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
                : "rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700"
            }
          >
            All
          </button>

        </div>

      </section>

      {errorMessage && (
        <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {errorMessage}
        </div>
      )}

      {filteredIncidents.length === 0 ? (

        <section className="mt-6 rounded-2xl bg-white p-12 text-center shadow-sm">
          <h3 className="text-xl font-bold text-slate-800">
            No incident reports
          </h3>

          <p className="mt-2 text-slate-500">
            There are no reports matching this filter.
          </p>
        </section>

      ) : (

        <section className="mt-6 space-y-5">

          {filteredIncidents.map((incident) => {
            const isUpdating =
              updatingId === incident.id;

            return (
              <article
                key={incident.id}
                className="rounded-2xl bg-white p-6 shadow-sm"
              >

                <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-start">

                  <div>

                    <div className="flex flex-wrap items-center gap-2">

                      <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold uppercase text-blue-700">
                        {formatIncidentType(
                          incident.incident_type
                        )}
                      </span>

                      <span
                        className={
                          incident.status === "submitted"
                            ? "rounded-full bg-amber-100 px-3 py-1 text-xs font-bold uppercase text-amber-700"
                            : incident.status === "reviewing"
                              ? "rounded-full bg-blue-100 px-3 py-1 text-xs font-bold uppercase text-blue-700"
                              : "rounded-full bg-green-100 px-3 py-1 text-xs font-bold uppercase text-green-700"
                        }
                      >
                        {incident.status}
                      </span>

                      <span
                        className={
                          incident.priority === "urgent"
                            ? "rounded-full bg-red-100 px-3 py-1 text-xs font-bold uppercase text-red-700"
                            : incident.priority === "high"
                              ? "rounded-full bg-orange-100 px-3 py-1 text-xs font-bold uppercase text-orange-700"
                              : "rounded-full bg-slate-100 px-3 py-1 text-xs font-bold uppercase text-slate-600"
                        }
                      >
                        {incident.priority}
                      </span>

                    </div>

                    <h3 className="mt-4 text-2xl font-bold text-slate-900">
                      {incident.title}
                    </h3>

                    <p className="mt-2 text-sm text-slate-500">
                      Reported by{" "}
                      <span className="font-semibold text-slate-700">
                        {incident.profile?.full_name ||
                          "Tourist"}
                      </span>
                    </p>

                  </div>

                  <div className="flex flex-wrap gap-2">

                    {incident.status ===
                      "submitted" && (
                      <button
                        type="button"
                        disabled={isUpdating}
                        onClick={() =>
                          updateStatus(
                            incident.id,
                            "reviewing"
                          )
                        }
                        className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-bold text-white hover:bg-blue-700 disabled:opacity-50"
                      >
                        Start Review
                      </button>
                    )}

                    {(incident.status ===
                      "submitted" ||
                      incident.status ===
                        "reviewing") && (
                      <button
                        type="button"
                        disabled={isUpdating}
                        onClick={() =>
                          updateStatus(
                            incident.id,
                            "resolved"
                          )
                        }
                        className="rounded-lg bg-green-600 px-4 py-2 text-sm font-bold text-white hover:bg-green-700 disabled:opacity-50"
                      >
                        Resolve
                      </button>
                    )}

                  </div>

                </div>

                <div className="mt-6">

                  <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                    Incident Description
                  </p>

                  <p className="mt-2 leading-relaxed text-slate-700">
                    {incident.description}
                  </p>

                </div>

                <div className="mt-6 grid gap-4 md:grid-cols-2">

                  <div className="rounded-xl bg-slate-50 p-4">

                    <p className="text-xs font-bold uppercase text-slate-400">
                      Tourist
                    </p>

                    <p className="mt-2 font-semibold text-slate-800">
                      {incident.profile?.full_name ||
                        "Not available"}
                    </p>

                    <p className="mt-1 text-sm text-slate-500">
                      {incident.profile?.phone ||
                        "Phone not provided"}
                    </p>

                    {incident.profile?.nationality && (
                      <p className="mt-1 text-sm text-slate-500">
                        {
                          incident.profile
                            .nationality
                        }
                      </p>
                    )}

                  </div>

                  <div className="rounded-xl bg-slate-50 p-4">

                    <p className="text-xs font-bold uppercase text-slate-400">
                      Priority
                    </p>

                    <select
                      value={incident.priority}
                      disabled={
                        isUpdating ||
                        incident.status === "resolved"
                      }
                      onChange={(event) =>
                        updatePriority(
                          incident.id,
                          event.target.value as
                            | "normal"
                            | "high"
                            | "urgent"
                        )
                      }
                      className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-800"
                    >
                      <option value="normal">
                        Normal
                      </option>

                      <option value="high">
                        High
                      </option>

                      <option value="urgent">
                        Urgent
                      </option>
                    </select>

                  </div>

                </div>

                {incident.occurred_at && (
                  <div className="mt-4 rounded-xl bg-slate-50 p-4">

                    <p className="text-xs font-bold uppercase text-slate-400">
                      Incident Time
                    </p>

                    <p className="mt-2 text-sm font-semibold text-slate-700">
                      {new Date(
                        incident.occurred_at
                      ).toLocaleString()}
                    </p>

                  </div>
                )}

                {incident.latitude !== null &&
                  incident.longitude !== null && (

                    <div className="mt-4 rounded-xl bg-slate-950 p-5 text-white">

                      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

                        <div>

                          <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                            Incident Location
                          </p>

                          <p className="mt-2 font-mono text-sm">
                            {incident.latitude.toFixed(
                              6
                            )}
                            ,{" "}
                            {incident.longitude.toFixed(
                              6
                            )}
                          </p>

                          {incident.accuracy_meters !==
                            null && (
                            <p className="mt-1 text-xs text-slate-400">
                              Approx. accuracy:{" "}
                              {Math.round(
                                incident.accuracy_meters
                              )}{" "}
                              metres
                            </p>
                          )}

                        </div>

                        <a
                          href={`https://www.openstreetmap.org/?mlat=${incident.latitude}&mlon=${incident.longitude}#map=17/${incident.latitude}/${incident.longitude}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex rounded-lg bg-white px-4 py-2 text-sm font-bold text-slate-900"
                        >
                          Open Location
                        </a>

                      </div>

                    </div>
                  )}

                {incident.evidence_path && (

                  <div className="mt-4 rounded-xl border border-slate-200 p-5">

                    <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                      Evidence
                    </p>

                    {incident.evidence_url ? (
                      <a
                        href={incident.evidence_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-3 inline-flex rounded-lg bg-slate-900 px-4 py-2 text-sm font-bold text-white"
                      >
                        View Evidence
                      </a>
                    ) : (
                      <p className="mt-2 text-sm text-slate-500">
                        Evidence exists but could not be loaded.
                      </p>
                    )}

                  </div>
                )}

                <div className="mt-5 border-t pt-4">

                  <p className="text-xs text-slate-400">
                    Report submitted{" "}
                    {new Date(
                      incident.created_at
                    ).toLocaleString()}
                  </p>

                </div>

              </article>
            );
          })}

        </section>
      )}

    </div>
  );
}