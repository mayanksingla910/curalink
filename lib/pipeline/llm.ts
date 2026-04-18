import { callGroq } from "./llm-client"

export async function callLLM(prompt: string) {
  try {
    return await callGroq(prompt, 2048)
  } catch (e) {
    console.error("LLM call failed:", e)
    return {
      conditionOverview: "",
      researchInsights: [],
      clinicalTrials: [],
      personalizedNote: "",
      disclaimer: "This is research information only, not medical advice.",
    }
  }
}