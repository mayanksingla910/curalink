"use client"

import { useState, useRef, useEffect } from "react"
import { ArrowUpIcon, SparklesIcon } from "lucide-react"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupText,
  InputGroupTextarea,
} from "@/components/ui/input-group"
import { Separator } from "@/components/ui/separator"
import { motion } from "framer-motion"
import { useChat } from "@/context/chat-context"

export default function GuestChatInput() {
  const { sendMessage, isLoading } = useChat()
  const [value, setValue] = useState("")
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = "auto"
    el.style.height = `${Math.min(el.scrollHeight, 160)}px`
  }, [value])

  const handleSend = async () => {
    if (!value.trim() || isLoading) return
    const content = value.trim()
    setValue("")
    await sendMessage(content)
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="sticky bottom-0 mx-auto w-full max-w-3xl bg-background px-4 pb-6"
    >
      <InputGroup className="pt-1">
        <InputGroupTextarea
          ref={textareaRef}
          placeholder={isLoading ? "Searching..." : "Ask about a condition, treatment, or clinical trial..."}
          value={value}
          disabled={isLoading}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault()
              handleSend()
            }
          }}
        />
        <InputGroupAddon align="block-end">
          <InputGroupButton size="icon-xs" variant="ghost" disabled={isLoading}>
            <SparklesIcon />
          </InputGroupButton>
          <InputGroupText className="ml-auto">
            {value.length}/4000
          </InputGroupText>
          <Separator className="h-4!" orientation="vertical" />
          <InputGroupButton
            className="rounded-full"
            size="icon-xs"
            variant="default"
            onClick={handleSend}
            disabled={isLoading || !value.trim()}
          >
            {isLoading ? (
              <span className="h-3 w-3 animate-spin rounded-full border-2 border-background border-t-transparent" />
            ) : (
              <ArrowUpIcon />
            )}
            <span className="sr-only">Send</span>
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
      <p className="mt-2 text-center text-xs text-muted-foreground">
        Guest sessions are not saved.{" "}
        <a href="/login" className="underline underline-offset-2 hover:text-foreground">
          Login
        </a>{" "}
        to keep your research history.
      </p>
    </motion.div>
  )
}