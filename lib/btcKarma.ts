export type BtcKarmaData = {
  protocol: string;
  source: string;
  totalBtcStaked: number;
  formattedTotalBtcStaked: string;
  tvlUsd: number;
  formattedTvlUsd: string;
  uniqueWallets: number;
  totalPositions: number;
  btcUsd: number;
  formattedBtcUsd: string;
  estimatedApr: number;
  aprMin: number;
  aprMax: number;
  timestamp: string | null;
  updatedAt: string;
  note: string;
};

function extractField(html: string, field: string) {
  const regex = new RegExp(`\\\\"${field}\\\\":\\\\"([^\\\\"]+)\\\\"`);
  const match = html.match(regex);
  return match?.[1] ?? null;
}

export async function getBtcKarmaData(): Promise<BtcKarmaData | null> {
  try {
    const response = await fetch("https://staking.btckarma.io/", {
      next: { revalidate: 604800 },
    });

    if (!response.ok) {
      return null;
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

    return {
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
    };
  } catch {
    return null;
  }
}
