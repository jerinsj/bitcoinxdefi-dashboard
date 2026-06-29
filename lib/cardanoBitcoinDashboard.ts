export async function getCardanoBitcoinDashboardData() {
  const [cardanoRes, karmaRes] = await Promise.all([
    fetch("https://bitcoinxdefi.com/api/cardano-bitcoin", {
      next: { revalidate: 604800 },
    }),
    fetch("https://bitcoinxdefi.com/api/btc-karma", {
      next: { revalidate: 604800 },
    }),
  ]);

  if (!cardanoRes.ok) {
    throw new Error("Failed to fetch Cardano Bitcoin data");
  }

  const cardano = await cardanoRes.json();
  const karma = karmaRes.ok ? await karmaRes.json() : null;
  const btcKarmaResponse = await fetch(
  `${process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"}/api/btc-karma`,
  { next: { revalidate: 604800 } }
  );

  const btcKarma = btcKarmaResponse.ok
  ? await btcKarmaResponse.json()
  : null;
  const totalHolders = cardano.assets.reduce(
  (sum: number, asset: any) => sum + (asset.holderCount ?? 0),
  0
);

return {
  cardano,
  karma,
  btcKarma,
  totalTrackedBtc:
    cardano.totalBtc + (karma?.totalBtcStaked ?? 0),
  protocolCount:
    cardano.assets.length + (karma ? 1 : 0),
  totalTvlUsd:
    karma?.tvlUsd ?? 0,
  totalHolders,
  updatedAt: cardano.updatedAt,
};
}
