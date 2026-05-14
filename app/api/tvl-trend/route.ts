import { NextResponse } from "next/server";

export const revalidate = 3600;

const protocolSlugs = [
  "babylon-protocol",
  "solvbtc",
  "tbtc",
  "lightning-network",
  "merlins-seal",
  "bouncebit-cedefi-yield",
  "bedrock-unibtc",
  "free-protocol"
];

export async function GET() {
  try {
    const results = await Promise.all(
      protocolSlugs.map(async (slug) => {
        const res = await fetch(`https://api.llama.fi/protocol/${slug}`, {
          next: { revalidate: 3600 }
        });

        if (!res.ok) return null;

        const data = await res.json();

        return data.tvl || [];
      })
    );

    const monthlyTotals: Record<string, number> = {};

    results
      .filter(Boolean)
      .forEach((series: any) => {
        series.forEach((point: any) => {
          const date = new Date(point.date * 1000);
          const month = date.toLocaleString("en-US", { month: "short" });

          monthlyTotals[month] = (monthlyTotals[month] || 0) + (point.totalLiquidityUSD || 0);
        });
      });

    const monthOrder = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    const chartData = monthOrder
      .filter((month) => monthlyTotals[month])
      .map((month) => ({
        month,
        tvl: Number((monthlyTotals[month] / 1_000_000_000).toFixed(2))
      }));

    return NextResponse.json(chartData);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch TVL trend data" },
      { status: 500 }
    );
  }
}
