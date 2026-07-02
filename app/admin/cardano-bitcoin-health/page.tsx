import type { Metadata } from "next";
import { cookies } from "next/headers";
import { DataSourceStatusPanel } from "@/components/cardano-bitcoin-v2/DataSourceStatusPanel";
import { fetchPersistedCardanoBitcoinSnapshots } from "@/lib/cardanoBitcoinHistoryStorage";
import AdminHealthPasscodeForm from "./passcode-form";

export const dynamic = "force-dynamic";

const siteUrl = "https://bitcoindefi.us";

export const metadata: Metadata = {
  title: "Cardano Bitcoin Data Health | Admin",
  description:
    "Administrative health checks for Bitcoin DeFi Analytics Cardano Bitcoin dashboard data sources.",
  robots: {
    index: false,
    follow: false,
  },
};

type StatusLevel = "healthy" | "warning" | "offline";

type HealthStatus = {
  name: string;
  description: string;
  status: StatusLevel;
  lastUpdated?: string | null;
  detail: string;
};

function getAgeInHours(value?: string | null) {
  if (!value) {
    return null;
  }

  const timestamp = new Date(value).getTime();

  if (Number.isNaN(timestamp)) {
    return null;
  }

  return (Date.now() - timestamp) / (1000 * 60 * 60);
}

function getFreshnessStatus(value?: string | null, warningHours = 48): StatusLevel {
  const ageInHours = getAgeInHours(value);

  if (ageInHours === null) {
    return "warning";
  }

  return ageInHours <= warningHours ? "healthy" : "warning";
}

async function checkCardanoBitcoinApi(): Promise<HealthStatus> {
  try {
    const response = await fetch(`${siteUrl}/api/cardano-bitcoin`, {
      cache: "no-store",
    });

    if (!response.ok) {
      return {
        name: "Cardano Bitcoin API",
        description:
          "Supplies Cardano BTC asset balances, holder counts, and tracked BTC totals.",
        status: "offline",
        lastUpdated: null,
        detail: `API returned HTTP ${response.status}.`,
      };
    }

    const data = await response.json();

    return {
      name: "Cardano Bitcoin API",
      description:
        "Supplies Cardano BTC asset balances, holder counts, and tracked BTC totals.",
      status: getFreshnessStatus(data.updatedAt, 48),
      lastUpdated: data.updatedAt,
      detail: `${data.assets?.length ?? 0} assets returned. Total tracked BTC: ${data.totalBtc ?? "Unavailable"}.`,
    };
  } catch (error) {
    return {
      name: "Cardano Bitcoin API",
      description:
        "Supplies Cardano BTC asset balances, holder counts, and tracked BTC totals.",
      status: "offline",
      lastUpdated: null,
      detail: error instanceof Error ? error.message : "Request failed.",
    };
  }
}

async function checkBtcKarmaApi(): Promise<HealthStatus> {
  try {
    const response = await fetch(`${siteUrl}/api/btc-karma`, {
      cache: "no-store",
    });

    if (!response.ok) {
      return {
        name: "BTC Karma API",
        description:
          "Supplies BTC Karma staking, TVL, wallets, and position metrics.",
        status: "warning",
        lastUpdated: null,
        detail: `API returned HTTP ${response.status}. Dashboard can still load without BTC Karma data.`,
      };
    }

    const data = await response.json();

    return {
      name: "BTC Karma API",
      description:
        "Supplies BTC Karma staking, TVL, wallets, and position metrics.",
      status: getFreshnessStatus(data.updatedAt, 168),
      lastUpdated: data.updatedAt,
      detail: `BTC staked: ${data.totalBtcStaked ?? "Unavailable"}. Wallets: ${data.uniqueWallets ?? "Unavailable"}.`,
    };
  } catch (error) {
    return {
      name: "BTC Karma API",
      description:
        "Supplies BTC Karma staking, TVL, wallets, and position metrics.",
      status: "warning",
      lastUpdated: null,
      detail: error instanceof Error ? error.message : "Request failed.",
    };
  }
}

