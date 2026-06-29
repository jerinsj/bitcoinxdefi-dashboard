export function DashboardHero() {
  return (
    <section className="flex flex-col justify-between gap-6 lg:flex-row">
      <div>
        <p className="text-sm font-bold uppercase tracking-wide text-orange-500">
          Cardano Bitcoin DeFi
        </p>

        <h1 className="mt-3 text-4xl font-extrabold text-white md:text-5xl">
          Cardano Bitcoin DeFi Dashboard
        </h1>

        <p className="mt-4 max-w-2xl text-lg text-slate-300">
          Tracking Bitcoin liquidity, bridges, staking, and DeFi activity
          connected to Cardano.
        </p>

        <div className="mt-6 rounded-xl border border-[#1f3148] bg-[#07111f] p-4 shadow-[0_8px_30px_rgba(0,0,0,0.35)]">
          <h3 className="font-semibold text-orange-400">Live Data Beta</h3>

          <p className="mt-1 text-sm text-slate-300">
            This Version 2 dashboard is under development. Live data will be
            connected from the existing BitcoinXDeFi APIs.
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-[#1f3148] bg-[#07111f] p-6 shadow-[0_8px_30px_rgba(0,0,0,0.35)] lg:w-[380px]">
        <h2 className="text-xl font-bold text-white">Cardano & Bitcoin</h2>

        <p className="mt-2 text-slate-300">
          Building a stronger DeFi future by connecting Bitcoin liquidity to
          Cardano.
        </p>

        <div className="mt-6 flex items-center justify-center gap-5">
          <div className="flex h-16 w-16 items-center justify-center rounded-full border border-orange-500 bg-orange-500/10 text-3xl font-bold text-orange-500">
            ₿
          </div>

          <div className="h-px w-12 border-t border-dashed border-[#1f3148]" />

          <div className="flex h-16 w-16 items-center justify-center rounded-full border border-blue-500 bg-blue-500/10 text-2xl font-bold text-blue-400">
            ₳
          </div>
        </div>
      </div>
    </section>
  );
}
