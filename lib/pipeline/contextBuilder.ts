export function buildPrompt({ context, history, publications, trials, query }: any) {
  const pubText = publications
  .slice(0, 6)  // ← only top 6
  .map(
    (p: any, i: number) =>
      `${i + 1}. "${p.title}" (${p.year}, ${p.source})
   Authors: ${p.authors?.join(", ") || "N/A"}
   Abstract: ${p.abstract?.slice(0, 120)}...
   URL: ${p.url}`
  )
  .join("\n\n")

const trialText = trials
  .slice(0, 3)  // ← only top 3
  .map(
    (t: any, i: number) =>
      `${i + 1}. ${t.title}
   Status: ${t.status}
   Location: ${t.locations?.join(", ") || "N/A"}
   Eligibility: ${t.eligibility?.slice(0, 100)}...`
  )
  .join("\n\n")

  const historyText = history
    .slice(-4)
    .map((m: any) => `${m.role === "user" ? "Patient" : "Assistant"}: ${m.content}`)
    .join("\n")

  return `You are Curalink, a medical research assistant. Be precise and never hallucinate.

PATIENT CONTEXT:
- Name: ${context?.name || "Unknown"}
- Disease: ${context?.disease || "Not specified"}
- Location: ${context?.location || "Not specified"}

CONVERSATION HISTORY:
${historyText || "None"}

RETRIEVED PUBLICATIONS:
${pubText || "None found"}

RETRIEVED CLINICAL TRIALS:
${trialText || "None found"}

PATIENT QUESTION: ${query}

Respond ONLY with valid JSON:
{
  "conditionOverview": "2-3 sentence overview relevant to this question",
  "researchInsights": [
    {
      "title": "publication title",
      "authors": "Author et al.",
      "year": 2023,
      "source": "pubmed or openalex",
      "url": "https://...",
      "insight": "1-2 sentence key finding relevant to patient",
      "snippet": "paraphrase from abstract"
    }
  ],
  "clinicalTrials": [
    {
      "title": "trial title",
      "status": "RECRUITING",
      "eligibility": "brief eligibility summary",
      "location": "city, country",
      "contact": "contact name",
      "url": "https://clinicaltrials.gov/..."
    }
  ],
  "personalizedNote": "1-2 sentences specific to this patient",
  "disclaimer": "This is research information only, not medical advice. Consult a qualified physician."
}`
}