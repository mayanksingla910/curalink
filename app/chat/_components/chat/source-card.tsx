import Link from "next/link"

interface Publication {
  title: string
  authors: string[]
  year: number
  source: "pubmed" | "openalex"
  url: string
  insight: string
  snippet: string
}

interface Props {
  publication: Publication
  index: number
}

const sourceBadge = {
  pubmed:
    "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-900",
  openalex:
    "bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-950 dark:text-teal-300 dark:border-teal-900",
}

export function SourceCard({ publication, index }: Props) {
  const authors = Array.isArray(publication.authors)
    ? publication.authors
    : typeof publication.authors === "string"
      ? publication.authors.split(", ")
      : []
  return (
    <div className="mb-3 rounded-xl border border-zinc-200 bg-white p-4 transition-colors hover:border-blue-200 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-blue-900">
      {/* Header */}
      <div className="mb-3 flex items-start gap-3">
        <span className="shrink-0 pt-0.5 font-mono text-xs text-zinc-400">
          {String(index).padStart(2, "0")}
        </span>
        <p className="text-sm leading-snug font-medium text-zinc-800 dark:text-zinc-100">
          {publication.title}
        </p>
      </div>

      {/* Badges */}
      <div className="mb-3 flex flex-wrap items-center gap-2 pl-7">
        <span
          className={`rounded border px-2 py-0.5 text-xs font-medium ${sourceBadge[publication.source]}`}
        >
          {publication.source === "pubmed" ? "PubMed" : "OpenAlex"}
        </span>
        <span className="rounded border border-zinc-200 bg-zinc-50 px-2 py-0.5 text-xs font-medium text-zinc-500 dark:border-zinc-700 dark:bg-zinc-800">
          {publication.year}
        </span>
      </div>

      {/* Insight */}
      <p className="mb-3 pl-7 text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
        {publication.insight}
      </p>

      {/* Snippet */}
      {publication.snippet && (
        <div className="mb-3 ml-7 border-l-2 border-zinc-200 bg-zinc-50 px-3 py-2 font-mono text-xs leading-relaxed text-zinc-400 dark:border-zinc-700 dark:bg-zinc-800/50">
          {publication.snippet}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center gap-3 pl-7">
        <p className="flex-1 truncate text-xs text-zinc-400">
          {authors.slice(0, 3).join(", ")}
          {authors.length > 3 ? " et al." : ""}
        </p>
        <Link
          href={publication.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex shrink-0 items-center gap-1 rounded border border-blue-200 bg-blue-50 px-3 py-1 text-xs text-blue-600 transition-opacity hover:opacity-75 dark:border-blue-900 dark:bg-blue-950 dark:text-blue-400"
        >
          View paper
          <svg
            className="h-2.5 w-2.5 opacity-70"
            viewBox="0 0 10 10"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <path d="M2 8L8 2M4 2h4v4" />
          </svg>
        </Link>
      </div>
    </div>
  )
}
