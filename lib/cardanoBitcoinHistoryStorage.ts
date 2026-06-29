import { hasSupabaseServerConfig, supabaseServerRequest } from "@/lib/supabaseServer";
import type {
  CardanoBitcoinAssetSnapshot,
  CardanoBitcoinHistorySnapshot,
  CardanoBitcoinProtocolSnapshot,
} from "@/types/cardanoBitcoinHistory";

type DailySnapshotRow = {
  snapshot_date: string;
  updated_at: string;
  total_tracked_btc: number | string;
  total_tvl_usd: number | string;
  total_holders: number;
  protocol_count: number;
};

type AssetSnapshotRow = {
  snapshot_date: string;
  symbol: string;
  name: string;
  source: string;
  total_supply: number | string;
  circulating_supply: number | string;
  excluded_balance: number | string;
  holder_count: number | null;
};

type ProtocolSnapshotRow = {
  snapshot_date: string;
  name: string;
  source: string;
  total_btc: number | string;
  tvl_usd: number | string;
  wallets: number | null;
  positions: number | null;
};

function toNumber(value: number | string | null | undefined) {
  return Number(value ?? 0);
}

function toAssetSnapshot(row: AssetSnapshotRow): CardanoBitcoinAssetSnapshot {
  return {
    symbol: row.symbol,
    name: row.name,
    source: row.source,
    totalSupply: toNumber(row.total_supply),
    circulatingSupply: toNumber(row.circulating_supply),
    excludedBalance: toNumber(row.excluded_balance),
    holderCount: row.holder_count,
  };
}

function toProtocolSnapshot(
  row: ProtocolSnapshotRow
): CardanoBitcoinProtocolSnapshot {
  return {
    name: row.name,
    source: row.source,
    totalBtc: toNumber(row.total_btc),
    tvlUsd: toNumber(row.tvl_usd),
    wallets: row.wallets ?? undefined,
    positions: row.positions ?? undefined,
  };
}

export async function fetchPersistedCardanoBitcoinSnapshots() {
  if (!hasSupabaseServerConfig()) {
    return [];
  }

  const [dailyRows, assetRows, protocolRows] = await Promise.all([
    supabaseServerRequest<DailySnapshotRow[]>(
      "cardano_bitcoin_daily_snapshots?select=*&order=snapshot_date.asc"
    ),
    supabaseServerRequest<AssetSnapshotRow[]>(
      "cardano_bitcoin_asset_snapshots?select=*&order=snapshot_date.asc,symbol.asc"
    ),
    supabaseServerRequest<ProtocolSnapshotRow[]>(
      "cardano_bitcoin_protocol_snapshots?select=*&order=snapshot_date.asc,name.asc"
    ),
  ]);

  return dailyRows.map((dailyRow) => {
    const assets = assetRows
      .filter((assetRow) => assetRow.snapshot_date === dailyRow.snapshot_date)
      .map(toAssetSnapshot);

    const protocols = protocolRows
      .filter((protocolRow) => protocolRow.snapshot_date === dailyRow.snapshot_date)
      .map(toProtocolSnapshot);

    return {
      date: dailyRow.snapshot_date,
      updatedAt: dailyRow.updated_at,
      totalTrackedBtc: toNumber(dailyRow.total_tracked_btc),
      totalTvlUsd: toNumber(dailyRow.total_tvl_usd),
      totalHolders: dailyRow.total_holders,
      protocolCount: dailyRow.protocol_count,
      assets,
      protocols,
    } satisfies CardanoBitcoinHistorySnapshot;
  });
}

function toDailyRow(snapshot: CardanoBitcoinHistorySnapshot) {
  return {
    snapshot_date: snapshot.date,
    updated_at: snapshot.updatedAt,
    total_tracked_btc: snapshot.totalTrackedBtc,
    total_tvl_usd: snapshot.totalTvlUsd,
    total_holders: snapshot.totalHolders,
    protocol_count: snapshot.protocolCount,
  };
}

function toAssetRows(snapshot: CardanoBitcoinHistorySnapshot) {
  return snapshot.assets.map((asset) => ({
    snapshot_date: snapshot.date,
    symbol: asset.symbol,
    name: asset.name,
    source: asset.source,
    total_supply: asset.totalSupply,
    circulating_supply: asset.circulatingSupply,
    excluded_balance: asset.excludedBalance,
    holder_count: asset.holderCount,
  }));
}

function toProtocolRows(snapshot: CardanoBitcoinHistorySnapshot) {
  return snapshot.protocols.map((protocol) => ({
    snapshot_date: snapshot.date,
    name: protocol.name,
    source: protocol.source,
    total_btc: protocol.totalBtc,
    tvl_usd: protocol.tvlUsd,
    wallets: protocol.wallets ?? null,
    positions: protocol.positions ?? null,
  }));
}

export async function persistCardanoBitcoinSnapshot(
  snapshot: CardanoBitcoinHistorySnapshot
) {
  await supabaseServerRequest(
    "cardano_bitcoin_daily_snapshots?on_conflict=snapshot_date",
    {
      method: "POST",
      headers: {
        Prefer: "resolution=merge-duplicates,return=minimal",
      },
      body: JSON.stringify(toDailyRow(snapshot)),
    }
  );

  const assetRows = toAssetRows(snapshot);
  if (assetRows.length > 0) {
    await supabaseServerRequest(
      "cardano_bitcoin_asset_snapshots?on_conflict=snapshot_date,symbol",
      {
        method: "POST",
        headers: {
          Prefer: "resolution=merge-duplicates,return=minimal",
        },
        body: JSON.stringify(assetRows),
      }
    );
  }

  const protocolRows = toProtocolRows(snapshot);
  if (protocolRows.length > 0) {
    await supabaseServerRequest(
      "cardano_bitcoin_protocol_snapshots?on_conflict=snapshot_date,name",
      {
        method: "POST",
        headers: {
          Prefer: "resolution=merge-duplicates,return=minimal",
        },
        body: JSON.stringify(protocolRows),
      }
    );
  }

  return snapshot;
}
