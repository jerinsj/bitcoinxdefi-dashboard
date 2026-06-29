import type { CardanoBitcoinHistorySnapshot } from "@/types/cardanoBitcoinHistory";

export type MetricChange = {
  value: number | null;
  direction: "up" | "down" | "flat" | "unknown";
};

function toIsoDate(value: string | Date) {
  return new Date(value).toISOString().slice(0, 10);
}

function calculateChange(currentValue: number, previousValue: number): MetricChange {
  if (!Number.isFinite(currentValue) || !Number.isFinite(previousValue) || previousValue === 0) {
    return { value: null, direction: "unknown" };
  }

  const value = ((currentValue - previousValue) / previousValue) * 100;

  return {
    value,
    direction: value > 0 ? "up" : value < 0 ? "down" : "flat",
  };
}

function findLookbackSnapshot(
  snapshots: CardanoBitcoinHistorySnapshot[],
  lookbackDays: number
) {
  const latest = snapshots.at(-1);

  if (!latest) {
    return null;
  }

  const targetDate = new Date(`${latest.date}T00:00:00.000Z`);
  targetDate.setUTCDate(targetDate.getUTCDate() - lookbackDays);
  const targetIsoDate = toIsoDate(targetDate);

  return [...snapshots].reverse().find((snapshot) => snapshot.date <= targetIsoDate) ?? snapshots[0] ?? null;
}

export function calculateAssetSupplyChanges(
  snapshots: CardanoBitcoinHistorySnapshot[],
  lookbackDays = 30
) {
  const latest = snapshots.at(-1);
  const previous = findLookbackSnapshot(snapshots, lookbackDays);
  const changes: Record<string, MetricChange> = {};

  if (!latest || !previous) {
    return changes;
  }

  for (const asset of latest.assets) {
    const previousAsset = previous.assets.find((candidate) => candidate.symbol === asset.symbol);

    changes[asset.symbol] = previousAsset
      ? calculateChange(asset.circulatingSupply, previousAsset.circulatingSupply)
      : { value: null, direction: "unknown" };
  }

  return changes;
}

export function formatUsdFromBtc(btcAmount: number, btcPriceUsd: number) {
  if (!btcPriceUsd || !Number.isFinite(btcAmount)) {
    return "USD unavailable";
  }

  return (btcAmount * btcPriceUsd).toLocaleString(undefined, {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  });
}
