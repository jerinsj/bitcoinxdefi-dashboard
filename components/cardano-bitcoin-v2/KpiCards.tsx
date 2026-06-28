type KpiCardsProps = {
  totalTrackedBtc: number;
  protocolCount: number;
  totalTvlUsd: number;
  updatedAt: string;
};

export function KpiCards({
  totalTrackedBtc,
  protocolCount,
  totalTvlUsd,
  updatedAt,
}: KpiCardsProps) {
  const snapshot = new Date(updatedAt);

  return (
    <section className="grid gap-5 md:grid-cols-4">
      <KpiCard
        title="Total BTC Tracked"
        value={`${totalTrackedBtc.toLocaleString(undefined, {
          maximumFractionDigits: 8,
        })} BTC`}
        sub="Cardano assets + BTC Karma"
      />

      <KpiCard
        title="Tracked Protocols"
        value={String(protocolCount)}
        sub="rsBTC, wanBTC, BTC Karma"
      />

      <KpiCard
        title="Estimated TVL"
        value={totalTvlUsd.toLocaleString(undefined, {
          style: "currency",
          currency: "USD",
          maximumFractionDigits: 0,
        })}
        sub="BTC value estimate"
      />

      <KpiCard
        title="Data Snapshot"
        value={snapshot.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
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
  );
}

function KpiCard({
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
      <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
        {title}
      </p>

      <p className="mt-3 text-2xl font-bold text-slate-950 dark:text-white">
        {value}
      </p>

      <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{sub}</p>
    </div>
  );
}
