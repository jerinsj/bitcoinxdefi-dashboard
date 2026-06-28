async function getCardanoBitcoinData() {
  const res = await fetch("https://bitcoinxdefi.com/api/cardano-bitcoin", {
    next: { revalidate: 604800 },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch Cardano Bitcoin data");
  }

  return res.json();
}

export default async function CardanoBitcoinPage() {
  const data = await getCardanoBitcoinData();

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10 text-slate-950 dark:bg-slate-950 dark:text-white">
      <div className="mx-auto max-w-7xl space-y-8">
        <section className="flex flex-col justify-between gap-6 lg:flex-row">
          <div>
            <p className="text-sm font-bold uppercase tracking-wide text-orange-500">
              Cardano Bitcoin DeFi
            </p>

            <h1 className="mt-3 text-4xl font-bold md:text-5xl">
              Cardano Bitcoin Dashboard
            </h1>

            <p className="mt-4 max-w-2xl text-lg text-slate-600 dark:text-slate-300">
              Tracking Bitcoin assets, bridges, liquidity, and DeFi activity
              connected to the Cardano ecosystem.
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

        <section className="grid gap-5 md:grid-cols-3">
          <Metric
            title="Total BTC on Cardano"
            value={`${data.formattedTotalBtc} BTC`}
            sub="rsBTC estimated + wanBTC verified"
          />

          <Metric
            title="Tracked BTC Assets"
            value={String(data.assets.length)}
            sub="rsBTC and wanBTC"
          />

          {(() => {
  const snapshot = new Date(data.updatedAt);

  return (
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
  );
})()}
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

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h2 className="text-xl font-bold">Methodology</h2>

          <p className="mt-4 text-slate-600 dark:text-slate-300">
            {data.note}
          </p>
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
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <p className="text-sm text-slate-500 dark:text-slate-400">{title}</p>

      <p className="mt-3 text-3xl font-bold">{value}</p>

      <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{sub}</p>
    </div>
  );
}
