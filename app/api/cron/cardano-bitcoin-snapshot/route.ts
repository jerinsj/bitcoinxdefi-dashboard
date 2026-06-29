import { NextRequest, NextResponse } from "next/server";
import { getCardanoBitcoinDashboardData } from "@/lib/cardanoBitcoinDashboard";
import { createCardanoBitcoinSnapshot } from "@/lib/cardanoBitcoinHistory";

export const dynamic = "force-dynamic";

function isAuthorized(request: NextRequest) {
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret) {
    return true;
  }

  const authHeader = request.headers.get("authorization");
  return authHeader === `Bearer ${cronSecret}`;
}

export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const dashboard = await getCardanoBitcoinDashboardData();
    const snapshot = createCardanoBitcoinSnapshot(dashboard);

    return NextResponse.json({
      ok: true,
      snapshot,
      persisted: false,
      nextStep:
        "Connect this endpoint to Supabase, Postgres, Vercel Blob, or a GitHub-backed data writer to persist one snapshot per day.",
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to create Cardano Bitcoin snapshot" },
      { status: 500 }
    );
  }
}
