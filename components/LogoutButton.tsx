"use client";

import {
  LogOut,
} from "lucide-react";

import { useRouter } from "next/navigation";

import { createClient } from "@/lib/supabase/client";

export default function LogoutButton() {
  const router = useRouter();

  async function logout() {
    const supabase =
      createClient();

    await supabase.auth.signOut();

    router.push("/login");
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={logout}
      className="glass-button inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-700"
    >
      <LogOut size={17} />
      Logout
    </button>
  );
}