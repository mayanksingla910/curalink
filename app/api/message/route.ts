import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { expandQuery } from "@/lib/pipeline/queryExpander"
import { fetchAllSources } from "@/lib/pipeline/dataFetcher"
import { rankResults } from "@/lib/pipeline/ranker"
import { buildPrompt } from "@/lib/pipeline/contextBuilder"
import { callLLM } from "@/lib/pipeline/llm"

export async function POST(req: NextRequest) {
  const { chatId, content } = await req.json()

  // 1. Load chat context + history
  const chat = await prisma.chat.findUnique({
    where: { id: chatId },
    include: {
      context: true,
      messages: {
        orderBy: { createdAt: "asc" },
        take: 6, // last 3 exchanges
      },
    },
  })

  if (!chat) {
    return new Response(JSON.stringify({ error: "Chat not found" }), {
      status: 404,
    })
  }

  // 2. Save user message immediately
  await prisma.message.create({
    data: { chatId, role: "user", content },
  })

  // 3. Stream response back
  const encoder = new TextEncoder()
  const stream = new ReadableStream({
    async start(controller) {
      const send = (data: object) => {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`))
      }

      try {
        // Step 1 — expand query
        send({ type: "status", message: "Expanding your query..." })
        const { pubmedQuery, openAlexQuery, trialsQuery } = await expandQuery(
          content,
          chat.context
        )

        // Step 2 — fetch in parallel
        send({
          type: "status",
          message: "Searching PubMed, OpenAlex, ClinicalTrials...",
        })
        const { publications, trials } = await fetchAllSources({
          pubmedQuery,
          openAlexQuery,
          trialsQuery,
        })
        console.log(
          `Fetched ${publications.length} publications and ${trials.length} trials`
        )

        send({
          type: "status",
          message: `Found ${publications.length} publications and ${trials.length} trials. Ranking...`,
        })

        // Step 3 — rank
        let ranked
try {
  ranked = rankResults(publications, trials, content, chat.context?.disease)
  console.log("Ranked:", ranked.publications.length, "pubs,", ranked.trials.length, "trials")
} catch (rankErr) {
  console.error("Rank error:", rankErr)
  throw rankErr
}

console.log("Ranked publications:", ranked.publications.length)
console.log("Ranked trials:", ranked.trials.length)
console.log("Sample pub:", JSON.stringify(ranked.publications[0]).slice(0, 200))

        // Step 4 — build prompt
        send({ type: "status", message: "Generating insights..." })
        const prompt = buildPrompt({
          context: chat.context,
          history: chat.messages,
          publications: ranked.publications,
          trials: ranked.trials,
          query: content,
        })

console.log("Prompt length (chars):", prompt.length)
console.log("Prompt length (approx tokens):", Math.round(prompt.length / 4))

        // Step 5 — call LLM
        let result
        try {
          result = await callLLM(prompt)
        } catch (llmErr) {
          console.error("LLM call threw:", llmErr)
          throw llmErr
        }
        console.log("LLM result:", JSON.stringify(result).slice(0, 300))
        console.log("LLM result type:", typeof result)
        console.log("conditionOverview:", result?.conditionOverview)
        console.log("researchInsights:", result?.researchInsights?.length)

        // Step 6 — save assistant message
        await prisma.message.create({
          data: {
            chatId,
            role: "assistant",
            content: result.conditionOverview ?? "",
            sources: {
              publications: ranked.publications.map((p: any) => ({
                ...p,
                authors: Array.isArray(p.authors)
                  ? p.authors
                  : [p.authors].filter(Boolean),
              })),
              trials: ranked.trials,
            },
            metadata: { fullResult: result },
          },
        })

        // Update chat timestamp
        await prisma.chat.update({
          where: { id: chatId },
          data: { updatedAt: new Date() },
        })

        // Step 7 — send final result
        send({ type: "done", result, sources: ranked })
        controller.close()
      } catch (err) {
        send({
          type: "error",
          message: "Something went wrong. Please try again.",
          error: err,
        })
        controller.close()
      }
    },
  })

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  })
}
