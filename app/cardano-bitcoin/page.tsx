const btcAssets = [
  {
    asset: "rsBTC",
    subtitle: "Rosen Bridge",
    source: "Rosen Bridge",
    supply: "125.73 BTC",
    value: "$3.46M",
    change: "+15.2%",
    status: "Active",
    notes: "Bitcoin bridged into Cardano through Rosen ecosystem",
  },
  {
    asset: "wanBTC",
    subtitle: "Wanchain BTC",
    source: "Wanchain",
    supply: "42.91 BTC",
    value: "$1.18M",
    change: "+8.7%",
    status: "Active",
    notes: "Wrapped Bitcoin routed to Cardano through Wanchain",
  },
  {
    asset: "Other BTC Assets",
    subtitle: "Future protocols",
    source: "Watchlist",
    supply: "6.64 BTC",
    value: "$0.18M",
    change: "—",
    status: "Watchlist",
    notes: "Add new Bitcoin assets on Cardano as they appear",
  },
];

const pools = [
  {
    pool: "rsBTC / ADA",
    dex: "Minswap",
    btc: "78.54 BTC",
    ada: "1.92M ADA",
    tvl: "$4.11M",
    change: "+14.3%",
    volume: "$1.28M",
  },
  {
    pool: "wanBTC / ADA",
    dex: "Minswap",
    btc: "26.31 BTC",
    ada: "643K ADA",
    tvl: "$1.37M",
    change: "+7.8%",
    volume: "$420K",
  },
];

