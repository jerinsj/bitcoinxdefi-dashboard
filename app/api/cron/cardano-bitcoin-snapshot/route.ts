import { NextRequest, NextResponse } from "next/server";
import { getCardanoBitcoinDashboardData } from "@/lib/cardanoBitcoinDashboard";
import { createCardanoBitcoinSnapshot } from "@/lib/cardanoBitcoinHistory";
import { persistCardanoBitcoinSnapshot } from "@/lib/cardanoBitcoinHistoryStorage";

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
    await persistCardanoBitcoinSnapshot(snapshot);

    return NextResponse.json({
      ok: true,
      persisted: true,
      snapshot,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to create Cardano Bitcoin snapshot",
        detail: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
