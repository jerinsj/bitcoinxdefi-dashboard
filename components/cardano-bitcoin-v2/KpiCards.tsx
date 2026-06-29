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
  liquidityChange: number;
  updatedAt: string;
};

function formatUsd(value: number) {
  return value.toLocaleString(undefined, {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });
}

export function KpiCards({
  totalTrackedBtc,
  protocolCount,
  totalTvlUsd,
  totalHolders,
  liquidityChange,
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
        secondaryValue={formatUsd(totalTvlUsd)}
        sub={`${liquidityChange >= 0 ? "+" : ""}${liquidityChange.toFixed(
          2
        )}% vs 90 days ago`}
        icon={Bitcoin}
        iconColor="text-orange-500"
        borderColor="border-orange-500/40"
        bgColor="bg-orange-500/10"
      />

      <KpiCard
        title="Tracked Protocols"
        value={String(protocolCount)}
        secondaryValue="Assets + protocols"
        sub="Active tracked entities"
        icon={BarChart3}
        iconColor="text-blue-500"
        borderColor="border-blue-500/40"
        bgColor="bg-blue-500/10"
      />

      <KpiCard
        title="Total BTC Holders"
        value={String(totalHolders)}
        secondaryValue="Wallet count"
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
        secondaryValue={snapshot.toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
          timeZone: "UTC",
        })}
        sub="UTC · Weekly refresh"
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
  secondaryValue,
  sub,
  icon: Icon,
  iconColor,
  borderColor,
  bgColor,
}: {
  title: string;
  value: string;
  secondaryValue: string;
  sub: string;
  icon: LucideIcon;
  iconColor: string;
  borderColor: string;
  bgColor: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-3.5 shadow-sm dark:border-[#16263a] dark:bg-[#071220]">
      <div className="flex items-center gap-3">
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border ${borderColor} ${bgColor}`}
        >
          <Icon className={`h-6 w-6 ${iconColor}`} />
        </div>

        <div className="flex-1">
          <p className="text-xs text-slate-600 dark:text-slate-400">{title}</p>

          <p className="mt-1 text-xl font-bold leading-tight text-slate-950 dark:text-white">
            {value}
          </p>

          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            {secondaryValue}
          </p>

          <p
            className={`mt-1 text-xs ${
              sub.startsWith("+")
                ? "text-green-600 dark:text-green-400"
                : sub.startsWith("-")
                  ? "text-red-600 dark:text-red-400"
                  : "text-slate-500 dark:text-slate-400"
            }`}
          >
            {sub}
          </p>
        </div>
      </div>
    </div>
  );
}
