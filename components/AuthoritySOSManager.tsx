"use client";

import {
  useMemo,
  useState,
} from "react";

import { useRouter } from "next/navigation";

import { createClient } from "@/lib/supabase/client";

type TouristProfile = {
  full_name: string | null;
  phone: string | null;
  nationality: string | null;
} | null;

type SOSRequest = {
  id: string;

  latitude: number;
  longitude: number;

  accuracy_meters: number | null;

  message: string | null;

  status:
    | "pending"
    | "acknowledged"
    | "resolved"
    | "cancelled";

  created_at: string;

  acknowledged_at: string | null;
  resolved_at: string | null;

  profile: TouristProfile;
};

type AuthoritySOSManagerProps = {
  initialRequests: SOSRequest[];
};

export default function AuthoritySOSManager({
  initialRequests,
}: AuthoritySOSManagerProps) {
  const supabase = useMemo(
    () => createClient(),
    []
  );

  const router = useRouter();

  const [updatingId, setUpdatingId] =
    useState<string | null>(null);

  const [errorMessage, setErrorMessage] =
    useState("");

  const [filter, setFilter] =
    useState("active");

  async function updateStatus(
    requestId: string,
    newStatus:
      | "acknowledged"
      | "resolved"
  ) {
    setErrorMessage("");

    const confirmationMessage =
      newStatus === "acknowledged"
        ? "Acknowledge this SOS request?"
        : "Mark this SOS request as resolved?";

    const confirmed =
      window.confirm(
        confirmationMessage
      );

    if (!confirmed) {
      return;
    }

    setUpdatingId(requestId);

    const { error } =
      await supabase.rpc(
        "update_sos_status",
        {
          request_id: requestId,
          new_status: newStatus,
        }
      );

    if (error) {
      setErrorMessage(
        error.message
      );

      setUpdatingId(null);
      return;
    }

    setUpdatingId(null);

    router.refresh();
  }

  const requests =
    initialRequests.filter(
      (request) => {
        if (filter === "all") {
          return true;
        }

        if (filter === "active") {
          return (
            request.status ===
              "pending" ||
            request.status ===
              "acknowledged"
          );
        }

        return (
          request.status === filter
        );
      }
    );

  const activeCount =
    initialRequests.filter(
      (request) =>
        request.status === "pending" ||
        request.status ===
          "acknowledged"
    ).length;

  return (
    <div>

      <section className="mb-8 grid gap-4 sm:grid-cols-3">

        <div className="rounded-2xl bg-white p-5 shadow-sm">

          <p className="text-sm font-semibold text-slate-500">
            Active Requests
          </p>

          <p className="mt-2 text-3xl font-bold text-red-600">
            {activeCount}
          </p>

        </div>

        <div className="rounded-2xl bg-white p-5 shadow-sm">

          <p className="text-sm font-semibold text-slate-500">
            Pending
          </p>

          <p className="mt-2 text-3xl font-bold text-amber-600">
            {
              initialRequests.filter(
                (request) =>
                  request.status ===
                  "pending"
              ).length
            }
          </p>

        </div>

        <div className="rounded-2xl bg-white p-5 shadow-sm">

          <p className="text-sm font-semibold text-slate-500">
            Acknowledged
          </p>

          <p className="mt-2 text-3xl font-bold text-blue-600">
            {
              initialRequests.filter(
                (request) =>
                  request.status ===
                  "acknowledged"
              ).length
            }
          </p>

        </div>

      </section>

      <section className="mb-6 rounded-2xl bg-white p-5 shadow-sm">

        <div className="flex flex-wrap gap-2">

          {[
            ["active", "Active"],
            ["pending", "Pending"],
            [
              "acknowledged",
              "Acknowledged",
            ],
            ["resolved", "Resolved"],
            ["all", "All"],
          ].map(
            ([value, label]) => (

              <button
                key={value}
                type="button"
                onClick={() =>
                  setFilter(value)
                }
                className={
                  filter === value
                    ? "rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
                    : "rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
                }
              >
                {label}
              </button>

            )
          )}

        </div>

      </section>

      {errorMessage && (

        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {errorMessage}
        </div>

      )}

      {requests.length === 0 ? (

        <section className="rounded-2xl bg-white p-12 text-center shadow-sm">

          <h3 className="text-xl font-bold text-slate-800">
            No SOS requests
          </h3>

          <p className="mt-2 text-slate-500">
            There are no requests matching
            the selected filter.
          </p>

        </section>

      ) : (

        <div className="space-y-5">

          {requests.map(
            (request) => {

              const isUpdating =
                updatingId === request.id;

              const createdDate =
                new Date(
                  request.created_at
                ).toLocaleString();

              return (

                <article
                  key={request.id}
                  className={
                    request.status ===
                    "pending"
                      ? "rounded-2xl border border-red-200 bg-white p-6 shadow-sm"
                      : request.status ===
                          "acknowledged"
                        ? "rounded-2xl border border-blue-200 bg-white p-6 shadow-sm"
                        : "rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
                  }
                >

                  <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-start">

                    <div>

                      <div className="flex flex-wrap items-center gap-3">

                        <span
                          className={
                            request.status ===
                            "pending"
                              ? "rounded-full bg-red-100 px-3 py-1 text-xs font-bold uppercase text-red-700"
                              : request.status ===
                                  "acknowledged"
                                ? "rounded-full bg-blue-100 px-3 py-1 text-xs font-bold uppercase text-blue-700"
                                : "rounded-full bg-slate-100 px-3 py-1 text-xs font-bold uppercase text-slate-700"
                          }
                        >
                          {request.status}
                        </span>

                        <span className="text-xs text-slate-400">
                          {createdDate}
                        </span>

                      </div>

                      <h3 className="mt-4 text-2xl font-bold text-slate-900">
                        {request.profile
                          ?.full_name ||
                          "Tourist"}
                      </h3>

                      {request.profile
                        ?.nationality && (

                        <p className="mt-1 text-sm text-slate-500">
                          {
                            request.profile
                              .nationality
                          }
                        </p>

                      )}

                    </div>

                    <div className="flex flex-wrap gap-2">

                      {request.status ===
                        "pending" && (

                        <button
                          type="button"
                          disabled={
                            isUpdating
                          }
                          onClick={() =>
                            updateStatus(
                              request.id,
                              "acknowledged"
                            )
                          }
                          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-blue-700 disabled:opacity-50"
                        >
                          {isUpdating
                            ? "Updating..."
                            : "Acknowledge"}
                        </button>

                      )}

                      {(request.status ===
                        "pending" ||
                        request.status ===
                          "acknowledged") && (

                        <button
                          type="button"
                          disabled={
                            isUpdating
                          }
                          onClick={() =>
                            updateStatus(
                              request.id,
                              "resolved"
                            )
                          }
                          className="rounded-lg bg-green-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-green-700 disabled:opacity-50"
                        >
                          Resolve
                        </button>

                      )}

                    </div>

                  </div>

                  <div className="mt-6 grid gap-4 md:grid-cols-2">

                    <div className="rounded-xl bg-slate-50 p-4">

                      <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                        Emergency Message
                      </p>

                      <p className="mt-2 text-sm leading-relaxed text-slate-700">
                        {request.message ||
                          "No message was provided."}
                      </p>

                    </div>

                    <div className="rounded-xl bg-slate-50 p-4">

                      <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                        Tourist Contact
                      </p>

                      <p className="mt-2 text-sm font-semibold text-slate-700">
                        {request.profile
                          ?.phone ||
                          "Phone not provided"}
                      </p>

                    </div>

                  </div>

                  <div className="mt-4 rounded-xl bg-slate-950 p-5 text-white">

                    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

                      <div>

                        <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                          Emergency Location
                        </p>

                        <p className="mt-2 font-mono text-sm">
                          {request.latitude.toFixed(
                            6
                          )}
                          ,{" "}
                          {request.longitude.toFixed(
                            6
                          )}
                        </p>

                        {request.accuracy_meters && (

                          <p className="mt-1 text-xs text-slate-400">
                            Approx. accuracy:{" "}
                            {Math.round(
                              request.accuracy_meters
                            )}{" "}
                            metres
                          </p>

                        )}

                      </div>

                      <a
                        href={`https://www.openstreetmap.org/?mlat=${request.latitude}&mlon=${request.longitude}#map=17/${request.latitude}/${request.longitude}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex rounded-lg bg-white px-4 py-2 text-sm font-bold text-slate-900"
                      >
                        Open Location
                      </a>

                    </div>

                  </div>

                </article>

              );
            }
          )}

        </div>

      )}

    </div>
  );
}