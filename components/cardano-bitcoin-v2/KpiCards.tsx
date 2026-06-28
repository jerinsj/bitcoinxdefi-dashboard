import {
  Bitcoin,
  BarChart3,
  Users,
  CalendarDays,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

type KpiCardsProps = {
  totalTrackedBtc: number;
  protocolCount: number;
  totalTvlUsd: number;
  totalHolders: number;
  updatedAt: string;
};

export function KpiCards({
  totalTrackedBtc,
  protocolCount,
  totalHolders,
  totalTvlUsd,
  updatedAt,
}: KpiCardsProps) {
  const snapshot = new Date(updatedAt);

  return (
    <section className="grid gap-5 md:grid-cols-4">
      <KpiCard
        title="Tracked Bitcoin Liquidity"
        value={`${totalTrackedBtc.toLocaleString(undefined, {
          maximumFractionDigits: 8,
        })} BTC`}
        sub="+8.71% vs 30 days ago"
        icon={Bitcoin}
        iconColor="text-orange-500"
        borderColor="border-orange-500/40"
        bgColor="bg-orange-500/10"
      />

      <KpiCard
        title="Tracked Protocols"
        value={String(protocolCount)}
        sub="Active protocols"
        icon={BarChart3}
        iconColor="text-blue-500"
        borderColor="border-blue-500/40"
        bgColor="bg-blue-500/10"
      />

      <KpiCard
        title="Total BTC Holders"
        value="40"
        sub="Across all tracked assets"
        icon={Users}
        iconColor="text-violet-500"
        borderColor="border-violet-500/40"
        bgColor="bg-violet-500/10"
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
        })}
        icon={CalendarDays}
        iconColor="text-green-500"
        borderColor="border-green-500/40"
        bgColor="bg-green-500/10"
      />
    </section>
  );
}

function KpiCard({
  title,
  value,
  sub,
  icon: Icon,
  iconColor,
  borderColor,
  bgColor,
}: {
  title: string;
  value: string;
  sub: string;
  icon: LucideIcon;
  iconColor: string;
  borderColor: string;
  bgColor: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-sm">
      <div className="flex items-start gap-4">
        <div
          className={`flex h-12 w-12 items-center justify-center rounded-full border ${borderColor} ${bgColor}`}
        >
          <Icon className={`h-6 w-6 ${iconColor}`} />
        </div>

        <div className="flex-1">
          <p className="text-sm text-slate-400">
            {title}
          </p>

          <p className="mt-2 text-3xl font-bold text-white">
            {value}
          </p>

          <p
            className={`mt-2 text-sm ${
              sub.startsWith("+")
                ? "text-green-400"
                : "text-slate-400"
            }`}
          >
            {sub}
          </p>
        </div>
      </div>
    </div>
  );
}
