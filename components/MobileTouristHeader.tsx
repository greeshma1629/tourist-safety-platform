"use client";

import {
  Menu,
  Shield,
  X,
} from "lucide-react";

import Link from "next/link";
import { useState } from "react";

const links = [
  ["Dashboard", "/dashboard"],
  ["Profile", "/profile"],
  ["Digital ID", "/digital-id"],
  ["Safety Map", "/safety-map"],
  ["Alerts", "/alerts"],
  ["Incidents", "/incidents"],
  [
    "Emergency Contacts",
    "/emergency-contacts",
  ],
  ["Resources", "/resources"],
  [
    "Smart Safety AI",
    "/smart-safety",
  ],
];

export default function MobileTouristHeader() {
  const [open, setOpen] =
    useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 px-4 pt-4 lg:hidden">
        <div className="glass-panel flex items-center justify-between rounded-2xl px-4 py-3">
          <Link
            href="/dashboard"
            className="flex items-center gap-2"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-violet-600 text-white">
              <Shield size={18} />
            </div>

            <span className="font-bold text-slate-950">
              SafeJourney
            </span>
          </Link>

          <button
            type="button"
            onClick={() =>
              setOpen(!open)
            }
            className="glass-button rounded-xl p-2.5 text-slate-700"
            aria-label="Open navigation"
          >
            {open ? (
              <X size={20} />
            ) : (
              <Menu size={20} />
            )}
          </button>
        </div>
      </header>

      {open && (
        <div className="fixed inset-x-4 top-[80px] z-50 lg:hidden">
          <div className="glass-panel-strong max-h-[calc(100vh-100px)] overflow-y-auto rounded-[24px] p-4">
            <nav className="grid gap-1">
              {links.map(
                ([name, href]) => (
                  <Link
                    key={href}
                    href={href}
                    onClick={() =>
                      setOpen(false)
                    }
                    className="rounded-xl px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-white/70"
                  >
                    {name}
                  </Link>
                )
              )}

              <Link
                href="/sos"
                onClick={() =>
                  setOpen(false)
                }
                className="mt-2 rounded-xl bg-red-600 px-4 py-3 text-center text-sm font-bold text-white shadow-lg shadow-red-500/20"
              >
                Emergency SOS
              </Link>
            </nav>
          </div>
        </div>
      )}
    </>
  );
}