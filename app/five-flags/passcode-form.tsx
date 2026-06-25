"use client";

import { useState } from "react";

export default function PasscodeForm() {
  const [passcode, setPasscode] = useState("");
  const [error, setError] = useState("");

  async function submitPasscode(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const res = await fetch("/api/five-flags/access", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ passcode }),
    });

    if (res.ok) {
      window.location.reload();
    } else {
      setError("Incorrect passcode.");
    }
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6">
      <h1 className="text-3xl font-bold">Five Flags Tool</h1>
      <p className="mt-3 text-slate-600 dark:text-slate-300">
        Enter the passcode to access this tool.
      </p>

      <form onSubmit={submitPasscode} className="mt-6 space-y-4">
        <input
          type="password"
          value={passcode}
          onChange={(e) => setPasscode(e.target.value)}
          placeholder="Passcode"
          className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-950 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
        />

        <button
          type="submit"
          className="w-full rounded-lg bg-slate-950 px-4 py-3 font-semibold text-white dark:bg-white dark:text-slate-950"
        >
          Unlock
        </button>

        {error && <p className="text-sm text-red-500">{error}</p>}
      </form>
    </main>
  );
}
