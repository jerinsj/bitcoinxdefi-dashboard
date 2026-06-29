type DashboardFooterProps = {
  updatedAt: string;
  refreshLabel?: string;
};

export function DashboardFooter({
  updatedAt,
  refreshLabel = "Data updates weekly",
}: DashboardFooterProps) {
  const snapshot = new Date(updatedAt);

  const formattedDate = snapshot.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: "UTC",
  });

  return (
    <footer className="flex items-center justify-center gap-6 pb-1 text-xs text-slate-500 dark:text-slate-400">
      <span className="flex items-center gap-1.5">
        <span className="h-2 w-2 rounded-full bg-orange-500" />
        Last updated: {formattedDate} UTC
      </span>

      <span>{refreshLabel}</span>
    </footer>
  );
}
