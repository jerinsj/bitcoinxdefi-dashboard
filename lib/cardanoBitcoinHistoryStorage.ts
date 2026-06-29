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

type SupabaseConfig = {
  url: string;
  key: string;
};

function getSupabaseConfig(): SupabaseConfig | null {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    return null;
  }

  return {
    url: url.replace(/\/$/, ""),
    key,
  };
}

function supabaseHeaders(config: SupabaseConfig) {
  return {
    apikey: config.key,
    authorization: `Bearer ${config.key}`,
    "content-type": "application/json",
  };
}

async function supabaseRequest<T>(path: string, init?: RequestInit): Promise<T> {
  const config = getSupabaseConfig();

  if (!config) {
    throw new Error("Missing Supabase environment variables");
  }

  const response = await fetch(`${config.url}/rest/v1/${path}`, {
    ...init,
    headers: {
      ...supabaseHeaders(config),
      ...(init?.headers ?? {}),
    },
    cache: "no-store",
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Supabase request failed: ${response.status} ${errorText}`);
  }

  if (response.status === 204) {
    return null as T;
  }

  return (await response.json()) as T;
}

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
  if (!getSupabaseConfig()) {
    return [];
  }

  const [dailyRows, assetRows, protocolRows] = await Promise.all([
    supabaseRequest<DailySnapshotRow[]>(
      "cardano_bitcoin_daily_snapshots?select=*&order=snapshot_date.asc"
    ),
    supabaseRequest<AssetSnapshotRow[]>(
      "cardano_bitcoin_asset_snapshots?select=*&order=snapshot_date.asc,symbol.asc"
    ),
    supabaseRequest<ProtocolSnapshotRow[]>(
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
  await supabaseRequest(
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
    await supabaseRequest(
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
    await supabaseRequest(
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
