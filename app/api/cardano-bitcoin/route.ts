import { NextResponse } from "next/server";
import { cardanoBtcAssets } from "@/lib/cardanoBtcAssets";

type BlockfrostAssetResponse = {
  quantity: string;
};

type BlockfrostHolder = {
  address: string;
  quantity: string;
};

async function fetchAssetSupply(assetId: string, projectId: string) {
  const response = await fetch(
    `https://cardano-mainnet.blockfrost.io/api/v0/assets/${assetId}`,
    {
      headers: { project_id: projectId },
      next: { revalidate: 300 },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch asset supply");
  }

  const data = (await response.json()) as BlockfrostAssetResponse;
  return Number(data.quantity);
}

async function fetchAllAssetHolders(assetId: string, projectId: string) {
  const holders: BlockfrostHolder[] = [];
  let page = 1;

  while (true) {
    const response = await fetch(
      `https://cardano-mainnet.blockfrost.io/api/v0/assets/${assetId}/addresses?count=100&page=${page}&order=desc`,
      {
        headers: { project_id: projectId },
        next: { revalidate: 300 },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch asset holders");
    }

    const data = (await response.json()) as BlockfrostHolder[];

    holders.push(...data);

    if (data.length < 100) break;

    page += 1;
  }

  return holders;
}

export async function GET() {
  const projectId = process.env.BLOCKFROST_PROJECT_ID;

  if (!projectId) {
    return NextResponse.json(
      { error: "Missing BLOCKFROST_PROJECT_ID" },
      { status: 500 }
    );
  }

  try {
    const assets = await Promise.all(
      cardanoBtcAssets.map(async (asset) => {
        const assetId = `${asset.policyId}${asset.assetNameHex}`;
        const rawTotalSupply = await fetchAssetSupply(assetId, projectId);

        let rawCirculatingSupply = rawTotalSupply;
        let rawExcludedBalance = 0;
        let holderCount: number | null = null;
        let methodology = "Verified on-chain asset supply";

        if (asset.trackingMethod === "holderAdjusted") {
          const holders = await fetchAllAssetHolders(assetId, projectId);

          holderCount = holders.length;

          const excludedSet = new Set(asset.excludedAddresses);

          rawExcludedBalance = holders
            .filter((holder) => excludedSet.has(holder.address))
            .reduce((sum, holder) => sum + Number(holder.quantity), 0);

          rawCirculatingSupply = holders
            .filter((holder) => !excludedSet.has(holder.address))
            .reduce((sum, holder) => sum + Number(holder.quantity), 0);

          methodology =
            "Estimated from holder balances excluding known treasury/reserve addresses";
        }

        const totalSupply = rawTotalSupply / 10 ** asset.decimals;
        const circulatingSupply =
          rawCirculatingSupply / 10 ** asset.decimals;
        const excludedBalance =
          rawExcludedBalance / 10 ** asset.decimals;

        return {
          symbol: asset.symbol,
          name: asset.name,
          source: asset.source,
          trackingMethod: asset.trackingMethod,
          methodology,
          holderCount,
          totalSupply,
          circulatingSupply,
          excludedBalance,
          formattedTotalSupply: totalSupply.toLocaleString(undefined, {
            maximumFractionDigits: 8,
          }),
          formattedCirculatingSupply:
            circulatingSupply.toLocaleString(undefined, {
              maximumFractionDigits: 8,
            }),
          formattedExcludedBalance: excludedBalance.toLocaleString(undefined, {
            maximumFractionDigits: 8,
          }),
        };
      })
    );

    const totalBtc = assets.reduce(
      (sum, asset) => sum + asset.circulatingSupply,
      0
    );

    return NextResponse.json({
      assets,
      totalBtc,
      formattedTotalBtc: totalBtc.toLocaleString(undefined, {
        maximumFractionDigits: 8,
      }),
      note:
        "rsBTC is estimated from holder balances excluding known treasury/reserve addresses. wanBTC uses verified on-chain asset supply.",
      updatedAt: new Date().toISOString(),
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to load Cardano Bitcoin data" },
      { status: 500 }
    );
  }
}
