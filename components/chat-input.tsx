"use client"

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
import { useState } from "react"

interface ChatInputProps {
  anchored?: boolean
  onSend?: (content: string) => void
}

const ChatInput = ({ onSend }: ChatInputProps) => {
  const [value, setValue] = useState("")

  const handleSend = () => {
    if (!value.trim()) return
    onSend?.(value.trim())
    setValue("")
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`sticky bottom-0 mx-auto w-full max-w-3xl items-center bg-background px-2 pb-6`}
    >
      <InputGroup className="pt-1">
        <InputGroupTextarea
          placeholder="Ask me anything..."
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault()
              handleSend()
            }
          }}
        />
        <InputGroupAddon align="block-end">
          <InputGroupButton size="icon-xs" variant="ghost">
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
          >
            <ArrowUpIcon />
            <span className="sr-only">Send</span>
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
    </motion.div>
  )
}

export default ChatInput
