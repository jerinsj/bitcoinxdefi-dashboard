export default function MethodologyPage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-12 text-slate-950">
      <h1 className="text-3xl font-bold tracking-tight">
        Methodology
      </h1>

      <p className="mt-6 text-base leading-7 text-slate-600">
        BitcoinXDeFi Analytics tracks Bitcoin DeFi ecosystem activity using
        public data sources and transparent filtering logic.
      </p>

      <h2 className="mt-10 text-xl font-semibold">Market Data</h2>
      <p className="mt-4 text-base leading-7 text-slate-600">
        Bitcoin price, market capitalization, and 24-hour price change are
        sourced from CoinGecko.
      </p>

      <h2 className="mt-10 text-xl font-semibold">Protocol Data</h2>
      <p className="mt-4 text-base leading-7 text-slate-600">
        Protocol TVL and category data are sourced from DeFiLlama. The dashboard
        filters for Bitcoin-related protocols, including BTC staking, wrapped
        BTC systems, bridges, Bitcoin Layer 2 ecosystems, and related BTCFi
        infrastructure.
      </p>

      <h2 className="mt-10 text-xl font-semibold">Excluded Categories</h2>
      <p className="mt-4 text-base leading-7 text-slate-600">
        Centralized exchanges are excluded from the main protocol watchlist
        because they represent custody and liquidity gateways rather than
        decentralized protocol activity.
      </p>

      <h2 className="mt-10 text-xl font-semibold">Wrapped BTC Distribution</h2>
      <p className="mt-4 text-base leading-7 text-slate-600">
        Wrapped BTC market cap distribution is estimated using public market
        capitalization data for major wrapped or bridged BTC assets.
      </p>

      <h2 className="mt-10 text-xl font-semibold">Limitations</h2>
      <ul className="mt-4 list-disc space-y-2 pl-6 text-slate-600">
        <li>TVL data may be delayed, revised, or incomplete.</li>
        <li>Some protocols may report data differently across chains.</li>
        <li>Historical charts are best interpreted as directional indicators.</li>
        <li>This dashboard is not financial advice.</li>
      </ul>
    </main>
  );
}
