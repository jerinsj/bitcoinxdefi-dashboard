"use client";

import { useEffect, useState } from "react";
import { Bitcoin, ExternalLink, LockKeyhole, Users, Layers } from "lucide-react";

const BTC_KARMA_DASHBOARD_URL = "https://staking.btckarma.io/";

type BtcKarmaData = {
  formattedTotalBtcStaked: string;
  formattedTvlUsd: string;
  uniqueWallets: number;
  totalPositions: number;
  updatedAt: string;
};

export function BtcKarmaPanel() {
  const [data, setData] = useState<BtcKarmaData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadBtcKarmaData() {
      try {
        const response = await fetch("/api/btc-karma");
        const result = await response.json();

        if (response.ok) {
          setData(result);
        }
      } finally {
        setLoading(false);
      }
    }

    loadBtcKarmaData();
  }, []);

  const stats = [
    {
      label: "BTC Staked",
      value: loading
        ? "Loading..."
        : data
          ? `${data.formattedTotalBtcStaked} BTC`
          : "Unavailable",
      icon: Bitcoin,
    },
    {
      label: "TVL",
      value: loading
        ? "Loading..."
        : data
          ? data.formattedTvlUsd
          : "Unavailable",
      icon: LockKeyhole,
    },
    {
      label: "Unique Wallets",
      value: loading
        ? "Loading..."
        : data
          ? data.uniqueWallets.toLocaleString()
          : "Unavailable",
      icon: Users,
    },
    {
      label: "Positions",
      value: loading
        ? "Loading..."
        : data
          ? data.totalPositions.toLocaleString()
          : "Unavailable",
      icon: Layers,
    },
  ];

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
        <div>
          <p className="text-sm font-bold uppercase tracking-wide text-orange-500">
            BTC Karma
          </p>

          <h2 className="mt-2 text-2xl font-bold text-slate-950 dark:text-white">
            BTC Karma Staking Overview
          </h2>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-300">
            Track Bitcoin-native staking activity connected to Cardano,
            including BTC staked, TVL, wallet participation, and open positions.
          </p>
        </div>

        <a
          href={BTC_KARMA_DASHBOARD_URL}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 rounded-xl border border-orange-200 bg-orange-50 px-4 py-2 text-sm font-semibold text-orange-700 transition hover:bg-orange-100 dark:border-orange-900 dark:bg-orange-950/40 dark:text-orange-300 dark:hover:bg-orange-950"
        >
          View BTC Karma
          <ExternalLink className="h-4 w-4" />
        </a>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.label}
              className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/60"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                  {stat.label}
                </p>

                <div className="rounded-lg bg-white p-2 text-orange-500 dark:bg-slate-950">
                  <Icon className="h-4 w-4" />
                </div>
              </div>

              <p className="mt-4 text-xl font-bold text-slate-950 dark:text-white">
                {stat.value}
              </p>

              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                {data?.updatedAt
                  ? `Updated ${new Date(data.updatedAt).toLocaleString()}`
                  : loading
                    ? "Fetching live BTC Karma data"
                    : "BTC Karma data unavailable"}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
