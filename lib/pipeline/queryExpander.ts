import { callGroq } from "./llm-client"
import { Context } from "@/types/pipeline"

export async function expandQuery(query: string, context: Context | null) {
  const disease = (context?.disease ?? "").trim()

  try {
    const result = await callGroq(
      `You are a medical search query expert.

Patient disease: ${disease}
User question: ${query}

Respond ONLY with valid JSON:
{
  "pubmedQuery": "optimized PubMed boolean query using MeSH terms and AND/OR operators",
  "openAlexQuery": "natural language search string for this condition and topic",
  "clinicalTrialCondition": "exact condition name for ClinicalTrials.gov",
  "clinicalTrialKeyword": "intervention or treatment keyword only"
}`,
      300
    )

    console.log("AI expanded query:", result)

    return {
      pubmedQuery: result.pubmedQuery,
      openAlexQuery: result.openAlexQuery,
      trialsQuery: {
        cond: result.clinicalTrialCondition,
        term: result.clinicalTrialKeyword,
      },
    }
  } catch (e) {
    console.error("Query expansion failed, using fallback:", e)
    return fallbackExpand(query, disease)
  }
}

function fallbackExpand(query: string, disease: string) {
  const base =
    disease && !query.toLowerCase().includes(disease.toLowerCase())
      ? `${disease} ${query}`
      : query

  const termIsDifferent =
    query.toLowerCase() !== disease.toLowerCase() &&
    !disease.toLowerCase().includes(query.toLowerCase())

  return {
    pubmedQuery: base,
    openAlexQuery: base,
    trialsQuery: {
      cond: disease || query,
      term: termIsDifferent ? query : "",
    },
  }
}