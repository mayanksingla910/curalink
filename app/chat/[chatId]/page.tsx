"use client"

import { useEffect } from "react"
import { useChat } from "../context/chat-context"
import { AnimatePresence, motion } from "framer-motion"

const mockMessages = [
  { id: "1", role: "user", content: "Hello!" },
  { id: "2", role: "assistant", content: "Hi! How can I help?" },
  { id: "3", role: "user", content: "Hello!" },
  { id: "4", role: "assistant", content: "Hi! How can I help?" },
  { id: "5", role: "user", content: "Hello!" },
  { id: "6", role: "assistant", content: "Hi! How can I help?" },
  { id: "7", role: "user", content: "Hello!" },
  { id: "8", role: "assistant", content: "Hi! How can I help?" },
  { id: "9", role: "user", content: "Hello!" },
  { id: "10", role: "assistant", content: "Hi! How can I help?" },
  { id: "11", role: "user", content: "Hello!" },
  { id: "12", role: "assistant", content: "Hi! How can I help?" },
  { id: "13", role: "user", content: "Hello!" },
  { id: "14", role: "assistant", content: "Hi! How can I help?" },
  { id: "15", role: "user", content: "Hello!" },
  { id: "16", role: "assistant", content: "Hi! How can I help?" },
]

export default function ChatPage() {
  const { setHasMessages } = useChat()

  useEffect(() => {
    setHasMessages(true)
    return () => setHasMessages(false)
  }, [setHasMessages])

  return (
    <div className="py-4 px-2 overflow-hidden space-y-4">
      <AnimatePresence> 
        {mockMessages.map((m) => (
          <motion.div
            key={m.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className={m.role === "user" ? "px-3 py-1 bg-accent w-fit rounded-md ml-auto" : "text-left"}
          >
            {m.content}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}