type BitcoinAsset = {
  symbol: string;
  name: string;
  source: string;
  methodology: string;
  formattedCirculatingSupply: string;
  formattedTotalSupply: string;
  circulatingSupply: number;
  totalSupply: number;
  holderCount: number | null;
};

export function BitcoinAssetsTable({
  assets,
  formattedTotalBtc,
}: {
  assets: BitcoinAsset[];
  formattedTotalBtc: string;
}) {
  const totalSupply = assets.reduce((sum, asset) => sum + asset.totalSupply, 0);
  const totalHolders = assets.reduce(
    (sum, asset) => sum + (asset.holderCount ?? 0),
    0
  );

  return (
    <section className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex flex-col gap-4 border-b border-slate-200 p-6 dark:border-slate-800 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-950 dark:text-white">
            Bitcoin Assets on Cardano
          </h2>

          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
            Live and estimated BTC asset supply connected to Cardano.
          </p>
        </div>

        <a
          href="/methodology"
          className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
        >
          View Methodology
        </a>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-slate-200 bg-slate-50 text-slate-500 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-400">
            <tr>
              <th className="px-6 py-3">Asset</th>
              <th className="px-6 py-3">Source</th>
              <th className="px-6 py-3">Circulating BTC</th>
              <th className="px-6 py-3">Total Supply</th>
              <th className="px-6 py-3">Holders</th>
              <th className="px-6 py-3">Methodology</th>
            </tr>
          </thead>

          <tbody>
            {assets.map((asset) => (
              <tr
                key={asset.symbol}
                className="border-b border-slate-200 last:border-0 dark:border-slate-800"
              >
                <td className="px-6 py-4">
                  <div>
                    <p className="font-bold text-slate-950 dark:text-white">
                      {asset.symbol}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {asset.name}
                    </p>
                  </div>
                </td>

                <td className="px-6 py-4 text-slate-700 dark:text-slate-300">
                  {asset.source}
                </td>

                <td className="px-6 py-4 font-semibold text-slate-950 dark:text-white">
                  {asset.formattedCirculatingSupply} BTC
                </td>

                <td className="px-6 py-4 text-slate-700 dark:text-slate-300">
                  {asset.formattedTotalSupply} BTC
                </td>

                <td className="px-6 py-4 text-slate-700 dark:text-slate-300">
                  {asset.holderCount ?? "—"}
                </td>

                <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                  {asset.methodology}
                </td>
              </tr>
            ))}

            <tr className="bg-orange-50 font-semibold dark:bg-orange-950/30">
              <td className="px-6 py-4 text-orange-600 dark:text-orange-400">
                Total
              </td>
              <td className="px-6 py-4">All tracked assets</td>
              <td className="px-6 py-4 text-orange-600 dark:text-orange-400">
                {formattedTotalBtc} BTC
              </td>
              <td className="px-6 py-4">
                {totalSupply.toLocaleString(undefined, {
                  maximumFractionDigits: 8,
                })}{" "}
                BTC
              </td>
              <td className="px-6 py-4">{totalHolders || "—"}</td>
              <td className="px-6 py-4">Mixed methodology</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  );
}
