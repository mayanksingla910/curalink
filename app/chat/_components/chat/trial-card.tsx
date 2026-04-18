import Link from "next/link";

interface Trial {
  title: string;
  status: string;
  eligibility: string;
  locations: string[];
  contact: string;
  url: string;
}

interface Props { trial: Trial }

function StatusBadge({ status }: { status: string }) {
  const s = status.toUpperCase();
  const styles: Record<string, string> = {
    RECRUITING: "bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-300 dark:border-green-900",
    COMPLETED: "bg-zinc-100 text-zinc-500 border-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:border-zinc-700",
    "ACTIVE_NOT_RECRUITING": "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-900",
    TERMINATED: "bg-red-50 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-300 dark:border-red-900",
  };
  const label: Record<string, string> = {
    RECRUITING: "Recruiting",
    COMPLETED: "Completed",
    ACTIVE_NOT_RECRUITING: "Active, not recruiting",
    TERMINATED: "Terminated",
    NOT_YET_RECRUITING: "Not yet recruiting",
  };
  const cls = styles[s] ?? styles.COMPLETED;
  return (
    <span className={`text-xs font-medium px-2.5 py-1 rounded border shrink-0 ${cls}`}>
      {label[s] ?? status}
    </span>
  );
}

export function TrialCard({ trial }: Props) {
  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 mb-3">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <p className="text-sm font-medium text-zinc-800 dark:text-zinc-100 leading-snug flex-1">
          {trial.title}
        </p>
        <StatusBadge status={trial.status} />
      </div>

      {/* Meta grid */}
      <div className="grid grid-cols-2 gap-3 mb-3">
        <div>
          <p className="text-[10px] font-medium tracking-widest uppercase text-zinc-400 mb-1">Location</p>
          <p className="text-xs text-zinc-500">{trial.locations?.join(" · ") || "N/A"}</p>
        </div>
        <div>
          <p className="text-[10px] font-medium tracking-widest uppercase text-zinc-400 mb-1">Contact</p>
          <p className="text-xs text-zinc-500">{trial.contact || "N/A"}</p>
        </div>
      </div>

      {/* Eligibility */}
      {trial.eligibility && (
        <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800 flex items-start justify-between gap-3">
          <p className="text-xs text-zinc-400 leading-relaxed flex-1 line-clamp-3">
            {trial.eligibility.slice(0, 220)}
            {trial.eligibility.length > 220 ? "..." : ""}
          </p>
          {trial.url && (
            <Link
              href={trial.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-teal-600 dark:text-teal-400 flex items-center gap-1 px-3 py-1 border border-teal-200 dark:border-teal-900 rounded bg-teal-50 dark:bg-teal-950 hover:opacity-75 transition-opacity shrink-0"
            >
              View trial
              <svg className="w-2.5 h-2.5 opacity-70" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M2 8L8 2M4 2h4v4"/>
              </svg>
            </Link>
          )}
        </div>
      )}
    </div>
  );
}