"use client";

import {
  FormEvent,
  useState,
} from "react";

import {
  CheckCircle2,
  Save,
  UserRound,
} from "lucide-react";

import { createClient } from "@/lib/supabase/client";

type Profile = {
  full_name: string;
  phone: string;
  date_of_birth: string;
  nationality: string;
};

type Props = {
  initialProfile: Profile;
};

export default function ProfileForm({
  initialProfile,
}: Props) {
  const [form, setForm] =
    useState(initialProfile);

  const [loading, setLoading] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const [errorMessage, setErrorMessage] =
    useState("");

  async function saveProfile(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setLoading(true);
    setMessage("");
    setErrorMessage("");

    const supabase =
      createClient();

    const {
      data: { user },
    } =
      await supabase.auth.getUser();

    if (!user) {
      setErrorMessage(
        "You are not logged in."
      );

      setLoading(false);
      return;
    }

    const { error } =
      await supabase
        .from("profiles")
        .update({
          full_name:
            form.full_name.trim(),
          phone:
            form.phone.trim() || null,
          date_of_birth:
            form.date_of_birth ||
            null,
          nationality:
            form.nationality.trim() ||
            null,
        })
        .eq("id", user.id);

    if (error) {
      setErrorMessage(
        error.message
      );
    } else {
      setMessage(
        "Profile updated successfully."
      );
    }

    setLoading(false);
  }

  return (
    <section className="glass-panel rounded-[28px] p-6 sm:p-8">
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100/70 text-blue-600">
          <UserRound size={21} />
        </div>

        <div>
          <h2 className="text-xl font-bold text-slate-950">
            Personal Information
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Update the information associated with your account.
          </p>
        </div>
      </div>

      <form
        onSubmit={saveProfile}
        className="mt-7 grid gap-5"
      >
        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Full Name
          </label>

          <input
            value={form.full_name}
            onChange={(event) =>
              setForm({
                ...form,
                full_name:
                  event.target.value,
              })
            }
            required
            className="glass-input w-full rounded-xl px-4 py-3 text-slate-900"
          />
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Phone
            </label>

            <input
              value={form.phone}
              onChange={(event) =>
                setForm({
                  ...form,
                  phone:
                    event.target.value,
                })
              }
              className="glass-input w-full rounded-xl px-4 py-3 text-slate-900"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Date of Birth
            </label>

            <input
              type="date"
              value={
                form.date_of_birth
              }
              onChange={(event) =>
                setForm({
                  ...form,
                  date_of_birth:
                    event.target.value,
                })
              }
              className="glass-input w-full rounded-xl px-4 py-3 text-slate-900"
            />
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Nationality
          </label>

          <input
            value={
              form.nationality
            }
            onChange={(event) =>
              setForm({
                ...form,
                nationality:
                  event.target.value,
              })
            }
            className="glass-input w-full rounded-xl px-4 py-3 text-slate-900"
          />
        </div>

        {message && (
          <div className="flex items-center gap-2 rounded-xl border border-green-200/70 bg-green-50/80 p-4 text-sm font-medium text-green-700">
            <CheckCircle2
              size={17}
            />

            {message}
          </div>
        )}

        {errorMessage && (
          <div className="rounded-xl border border-red-200 bg-red-50/90 p-4 text-sm text-red-700">
            {errorMessage}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="mt-1 inline-flex w-fit items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-bold text-white shadow-lg shadow-blue-500/20 transition hover:bg-blue-700 disabled:opacity-50"
        >
          <Save size={17} />

          {loading
            ? "Saving..."
            : "Save Changes"}
        </button>
      </form>
    </section>
  );
}