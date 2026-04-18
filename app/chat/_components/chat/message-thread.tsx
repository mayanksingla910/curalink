"use client";
import { useState, useRef, useEffect } from "react";
import { StructuredResponse } from "./structured-response";
import { StatusBar } from "./statusbar";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  result?: any;       // LLM structured JSON
  sources?: any;      // ranked pubs + trials
}

interface Props {
  chatId: string;
  initialMessages: Message[];
  patientContext: { disease: string; name?: string; location?: string } | null;
}

export function MessageThread({ chatId, initialMessages, patientContext }: Props) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, status]);

  async function sendMessage() {
    if (!input.trim() || isLoading) return;
    const content = input.trim();
    setInput("");
    setIsLoading(true);

    // Optimistically add user message
    const tempId = crypto.randomUUID();
    setMessages((prev) => [...prev, { id: tempId, role: "user", content }]);

    try {
      const res = await fetch("/api/message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chatId, content }),
      });

      if (!res.body) throw new Error("No stream");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          try {
            const event = JSON.parse(line.slice(6));
            if (event.type === "status") {
              setStatus(event.message);
            } else if (event.type === "done") {
              setStatus(null);
              setMessages((prev) => [
                ...prev,
                {
                  id: crypto.randomUUID(),
                  role: "assistant",
                  content: event.result?.conditionOverview ?? "",
                  result: event.result,
                  sources: event.sources,
                },
              ]);
            } else if (event.type === "error") {
              setStatus(null);
              setMessages((prev) => [
                ...prev,
                { id: crypto.randomUUID(), role: "assistant", content: event.message },
              ]);
            }
          } catch {}
        }
      }
    } catch (err) {
      setStatus(null);
      setMessages((prev) => [
        ...prev,
        { id: crypto.randomUUID(), role: "assistant", content: "Something went wrong. Please try again." },
      ]);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            {msg.role === "user" ? (
              <div className="max-w-[75%] px-4 py-2.5 bg-zinc-100 dark:bg-zinc-800 rounded-2xl rounded-tr-sm text-sm text-zinc-800 dark:text-zinc-100">
                {msg.content}
              </div>
            ) : (
              <div className="w-full max-w-3xl">
                {msg.result ? (
                  <StructuredResponse
                    result={msg.result}
                    disease={patientContext?.disease ?? ""}
                  />
                ) : (
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">{msg.content}</p>
                )}
              </div>
            )}
          </div>
        ))}

        {/* Status bar while loading */}
        {status && (
          <div className="flex justify-start w-full max-w-3xl">
            <div className="w-full">
              <StatusBar message={status} />
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input area */}
      <div className="border-t border-zinc-100 dark:border-zinc-800 px-4 py-4">
        <div className="flex gap-3 items-end max-w-3xl mx-auto">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
            placeholder="Ask a follow-up question..."
            rows={1}
            disabled={isLoading}
            className="flex-1 resize-none px-4 py-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm text-zinc-800 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:border-teal-400 dark:focus:border-teal-700 transition-colors disabled:opacity-50"
          />
          <button
            onClick={sendMessage}
            disabled={isLoading || !input.trim()}
            className="w-10 h-10 rounded-xl border border-teal-200 dark:border-teal-900 bg-teal-50 dark:bg-teal-950 flex items-center justify-center text-teal-600 dark:text-teal-400 hover:opacity-75 transition-opacity disabled:opacity-30 shrink-0"
          >
            <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M3 8h10M9 4l4 4-4 4"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}