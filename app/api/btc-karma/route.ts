import { NextResponse } from "next/server";

function extractField(html: string, field: string) {
  const regex = new RegExp(`\\\\"${field}\\\\":\\\\"([^\\\\"]+)\\\\"`);
  const match = html.match(regex);
  return match?.[1] ?? null;
}

export async function GET() {
  try {
    const response = await fetch("https://staking.btckarma.io/", {
      next: { revalidate: 604800 },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch BTC Karma page" },
        { status: 502 }
      );
    }

    const html = await response.text();

    const totalBtcStaked = extractField(html, "total_btc_staked");
    const uniqueWallets = extractField(html, "unique_wallets");
    const totalPositions = extractField(html, "total_positions");
    const btcUsd = extractField(html, "usd_btc");
    const estimatedApr = extractField(html, "estimated_apr");
    const aprMin = extractField(html, "apr_min");
    const aprMax = extractField(html, "apr_max");
    const timestamp = extractField(html, "timestamp");

    const btc = Number(totalBtcStaked ?? 0);
    const btcPrice = Number(btcUsd ?? 0);
    const tvlUsd = btc * btcPrice;

    return NextResponse.json({
      protocol: "BTC Karma",
      source: "BTC Karma public dashboard",
      totalBtcStaked: btc,
      formattedTotalBtcStaked: btc.toLocaleString(undefined, {
        maximumFractionDigits: 8,
      }),
      tvlUsd,
      formattedTvlUsd: tvlUsd.toLocaleString(undefined, {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 2,
      }),
      uniqueWallets: Number(uniqueWallets ?? 0),
      totalPositions: Number(totalPositions ?? 0),
      btcUsd: btcPrice,
      formattedBtcUsd: btcPrice.toLocaleString(undefined, {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 2,
      }),
      estimatedApr: Number(estimatedApr ?? 0),
      aprMin: Number(aprMin ?? 0),
      aprMax: Number(aprMax ?? 0),
      timestamp,
      updatedAt: new Date().toISOString(),
      note:
        "BTC Karma data is parsed from the public BTC Karma dashboard HTML. This is not an official API endpoint and may change if the dashboard changes.",
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to load BTC Karma data" },
      { status: 500 }
    );
  }
}
