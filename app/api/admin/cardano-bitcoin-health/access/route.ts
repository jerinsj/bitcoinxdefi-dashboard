import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { passcode } = await request.json();

  if (passcode !== process.env.CARDANO_HEALTH_PASSCODE) {
    return NextResponse.json({ error: "Invalid passcode" }, { status: 401 });
  }

  const response = NextResponse.json({ success: true });

  response.cookies.set("cardano_health_access", "true", {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    path: "/admin/cardano-bitcoin-health",
    maxAge: 60 * 60 * 12,
  });

  return response;
}
