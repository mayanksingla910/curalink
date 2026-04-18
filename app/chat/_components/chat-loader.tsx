"use client";

import { useEffect } from "react";
import { useChat } from "@/context/chat-context";

interface Props {
  chatId: string;
  initialMessages: any[];
  patientContext: any;
}

export function ChatLoader({ chatId, initialMessages, patientContext }: Props) {
  const { loadChat } = useChat();

  useEffect(() => {
    loadChat(chatId, initialMessages, patientContext);
  }, [chatId]); // re-run when navigating between chats

  return null;
}