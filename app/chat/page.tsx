"use client"

import { AnimatePresence, motion } from "framer-motion"
import { useChat } from "./context/chat-context"

export default function NewChatPage() {
  const { hasMessages } = useChat()

  return (
    <AnimatePresence>
      {!hasMessages && (
        <motion.div
          key="greeting"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          className="flex h-full items-center justify-center pointer-events-none"
        >
          <h1 className="text-2xl font-semibold">What can I help you with?</h1>
        </motion.div>
      )}
    </AnimatePresence>
  )
}