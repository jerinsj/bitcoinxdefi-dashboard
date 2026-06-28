"use client";

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
  totalBtc: number;
};

function formatBtc(value: number) {
  return `${value.toFixed(2)} BTC`;
}

export function LiquidityChart({
  data,
}: {
  data: ChartPoint[];
}) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-orange-500">📈</span>
            <h2 className="text-2xl font-bold">
              Total BTC on Cardano
            </h2>
          </div>

          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
            90-day liquidity trend based on tracked Cardano BTC assets.
          </p>
        </div>

        <div className="flex rounded-lg border border-slate-200 bg-slate-50 p-1 text-xs dark:border-slate-800 dark:bg-slate-950">
          {["7D", "30D", "90D", "180D", "1Y", "MAX"].map((range) => (
            <span
              key={range}
              className={`rounded-md px-3 py-1 font-semibold ${
                range === "90D"
                  ? "bg-orange-500 text-white"
                  : "text-slate-500 dark:text-slate-400"
              }`}
            >
              {range}
            </span>
          ))}
        </div>
      </div>

      <div className="h-[340px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{
              top: 20,
              right: 24,
              left: 0,
              bottom: 12,
            }}
          >
            <defs>
              <linearGradient id="btcGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f97316" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#f97316" stopOpacity={0.02} />
              </linearGradient>
            </defs>

            <CartesianGrid
              strokeDasharray="4 4"
              vertical={false}
              stroke="currentColor"
              className="text-slate-200 dark:text-slate-800"
            />

            <XAxis
              dataKey="date"
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={false}
              minTickGap={28}
            />

            <YAxis
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value}`}
              width={48}
            />

            <Tooltip
              formatter={(value) => [formatBtc(Number(value)), "BTC"]}
              labelClassName="text-slate-950"
              contentStyle={{
                borderRadius: "12px",
                border: "1px solid rgb(226 232 240)",
                background: "white",
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
                stroke: "white",
                strokeWidth: 2,
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
