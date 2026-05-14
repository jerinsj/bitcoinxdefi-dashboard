import { NextResponse } from "next/server";

export const revalidate = 3600;

const coins = [
  "wrapped-bitcoin",
  "tbtc",
  "coinbase-wrapped-btc",
  "bitcoin-avalanche-bridged-btc-b",
  "solvbtc"
];

export async function GET() {
  try {
    const ids = coins.join(",");

    const res = await fetch(
      `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${ids}`,
      {
        next: { revalidate: 3600 }
      }
    );

    const data = await res.json();

    const formatted = data.map((coin: any) => ({
      name:
        coin.symbol.toUpperCase() === "WBTC"
          ? "WBTC"
          : coin.symbol.toUpperCase(),
      value: Number(
        (coin.market_cap / 1_000_000_000).toFixed(2)
      )
    }));

    return NextResponse.json(formatted);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch wrapped BTC data" },
      { status: 500 }
    );
  }
}
