"use client";

import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Activity,
  AlertTriangle,
  ArrowUpRight,
  Bitcoin,
  Database,
  Globe2,
  Lock,
  Search,
  ShieldCheck,
  TrendingUp,
  Wallet
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid
} from "recharts";

const news = [
  "Bitcoin DeFi liquidity rises as L2 ecosystems expand.",
  "BTC staking protocols attract renewed institutional attention.",
  "Wrapped BTC supply remains the largest source of Bitcoin DeFi liquidity.",
  "Security risk remains highest around bridges, custody, and oracle design.",
  "Cardano/BOS Bitcoin interoperability remains a watchlist category."
];

function StatCard({
  icon: Icon,
  label,
  value,
  sub
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  sub: string;
}) {
  return (
    <Card className="rounded-2xl border-slate-200 bg-white/80 shadow-sm">
      <CardContent className="p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-500">{label}</p>
            <p className="mt-2 text-2xl font-semibold text-slate-950">{value}</p>
            <p className="mt-1 text-xs text-slate-500">{sub}</p>
          </div>
          <div className="rounded-2xl bg-slate-100 p-3">
            <Icon className="h-6 w-6 text-slate-700" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function RiskBadge({ risk }: { risk: string }) {
  const cls =
    risk === "Low"
      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
      : risk === "Medium"
      ? "bg-amber-50 text-amber-700 border-amber-200"
      : risk === "Research"
      ? "bg-sky-50 text-sky-700 border-sky-200"
      : "bg-rose-50 text-rose-700 border-rose-200";

  return <span className={`rounded-full border px-3 py-1 text-xs font-medium ${cls}`}>{risk}</span>;
}

export default function HomePage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [btcData, setBtcData] = useState<{
    price: number;
    marketCap: number;
    change24h: number;
  } | null>(null);

   const [protocols, setProtocols] = useState<any[]>([]);
   const [tvlTrend, setTvlTrend] = useState<any[]>([]);
   const [wrappedBtcData, setWrappedBtcData] = useState<any[]>([]);
  
  useEffect(() => {
    async function loadBtcData() {
      try {
        const res = await fetch("/api/btc");
        const data = await res.json();
        setBtcData(data);
      } catch (error) {
        console.error("Failed to load BTC data", error);
      }
    }
    async function loadProtocols() {
  try {
    const res = await fetch("/api/protocols");
    const data = await res.json();
    setProtocols(data);
  } catch (error) {
    console.error("Failed to load protocols", error);
  }
}
   async function loadTvlTrend() {
  try {
    const res = await fetch("/api/tvl-trend");
    const data = await res.json();
    setTvlTrend(data);
  } catch (error) {
    console.error("Failed to load TVL trend", error);
  }
}
    async function loadWrappedBtc() {
  try {
    const res = await fetch("/api/wrapped-btc");
    const data = await res.json();
    setWrappedBtcData(data);
  } catch (error) {
    console.error("Failed to load wrapped BTC data", error);
  }
}
     loadBtcData();
     loadProtocols();
     loadTvlTrend();
     loadWrappedBtc();
   
  }, []);

  const categories = ["All", ...Array.from(new Set(protocols.map((p) => p.category)))];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-orange-50 text-slate-950">
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-orange-100 p-3">
              <Bitcoin className="h-7 w-7 text-orange-600" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">BitcoinXDeFi Analytics</h1>
              <p className="text-sm text-slate-500">
                Bitcoin DeFi, BTC staking, bridge liquidity, Cardano/BOS watchlist, and L2 risk intelligence
              </p>
            </div>
          </div>
          {/* <Button className="rounded-2xl">
            Launch App <ArrowUpRight className="ml-2 h-4 w-4" />
          </Button> */}
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-8">
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 grid gap-5 lg:grid-cols-[1.4fr_.6fr]"
        >
          <Card className="rounded-3xl border-slate-200 bg-slate-950 text-white shadow-sm">
            <CardContent className="p-8">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm text-white/80">
                <Globe2 className="h-4 w-4" /> bitcoinxdefi.com • bitcoinxdefi.net • bitcoinxdefi.org • bitcoindefi.us
              </div>
              <h2 className="max-w-3xl text-4xl font-bold tracking-tight md:text-5xl">
                Track where Bitcoin liquidity is moving inside DeFi.
              </h2>
              <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300">
                A dashboard concept for monitoring BTC-backed protocols, wrapped Bitcoin supply, L2 activity,
                staking narratives, bridge concentration, Cardano/BOS developments, and protocol risk.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Button className="rounded-2xl bg-orange-500 text-white hover:bg-orange-600">View Protocols</Button>
                <Button variant="secondary" className="rounded-2xl">Read Risk Methodology</Button>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-3xl border-slate-200 bg-white shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <ShieldCheck className="h-6 w-6 text-slate-700" />
                <h3 className="text-lg font-semibold">Security Note</h3>
              </div>
              <p className="mt-4 text-sm leading-6 text-slate-600">
                This dashboard should remain educational and analytics-focused. Avoid promising returns, running token sales,
                or asking users for seed phrases, wallet keys, or exchange login details.
              </p>
              {/* <div className="mt-5 rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">
                Use domain lock, MFA, private WHOIS, and a dedicated email for inbound domain inquiries.
              </div> */}
            </CardContent>
          </Card>
        </motion.section>

        <section className="mb-8 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
  icon={Bitcoin}
  label="Live BTC Price"
  value={btcData ? `$${btcData.price.toLocaleString()}` : "Loading..."}
  sub="CoinGecko live market data"
/>

<StatCard
  icon={TrendingUp}
  label="BTC 24H Change"
  value={
    btcData
      ? `${btcData.change24h >= 0 ? "+" : ""}${btcData.change24h.toFixed(2)}%`
      : "Loading..."
  }
  sub="Updated every 60 seconds"
/>

<StatCard
  icon={Database}
  label="BTC Market Cap"
  value={
    btcData
      ? `$${Math.round(btcData.marketCap / 1_000_000_000).toLocaleString()}B`
      : "Loading..."
  }
  sub="Live market capitalization"
/>

<StatCard
  icon={Wallet}
  label="Tracked Protocols"
  value="6"
  sub="BTC DeFi watchlist"
/>
        </section>

        <section className="mb-8 grid gap-5 lg:grid-cols-[1.3fr_.7fr]">
          <Card className="rounded-3xl border-slate-200 bg-white shadow-sm">
            <CardContent className="p-6">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold">BTC DeFi TVL Trend</h3>
                  <p className="text-sm text-slate-500">Live aggregated BTC DeFi protocol TVL in billions</p>
                </div>
                <Activity className="h-5 w-5 text-slate-500" />
              </div>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={tvlTrend}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="tvl" strokeWidth={3} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-3xl border-slate-200 bg-white shadow-sm">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold">Wrapped BTC Share</h3>
              <p className="text-sm text-slate-500">Live wrapped BTC market cap distribution</p>
              <div className="mt-5 h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={wrappedBtcData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="grid gap-5 lg:grid-cols-[1.4fr_.6fr]">
          <Card className="rounded-3xl border-slate-200 bg-white shadow-sm">
            <CardContent className="p-6">
              <div className="mb-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <h3 className="text-lg font-semibold">Protocol Watchlist</h3>
                  <p className="text-sm text-slate-500">Filter BTC DeFi protocols by category and risk</p>
                </div>
                <div className="flex gap-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                    <Input
                      className="w-52 rounded-2xl pl-9"
                      placeholder="Search protocol"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                    />
                  </div>
                  <select
                    className="rounded-2xl border border-slate-200 bg-white px-4 text-sm"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    {categories.map((c) => (
                      <option key={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="overflow-hidden rounded-2xl border border-slate-200">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 text-slate-500">
                    <tr>
                      <th className="p-4 font-medium">Protocol</th>
                      <th className="p-4 font-medium">Category</th>
                      <th className="p-4 font-medium">TVL</th>
                      <th className="p-4 font-medium">30D</th>
                      <th className="p-4 font-medium">Risk</th>
                    </tr>
                  </thead>
                  <tbody>
  {protocols.map((p) => (
  <tr key={p.name} className="border-t border-slate-100">
    <td className="p-4">
      <div className="font-semibold text-slate-950">
        {p.name}
      </div>

      <div className="text-xs text-slate-500">
        {p.chains?.join(", ")}
      </div>
    </td>

    <td className="p-4 text-slate-600">
      {p.category}
    </td>

    <td className="p-4 font-medium">
      ${Math.round(p.tvl).toLocaleString()}
    </td>

    <td
      className={`p-4 font-medium ${
        p.change1d >= 0
          ? "text-emerald-600"
          : "text-rose-600"
      }`}
    >
      {p.change1d
        ? `${p.change1d.toFixed(2)}%`
        : "N/A"}
    </td>

    <td className="p-4">
      Live
    </td>
  </tr>
))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-5">
            <Card className="rounded-3xl border-slate-200 bg-white shadow-sm">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold">Market Signals</h3>
                <div className="mt-4 space-y-3">
                  {news.map((item) => (
                    <div key={item} className="rounded-2xl bg-slate-50 p-4 text-sm leading-6 text-slate-600">
                      {item}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* <Card className="rounded-3xl border-slate-200 bg-white shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <Lock className="h-5 w-5 text-slate-700" />
                  <h3 className="text-lg font-semibold">Owner Controls</h3>
                </div>
                 <ul className="mt-4 space-y-2 text-sm text-slate-600">
                  <li>• Redirect .net, .org, and .us to the .com site.</li>
                  <li>• Add a protected contact form for domain inquiries.</li>
                  <li>• Use a separate email, not your personal inbox.</li>
                  <li>• Keep all analytics data read-only and public-source based.</li>
                </ul>
              </CardContent>
            </Card> */}
          </div>
        </section>

        <footer className="mt-10 rounded-3xl border border-slate-200 bg-white p-6 text-sm text-slate-500">
          Educational research only. Not financial advice. No wallet connection required.
        </footer>
      </main>
    </div>
  );
}
