import { BitcoinAssetsTable } from "@/components/cardano-bitcoin-v2/BitcoinAssetsTable";
import { KpiCards } from "@/components/cardano-bitcoin-v2/KpiCards";
import type { Metadata } from "next";
import { DashboardHero } from "@/components/cardano-bitcoin-v2/DashboardHero";
import { LiquidityChart } from "@/components/cardano-bitcoin-v2/LiquidityChart";
import { getCardanoBitcoinDashboardData } from "@/lib/cardanoBitcoinDashboard";

export const metadata: Metadata = {
  title: "Cardano Bitcoin DeFi Dashboard V2 | BitcoinXDeFi",
  description:
    "Development preview of the Cardano Bitcoin DeFi Dashboard by BitcoinXDeFi.",
  robots: {
    index: false,
    follow: false,
  },
};

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
 const dashboard = await getCardanoBitcoinDashboardData();
const chartData = buildChartData(dashboard.totalTrackedBtc);

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10 text-slate-950 dark:bg-slate-950 dark:text-white">
      <div className="mx-auto max-w-7xl space-y-8">
        <DashboardHero />
        <LiquidityChart data={chartData} />
        <KpiCards
          totalTrackedBtc={dashboard.totalTrackedBtc}
          protocolCount={dashboard.protocolCount}
          totalTvlUsd={dashboard.totalTvlUsd}
          totalHolders={dashboard.totalHolders}
          updatedAt={dashboard.updatedAt}
        />
        <BitcoinAssetsTable
        assets={dashboard.cardano.assets}
        formattedTotalBtc={dashboard.cardano.formattedTotalBtc}
        />
      </div>
    </main>
  );
}
