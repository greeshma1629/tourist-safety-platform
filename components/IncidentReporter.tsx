"use client";

import {
  ChangeEvent,
  FormEvent,
  useMemo,
  useState,
} from "react";

import {
  FileText,
  LocateFixed,
  Upload,
} from "lucide-react";

import { useRouter } from "next/navigation";

import { createClient } from "@/lib/supabase/client";

type Incident = {
  id: string;
  incident_type: string;
  title: string;
  description: string;
  occurred_at: string | null;
  status: string;
  priority: string;
  evidence_path: string | null;
  created_at: string;
};

type Props = {
  initialIncidents: Incident[];
};

export default function IncidentReporter({
  initialIncidents,
}: Props) {
  const supabase = useMemo(
    () => createClient(),
    []
  );

  const router = useRouter();

  const [
    incidentType,
    setIncidentType,
  ] =
    useState("other");

  const [title, setTitle] =
    useState("");

  const [
    description,
    setDescription,
  ] = useState("");

  const [
    occurredAt,
    setOccurredAt,
  ] = useState("");

  const [file, setFile] =
    useState<File | null>(null);

  const [
    useLocation,
    setUseLocation,
  ] = useState(false);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  function handleFile(
    event: ChangeEvent<HTMLInputElement>
  ) {
    const selected =
      event.target.files?.[0];

    if (!selected) {
      setFile(null);
      return;
    }

    if (
      selected.size >
      5 * 1024 * 1024
    ) {
      setError(
        "Evidence must be smaller than 5 MB."
      );

      event.target.value = "";
      return;
    }

    const allowed = [
      "image/jpeg",
      "image/png",
      "application/pdf",
    ];

    if (
      !allowed.includes(
        selected.type
      )
    ) {
      setError(
        "Only JPG, PNG and PDF evidence is allowed."
      );

      event.target.value = "";
      return;
    }

    setError("");
    setFile(selected);
  }

  async function submitWithLocation(
    userId: string,
    latitude:
      | number
      | null,
    longitude:
      | number
      | null,
    accuracy:
      | number
      | null
  ) {
    let evidencePath:
      | string
      | null = null;

    if (file) {
      const safeName =
        file.name.replace(
          /[^a-zA-Z0-9._-]/g,
          "_"
        );

      evidencePath =
        `${userId}/${crypto.randomUUID()}-${safeName}`;

      const {
        error: uploadError,
      } =
        await supabase.storage
          .from(
            "incident-evidence"
          )
          .upload(
            evidencePath,
            file
          );

      if (uploadError) {
        throw uploadError;
      }
    }

    const {
      error: insertError,
    } =
      await supabase
        .from("incidents")
        .insert({
          user_id: userId,
          incident_type:
            incidentType,
          title:
            title.trim(),
          description:
            description.trim(),
          occurred_at:
            occurredAt
              ? new Date(
                  occurredAt
                ).toISOString()
              : null,
          latitude,
          longitude,
          accuracy_meters:
            accuracy,
          evidence_path:
            evidencePath,
        });

    if (insertError) {
      if (evidencePath) {
        await supabase.storage
          .from(
            "incident-evidence"
          )
          .remove([
            evidencePath,
          ]);
      }

      throw insertError;
    }
  }

  async function submitIncident(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setLoading(true);
    setError("");

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

    try {
      if (useLocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            try {
              await submitWithLocation(
                user.id,
                position.coords
                  .latitude,
                position.coords
                  .longitude,
                position.coords
                  .accuracy
              );

              clearForm();
            } catch (error: any) {
              setError(
                error.message
              );
              setLoading(false);
            }
          },
          () => {
            setError(
              "Unable to access location."
            );

            setLoading(false);
          }
        );

        return;
      }

      await submitWithLocation(
        user.id,
        null,
        null,
        null
      );

      clearForm();
    } catch (error: any) {
      setError(
        error.message
      );

      setLoading(false);
    }
  }

  function clearForm() {
    setIncidentType(
      "other"
    );
    setTitle("");
    setDescription("");
    setOccurredAt("");
    setFile(null);
    setUseLocation(false);
    setLoading(false);

    router.refresh();
  }

  function formatType(
    value: string
  ) {
    return value
      .replaceAll("_", " ")
      .replace(
        /\b\w/g,
        (letter) =>
          letter.toUpperCase()
      );
  }

  return (
    <div className="grid gap-7 xl:grid-cols-[0.85fr_1.15fr]">
      <section className="glass-panel rounded-[28px] p-6 sm:p-7">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100/70 text-blue-600">
            <FileText size={19} />
          </div>

          <div>
            <h2 className="text-xl font-bold text-slate-950">
              New Incident Report
            </h2>

            <p className="text-sm text-slate-500">
              Provide clear information about the event.
            </p>
          </div>
        </div>

        <form
          onSubmit={
            submitIncident
          }
          className="mt-6 space-y-4"
        >
          <select
            value={incidentType}
            onChange={(event) =>
              setIncidentType(
                event.target.value
              )
            }
            className="glass-input w-full rounded-xl px-4 py-3"
          >
            <option value="lost_property">
              Lost Property
            </option>

            <option value="theft">
              Theft
            </option>

            <option value="suspicious_activity">
              Suspicious Activity
            </option>

            <option value="harassment">
              Harassment
            </option>

            <option value="transport_issue">
              Transport Issue
            </option>

            <option value="scam">
              Scam
            </option>

            <option value="other">
              Other
            </option>
          </select>

          <input
            value={title}
            onChange={(event) =>
              setTitle(
                event.target.value
              )
            }
            required
            placeholder="Incident title"
            className="glass-input w-full rounded-xl px-4 py-3"
          />

          <textarea
            value={description}
            onChange={(event) =>
              setDescription(
                event.target.value
              )
            }
            required
            rows={5}
            placeholder="Describe what happened..."
            className="glass-input w-full resize-none rounded-xl px-4 py-3"
          />

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Approximate incident time
            </label>

            <input
              type="datetime-local"
              value={occurredAt}
              onChange={(event) =>
                setOccurredAt(
                  event.target.value
                )
              }
              className="glass-input w-full rounded-xl px-4 py-3"
            />
          </div>

          <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-white/70 bg-white/35 p-4">
            <input
              type="checkbox"
              checked={useLocation}
              onChange={(event) =>
                setUseLocation(
                  event.target.checked
                )
              }
            />

            <LocateFixed
              size={17}
              className="text-blue-600"
            />

            <span className="text-sm font-semibold text-slate-700">
              Attach my current approximate location
            </span>
          </label>

          <label className="block cursor-pointer rounded-xl border border-dashed border-slate-300/80 bg-white/30 p-5 text-center">
            <Upload className="mx-auto text-slate-500" />

            <p className="mt-2 text-sm font-bold text-slate-700">
              Add Evidence
            </p>

            <p className="mt-1 text-xs text-slate-500">
              JPG, PNG or PDF. Maximum 5 MB.
            </p>

            <input
              type="file"
              accept=".jpg,.jpeg,.png,.pdf"
              onChange={handleFile}
              className="mt-3 text-sm"
            />

            {file && (
              <p className="mt-2 text-xs font-semibold text-blue-600">
                {file.name}
              </p>
            )}
          </label>

          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50/90 p-4 text-sm text-red-700">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-blue-600 px-5 py-3 font-bold text-white shadow-lg shadow-blue-500/20 hover:bg-blue-700 disabled:opacity-50"
          >
            {loading
              ? "Submitting..."
              : "Submit Incident Report"}
          </button>
        </form>
      </section>

      <section>
        <h2 className="mb-5 text-xl font-bold text-slate-950">
          Your Reports
        </h2>

        {initialIncidents.length ===
        0 ? (
          <div className="glass-panel rounded-[28px] p-12 text-center">
            <FileText className="mx-auto text-slate-400" />

            <p className="mt-4 font-bold text-slate-800">
              No incident reports
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {initialIncidents.map(
              (incident) => (
                <article
                  key={incident.id}
                  className="glass-card rounded-[24px] p-6"
                >
                  <div className="flex flex-wrap gap-2">
                    <span className="rounded-full bg-blue-100/70 px-3 py-1 text-xs font-bold text-blue-700">
                      {formatType(
                        incident.incident_type
                      )}
                    </span>

                    <span className="rounded-full bg-white/60 px-3 py-1 text-xs font-bold uppercase text-slate-600">
                      {
                        incident.status
                      }
                    </span>

                    <span
                      className={
                        incident.priority ===
                        "urgent"
                          ? "rounded-full bg-red-100/80 px-3 py-1 text-xs font-bold uppercase text-red-700"
                          : incident.priority ===
                              "high"
                            ? "rounded-full bg-amber-100/80 px-3 py-1 text-xs font-bold uppercase text-amber-700"
                            : "rounded-full bg-slate-100/80 px-3 py-1 text-xs font-bold uppercase text-slate-600"
                      }
                    >
                      {
                        incident.priority
                      }
                    </span>
                  </div>

                  <h3 className="mt-4 text-xl font-bold text-slate-950">
                    {incident.title}
                  </h3>

                  <p className="mt-2 leading-relaxed text-slate-600">
                    {
                      incident.description
                    }
                  </p>

                  <p className="mt-5 text-xs text-slate-400">
                    Submitted{" "}
                    {new Date(
                      incident.created_at
                    ).toLocaleString()}
                  </p>
                </article>
              )
            )}
          </div>
        )}
      </section>
    </div>
  );
}