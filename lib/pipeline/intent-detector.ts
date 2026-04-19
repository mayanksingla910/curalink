import { callGroq } from "./llm-client"

export async function detectIntent(
  query: string,
  currentDisease: string,
  existingDiseases: string[] = []
) {
  try {
    const result = await callGroq(
      `You are a medical intent detector for a research assistant.

Current primary disease context: "${currentDisease || "none"}"
All diseases discussed so far: ${existingDiseases.length ? existingDiseases.join(", ") : "none"}
User message: "${query}"

Rules:
- isNewTopic: set to true if the user is asking about a DIFFERENT disease than the current primary disease
- isMultiDisease: set to true if the query involves 2 or more diseases simultaneously
- relationshipQuery: set to true if the user is asking how two conditions interact or relate
- primaryDisease: the single most relevant disease for this specific query
- diseases: all diseases explicitly or implicitly mentioned in this query only
- effectiveQuery: rewrite the user message as a clear medical research query (e.g. "what about heart?" becomes "heart disease treatment and management")

Respond ONLY with valid JSON:
{
  "diseases": ["disease1", "disease2"],
  "primaryDisease": "main disease for this query",
  "isMultiDisease": false,
  "isNewTopic": false,
  "relationshipQuery": false,
  "effectiveQuery": "rewritten medical search query"
}`,
      250
    )

    // Validate shape — protect against malformed LLM output
    return {
      diseases: Array.isArray(result.diseases) && result.diseases.length
        ? result.diseases
        : [currentDisease || query],
      primaryDisease: result.primaryDisease || currentDisease || query,
      isMultiDisease: result.isMultiDisease === true,
      isNewTopic: result.isNewTopic === true,
      relationshipQuery: result.relationshipQuery === true,
      effectiveQuery: result.effectiveQuery || query,
    }
  } catch {
    return {
      diseases: currentDisease ? [currentDisease] : [],
      primaryDisease: currentDisease || query,
      isMultiDisease: false,
      isNewTopic: false,
      relationshipQuery: false,
      effectiveQuery: query,
    }
  }
}