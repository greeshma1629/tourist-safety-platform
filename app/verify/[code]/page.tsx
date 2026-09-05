import Link from "next/link";

import { createClient } from "@/lib/supabase/server";

type VerifyPageProps = {
  params: Promise<{
    code: string;
  }>;
};

export default async function VerifyPage({
  params,
}: VerifyPageProps) {
  const { code } = await params;

  const supabase = await createClient();

  const { data, error } = await supabase.rpc(
    "verify_tourist_id",
    {
      code_to_verify: code,
    }
  );

  const touristId =
    !error && data && data.length > 0
      ? data[0]
      : null;

  if (!touristId) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 px-6">

        <div className="w-full max-w-lg rounded-3xl bg-white p-10 text-center shadow-sm">

          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-50 text-2xl">
            ✕
          </div>

          <h1 className="mt-6 text-3xl font-bold text-slate-900">
            Tourist ID Not Found
          </h1>

          <p className="mt-3 text-slate-600">
            This Tourist Safety Platform ID could not
            be verified.
          </p>

          <p className="mt-6 font-mono text-sm text-slate-500">
            {code}
          </p>

          <Link
            href="/"
            className="mt-8 inline-flex rounded-lg bg-slate-900 px-5 py-3 font-semibold text-white"
          >
            Return Home
          </Link>

        </div>

      </main>
    );
  }

  const isActive =
    touristId.status === "active";

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-6">

      <div className="w-full max-w-lg overflow-hidden rounded-3xl bg-white shadow-lg">

        <div
          className={
            isActive
              ? "bg-green-600 px-8 py-7 text-white"
              : "bg-red-600 px-8 py-7 text-white"
          }
        >

          <p className="text-sm font-semibold tracking-wider">
            TOURIST SAFETY PLATFORM
          </p>

          <h1 className="mt-2 text-3xl font-bold">
            {isActive
              ? "Verified Tourist ID"
              : "Tourist ID Not Active"}
          </h1>

        </div>

        <div className="p-8">

          <div className="space-y-6">

            <div>
              <p className="text-sm text-slate-500">
                Tourist
              </p>

              <p className="mt-1 text-xl font-bold text-slate-900">
                {touristId.full_name}
              </p>
            </div>

            <div>
              <p className="text-sm text-slate-500">
                Nationality
              </p>

              <p className="mt-1 font-semibold text-slate-800">
                {touristId.nationality ||
                  "Not provided"}
              </p>
            </div>

            <div>
              <p className="text-sm text-slate-500">
                Tourist ID
              </p>

              <p className="mt-1 font-mono font-bold text-blue-600">
                {touristId.public_code}
              </p>
            </div>

            <div>
              <p className="text-sm text-slate-500">
                Status
              </p>

              <p
                className={
                  isActive
                    ? "mt-1 font-bold text-green-600"
                    : "mt-1 font-bold text-red-600"
                }
              >
                {touristId.status.toUpperCase()}
              </p>
            </div>

          </div>

          <div className="mt-8 rounded-xl bg-slate-50 p-4">

            <p className="text-sm leading-relaxed text-slate-600">
              Verification displays only limited
              identity information. Personal safety,
              contact and emergency information is not
              publicly displayed.
            </p>

          </div>

        </div>

      </div>

    </main>
  );
}