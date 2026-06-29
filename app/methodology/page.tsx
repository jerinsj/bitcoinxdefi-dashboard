import type { Metadata } from "next";
import { Bitcoin, CheckCircle2, AlertTriangle, BarChart3, Database, Clock } from "lucide-react";

export const metadata: Metadata = {
  title: "Methodology | BitcoinXDeFi Analytics",
  description:
    "How BitcoinXDeFi Analytics tracks Cardano Bitcoin assets, BTC liquidity, bridge supply, BTC Karma metrics, USD values, and historical changes.",
};

const verifiedMetrics = [
  "wanBTC on-chain asset supply",
  "Cardano asset holder counts when available",
  "Token supply from Cardano chain data",
];

const estimatedMetrics = [
  "rsBTC circulating supply after excluding the largest holder",
  "USD values derived from BTC/USD pricing",
  "30D changes when historical snapshots are available",
];

const sources = [
  "Blockfrost",
  "Cardano on-chain data",
  "Rosen Bridge",
  "Wanchain",
  "BTC Karma",
  "BitcoinXDeFi snapshots",
];

export default function MethodologyPage() {
  return (
    <main className="min-h-screen bg-slate-50 px-6 py-12 text-slate-950 dark:bg-[#020817] dark:text-white">
      <div className="mx-auto max-w-6xl space-y-8">
        <section className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm dark:border-[#16263a] dark:bg-[#071220]">
          <p className="text-sm font-bold uppercase tracking-wide text-orange-500">
            BitcoinXDeFi Analytics
          </p>

          <h1 className="mt-3 text-4xl font-bold tracking-tight">
            Methodology
          </h1>

          <p className="mt-5 max-w-3xl text-base leading-7 text-slate-600 dark:text-slate-300">
            BitcoinXDeFi tracks where Bitcoin liquidity is moving inside DeFi.
            This page explains how Cardano Bitcoin metrics are classified,
            calculated, labeled, and updated.
          </p>
        </section>

        <section className="grid gap-5 md:grid-cols-3">
          <SummaryCard
            icon={CheckCircle2}
            title="Verified Metrics"
            value="On-chain"
            description="Used when supply or holder data can be read directly from Cardano chain data."
            tone="green"
          />

          <SummaryCard
            icon={AlertTriangle}
            title="Estimated Metrics"
            value="Transparent"
            description="Used when a number requires assumptions, exclusions, or interpretation."
            tone="amber"
          />

          <SummaryCard
            icon={Clock}
            title="Refresh Cadence"
            value="Weekly"
            description="Core bridge and protocol metrics currently refresh weekly."
            tone="orange"
          />
        </section>

        <section className="grid gap-5 lg:grid-cols-2">
          <InfoPanel
            icon={CheckCircle2}
            title="Verified BTC Asset Metrics"
            description="Verified metrics are used when BitcoinXDeFi can read the relevant data directly from Cardano on-chain asset records or a clearly identifiable bridge-issued asset."
            items={verifiedMetrics}
            tone="green"
          />

          <InfoPanel
            icon={AlertTriangle}
            title="Estimated BTC Asset Metrics"
            description="Estimated metrics are used when the dashboard needs to make a transparent assumption to avoid overstating circulating Bitcoin liquidity."
            items={estimatedMetrics}
            tone="amber"
          />
        </section>

        <section className="grid gap-5 lg:grid-cols-2">
          <MethodCard
            icon={Bitcoin}
            title="rsBTC"
            label="Estimated"
            labelClassName="border-amber-300 bg-amber-50 text-amber-700 dark:border-amber-500/40 dark:bg-amber-500/10 dark:text-amber-300"
          >
            rsBTC circulating supply is currently estimated from Cardano holder
            balances by excluding the largest holder. The largest holder is
            assumed to be treasury, reserve, or bridge-controlled liquidity.
            This is labeled as estimated because the assumption may change if
            better source data becomes available.
          </MethodCard>

          <MethodCard
            icon={Bitcoin}
            title="wanBTC"
            label="Verified"
            labelClassName="border-green-300 bg-green-50 text-green-700 dark:border-green-500/40 dark:bg-green-500/10 dark:text-green-300"
          >
            wanBTC is treated as verified when its supply can be read directly
            from Cardano on-chain asset data. Holder counts are derived from
            asset holder records when available.
          </MethodCard>

          <MethodCard
            icon={BarChart3}
            title="BTC Karma"
            label="Protocol"
            labelClassName="border-blue-300 bg-blue-50 text-blue-700 dark:border-blue-500/40 dark:bg-blue-500/10 dark:text-blue-300"
          >
            BTC Karma data is sourced from the public BTC Karma dashboard.
            BitcoinXDeFi tracks BTC staked, TVL, unique wallets, and positions
            when the public dashboard data is available. This may become
            temporarily unavailable if the upstream dashboard changes.
          </MethodCard>

          <MethodCard
            icon={Database}
            title="Historical Changes"
            label="Snapshots"
            labelClassName="border-violet-300 bg-violet-50 text-violet-700 dark:border-violet-500/40 dark:bg-violet-500/10 dark:text-violet-300"
          >
            Percentage changes are calculated from stored historical snapshots.
            If there is not enough reliable history for a metric, the dashboard
            leaves the value unavailable instead of inventing a change.
          </MethodCard>
        </section>

        <section className="grid gap-5 lg:grid-cols-3">
          <DetailCard title="BTC First">
            Bitcoin remains the primary unit across BitcoinXDeFi. USD values are
            shown underneath BTC values as supporting context.
          </DetailCard>

          <DetailCard title="USD Values">
            USD values are calculated from the current or inferred BTC/USD price
            and should be treated as secondary reference values.
          </DetailCard>

          <DetailCard title="Data Quality">
            Metrics are labeled as verified, estimated, protocol-sourced, or
            unavailable so users can understand the quality of each value.
          </DetailCard>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-[#16263a] dark:bg-[#071220]">
          <div className="flex items-center gap-3">
            <Database className="h-5 w-5 text-orange-500" />

            <h2 className="text-xl font-semibold text-slate-950 dark:text-white">
              Current Data Sources
            </h2>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {sources.map((source) => (
              <div
                key={source}
                className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 dark:border-[#16263a] dark:bg-[#020d1a] dark:text-slate-300"
              >
                {source}
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-orange-200 bg-orange-50 p-6 shadow-sm dark:border-orange-500/30 dark:bg-orange-500/10">
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 text-orange-500" />

            <h2 className="text-xl font-semibold text-orange-700 dark:text-orange-300">
              Limitations
            </h2>
          </div>

          <p className="mt-3 text-base leading-7 text-slate-700 dark:text-slate-300">
            BitcoinXDeFi Analytics depends on public data sources, on-chain
            indexing, third-party dashboards, and transparent assumptions. Some
            values may be delayed, revised, incomplete, or unavailable. This
            dashboard is for research and informational purposes only and is not
            financial advice.
          </p>
        </section>
      </div>
    </main>
  );
}

function SummaryCard({
  icon: Icon,
  title,
  value,
  description,
  tone,
}: {
  icon: typeof CheckCircle2;
  title: string;
  value: string;
  description: string;
  tone: "green" | "amber" | "orange";
}) {
  const toneClasses = {
    green: "border-green-500/40 bg-green-500/10 text-green-500",
    amber: "border-amber-500/40 bg-amber-500/10 text-amber-500",
    orange: "border-orange-500/40 bg-orange-500/10 text-orange-500",
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-[#16263a] dark:bg-[#071220]">
      <div className="flex items-center gap-3">
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-full border ${toneClasses[tone]}`}
        >
          <Icon className="h-5 w-5" />
        </div>

        <div>
          <p className="text-xs text-slate-600 dark:text-slate-400">{title}</p>
          <p className="text-xl font-bold text-slate-950 dark:text-white">
            {value}
          </p>
        </div>
      </div>

      <p className="mt-4 text-sm leading-6 text-slate-600 dark:text-slate-300">
        {description}
      </p>
    </div>
  );
}

function InfoPanel({
  icon: Icon,
  title,
  description,
  items,
  tone,
}: {
  icon: typeof CheckCircle2;
  title: string;
  description: string;
  items: string[];
  tone: "green" | "amber";
}) {
  const toneClasses = {
    green: "text-green-500",
    amber: "text-amber-500",
  };

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-[#16263a] dark:bg-[#071220]">
      <div className="flex items-center gap-3">
        <Icon className={`h-5 w-5 ${toneClasses[tone]}`} />

        <h2 className="text-xl font-semibold text-slate-950 dark:text-white">
          {title}
        </h2>
      </div>

      <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
        {description}
      </p>

      <ul className="mt-5 space-y-3">
        {items.map((item) => (
          <li
            key={item}
            className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 dark:border-[#16263a] dark:bg-[#020d1a] dark:text-slate-300"
          >
            {item}
          </li>
        ))}
      </ul>
    </article>
  );
}

function MethodCard({
  icon: Icon,
  title,
  label,
  labelClassName,
  children,
}: {
  icon: typeof Bitcoin;
  title: string;
  label: string;
  labelClassName: string;
  children: React.ReactNode;
}) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-[#16263a] dark:bg-[#071220]">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full border border-orange-500/40 bg-orange-500/10 text-orange-500">
            <Icon className="h-5 w-5" />
          </div>

          <h2 className="text-xl font-semibold text-slate-950 dark:text-white">
            {title}
          </h2>
        </div>

        <span
          className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${labelClassName}`}
        >
          {label}
        </span>
      </div>

      <p className="mt-4 text-sm leading-6 text-slate-600 dark:text-slate-300">
        {children}
      </p>
    </article>
  );
}

function DetailCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-[#16263a] dark:bg-[#071220]">
      <h2 className="text-lg font-semibold text-slate-950 dark:text-white">
        {title}
      </h2>

      <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
        {children}
      </p>
    </article>
  );
}
