import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cardano Bitcoin Ecosystem Dashboard | BitcoinXDeFi",
  description:
    "Track Bitcoin liquidity connected to Cardano, including rsBTC, wanBTC, and BTC Karma protocol metrics.",
  openGraph: {
    title: "Cardano Bitcoin Ecosystem Dashboard",
    description:
      "Live and estimated Bitcoin liquidity metrics across Cardano BTC assets and related Bitcoin DeFi protocols.",
    url: "https://bitcoinxdefi.com/cardano-bitcoin",
    siteName: "BitcoinXDeFi Analytics",
    images: [
      {
        url: "https://bitcoinxdefi.com/og/cardano-bitcoin-dashboard.png",
        width: 1200,
        height: 630,
        alt: "Cardano Bitcoin Ecosystem Dashboard by BitcoinXDeFi",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Cardano Bitcoin Ecosystem Dashboard | BitcoinXDeFi",
    description:
      "Track Bitcoin liquidity connected to Cardano, including rsBTC, wanBTC, and BTC Karma.",
    images: ["https://bitcoinxdefi.com/og/cardano-bitcoin-dashboard.png"],
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

async function getBtcKarmaData() {
  const res = await fetch("https://bitcoinxdefi.com/api/btc-karma", {
    next: { revalidate: 604800 },
  });

  if (!res.ok) {
    return null;
  }

  return res.json();
}

function buildChartData(currentTotal: number) {
  return Array.from({ length: 90 }, (_, i) => {
    const progress = i / 89;
    const start = currentTotal * 0.78;
    const value =
      start + (currentTotal - start) * progress + Math.sin(i / 5) * 0.12;

    return Number(value.toFixed(8));
  });
}

export default async function CardanoBitcoinPage() {
  const data = await getCardanoBitcoinData();
  const karma = await getBtcKarmaData();

  const trackedLiquidity =
    data.totalBtc + (karma?.totalBtcStaked ?? 0);

  const chartData = buildChartData(data.totalBtc);
  const snapshot = new Date(data.updatedAt);

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10 text-slate-950 dark:bg-slate-950 dark:text-white">
      <div className="mx-auto max-w-7xl space-y-8">
        <section className="flex flex-col justify-between gap-6 lg:flex-row">
          <div>
            <p className="text-sm font-bold uppercase tracking-wide text-orange-500">
              Cardano Bitcoin DeFi
            </p>

            <h1 className="mt-3 text-4xl font-bold md:text-5xl">
              Cardano Bitcoin DeFi Dashboard
            </h1>

            <p className="mt-4 max-w-2xl text-lg text-slate-600 dark:text-slate-300">
              Tracking Bitcoin liquidity, bridges, staking, and DeFi activity
              connected to Cardano.
            </p>

            <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-900 dark:bg-amber-950/40">
              <h3 className="font-semibold text-amber-900 dark:text-amber-300">
                Live Data Beta
              </h3>

              <p className="mt-1 text-sm text-amber-800 dark:text-amber-200">
                wanBTC uses verified on-chain supply. rsBTC is estimated by
                excluding the largest holder, assumed to be treasury/reserve.
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 lg:w-[380px]">
            <h2 className="text-xl font-bold">Cardano & Bitcoin</h2>

            <p className="mt-2 text-slate-600 dark:text-slate-300">
              Building a stronger DeFi future by connecting Bitcoin liquidity
              to Cardano.
            </p>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-6 flex flex-col justify-between gap-3 md:flex-row md:items-center">
            <div>
              <h2 className="text-2xl font-bold">
                Total BTC on Cardano (90 Days)
              </h2>
              <p className="mt-1 text-slate-600 dark:text-slate-300">
                rsBTC estimated supply + wanBTC verified supply
              </p>
            </div>

            <div className="rounded-full bg-orange-100 px-4 py-2 text-sm font-semibold text-orange-700 dark:bg-orange-950/50 dark:text-orange-300">
              90D
            </div>
          </div>

          <LineChart
            data={chartData}
            currentValue={data.formattedTotalBtc}
            snapshot={snapshot}
          />
        </section>

        <section className="grid gap-5 md:grid-cols-3">
          <Metric
            title="Tracked Bitcoin Liquidity"
            value={`${trackedLiquidity.toLocaleString(undefined, {
              maximumFractionDigits: 8,
            })} BTC`}
            sub="Cardano assets + BTC Karma"
          />

          <Metric
            title="Tracked Protocols"
            value={String(data.assets.length + (karma ? 1 : 0))}
            sub="rsBTC, wanBTC and BTC Karma"
          />

          <Metric
            title="Data Snapshot"
            value={snapshot.toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
              timeZone: "UTC",
            })}
            sub={snapshot.toLocaleTimeString("en-US", {
              hour: "numeric",
              minute: "2-digit",
              hour12: true,
              timeZone: "UTC",
              timeZoneName: "short",
            })}
          />
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="border-b border-slate-200 p-6 dark:border-slate-800">
            <h2 className="text-2xl font-bold">Bitcoin Assets on Cardano</h2>
            <p className="mt-1 text-slate-600 dark:text-slate-300">
              Live and estimated BTC asset supply connected to Cardano.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-slate-200 bg-slate-50 text-slate-500 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-400">
                <tr>
                  <th className="px-6 py-3">Asset</th>
                  <th className="px-6 py-3">Source</th>
                  <th className="px-6 py-3">Circulating BTC</th>
                  <th className="px-6 py-3">Total Supply</th>
                  <th className="px-6 py-3">Methodology</th>
                  <th className="px-6 py-3">Holders</th>
                </tr>
              </thead>

              <tbody>
                {data.assets.map((asset: any) => (
                  <tr
                    key={asset.symbol}
                    className="border-b border-slate-200 last:border-0 dark:border-slate-800"
                  >
                    <td className="px-6 py-4 font-bold">{asset.symbol}</td>
                    <td className="px-6 py-4">{asset.source}</td>
                    <td className="px-6 py-4 font-semibold">
                      {asset.formattedCirculatingSupply} BTC
                    </td>
                    <td className="px-6 py-4">
                      {asset.formattedTotalSupply} BTC
                    </td>
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                      {asset.methodology}
                    </td>
                    <td className="px-6 py-4">{asset.holderCount ?? "—"}</td>
                  </tr>
                ))}

                <tr className="bg-orange-50 font-semibold dark:bg-orange-950/30">
                  <td className="px-6 py-4">Total</td>
                  <td className="px-6 py-4">All tracked assets</td>
                  <td className="px-6 py-4">{data.formattedTotalBtc} BTC</td>
                  <td className="px-6 py-4">—</td>
                  <td className="px-6 py-4">Mixed methodology</td>
                  <td className="px-6 py-4">—</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {karma && (
          <section className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="border-b border-slate-200 p-6 dark:border-slate-800">
              <h2 className="text-2xl font-bold">BTC Karma Protocol</h2>
              <p className="mt-1 text-slate-600 dark:text-slate-300">
                Public dashboard metrics for BTC Karma staking activity.
              </p>
            </div>

            <div className="grid gap-5 p-6 md:grid-cols-4">
              <Metric
                title="BTC Staked"
                value={`${karma.formattedTotalBtcStaked} BTC`}
                sub="Protocol reported"
              />

              <Metric
                title="TVL"
                value={karma.formattedTvlUsd}
                sub="Based on BTC price"
              />

              <Metric
                title="Unique Wallets"
                value={String(karma.uniqueWallets)}
                sub="BTC Karma dashboard"
              />

              <Metric
                title="Positions"
                value={String(karma.totalPositions)}
                sub="Active + inactive"
              />
            </div>
          </section>
        )}

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h2 className="text-xl font-bold">Methodology</h2>

          <p className="mt-4 text-slate-600 dark:text-slate-300">
            {data.note}
          </p>

          {karma && (
            <p className="mt-3 text-slate-600 dark:text-slate-300">
              BTC Karma data is sourced from the public BTC Karma dashboard and
              cached weekly.
            </p>
          )}

          <p className="mt-3 text-slate-600 dark:text-slate-300">
            The 90-day chart is currently a visual trend placeholder anchored to
            the latest live snapshot. Historical snapshots can be added next for
            fully accurate chart history.
          </p>
        </section>
      </div>
    </main>
  );
}

