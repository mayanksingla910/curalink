// lib/pipeline/llm-client.ts
export const GROQ_MODEL = "llama-3.1-8b-instant"
export const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions"

export async function callGroq(prompt: string, maxTokens = 1500) {
  const res = await fetch(GROQ_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: GROQ_MODEL,
      messages: [{ role: "user", content: prompt }],
      temperature: 0.1,
      max_tokens: maxTokens,
      response_format: { type: "json_object" },
    }),
  })

  const data = await res.json()

  if (!res.ok) {
    throw new Error(`Groq error: ${data.error?.message ?? res.status}`)
  }

  return JSON.parse(data.choices[0].message.content)
}