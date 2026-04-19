export function rankResults(
  publications: any[],
  trials: any[],
  query: string,
  disease = ""
) {
  const terms = [
    ...query.toLowerCase().split(/\s+/),
    ...disease.toLowerCase().split(/\s+/),
  ].filter((t) => t.length > 3)

  if (terms.length === 0) return { publications: [], trials: [] }

  const scored = publications
    .filter((pub) => pub && typeof pub.title === "string") // ← filter nulls first
    .map((pub) => {
      let score = 0
      const titleLower = (pub.title ?? "").toLowerCase()
      const abstractLower = (pub.abstract ?? "").toLowerCase()

      const age = new Date().getFullYear() - (pub.year || 2000)
      score += Math.max(0, 30 - age * 3)

      let titleHits = 0
      terms.forEach((t) => {
        if (titleLower.includes(t)) { score += 15; titleHits++ }
        else if (abstractLower.includes(t)) score += 8
      })

      score += Math.min(20, (pub.citations ?? 0) / 10)
      score += pub.source === "pubmed" ? 10 : 6
      if (titleHits === 0) score -= 40

      return { ...pub, score }
    })

  const seen = new Set<string>()
  const deduped = scored.filter((item) => {
    const key = (item.title ?? "").toLowerCase().replace(/\s+/g, " ").slice(0, 60)
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })

  return {
    publications: deduped
      .filter((p) => p.score > 20)
      .sort((a, b) => b.score - a.score)
      .slice(0, 8),
    trials: trials.filter((t) => t && t.title).slice(0, 4),
  }
}