export default function CardanoBitcoinPage() {
  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10 text-slate-950">
      <div className="mx-auto max-w-7xl space-y-8">
        <section className="flex flex-col justify-between gap-6 lg:flex-row">
          <div>
            <p className="text-sm font-bold uppercase tracking-wide text-orange-500">
              Cardano Bitcoin DeFi
            </p>

            <h1 className="mt-3 text-4xl font-bold md:text-5xl">
              Cardano Bitcoin Dashboard
            </h1>

            <p className="mt-4 max-w-2xl text-lg text-slate-600">
              Tracking Bitcoin assets, bridges, liquidity, and DeFi activity
              connected to the Cardano ecosystem.
            </p>

            <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4">
              <div className="flex items-start gap-3">
                <div className="text-xl">⚠️</div>

                <div>
                  <h3 className="font-semibold text-amber-900">
                    Demo Dashboard
                  </h3>

                  <p className="mt-1 text-sm text-amber-800">
                    This page is currently a prototype. All BTC balances, TVL,
                    liquidity, and growth metrics shown below are placeholder
                    values for layout testing and do not represent live
                    on-chain data.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border bg-white p-6 shadow-sm lg:w-[380px]">
            <h2 className="text-xl font-bold">Cardano & Bitcoin</h2>

            <p className="mt-2 text-slate-600">
              Building a stronger DeFi future by connecting Bitcoin liquidity
              to Cardano.
            </p>
          </div>
        </section>

        <section className="grid gap-5 md:grid-cols-4">
          <Metric
            title="Total BTC on Cardano"
            value="175.28 BTC"
            sub="+12.6% vs 30 days ago"
          />

          <Metric
            title="Tracked BTC Assets"
            value="2"
            sub="Active assets monitored"
          />

          <Metric
            title="BTC DeFi TVL"
            value="$4.82M"
            sub="+8.4% vs 30 days ago"
          />

          <Metric
            title="30D Growth"
            value="+12.6%"
            sub="vs previous 30 days"
          />
        </section>

        <section className="grid gap-6 lg:grid-cols-3">
          <div className="rounded-2xl border bg-white shadow-sm lg:col-span-2">
            <div className="border-b p-6">
              <h2 className="text-2xl font-bold">
                Bitcoin Assets on Cardano
              </h2>

              <p className="mt-1 text-slate-600">
                Bitcoin-backed or Bitcoin-derived assets that bring BTC
                liquidity to Cardano DeFi.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b bg-slate-50 text-slate-500">
                  <tr>
                    <th className="px-6 py-3">Asset</th>
                    <th className="px-6 py-3">Source</th>
                    <th className="px-6 py-3">BTC Supply</th>
                    <th className="px-6 py-3">30D Change</th>
                    <th className="px-6 py-3">Status</th>
                    <th className="px-6 py-3">Notes</th>
                  </tr>
                </thead>

                <tbody>
                  {btcAssets.map((item) => (
                    <tr key={item.asset} className="border-b last:border-0">
                      <td className="px-6 py-4">
                        <p className="font-bold">{item.asset}</p>
                        <p className="text-xs text-slate-500">
                          {item.subtitle}
                        </p>
                      </td>

                      <td className="px-6 py-4">{item.source}</td>

                      <td className="px-6 py-4">
                        <p className="font-semibold">{item.supply}</p>
                        <p className="text-xs text-slate-500">{item.value}</p>
                      </td>

                      <td className="px-6 py-4 text-green-600">
                        {item.change}
                      </td>

                      <td className="px-6 py-4">
                        <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                          {item.status}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-slate-600">
                        {item.notes}
                      </td>
                    </tr>
                  ))}

                  <tr className="bg-orange-50 font-semibold">
                    <td className="px-6 py-4">Total</td>
                    <td className="px-6 py-4">
                      Across all tracked assets
                    </td>
                    <td className="px-6 py-4">175.28 BTC</td>
                    <td className="px-6 py-4 text-green-600">+12.6%</td>
                    <td></td>
                    <td className="px-6 py-4">$4.82M</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="rounded-2xl border bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold">
              Total BTC on Cardano
            </h2>

            <p className="mt-4 text-3xl font-bold">
              175.28 BTC
            </p>

            <p className="text-sm text-green-600">
              +12.6%
            </p>

            <div className="mt-8 h-64 rounded-xl bg-gradient-to-t from-orange-100 to-white p-4">
              <div className="flex h-full items-end gap-2">
                {[
                  35, 45, 54, 60, 67, 72, 70, 78, 86, 82,
                  90, 94, 91, 99, 88, 92, 95, 101, 110,
                  107, 116,
                ].map((height, index) => (
                  <div
                    key={index}
                    className="flex-1 rounded-t bg-orange-500"
                    style={{ height: `${height}%` }}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-3">
          <div className="rounded-2xl border bg-white shadow-sm lg:col-span-2">
            <div className="border-b p-5">
              <h2 className="text-xl font-bold">
                Top BTC/ADA Liquidity Pools on Cardano
              </h2>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b bg-slate-50 text-slate-500">
                  <tr>
                    <th className="px-6 py-3">Pool</th>
                    <th className="px-6 py-3">DEX</th>
                    <th className="px-6 py-3">BTC Amount</th>
                    <th className="px-6 py-3">ADA Amount</th>
                    <th className="px-6 py-3">TVL</th>
                    <th className="px-6 py-3">30D Change</th>
                    <th className="px-6 py-3">Volume</th>
                  </tr>
                </thead>

                <tbody>
                  {pools.map((pool) => (
                    <tr key={pool.pool} className="border-b last:border-0">
                      <td className="px-6 py-4 font-semibold">
                        {pool.pool}
                      </td>
                      <td className="px-6 py-4">{pool.dex}</td>
                      <td className="px-6 py-4">{pool.btc}</td>
                      <td className="px-6 py-4">{pool.ada}</td>
                      <td className="px-6 py-4 font-semibold">{pool.tvl}</td>
                      <td className="px-6 py-4 text-green-600">
                        {pool.change}
                      </td>
                      <td className="px-6 py-4">{pool.volume}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="rounded-2xl border bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold">Methodology</h2>

            <p className="mt-4 text-slate-600">
              This dashboard only tracks Bitcoin-backed or Bitcoin-derived
              assets connected to Cardano. Synthetic BTC exposure, ETFs, and
              unrelated Bitcoin price products are excluded unless they directly
              move BTC liquidity into Cardano DeFi.
            </p>
          </div>
        </section>
      </div>
    </main>
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
    <div className="rounded-2xl border bg-white p-6 shadow-sm">
      <p className="text-sm text-slate-500">{title}</p>

      <p className="mt-3 text-3xl font-bold">{value}</p>

      <p className="mt-2 text-sm text-slate-500">{sub}</p>
    </div>
  );
}
