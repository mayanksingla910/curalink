"use client"

import { AnimatePresence, motion } from "framer-motion"
import LoginRedirectButton from "@/components/login-redirect-button"
import ThemeToggle from "@/components/theme-toggle"
import GuestChatInput from "@/components/guest-chat-input"
import { MessageFeed } from "@/app/chat/_components/message-feed"
import { useChat } from "@/context/chat-context"

export default function Page() {
  const { hasMessages, status } = useChat()

  return (
    <div className="flex min-h-screen w-full flex-col">
      {/* Header */}
      <header className="sticky top-0 z-10 flex h-16 w-full items-center justify-between border-b bg-background/80 px-6 backdrop-blur-md md:px-12">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold">Cura Link</span>
          <span className="rounded-md border border-zinc-200 bg-zinc-50 px-1.5 py-0.5 text-[10px] text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900">
            Guest
          </span>
        </div>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <LoginRedirectButton />
        </div>
      </header>

      {/* Main content area */}
      <main className="relative mx-auto flex w-full max-w-3xl flex-1 flex-col px-4">

        {/* Greeting — shown only before first message */}
        <AnimatePresence>
          {!hasMessages && !status && (
            <motion.div
              key="greeting"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              className="flex flex-1 flex-col items-center justify-center gap-3 py-20 text-center"
            >
              <h1 className="text-2xl font-semibold text-zinc-800 dark:text-zinc-100">
                What can I help you research?
              </h1>
              <p className="max-w-md text-sm text-muted-foreground">
                Ask about any condition, treatment, or clinical trial. Powered by PubMed, OpenAlex, and ClinicalTrials.gov.
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Messages */}
        {(hasMessages || status) && (
          <div className="flex-1 py-6 px-2">
            <MessageFeed />
          </div>
        )}

      </main>

      {/* Input — always at bottom */}
      <GuestChatInput />
    </div>
  )
}