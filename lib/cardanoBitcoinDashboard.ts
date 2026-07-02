type CoinGeckoBitcoinResponse = {
  bitcoin?: {
    usd?: number;
  };
};

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://bitcoindefi.us";

async function fetchBitcoinPriceUsd() {
  try {
    const response = await fetch(
      "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd",
      { next: { revalidate: 3600 } }
    );

    if (!response.ok) {
      return 0;
    }

    const data = (await response.json()) as CoinGeckoBitcoinResponse;
    return data.bitcoin?.usd ?? 0;
  } catch {
    return 0;
  }
}

export async function getCardanoBitcoinDashboardData() {
  const [cardanoRes, karmaRes, btcPriceUsd] = await Promise.all([
    fetch(`${siteUrl}/api/cardano-bitcoin`, {
      next: { revalidate: 604800 },
    }),
    fetch(`${siteUrl}/api/btc-karma`, {
      next: { revalidate: 604800 },
    }),
    fetchBitcoinPriceUsd(),
  ]);

  if (!cardanoRes.ok) {
    throw new Error("Failed to fetch Cardano Bitcoin data");
  }

  const cardano = await cardanoRes.json();
  const karma = karmaRes.ok ? await karmaRes.json() : null;
  const totalHolders = cardano.assets.reduce(
    (sum: number, asset: any) => sum + (asset.holderCount ?? 0),
    0
  );
  const totalTrackedBtc = cardano.totalBtc + (karma?.totalBtcStaked ?? 0);
  const inferredBtcPriceUsd =
    btcPriceUsd ||
    (karma?.tvlUsd && karma?.totalBtcStaked
      ? karma.tvlUsd / karma.totalBtcStaked
      : 0);

  return {
    cardano,
    karma,
    btcPriceUsd: inferredBtcPriceUsd,
    totalTrackedBtc,
    protocolCount: cardano.assets.length + (karma ? 1 : 0),
    totalTvlUsd: inferredBtcPriceUsd
      ? totalTrackedBtc * inferredBtcPriceUsd
      : karma?.tvlUsd ?? 0,
    totalHolders,
    updatedAt: cardano.updatedAt,
  };
}
