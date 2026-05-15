export default function AboutPage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-12 text-slate-950">
      <h1 className="text-3xl font-bold tracking-tight">
        About BitcoinXDeFi Analytics
      </h1>

      <p className="mt-6 text-base leading-7 text-slate-600">
        BitcoinXDeFi Analytics is an independent educational and research
        dashboard focused on Bitcoin DeFi ecosystems, wrapped BTC
        infrastructure, BTC liquidity trends, and cross-chain interoperability.
      </p>

      <p className="mt-4 text-base leading-7 text-slate-600">
        The platform is designed to help users understand how Bitcoin liquidity
        is moving through decentralized finance infrastructure, including BTC
        staking, wrapped Bitcoin assets, bridges, Layer 2 networks, and related
        protocol ecosystems.
      </p>

      <h2 className="mt-10 text-xl font-semibold">What We Do Not Do</h2>

      <ul className="mt-4 list-disc space-y-2 pl-6 text-slate-600">
        <li>We do not offer investment products.</li>
        <li>We do not sell tokens.</li>
        <li>We do not provide custody services.</li>
        <li>We do not connect to wallets.</li>
        <li>We do not provide financial advice.</li>
      </ul>

      <h2 className="mt-10 text-xl font-semibold">Data Sources</h2>

      <p className="mt-4 text-base leading-7 text-slate-600">
        The dashboard uses public data sources such as CoinGecko and DeFiLlama
        to display market data, protocol TVL, and ecosystem metrics. Data may be
        delayed, incomplete, or revised by source providers.
      </p>

      <h2 className="mt-10 text-xl font-semibold">Important Disclaimer</h2>

      <p className="mt-4 text-base leading-7 text-slate-600">
        BitcoinXDeFi Analytics is for educational and informational purposes
        only. Nothing on this site should be interpreted as financial,
        investment, legal, or tax advice.
      </p>
    </main>
  );
}
