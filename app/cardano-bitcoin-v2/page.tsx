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

const siteUrl = "https://bitcoindefi.us";
const cardanoDashboardUrl = `${siteUrl}/cardano-bitcoin-v2`;
const cardanoOgImage = "/og/cardano-bitcoin-dashboard.png";
const brandName = "Bitcoin DeFi Analytics";

export const metadata: Metadata = {
  title: "Cardano Bitcoin Dashboard | Wrapped BTC Analytics",
  description:
    "Track Bitcoin liquidity connected to Cardano, including rsBTC, wanBTC, BTC Karma staking, Cardano wrapped BTC supply, holders, bridge metrics, and historical BTCFi trends.",
  alternates: {
    canonical: "/cardano-bitcoin-v2",
  },
  keywords: [
    "Cardano Bitcoin",
    "Cardano BTC",
    "wrapped BTC on Cardano",
    "rsBTC",
    "wanBTC",
    "BTC Karma",
    "Bitcoin DeFi Cardano",
    "Cardano DeFi analytics",
    "Bitcoin bridge Cardano",
  ],
  openGraph: {
    title: "Cardano Bitcoin Dashboard | Wrapped BTC Analytics",
    description:
      "Track rsBTC, wanBTC, BTC Karma staking, Cardano BTC liquidity, holders, and historical Bitcoin DeFi activity connected to Cardano.",
    url: "/cardano-bitcoin-v2",
    siteName: brandName,
    images: [
      {
        url: cardanoOgImage,
        width: 1200,
        height: 630,
        alt: "Cardano Bitcoin Ecosystem Dashboard by Bitcoin DeFi Analytics",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Cardano Bitcoin Dashboard | Wrapped BTC Analytics",
    description:
      "Track Bitcoin liquidity connected to Cardano, including rsBTC, wanBTC, BTC Karma, bridge metrics, and historical BTCFi trends.",
    images: [cardanoOgImage],
  },
  robots: {
    index: true,
    follow: true,
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

  const datasetJsonLd = {
    "@context": "https://schema.org",
    "@type": "Dataset",
    name: "Cardano Bitcoin DeFi Dashboard",
    description:
      "Bitcoin liquidity, wrapped BTC asset supply, protocol metrics, and historical Cardano Bitcoin DeFi analytics.",
    url: cardanoDashboardUrl,
    creator: {
      "@type": "Organization",
      name: brandName,
      url: siteUrl,
    },
    keywords: [
      "Cardano Bitcoin",
      "wrapped BTC",
      "rsBTC",
      "wanBTC",
      "BTC Karma",
      "Bitcoin DeFi",
    ],
    temporalCoverage: "2026/..",
    isAccessibleForFree: true,
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: siteUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Cardano Bitcoin Dashboard",
        item: cardanoDashboardUrl,
      },
    ],
  };

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10 text-slate-950 dark:bg-[#020817] dark:text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(datasetJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
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
