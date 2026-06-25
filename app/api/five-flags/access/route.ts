import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { passcode } = await request.json();

  if (passcode !== process.env.FIVE_FLAGS_PASSCODE) {
    return NextResponse.json({ error: "Invalid passcode" }, { status: 401 });
  }

  const response = NextResponse.json({ success: true });

  response.cookies.set("five_flags_access", "true", {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    path: "/five-flags",
    maxAge: 60 * 60 * 24 * 7,
  });

  return response;
}
