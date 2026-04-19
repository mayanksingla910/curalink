import { OverviewCard } from "./overview-card"
import { SourceCard } from "./source-card"
import { TrialCard } from "./trial-card"

interface LLMResult {
  conditionOverview: string
  researchInsights: any[]
  clinicalTrials: any[]
  personalizedNote: string
  disclaimer: string
  keyFindings?: string[]
  extendedSummary?: string
  primaryDisease: string
}

interface Props {
  result: LLMResult
  disease: string
}

export function StructuredResponse({ result, disease }: Props) {
  return (
    <div className="w-full">
      {/* Overview */}
      {result.conditionOverview && (
        <OverviewCard
          overview={result.conditionOverview}
          personalizedNote={result.personalizedNote}
          disease={result.primaryDisease ?? disease} 
          researchInsights={result.researchInsights}
          keyFindings={result.keyFindings ?? []}
          summary={result.extendedSummary}
        />
      )}

      {/* Publications */}
      {result.researchInsights?.length > 0 && (
        <div className="mt-5">
          <p className="mb-3 text-xs font-medium tracking-widest text-zinc-400 uppercase">
            Research publications
          </p>
          {result.researchInsights.map((pub, i) => (
            <SourceCard key={i} publication={pub} index={i + 1} />
          ))}
        </div>
      )}

      {/* Trials */}
      {result.clinicalTrials?.length > 0 && (
        <div className="mt-5">
          <p className="mb-3 text-xs font-medium tracking-widest text-zinc-400 uppercase">
            Clinical trials
          </p>
          {result.clinicalTrials.map((trial, i) => (
            <TrialCard key={i} trial={trial} />
          ))}
        </div>
      )}

      {/* Disclaimer */}
      {result.disclaimer && (
        <div className="mt-5 flex gap-2.5 rounded-lg border border-amber-200 bg-amber-50 px-3.5 py-3 dark:border-amber-900 dark:bg-amber-950">
          <svg
            className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-600 dark:text-amber-400"
            viewBox="0 0 14 14"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <circle cx="7" cy="7" r="6" />
            <path d="M7 4v3M7 10v.5" />
          </svg>
          <p className="text-xs leading-relaxed text-amber-700 dark:text-amber-300">
            {result.disclaimer}
          </p>
        </div>
      )}
    </div>
  )
}
