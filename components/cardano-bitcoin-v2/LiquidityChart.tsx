"use client";

import { useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type ChartPoint = {
  date: string;
  label?: string;
  totalBtc: number;
};

type HistorySource = "seeded-history" | "live-history";

type LiquidityChartProps = {
  data: ChartPoint[];
  source?: HistorySource;
};

type RangeOption = {
  label: string;
  days: number | null;
};

const ranges: RangeOption[] = [
  { label: "7D", days: 7 },
  { label: "30D", days: 30 },
  { label: "90D", days: 90 },
  { label: "180D", days: 180 },
  { label: "1Y", days: 365 },
  { label: "MAX", days: null },
];

function formatBtc(value: number) {
  return `${value.toFixed(2)} BTC`;
}

export function LiquidityChart({
  data,
  source = "seeded-history",
}: LiquidityChartProps) {
  const [selectedRange, setSelectedRange] = useState("90D");

  const selectedRangeConfig = ranges.find(
    (range) => range.label === selectedRange
  );

  const filteredData = useMemo(() => {
    if (!selectedRangeConfig?.days) {
      return data;
    }

    return data.slice(-selectedRangeConfig.days);
  }, [data, selectedRangeConfig]);

  const sourceLabel =
    source === "live-history" ? "saved daily snapshots" : "bootstrap history";

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-[#16263a] dark:bg-[#071220]">
      <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-orange-500">📈</span>
            <h2 className="text-2xl font-bold text-slate-950 dark:text-white">
              Total BTC on Cardano
            </h2>
          </div>

          <p className="mt-1 text-sm text-slate-600 dark:text-[#cbd5e1]">
            {selectedRange} liquidity trend based on {sourceLabel}.
          </p>
        </div>

        <div className="flex rounded-lg border border-slate-200 bg-slate-50 p-1 text-xs dark:border-[#16263a] dark:bg-[#020d1a]">
          {ranges.map((range) => (
            <button
              key={range.label}
              type="button"
              onClick={() => setSelectedRange(range.label)}
              className={`rounded-md px-3 py-1 font-semibold transition ${
                selectedRange === range.label
                  ? "bg-orange-500 text-white"
                  : "text-slate-500 hover:bg-slate-100 hover:text-slate-950 dark:text-slate-400 dark:hover:bg-[#0b1728] dark:hover:text-white"
              }`}
            >
              {range.label}
            </button>
          ))}
        </div>
      </div>

      <div className="h-[360px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={filteredData}
            margin={{
              top: 20,
              right: 24,
              left: 0,
              bottom: 12,
            }}
          >
            <defs>
              <linearGradient id="btcGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f97316" stopOpacity={0.42} />
                <stop offset="95%" stopColor="#f97316" stopOpacity={0.03} />
              </linearGradient>
            </defs>

            <CartesianGrid
              strokeDasharray="4 4"
              vertical={false}
              stroke="currentColor"
              className="text-slate-200 dark:text-[#16263a]"
              opacity={0.55}
            />

            <XAxis
              dataKey="label"
              tick={{ fontSize: 12, fill: "currentColor" }}
              tickLine={false}
              axisLine={false}
              minTickGap={28}
              className="text-slate-500 dark:text-slate-400"
            />

            <YAxis
              tick={{ fontSize: 12, fill: "currentColor" }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value}`}
              width={48}
              className="text-slate-500 dark:text-slate-400"
            />

            <Tooltip
              formatter={(value) => [formatBtc(Number(value)), "BTC"]}
              labelStyle={{ color: "#ffffff" }}
              contentStyle={{
                borderRadius: "12px",
                border: "1px solid #16263a",
                background: "#071220",
                color: "#ffffff",
              }}
            />

            <Area
              type="monotone"
              dataKey="totalBtc"
              stroke="#f97316"
              strokeWidth={3}
              fill="url(#btcGradient)"
              activeDot={{
                r: 5,
                fill: "#f97316",
                stroke: "#ffffff",
                strokeWidth: 2,
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