function LineChart({
  data,
  currentValue,
  snapshot,
}: {
  data: number[];
  currentValue: string;
  snapshot: Date;
}) {
  const width = 1000;
  const height = 260;
  const padding = 28;

  const min = Math.min(...data);
  const max = Math.max(...data);

  const points = data
    .map((value, index) => {
      const x =
        padding + (index / (data.length - 1)) * (width - padding * 2);

      const y =
        height -
        padding -
        ((value - min) / (max - min || 1)) * (height - padding * 2);

      return `${x},${y}`;
    })
    .join(" ");

  return (
    <div className="relative overflow-hidden rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950">
      <div className="absolute right-6 top-6 text-right">
        <p className="text-lg font-bold text-orange-500">
          {currentValue} BTC
        </p>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          {snapshot.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
            timeZone: "UTC",
          })}
        </p>
      </div>

      <svg viewBox={`0 0 ${width} ${height}`} className="h-72 w-full">
        {[0, 1, 2, 3].map((line) => {
          const y = padding + line * ((height - padding * 2) / 3);

          return (
            <line
              key={line}
              x1={padding}
              x2={width - padding}
              y1={y}
              y2={y}
              className="stroke-slate-200 dark:stroke-slate-800"
              strokeDasharray="4 4"
            />
          );
        })}

        <polyline
          fill="none"
          stroke="rgb(249 115 22)"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={points}
        />

        <polyline
          fill="rgba(249,115,22,0.15)"
          stroke="none"
          points={`${padding},${height - padding} ${points} ${
            width - padding
          },${height - padding}`}
        />
      </svg>
    </div>
  );
}

function Metric({
  title,
  value,
  sub,
}: {
  title: string;
  value: string;
  sub: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <p className="text-sm text-slate-500 dark:text-slate-400">{title}</p>
      <p className="mt-3 text-3xl font-bold">{value}</p>
      <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{sub}</p>
    </div>
  );
}
