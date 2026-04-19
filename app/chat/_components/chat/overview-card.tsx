import Link from "next/link"

interface ResearchInsight {
  title: string
  authors: string
  year: number
  source: string
  url: string
  insight: string
  snippet: string
}

interface Props {
  overview: string
  personalizedNote?: string
  disease: string
  researchInsights?: ResearchInsight[]
  keyFindings?: string[]
  summary?: string
}

export function OverviewCard({
  overview,
  personalizedNote,
  disease,
  researchInsights = [],
  keyFindings = [],
  summary,
}: Props) {
  return (
    <div className="mb-4 overflow-hidden rounded-2xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
      
      {/* Header bar */}
      <div className="border-b border-zinc-100 px-5 py-3 dark:border-zinc-800">
        <div className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-teal-500" />
          <p className="text-xs font-medium uppercase tracking-widest text-teal-600 dark:text-teal-400">
            Research summary — {disease}
          </p>
        </div>
      </div>

      <div className="p-5 space-y-5">

        {/* Lead paragraph — the "overview" from LLM */}
        <p className="font-serif text-[17px] leading-[1.75] text-zinc-800 dark:text-zinc-100">
          {overview}
        </p>

        {/* Extended summary if provided */}
        {summary && summary !== overview && (
          <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
            {summary}
          </p>
        )}

        {/* Key findings — bulleted, highlighted */}
        {keyFindings.length > 0 && (
          <div>
            <p className="mb-2.5 text-[11px] font-semibold uppercase tracking-widest text-zinc-400">
              Key findings
            </p>
            <ul className="space-y-2">
              {keyFindings.map((finding, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-teal-400" />
                  <span className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                    {finding}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Inline citations from top papers */}
        {researchInsights.length > 0 && (
          <div>
            <p className="mb-2.5 text-[11px] font-semibold uppercase tracking-widest text-zinc-400">
              Supporting evidence
            </p>
            <div className="space-y-2.5">
              {researchInsights.slice(0, 3).map((pub, i) => (
                <div
                  key={i}
                  className="flex gap-3 rounded-lg border border-zinc-100 bg-zinc-50 p-3 dark:border-zinc-800 dark:bg-zinc-800/40"
                >
                  {/* Citation number */}
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded bg-zinc-200 font-mono text-[10px] font-medium text-zinc-500 dark:bg-zinc-700 dark:text-zinc-400">
                    {i + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    {/* Insight text */}
                    <p className="text-xs leading-relaxed text-zinc-600 dark:text-zinc-400">
                      {pub.insight}
                    </p>
                    {/* Paper meta + link */}
                    <div className="mt-1.5 flex items-center gap-2">
                      <Link
                        href={pub.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="truncate text-[11px] text-teal-600 hover:underline dark:text-teal-400"
                      >
                        {pub.title.length > 60
                          ? pub.title.slice(0, 60) + "..."
                          : pub.title}
                      </Link>
                      <span className="shrink-0 text-[11px] text-zinc-400">
                        · {pub.year}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Personalized note */}
        {personalizedNote && (
          <div className="flex gap-2.5 rounded-lg border border-teal-100 bg-teal-50 p-3 dark:border-teal-900/50 dark:bg-teal-950/30">
            <svg
              className="mt-0.5 h-3.5 w-3.5 shrink-0 text-teal-500"
              viewBox="0 0 14 14"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <circle cx="7" cy="7" r="6" />
              <path d="M7 5v3M7 10v.5" />
            </svg>
            <p className="text-xs italic leading-relaxed text-teal-700 dark:text-teal-300">
              {personalizedNote}
            </p>
          </div>
        )}

      </div>
    </div>
  )
}