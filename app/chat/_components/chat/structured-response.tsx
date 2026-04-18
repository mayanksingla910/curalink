import { OverviewCard } from "./overview-card";
import { SourceCard } from "./source-card";
import { TrialCard } from "./trial-card";

interface LLMResult {
  conditionOverview: string;
  researchInsights: any[];
  clinicalTrials: any[];
  personalizedNote: string;
  disclaimer: string;
}

interface Props {
  result: LLMResult;
  disease: string;
}

export function StructuredResponse({ result, disease }: Props) {
  return (
    <div className="w-full">
      {/* Overview */}
      {result.conditionOverview && (
        <OverviewCard
          overview={result.conditionOverview}
          personalizedNote={result.personalizedNote}
          disease={disease}
        />
      )}

      {/* Publications */}
      {result.researchInsights?.length > 0 && (
        <div className="mt-5">
          <p className="text-xs font-medium tracking-widest uppercase text-zinc-400 mb-3">
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
          <p className="text-xs font-medium tracking-widest uppercase text-zinc-400 mb-3">
            Clinical trials
          </p>
          {result.clinicalTrials.map((trial, i) => (
            <TrialCard key={i} trial={trial} />
          ))}
        </div>
      )}

      {/* Disclaimer */}
      {result.disclaimer && (
        <div className="flex gap-2.5 mt-5 px-3.5 py-3 bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-900 rounded-lg">
          <svg className="w-3.5 h-3.5 mt-0.5 shrink-0 text-amber-600 dark:text-amber-400" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="7" cy="7" r="6"/><path d="M7 4v3M7 10v.5"/>
          </svg>
          <p className="text-xs text-amber-700 dark:text-amber-300 leading-relaxed">
            {result.disclaimer}
          </p>
        </div>
      )}
    </div>
  );
}