async function checkCoinGecko(): Promise<HealthStatus> {
  try {
    const response = await fetch(
      "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd",
      { cache: "no-store" }
    );

    if (!response.ok) {
      return {
        name: "CoinGecko BTC Price",
        description: "Supplies BTC/USD pricing used for secondary USD values.",
        status: "warning",
        lastUpdated: new Date().toISOString(),
        detail: `CoinGecko returned HTTP ${response.status}. Dashboard may fall back to inferred BTC price.`,
      };
    }

    const data = await response.json();
    const price = data.bitcoin?.usd;

    return {
      name: "CoinGecko BTC Price",
      description: "Supplies BTC/USD pricing used for secondary USD values.",
      status: price ? "healthy" : "warning",
      lastUpdated: new Date().toISOString(),
      detail: price
        ? `BTC/USD returned: $${price.toLocaleString()}.`
        : "BTC/USD price was unavailable.",
    };
  } catch (error) {
    return {
      name: "CoinGecko BTC Price",
      description: "Supplies BTC/USD pricing used for secondary USD values.",
      status: "warning",
      lastUpdated: null,
      detail: error instanceof Error ? error.message : "Request failed.",
    };
  }
}

async function checkHistoricalSnapshots(): Promise<HealthStatus> {
  try {
    const snapshots = await fetchPersistedCardanoBitcoinSnapshots();
    const latestSnapshot = snapshots.at(-1);

    if (!latestSnapshot) {
      return {
        name: "Historical Snapshots",
        description:
          "Supabase-backed daily snapshots powering historical charts and percentage changes.",
        status: "warning",
        lastUpdated: null,
        detail: "No persisted snapshots were returned from Supabase.",
      };
    }

    return {
      name: "Historical Snapshots",
      description:
        "Supabase-backed daily snapshots powering historical charts and percentage changes.",
      status: getFreshnessStatus(`${latestSnapshot.date}T00:00:00.000Z`, 48),
      lastUpdated: latestSnapshot.updatedAt,
      detail: `${snapshots.length} persisted snapshots found. Latest snapshot date: ${latestSnapshot.date}.`,
    };
  } catch (error) {
    return {
      name: "Historical Snapshots",
      description:
        "Supabase-backed daily snapshots powering historical charts and percentage changes.",
      status: "offline",
      lastUpdated: null,
      detail: error instanceof Error ? error.message : "Supabase snapshot check failed.",
    };
  }
}

export default async function CardanoBitcoinHealthPage() {
  const hasAccess = cookies().get("cardano_health_access")?.value === "true";

  if (!hasAccess) {
    return <AdminHealthPasscodeForm />;
  }

  const statuses = await Promise.all([
    checkCardanoBitcoinApi(),
    checkBtcKarmaApi(),
    checkCoinGecko(),
    checkHistoricalSnapshots(),
  ]);

  const offlineCount = statuses.filter((source) => source.status === "offline").length;
  const warningCount = statuses.filter((source) => source.status === "warning").length;

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10 text-slate-950 dark:bg-[#020817] dark:text-white">
      <div className="mx-auto max-w-5xl space-y-8">
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-[#16263a] dark:bg-[#071220]">
          <p className="text-sm font-bold uppercase tracking-wide text-orange-500">
            Admin Only
          </p>
          <h1 className="mt-2 text-3xl font-bold text-slate-950 dark:text-white">
            Cardano Bitcoin Data Health
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
            Internal status page for checking whether the Cardano Bitcoin dashboard data sources are online, fresh, and returning usable data. This page is hidden from navigation, protected by passcode, and marked noindex.
          </p>

          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-[#16263a] dark:bg-[#020d1a]">
              <p className="text-xs text-slate-500 dark:text-slate-400">Sources Checked</p>
              <p className="mt-1 text-2xl font-bold text-slate-950 dark:text-white">{statuses.length}</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-[#16263a] dark:bg-[#020d1a]">
              <p className="text-xs text-slate-500 dark:text-slate-400">Warnings</p>
              <p className="mt-1 text-2xl font-bold text-amber-600 dark:text-amber-400">{warningCount}</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-[#16263a] dark:bg-[#020d1a]">
              <p className="text-xs text-slate-500 dark:text-slate-400">Offline</p>
              <p className="mt-1 text-2xl font-bold text-red-600 dark:text-red-400">{offlineCount}</p>
            </div>
          </div>
        </section>

        <DataSourceStatusPanel statuses={statuses} />
      </div>
    </main>
  );
}
