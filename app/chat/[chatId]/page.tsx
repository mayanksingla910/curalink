import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import { ChatLoader } from "../_components/chat-loader"
import { MessageFeed } from "../_components/message-feed"

export default async function ChatPage({
  params,
}: {
  params: Promise<{ chatId: string }>
}) {
  const { chatId } = await params // ← await params first

  const chat = await prisma.chat.findUnique({
    where: { id: chatId },
    include: {
      context: true,
      messages: { orderBy: { createdAt: "asc" } },
    },
  })

  if (!chat) notFound()

  const initialMessages = chat.messages.map((m) => ({
    id: m.id,
    role: m.role as "user" | "assistant",
    content: m.content,
    result: (m.metadata as any)?.fullResult ?? null,
    sources: m.sources
      ? {
          ...(m.sources as any),
          publications: ((m.sources as any).publications ?? []).map(
            (p: any) => ({
              ...p,
              authors: Array.isArray(p.authors)
                ? p.authors
                : typeof p.authors === "string"
                  ? p.authors.split(", ")
                  : [],
            })
          ),
        }
      : null,
  }))

  return (
    <>
      <ChatLoader
        chatId={chat.id}
        initialMessages={initialMessages}
        patientContext={chat.context}
      />
      <MessageFeed />
    </>
  )
}
