"use client"

import { createContext, useContext, useState } from "react"

interface ChatContextType {
  hasMessages: boolean
  setHasMessages: (val: boolean) => void
}

const ChatContext = createContext<ChatContextType>({
  hasMessages: false,
  setHasMessages: () => {},
})

export const ChatProvider = ({ children }: { children: React.ReactNode }) => {
  const [hasMessages, setHasMessages] = useState(false)

  return (
    <ChatContext.Provider value={{ hasMessages, setHasMessages }}>
      {children}
    </ChatContext.Provider>
  )
}

export const useChat = () => useContext(ChatContext)