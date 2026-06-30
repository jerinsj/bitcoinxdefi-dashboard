"use client";

import { useState } from "react";

export default function AdminHealthPasscodeForm() {
  const [passcode, setPasscode] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function submitPasscode(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/admin/cardano-bitcoin-health/access", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ passcode }),
      });

      if (res.ok) {
        window.location.reload();
        return;
      }

      setError("Incorrect passcode.");
    } catch {
      setError("Unable to validate passcode.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-6 py-12 text-slate-950 dark:bg-[#020817] dark:text-white">
      <section className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-[#16263a] dark:bg-[#071220]">
        <p className="text-sm font-bold uppercase tracking-wide text-orange-500">
          Admin Only
        </p>

        <h1 className="mt-2 text-3xl font-bold text-slate-950 dark:text-white">
          Cardano Bitcoin Data Health
        </h1>

        <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
          Enter the admin passcode to view internal source health checks.
        </p>

        <form onSubmit={submitPasscode} className="mt-6 space-y-4">
          <input
            type="password"
            value={passcode}
            onChange={(e) => setPasscode(e.target.value)}
            placeholder="Admin passcode"
            className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-orange-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
          />

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-lg bg-orange-500 px-4 py-3 font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? "Unlocking..." : "Unlock Health Dashboard"}
          </button>

          {error && <p className="text-sm text-red-500">{error}</p>}
        </form>
      </section>
    </main>
  );
}
