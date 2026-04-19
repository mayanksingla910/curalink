export function buildPrompt({
  context,
  history,
  publications,
  summary,
  trials,
  query,
}: any) {
  const diseases: string[] = context?.diseases?.length
    ? context.diseases
    : context?.disease
      ? [context.disease]
      : []

  const diseaseDisplay =
    diseases.length > 1 ? diseases.join(", ") : (diseases[0] ?? "Not specified")

  const isMultiDisease = diseases.length > 1

  const pubText = publications
    .slice(0, 6)
    .map(
      (p: any, i: number) =>
        `${i + 1}. "${p.title}" (${p.year}, ${p.source})
   Authors: ${Array.isArray(p.authors) ? p.authors.join(", ") : p.authors || "N/A"}
   Abstract: ${p.abstract?.slice(0, 120)}...
   URL: ${p.url}`
    )
    .join("\n\n")

  const trialText = trials
    .slice(0, 3)
    .map(
      (t: any, i: number) =>
        `${i + 1}. ${t.title}
   Status: ${t.status}
   Location: ${t.locations?.join(", ") || "N/A"}
   Eligibility: ${t.eligibility?.slice(0, 100)}...`
    )
    .join("\n\n")

  const contextText = summary
    ? `CONVERSATION SUMMARY:\n${summary}`
    : `RECENT MESSAGES:\n${
        history
          .slice(-4)
          .map(
            (m: any) =>
              `${m.role === "user" ? "Patient" : "Assistant"}: ${m.content}`
          )
          .join("\n") || "None"
      }`

  const multiDiseaseInstruction = isMultiDisease
    ? `IMPORTANT: The patient has multiple conditions (${diseaseDisplay}). 
Consider interactions, contraindications, and relationships between these conditions in your response.
Prioritize papers that discuss these conditions together or their interactions.`
    : ""

  return `You are Curalink, a medical research assistant. Be precise, cite sources, and never hallucinate.

PATIENT CONTEXT:
- Name: ${context?.name || "Unknown"}
- Condition(s): ${diseaseDisplay}
- Location: ${context?.location || "Not specified"}

${contextText}

${multiDiseaseInstruction}

RETRIEVED PUBLICATIONS:
${pubText || "None found"}

RETRIEVED CLINICAL TRIALS:
${trialText || "None found"}

PATIENT QUESTION: ${query}

Respond ONLY with valid JSON, no extra text:
{
  "primaryDisease": "the main disease this response is about",
  "conditionOverview": "2-3 sentence overview directly relevant to the question${isMultiDisease ? ", addressing how the conditions relate" : ""}",
  "extendedSummary": "2-3 sentences expanding on the overview with specific clinical detail, statistics, or mechanisms",
  "keyFindings": [
    "specific finding with numbers or percentages where available",
    "second key finding from the research",
    "third key finding${isMultiDisease ? " about the relationship between conditions" : ""}"
  ],
  "researchInsights": [
    {
      "title": "exact publication title",
      "authors": "Last et al.",
      "year": 2023,
      "source": "pubmed or openalex",
      "url": "https://...",
      "insight": "1-2 sentence key finding directly relevant to the patient question",
      "snippet": "paraphrased key quote from abstract"
    }
  ],
  "clinicalTrials": [
    {
      "title": "trial title",
      "status": "RECRUITING",
      "eligibility": "brief plain-English eligibility summary",
      "location": "city, country",
      "contact": "contact name or N/A",
      "url": "https://clinicaltrials.gov/..."
    }
  ],
  "personalizedNote": "1-2 sentences tailored to this patient's specific condition(s) and location",
  "disclaimer": "This is research information only, not medical advice. Consult a qualified physician before making any treatment decisions."
}`
}
