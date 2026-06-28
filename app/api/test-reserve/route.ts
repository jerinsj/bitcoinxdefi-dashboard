import { NextResponse } from "next/server";

const reserveAddress =
  "addr1x8x6ca648w25x085dg8xs6k5e69yemr5hakcnl0gshmal6gahwzvy33q3jhr74lurrp9p0n8derw58fh7snq2zwxe8zsdkcqrj";

export async function GET() {
  const projectId = process.env.BLOCKFROST_PROJECT_ID;

  if (!projectId) {
    return NextResponse.json(
      { error: "Missing BLOCKFROST_PROJECT_ID" },
      { status: 500 }
    );
  }

  const response = await fetch(
    `https://cardano-mainnet.blockfrost.io/api/v0/addresses/${reserveAddress}`,
    {
      headers: {
        project_id: projectId,
      },
      next: { revalidate: 300 },
    }
  );

  const data = await response.json();

  return NextResponse.json({
    status: response.status,
    ok: response.ok,
    address: reserveAddress,
    data,
  });
}
