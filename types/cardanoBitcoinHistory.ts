export type CardanoBitcoinAssetSnapshot = {
  symbol: string;
  name: string;
  source: string;
  totalSupply: number;
  circulatingSupply: number;
  excludedBalance: number;
  holderCount: number | null;
};

export type CardanoBitcoinProtocolSnapshot = {
  name: string;
  totalBtc: number;
  tvlUsd: number;
  wallets?: number;
  positions?: number;
  source: string;
};

export type CardanoBitcoinHistorySnapshot = {
  date: string;
  updatedAt: string;
  totalTrackedBtc: number;
  totalTvlUsd: number;
  totalHolders: number;
  protocolCount: number;
  assets: CardanoBitcoinAssetSnapshot[];
  protocols: CardanoBitcoinProtocolSnapshot[];
};

export type CardanoBitcoinChartPoint = {
  date: string;
  label: string;
  totalBtc: number;
  totalTvlUsd: number;
  totalHolders: number;
  protocolCount: number;
};

export type CardanoBitcoinHistoryResponse = {
  snapshots: CardanoBitcoinHistorySnapshot[];
  chartData: CardanoBitcoinChartPoint[];
  updatedAt: string;
  source: "seeded-history" | "live-history";
};
