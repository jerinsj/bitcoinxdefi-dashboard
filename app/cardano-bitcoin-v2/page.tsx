import { BitcoinAssetsTable } from "@/components/cardano-bitcoin-v2/BitcoinAssetsTable";
import { KpiCards } from "@/components/cardano-bitcoin-v2/KpiCards";
import type { Metadata } from "next";
import { DashboardHero } from "@/components/cardano-bitcoin-v2/DashboardHero";
import { LiquidityChart } from "@/components/cardano-bitcoin-v2/LiquidityChart";
import { getCardanoBitcoinDashboardData } from "@/lib/cardanoBitcoinDashboard";
import { DashboardFooter } from "@/components/cardano-bitcoin-v2/DashboardFooter";
import {
  calculateLiquidityChange,
  getCardanoBitcoinHistory,
} from "@/lib/cardanoBitcoinHistory";
import { calculateAssetSupplyChanges } from "@/lib/cardanoBitcoinMetrics";
import { fetchPersistedCardanoBitcoinSnapshots } from "@/lib/cardanoBitcoinHistoryStorage";
import { BtcKarmaPanel } from "@/components/btc-karma-panel";

export const metadata: Metadata = {
  title: "Cardano Bitcoin DeFi Dashboard V2 | BitcoinXDeFi",
  description:
    "Development preview of the Cardano Bitcoin DeFi Dashboard by BitcoinXDeFi.",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function CardanoBitcoinV2Page() {
  const [dashboard, persistedSnapshots] = await Promise.all([
    getCardanoBitcoinDashboardData(),
    fetchPersistedCardanoBitcoinSnapshots(),
  ]);

  const history = getCardanoBitcoinHistory(dashboard, persistedSnapshots);
  const liquidityChange = calculateLiquidityChange(history.chartData, 90);
  const assetChanges = calculateAssetSupplyChanges(history.snapshots, 30);

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10 text-slate-950 dark:bg-[#020817] dark:text-white">
      <div className="mx-auto max-w-7xl space-y-10">
        <DashboardHero />

        <LiquidityChart data={history.chartData} source={history.source} />

        <KpiCards
          totalTrackedBtc={dashboard.totalTrackedBtc}
          protocolCount={dashboard.protocolCount}
          totalTvlUsd={dashboard.totalTvlUsd}
          totalHolders={dashboard.totalHolders}
          liquidityChange={liquidityChange}
          updatedAt={dashboard.updatedAt}
        />

        <BitcoinAssetsTable
          assets={dashboard.cardano.assets}
          formattedTotalBtc={dashboard.cardano.formattedTotalBtc}
          btcPriceUsd={dashboard.btcPriceUsd}
          assetChanges={assetChanges}
        />

        <BtcKarmaPanel />
        <DashboardFooter updatedAt={dashboard.updatedAt} />
      </div>
    </main>
  );
}
