"use client";

import { useEffect, useRef } from "react";
import { useChat } from "@/context/chat-context";
import { StructuredResponse } from "./chat/structured-response";
import { StatusBar } from "./chat/statusbar";

export function MessageFeed() {
  const { messages, status, patientContext } = useChat();
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, status]);

  if (messages.length === 0 && !status) return null;

  return (
    <div className="flex flex-col gap-6 py-6">
      {messages.map((msg) => (
        <div
          key={msg.id}
          className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
        >
          {msg.role === "user" ? (
            <div className="max-w-[75%] rounded-2xl rounded-tr-sm bg-zinc-100 px-4 py-2.5 text-sm text-zinc-800 dark:bg-zinc-800 dark:text-zinc-100">
              {msg.content}
            </div>
          ) : (
            <div className="w-full">
              {msg.result ? (
                <StructuredResponse
                  result={msg.result}
                  disease={patientContext?.disease ?? ""}
                />
              ) : (
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  {msg.content}
                </p>
              )}
            </div>
          )}
        </div>
      ))}

      {status && <StatusBar message={status} />}

      <div ref={bottomRef} />
    </div>
  );
}