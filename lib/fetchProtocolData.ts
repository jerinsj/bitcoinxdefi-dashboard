export interface ProtocolMetric {
  protocol: string;
  tvlBTC: number;
  tvlUSD: number;
  users?: number;
  transactions?: number;
  updated: string;
}

export async function fetchProtocolData(endpoint: string) {
  const res = await fetch(endpoint, {
    next: { revalidate: 300 }, // refresh every 5 minutes
  });

  if (!res.ok) {
    throw new Error("Failed to fetch protocol data");
  }

  return res.json();
}
