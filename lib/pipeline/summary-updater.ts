import { callGroq } from "./llm-client"

export async function updateChatSummary(
  existingSummary: string | null,
  userMessage: string,
  assistantResponse: string,
  diseases: string[]
) {
  try {
    const result = await callGroq(
      `You are a medical conversation summarizer.

Existing summary: "${existingSummary ?? "No summary yet"}"
Diseases discussed: ${diseases.join(", ")}

New exchange:
Patient asked: "${userMessage}"
Key findings from response: "${assistantResponse.slice(0, 300)}"

Update the summary to include the new information. Keep it concise (max 150 words).
Focus on: what conditions were discussed, what treatments/trials were found, what the patient seems to be researching.

Respond ONLY with valid JSON:
{
  "summary": "updated rolling summary"
}`,
      300
    )
    return result.summary as string
  } catch {
    return existingSummary ?? ""
  }
}