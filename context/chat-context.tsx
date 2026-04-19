"use client"

import { createContext, useContext, useState, useRef, useCallback } from "react"
import { useRouter } from "next/navigation"
import { authClient } from "@/lib/auth-client"

interface Chat {
  id: string
  title: string
}

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  result?: any
  sources?: any
}

interface PatientContext {
  disease: string
  name?: string
  location?: string
}

interface ChatContextType {
  messages: Message[]
  status: string | null
  isLoading: boolean
  hasMessages: boolean
  currentChatId: string | null
  patientContext: PatientContext | null
  chats: Chat[]
  sendMessage: (content: string) => Promise<void>
  loadChat: (
    chatId: string,
    initialMessages: Message[],
    context: PatientContext | null
  ) => void
  startNewChat: (
    disease: string,
    name?: string,
    location?: string
  ) => Promise<void>
  setPatientContext: (ctx: PatientContext) => void
  resetChat: () => void
  addChat: (chat: Chat) => void
  removeChat: (id: string) => void
}

const ChatContext = createContext<ChatContextType | null>(null)

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [messages, setMessages] = useState<Message[]>([])
  const [status, setStatus] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const isLoadingRef = useRef(false)
  const [currentChatId, setCurrentChatId] = useState<string | null>(null)
  const [patientContext, setPatientContext] = useState<PatientContext | null>(
    null
  )
  const [chats, setChats] = useState<Chat[]>([])

  const { data: session } = authClient.useSession()

  const addChat = useCallback((chat: Chat) => {
    setChats((prev) => {
      if (prev.some((c) => c.id === chat.id)) return prev
      return [chat, ...prev]
    })
  }, [])

  const removeChat = useCallback((id: string) => {
    setChats((prev) => prev.filter((c) => c.id !== id))
  }, [])

  const resetChat = useCallback(() => {
    setMessages([])
    setStatus(null)
    setCurrentChatId(null)
    setPatientContext(null)
    setIsLoading(false)
    isLoadingRef.current = false
  }, [])

  const loadChat = useCallback(
    (
      chatId: string,
      initialMessages: Message[],
      context: PatientContext | null
    ) => {
      setCurrentChatId(chatId)
      setMessages(initialMessages)
      setPatientContext(context)
      setStatus(null)
    },
    []
  )

  const startNewChat = useCallback(
    async (disease: string, name?: string, location?: string) => {
      resetChat()
      console.log("startNewChat called with:", { disease, name, location })
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ disease, name, location }),
      })
      console.log("startNewChat response status:", res.status)
      const body = await res.json()
      console.log("startNewChat response body:", body)
      const { chat } = body
      addChat({ id: chat.id, title: chat.title })
      setCurrentChatId(chat.id)
      setPatientContext({ disease, name, location })
      router.push(`/chat/${chat.id}`)
    },
    [router, addChat, resetChat]
  )

  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim() || isLoadingRef.current) return

      let chatId = currentChatId
      if (!chatId) {
        const disease = patientContext?.disease ?? content.slice(0, 60)
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ disease }),
        })
        const { chat } = await res.json()
        addChat({ id: chat.id, title: chat.title })
        chatId = chat.id
        setCurrentChatId(chat.id)
        if (session) {
          router.push(`/chat/${chat.id}`)
        }
      }

      isLoadingRef.current = true
      setIsLoading(true)
      setMessages((prev) => [
        ...prev,
        { id: crypto.randomUUID(), role: "user", content },
      ])

      try {
        const res = await fetch("/api/message", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ chatId, content }),
        })

        if (!res.body) throw new Error("No stream")

        const reader = res.body.getReader()
        const decoder = new TextDecoder()
        let buffer = ""

        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          buffer += decoder.decode(value, { stream: true })
          const lines = buffer.split("\n")
          buffer = lines.pop() ?? ""

          for (const line of lines) {
            if (!line.startsWith("data: ")) continue
            try {
              const event = JSON.parse(line.slice(6))
              if (event.type === "status") {
                setStatus(event.message)
              } else if (event.type === "done") {
                setStatus(null)
                setMessages((prev) => [
                  ...prev,
                  {
                    id: crypto.randomUUID(),
                    role: "assistant",
                    content: event.result?.conditionOverview ?? "",
                    result: event.result,
                    sources: event.sources,
                  },
                ])
              } else if (event.type === "context_update") {
                setPatientContext((prev) =>
                  prev ? { ...prev, ...event.context } : event.context
                )
              } else if (event.type === "error") {
                setStatus(null)
                setMessages((prev) => [
                  ...prev,
                  {
                    id: crypto.randomUUID(),
                    role: "assistant",
                    content: event.message ?? "Something went wrong.",
                  },
                ])
              }
            } catch {}
          }
        }
      } catch {
        setStatus(null)
        setMessages((prev) => [
          ...prev,
          {
            id: crypto.randomUUID(),
            role: "assistant",
            content: "Something went wrong. Please try again.",
          },
        ])
      } finally {
        setIsLoading(false)
        isLoadingRef.current = false
      }
    },
    [currentChatId, patientContext, router, addChat, session]
  )

  return (
    <ChatContext.Provider
      value={{
        messages,
        status,
        isLoading,
        hasMessages: messages.length > 0,
        currentChatId,
        patientContext,
        chats,
        sendMessage,
        loadChat,
        startNewChat,
        setPatientContext,
        resetChat,
        addChat,
        removeChat,
      }}
    >
      {children}
    </ChatContext.Provider>
  )
}

export function useChat() {
  const ctx = useContext(ChatContext)
  if (!ctx) throw new Error("useChat must be used inside ChatProvider")
  return ctx
}
