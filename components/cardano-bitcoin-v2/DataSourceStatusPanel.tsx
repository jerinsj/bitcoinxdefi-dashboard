type StatusLevel = "healthy" | "warning" | "offline";

type DataSourceStatus = {
  name: string;
  description: string;
  status: StatusLevel;
  lastUpdated?: string | null;
  detail: string;
};

type DataSourceStatusPanelProps = {
  statuses: DataSourceStatus[];
};

function formatTimestamp(value?: string | null) {
  if (!value) {
    return "Not available";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Not available";
  }

  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: "UTC",
  });
}

function getStatusClasses(status: StatusLevel) {
  if (status === "healthy") {
    return {
      dot: "bg-green-500",
      badge:
        "border-green-300 bg-green-50 text-green-700 dark:border-green-500/40 dark:bg-green-500/10 dark:text-green-300",
      label: "Healthy",
    };
  }

  if (status === "warning") {
    return {
      dot: "bg-amber-500",
      badge:
        "border-amber-300 bg-amber-50 text-amber-700 dark:border-amber-500/40 dark:bg-amber-500/10 dark:text-amber-300",
      label: "Warning",
    };
  }

  return {
    dot: "bg-red-500",
    badge:
      "border-red-300 bg-red-50 text-red-700 dark:border-red-500/40 dark:bg-red-500/10 dark:text-red-300",
    label: "Offline",
  };
}

export function DataSourceStatusPanel({ statuses }: DataSourceStatusPanelProps) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-[#16263a] dark:bg-[#071220]">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-950 dark:text-white">
            Data Source Health
          </h2>
          <p className="mt-1 text-sm text-slate-600 dark:text-[#cbd5e1]">
            Current availability and freshness for dashboard inputs.
          </p>
        </div>

        <span className="inline-flex w-fit rounded-full border border-orange-300 bg-orange-50 px-3 py-1 text-xs font-semibold text-orange-700 dark:border-orange-500/40 dark:bg-orange-500/10 dark:text-orange-300">
          Phase 11.6
        </span>
      </div>

      <div className="mt-5 grid gap-3">
        {statuses.map((source) => {
          const statusClasses = getStatusClasses(source.status);

          return (
            <article
              key={source.name}
              className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-[#16263a] dark:bg-[#020d1a]"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex gap-3">
                  <span
                    className={`mt-1 h-2.5 w-2.5 shrink-0 rounded-full ${statusClasses.dot}`}
                  />

                  <div>
                    <h3 className="font-semibold text-slate-950 dark:text-white">
                      {source.name}
                    </h3>
                    <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                      {source.description}
                    </p>
                    <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                      Last updated: {formatTimestamp(source.lastUpdated)} UTC
                    </p>
                  </div>
                </div>

                <span
                  className={`inline-flex w-fit rounded-full border px-2.5 py-1 text-xs font-semibold ${statusClasses.badge}`}
                >
                  {statusClasses.label}
                </span>
              </div>

              <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
                {source.detail}
              </p>
            </article>
          );
        })}
      </div>
    </section>
  );
}
