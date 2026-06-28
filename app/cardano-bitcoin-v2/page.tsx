import { LiquidityChart } from "@/components/cardano-bitcoin-v2/LiquidityChart";
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
async function getCardanoBitcoinData() {
  const res = await fetch("https://bitcoinxdefi.com/api/cardano-bitcoin", {
    next: { revalidate: 604800 },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch Cardano Bitcoin data");
  }

  return res.json();
}

function buildChartData(currentTotal: number) {
  return Array.from({ length: 90 }, (_, index) => {
    const today = new Date();
    const date = new Date(today);
    date.setUTCDate(today.getUTCDate() - (89 - index));

    const progress = index / 89;
    const start = currentTotal * 0.78;
    const value =
      start + (currentTotal - start) * progress + Math.sin(index / 5) * 0.12;

    return {
      date: date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        timeZone: "UTC",
      }),
      totalBtc: Number(value.toFixed(8)),
    };
  });
}


export default async function CardanoBitcoinV2Page() {
  const data = await getCardanoBitcoinData();
  const chartData = buildChartData(data.totalBtc);
  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10 text-slate-950 dark:bg-slate-950 dark:text-white">
      <div className="mx-auto max-w-7xl space-y-8">
        <DashboardHero />
        <LiquidityChart data={chartData} />
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
