"use client";

import {
  FormEvent,
  useState,
} from "react";

import Link from "next/link";

import {
  Bot,
  Sparkles,
} from "lucide-react";

type Analysis = {
  risk_level:
    | "low"
    | "medium"
    | "high";
  category: string;
  summary: string;
  guidance: string[];
  suggest_sos: boolean;
};

export default function SmartSafetyAssistant() {
  const [
    situation,
    setSituation,
  ] = useState("");

  const [
    analysis,
    setAnalysis,
  ] =
    useState<Analysis | null>(
      null
    );

  const [loading, setLoading] =
    useState(false);

  const [
    errorMessage,
    setErrorMessage,
  ] = useState("");

  async function analyze(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setErrorMessage("");
    setAnalysis(null);

    if (
      situation.trim().length <
      10
    ) {
      setErrorMessage(
        "Please provide a little more information."
      );

      return;
    }

    setLoading(true);

    try {
      const response =
        await fetch(
          "/api/ai-safety",
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
            },
            body:
              JSON.stringify({
                situation:
                  situation.trim(),
              }),
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        setErrorMessage(
          data.error ||
            "Unable to analyze the situation."
        );
      } else {
        setAnalysis(
          data.analysis
        );
      }
    } catch {
      setErrorMessage(
        "Smart Safety is temporarily unavailable."
      );
    }

    setLoading(false);
  }

  function format(
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
    <div className="grid gap-6 lg:grid-cols-[1fr_0.95fr]">
      <section className="glass-panel rounded-[30px] p-7">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-blue-600 text-white shadow-lg shadow-violet-500/20">
            <Bot size={21} />
          </div>

          <div>
            <h2 className="text-xl font-bold text-slate-950">
              Describe Your Situation
            </h2>

            <p className="text-sm text-slate-500">
              Avoid unnecessary private information.
            </p>
          </div>
        </div>

        <form
          onSubmit={analyze}
          className="mt-6"
        >
          <textarea
            value={situation}
            onChange={(event) =>
              setSituation(
                event.target.value
              )
            }
            maxLength={1500}
            rows={9}
            placeholder="Describe a travel safety situation..."
            className="glass-input w-full resize-none rounded-2xl px-4 py-4"
          />

          <p className="mt-2 text-right text-xs text-slate-400">
            {situation.length}
            /1500
          </p>

          {errorMessage && (
            <div className="mt-5 rounded-xl border border-red-200 bg-red-50/90 p-4 text-sm text-red-700">
              {errorMessage}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 px-5 py-3 font-bold text-white shadow-lg shadow-violet-500/20 transition hover:opacity-95 disabled:opacity-50"
          >
            <Sparkles
              size={18}
            />

            {loading
              ? "Analyzing..."
              : "Analyze Safety Situation"}
          </button>
        </form>
      </section>

      {!analysis ? (
        <section className="glass-panel flex min-h-[450px] items-center justify-center rounded-[30px] p-8 text-center">
          <div>
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-100/70 text-violet-600">
              <Sparkles
                size={25}
              />
            </div>

            <p className="mt-5 text-xl font-bold text-slate-950">
              Smart analysis will
              appear here
            </p>

            <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-slate-500">
              AI guidance supports
              safety decisions but does
              not replace official
              emergency services.
            </p>
          </div>
        </section>
      ) : (
        <section
          className={
            analysis.risk_level ===
            "high"
              ? "rounded-[30px] border border-red-200 bg-red-50/75 p-7 shadow-lg backdrop-blur-xl"
              : analysis.risk_level ===
                  "medium"
                ? "rounded-[30px] border border-amber-200 bg-amber-50/75 p-7 shadow-lg backdrop-blur-xl"
                : "rounded-[30px] border border-green-200 bg-green-50/75 p-7 shadow-lg backdrop-blur-xl"
          }
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span
              className={
                analysis.risk_level ===
                "high"
                  ? "rounded-full bg-red-600 px-4 py-2 text-xs font-bold uppercase text-white"
                  : analysis.risk_level ===
                      "medium"
                    ? "rounded-full bg-amber-500 px-4 py-2 text-xs font-bold uppercase text-white"
                    : "rounded-full bg-green-600 px-4 py-2 text-xs font-bold uppercase text-white"
              }
            >
              {
                analysis.risk_level
              }{" "}
              Risk
            </span>

            <span className="text-sm font-semibold text-slate-600">
              {format(
                analysis.category
              )}
            </span>
          </div>

          <h3 className="mt-6 text-2xl font-bold text-slate-950">
            Safety Assessment
          </h3>

          <p className="mt-3 leading-relaxed text-slate-700">
            {analysis.summary}
          </p>

          <p className="mt-7 font-bold text-slate-900">
            Recommended next steps
          </p>

          <div className="mt-4 space-y-3">
            {analysis.guidance.map(
              (item, index) => (
                <div
                  key={index}
                  className="rounded-xl bg-white/65 p-4"
                >
                  <div className="flex gap-3">
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-950 text-xs font-bold text-white">
                      {index + 1}
                    </div>

                    <p className="text-sm leading-relaxed text-slate-700">
                      {item}
                    </p>
                  </div>
                </div>
              )
            )}
          </div>

          {analysis.suggest_sos && (
            <div className="mt-7 rounded-2xl border border-red-200 bg-white/70 p-5">
              <p className="font-bold text-red-700">
                Emergency assistance may be appropriate
              </p>

              <p className="mt-2 text-sm text-slate-600">
                If you believe you
                are in immediate danger,
                use official local
                emergency services.
              </p>

              <Link
                href="/sos"
                className="mt-4 inline-flex rounded-xl bg-red-600 px-5 py-3 text-sm font-bold text-white hover:bg-red-700"
              >
                Open Emergency SOS
              </Link>
            </div>
          )}

          <p className="mt-6 border-t border-slate-300/50 pt-4 text-xs leading-relaxed text-slate-500">
            AI-generated guidance can
            be incomplete or incorrect.
          </p>
        </section>
      )}
    </div>
  );
}