import { NextResponse } from "next/server";
import { getCardanoBitcoinDashboardData } from "@/lib/cardanoBitcoinDashboard";
import { getCardanoBitcoinHistory } from "@/lib/cardanoBitcoinHistory";
import { fetchPersistedCardanoBitcoinSnapshots } from "@/lib/cardanoBitcoinHistoryStorage";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const [dashboard, persistedSnapshots] = await Promise.all([
      getCardanoBitcoinDashboardData(),
      fetchPersistedCardanoBitcoinSnapshots(),
    ]);
    const history = getCardanoBitcoinHistory(dashboard, persistedSnapshots);

    return NextResponse.json({
      ...history,
      persistedSnapshotCount: persistedSnapshots.length,
      note:
        history.source === "seeded-history"
          ? "Historical chart uses a bootstrap series until enough daily production snapshots are saved."
          : "Historical chart is based on saved daily production snapshots.",
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to load Cardano Bitcoin history",
        detail: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
