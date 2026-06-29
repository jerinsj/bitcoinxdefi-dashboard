import Image from "next/image";

type BitcoinAsset = {
  symbol: string;
  name: string;
  source: string;
  logo?: string;
  methodology: string;
  formattedCirculatingSupply: string;
  formattedTotalSupply: string;
  circulatingSupply: number;
  totalSupply: number;
  holderCount: number | null;
};

function AssetIcon({ src, symbol }: { src?: string; symbol: string }) {
  return (
    <div className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-slate-100 dark:border-[#16263a] dark:bg-[#020d1a]">
      <Image
        src={src ?? "/icons/bitcoin.png"}
        alt={`${symbol} logo`}
        width={28}
        height={28}
        className="rounded-full"
      />
    </div>
  );
}

export function BitcoinAssetsTable({
  assets,
  formattedTotalBtc,
}: {
  assets: BitcoinAsset[];
  formattedTotalBtc: string;
}) {
  const totalHolders = assets.reduce(
    (sum, asset) => sum + (asset.holderCount ?? 0),
    0
  );

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-[#16263a] dark:bg-[#071220]">
      <div className="flex flex-col gap-4 border-b border-slate-200 p-6 dark:border-[#16263a] md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-950 dark:text-white">
            Bitcoin Assets on Cardano
          </h2>

          <p className="mt-1 text-sm text-slate-600 dark:text-[#cbd5e1]">
            Live and estimated BTC asset supply connected to Cardano.
          </p>
        </div>

        <a
          href="/methodology"
          className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 dark:border-[#16263a] dark:bg-[#020d1a] dark:text-slate-200 dark:hover:border-orange-500/60 dark:hover:text-orange-400"
        >
          View Methodology
        </a>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px] text-left text-sm">
          <thead className="border-b border-slate-200 bg-slate-50 text-slate-500 dark:border-[#16263a] dark:bg-[#020d1a] dark:text-slate-400">
            <tr>
              <th className="px-6 py-3">Asset</th>
              <th className="px-6 py-3">Source</th>
              <th className="px-6 py-3">Circulating BTC</th>
              <th className="px-6 py-3">Issued Supply</th>
              <th className="px-6 py-3">30D Change</th>
              <th className="px-6 py-3">Holders</th>
              <th className="px-6 py-3">Methodology</th>
            </tr>
          </thead>

          <tbody>
            {assets.map((asset) => (
              <tr
                key={asset.symbol}
                className="border-b border-slate-200 last:border-0 hover:bg-slate-50 dark:border-[#16263a] dark:hover:bg-[#0b1728]/60"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <AssetIcon src={asset.logo} symbol={asset.symbol} />

                    <div>
                      <p className="font-bold text-slate-950 dark:text-white">
                        {asset.symbol}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {asset.name}
                      </p>
                    </div>
                  </div>
                </td>

                <td className="px-6 py-4 text-slate-700 dark:text-slate-300">
                  {asset.source}
                </td>

                <td className="px-6 py-4">
                  <p className="font-semibold text-slate-950 dark:text-white">
                    {asset.formattedCirculatingSupply} BTC
                  </p>
                </td>

                <td className="px-6 py-4">
                  <p className="font-semibold text-slate-950 dark:text-white">
                    {asset.formattedTotalSupply} BTC
                  </p>
                </td>

                <td className="px-6 py-4 text-green-600 dark:text-green-400">
                  ▲ —
                </td>

                <td className="px-6 py-4 text-slate-700 dark:text-slate-300">
                  {asset.holderCount ?? "—"}
                </td>

                <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                  {asset.methodology}
                </td>
              </tr>
            ))}

            <tr className="bg-orange-50 font-semibold dark:bg-[#21151a]">
              <td className="px-6 py-4 text-orange-600 dark:text-orange-400">
                Total (All Assets)
              </td>

              <td className="px-6 py-4 text-slate-950 dark:text-white">
                All tracked assets
              </td>

              <td className="px-6 py-4 text-orange-600 dark:text-orange-400">
                {formattedTotalBtc} BTC
              </td>

              <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                Asset-specific supplies
              </td>

              <td className="px-6 py-4 text-green-600 dark:text-green-400">
                ▲ —
              </td>

              <td className="px-6 py-4 text-orange-600 dark:text-orange-400">
                {totalHolders || "—"}
              </td>

              <td className="px-6 py-4 text-slate-950 dark:text-white">
                Mixed
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  );
}
