"use client";

import {
  useEffect,
  useState,
} from "react";

import QRCode from "qrcode";

import {
  Fingerprint,
  ShieldCheck,
} from "lucide-react";

type Props = {
  fullName: string;
  nationality: string;
  publicCode: string;
  status: string;
  issuedAt: string;
};

export default function DigitalIdCard({
  fullName,
  nationality,
  publicCode,
  status,
  issuedAt,
}: Props) {
  const [qrCode, setQrCode] =
    useState("");

  useEffect(() => {
    async function generate() {
      const verificationUrl =
        `${window.location.origin}/verify/${publicCode}`;

      const data =
        await QRCode.toDataURL(
          verificationUrl,
          {
            width: 320,
            margin: 2,
          }
        );

      setQrCode(data);
    }

    generate();
  }, [publicCode]);

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_0.75fr]">
      <section className="relative overflow-hidden rounded-[30px] border border-white/20 bg-gradient-to-br from-slate-950 via-blue-950 to-violet-950 p-7 text-white shadow-2xl shadow-blue-950/15 sm:p-9">
        <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-blue-500/25 blur-3xl" />

        <div className="absolute -bottom-24 left-[30%] h-64 w-64 rounded-full bg-violet-500/20 blur-3xl" />

        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-300">
                SafeJourney ID
              </p>

              <h2 className="mt-2 text-2xl font-bold">
                Digital Tourist ID
              </h2>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 backdrop-blur">
              <Fingerprint
                size={22}
              />
            </div>
          </div>

          <div className="mt-12">
            <p className="text-sm text-slate-400">
              Tourist
            </p>

            <p className="mt-1 text-3xl font-bold">
              {fullName}
            </p>

            <p className="mt-2 text-slate-300">
              {nationality}
            </p>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-xs text-slate-400">
                Tourist Code
              </p>

              <p className="mt-2 font-mono font-bold">
                {publicCode}
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-xs text-slate-400">
                Status
              </p>

              <p className="mt-2 inline-flex items-center gap-2 font-bold capitalize text-green-300">
                <ShieldCheck
                  size={16}
                />
                {status}
              </p>
            </div>
          </div>

          <p className="mt-6 text-xs text-slate-400">
            Issued{" "}
            {new Date(
              issuedAt
            ).toLocaleDateString()}
          </p>
        </div>
      </section>

      <section className="glass-panel flex flex-col items-center justify-center rounded-[30px] p-7 text-center">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-blue-600">
          Verification QR
        </p>

        <h3 className="mt-2 text-xl font-bold text-slate-950">
          Scan to verify
        </h3>

        <div className="mt-6 rounded-[24px] bg-white p-5 shadow-xl shadow-slate-900/5">
          {qrCode ? (
            <img
              src={qrCode}
              alt="Tourist ID verification QR code"
              className="h-56 w-56"
            />
          ) : (
            <div className="flex h-56 w-56 items-center justify-center text-sm text-slate-400">
              Generating QR...
            </div>
          )}
        </div>

        <p className="mt-5 max-w-sm text-sm leading-relaxed text-slate-500">
          This code opens the limited
          public verification page. It
          does not contain your private
          account data.
        </p>
      </section>
    </div>
  );
}