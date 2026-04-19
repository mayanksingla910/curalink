import { callGroq } from "./llm-client"

export async function expandQuery(query: string, context: any) {
  const disease = (context?.disease ?? "").trim()
  const diseases: string[] = context?.diseases ?? [disease]

  const diseaseContext =
    diseases.length > 1
      ? `Multiple conditions: ${diseases.join(", ")}`
      : `Condition: ${disease}`
  try {
    const result = await callGroq(
      `You are a medical search query expert.

    ${diseaseContext}
    User question: ${query}

    ${diseases.length > 1 ? `The user is asking about the relationship or interaction between these conditions. Build queries that capture this relationship.` : ""}

    Respond ONLY with valid JSON:
    {
      "pubmedQuery": "PubMed boolean query — if multiple diseases, use AND to find papers covering both",
      "openAlexQuery": "natural language search covering all mentioned conditions",
      "clinicalTrialCondition": "primary condition for ClinicalTrials.gov",
      "clinicalTrialKeyword": "intervention or secondary condition as keyword"
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
