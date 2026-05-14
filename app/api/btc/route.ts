import { NextResponse } from "next/server";

export const revalidate = 60;

export async function GET() {
  const res = await fetch(
    "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd&include_market_cap=true&include_24hr_change=true",
    { next: { revalidate: 60 } }
  );

  if (!res.ok) {
    return NextResponse.json(
      { error: "Failed to fetch BTC data" },
      { status: 500 }
    );
  }

  const data = await res.json();

  return NextResponse.json({
    price: data.bitcoin.usd,
    marketCap: data.bitcoin.usd_market_cap,
    change24h: data.bitcoin.usd_24h_change
  });
}
