import { NextResponse } from "next/server";
import { cardanoBtcAssets } from "@/lib/cardanoBtcAssets";

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

        const response = await fetch(
          `https://cardano-mainnet.blockfrost.io/api/v0/assets/${assetId}`,
          {
            headers: {
              project_id: projectId,
            },
            next: { revalidate: 300 },
          }
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch ${asset.symbol}`);
        }

        const data = await response.json();

        const rawSupply = Number(data.quantity);
        const supply = rawSupply / 10 ** asset.decimals;

        return {
          symbol: asset.symbol,
          name: asset.name,
          source: asset.source,
          policyId: asset.policyId,
          assetNameHex: asset.assetNameHex,
          supply,
          formattedSupply: supply.toLocaleString(undefined, {
            maximumFractionDigits: 8,
          }),
        };
      })
    );

    const totalBtc = assets.reduce((sum, asset) => sum + asset.supply, 0);

    return NextResponse.json({
      assets,
      totalBtc,
      formattedTotalBtc: totalBtc.toLocaleString(undefined, {
        maximumFractionDigits: 8,
      }),
      updatedAt: new Date().toISOString(),
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to load Cardano Bitcoin data" },
      { status: 500 }
    );
  }
}
