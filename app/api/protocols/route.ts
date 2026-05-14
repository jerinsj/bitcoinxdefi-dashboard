import { NextResponse } from "next/server";

export const revalidate = 300;

export async function GET() {
  try {
    const res = await fetch(
      "https://api.llama.fi/protocols",
      {
        next: { revalidate: 300 }
      }
    );

    if (!res.ok) {
      throw new Error("Failed to fetch protocols");
    }

    const data = await res.json();

    const btcProtocols = data
      .filter((p: any) => {
        const chainText = Array.isArray(p.chains)
          ? p.chains.join(" ").toLowerCase()
          : "";

        const nameText = p.name?.toLowerCase() || "";

        return (
          chainText.includes("bitcoin") ||
          nameText.includes("bitcoin") ||
          nameText.includes("btc") ||
          nameText.includes("stacks") ||
          nameText.includes("rootstock") ||
          nameText.includes("babylon")
        );
      })
      .slice(0, 12)
      .map((p: any) => ({
        name: p.name,
        category: p.category || "Unknown",
        tvl: p.tvl || 0,
        chains: p.chains || [],
        change1d: p.change_1d || 0
      }));

    return NextResponse.json(btcProtocols);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch DeFiLlama data" },
      { status: 500 }
    );
  }
}
