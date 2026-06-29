import { NextResponse } from "next/server";
import { getCardanoBitcoinDashboardData } from "@/lib/cardanoBitcoinDashboard";
import { getCardanoBitcoinHistory } from "@/lib/cardanoBitcoinHistory";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const dashboard = await getCardanoBitcoinDashboardData();
    const history = getCardanoBitcoinHistory(dashboard);

    return NextResponse.json({
      ...history,
      note:
        history.source === "seeded-history"
          ? "Historical chart uses a bootstrap series until enough daily production snapshots are saved."
          : "Historical chart is based on saved daily production snapshots.",
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to load Cardano Bitcoin history" },
      { status: 500 }
    );
  }
}
