import type { Metadata } from "next";
import { DashboardHero } from "@/components/cardano-bitcoin-v2/DashboardHero";

export const metadata: Metadata = {
  title: "Cardano Bitcoin DeFi Dashboard V2 | BitcoinXDeFi",
  description:
    "Development preview of the Cardano Bitcoin DeFi Dashboard by BitcoinXDeFi.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function CardanoBitcoinV2Page() {
  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10 text-slate-950 dark:bg-slate-950 dark:text-white">
      <div className="mx-auto max-w-7xl space-y-8">
        <DashboardHero />

        <section className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <p className="text-sm font-semibold uppercase tracking-wide text-orange-500">
            Phase 1 Complete
          </p>

          <h2 className="mt-3 text-2xl font-bold">
            Dashboard shell and hero are ready.
          </h2>

          <p className="mt-3 text-slate-600 dark:text-slate-300">
            Next step: add the professional liquidity chart while keeping the
            current production page untouched.
          </p>
        </section>
      </div>
    </main>
  );
}
