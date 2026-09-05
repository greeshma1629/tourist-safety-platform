"use client";

import {
  FormEvent,
  useState,
} from "react";

import Link from "next/link";

import {
  ArrowRight,
  Shield,
} from "lucide-react";

import {
  useRouter,
} from "next/navigation";

import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  async function login(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setLoading(true);
    setError("");

    const supabase =
      createClient();

    const { error } =
      await supabase.auth
        .signInWithPassword({
          email,
          password,
        });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    router.push(
      "/dashboard"
    );

    router.refresh();
  }

  return (
    <main className="tourist-background flex min-h-screen items-center justify-center px-5 py-10">
      <div className="w-full max-w-md">
        <Link
          href="/"
          className="mb-7 flex items-center justify-center gap-3"
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-violet-600 text-white shadow-lg shadow-blue-500/20">
            <Shield size={21} />
          </div>

          <div>
            <p className="font-bold text-slate-950">
              SafeJourney
            </p>

            <p className="text-xs text-slate-500">
              Tourist Safety Platform
            </p>
          </div>
        </Link>

        <section className="glass-panel-strong rounded-[30px] p-7 sm:p-8">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-blue-600">
            Welcome Back
          </p>

          <h1 className="mt-2 text-3xl font-bold text-slate-950">
            Sign in
          </h1>

          <p className="mt-2 text-sm leading-relaxed text-slate-500">
            Access your safety dashboard and travel tools.
          </p>

          <form
            onSubmit={login}
            className="mt-7 space-y-4"
          >
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Email
              </label>

              <input
                type="email"
                value={email}
                onChange={(event) =>
                  setEmail(
                    event.target.value
                  )
                }
                required
                className="glass-input w-full rounded-xl px-4 py-3"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Password
              </label>

              <input
                type="password"
                value={password}
                onChange={(event) =>
                  setPassword(
                    event.target.value
                  )
                }
                required
                className="glass-input w-full rounded-xl px-4 py-3"
              />
            </div>

            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50/90 p-4 text-sm text-red-700">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-bold text-white shadow-lg shadow-blue-500/20 hover:bg-blue-700 disabled:opacity-50"
            >
              {loading
                ? "Signing in..."
                : "Sign In"}

              {!loading && (
                <ArrowRight
                  size={17}
                />
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="font-bold text-blue-600"
            >
              Create one
            </Link>
          </p>
        </section>
      </div>
    </main>
  );
}