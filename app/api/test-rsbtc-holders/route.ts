import { NextResponse } from "next/server";

const assetId =
  "2dbc49f682ad21f6d18705cf446f9f7a277731ab70ae21a454f888b27273425443";

export async function GET() {
  const projectId = process.env.BLOCKFROST_PROJECT_ID;

  if (!projectId) {
    return NextResponse.json(
      { error: "Missing BLOCKFROST_PROJECT_ID" },
      { status: 500 }
    );
  }

  const response = await fetch(
    `https://cardano-mainnet.blockfrost.io/api/v0/assets/${assetId}/addresses?count=100&page=1`,
    {
      headers: {
        project_id: projectId,
      },
      cache: "no-store",
    }
  );

  const holders = await response.json();

  return NextResponse.json({
    status: response.status,
    holderCountReturned: Array.isArray(holders) ? holders.length : 0,
    holders,
  });
}
