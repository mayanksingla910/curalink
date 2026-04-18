// components/patient-context-modal.tsx
"use client";

import { useState } from "react";
import { useChat } from "@/context/chat-context";

export function PatientContextModal() {
  const { startNewChat, sendMessage, isLoading } = useChat();
  const [disease, setDisease] = useState("");
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [step, setStep] = useState<"context" | "ready">("context");

  async function handleStart() {
    if (!disease.trim()) return;
    await startNewChat(disease, name || undefined, location || undefined);
  }

  return (
    <div className="mx-auto max-w-md rounded-2xl border border-zinc-200 bg-white p-8 dark:border-zinc-800 dark:bg-zinc-900">
      <p className="mb-2 text-xs font-medium uppercase tracking-widest text-teal-600 dark:text-teal-400">
        New research session
      </p>
      <h2 className="mb-6 text-xl font-medium text-zinc-800 dark:text-zinc-100">
        What condition are you researching?
      </h2>

      <div className="space-y-4">
        <div>
          <label className="mb-1.5 block text-xs text-zinc-500">
            Condition or disease <span className="text-red-400">*</span>
          </label>
          <input
            value={disease}
            onChange={(e) => setDisease(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleStart()}
            placeholder="e.g. Parkinson's disease, lung cancer..."
            className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3.5 py-2.5 text-sm focus:border-teal-400 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs text-zinc-500">
            Patient name <span className="text-zinc-400">(optional)</span>
          </label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. John Smith"
            className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3.5 py-2.5 text-sm focus:border-teal-400 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs text-zinc-500">
            Location{" "}
            <span className="text-zinc-400">(optional — improves trial results)</span>
          </label>
          <input
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="e.g. Toronto, Canada"
            className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3.5 py-2.5 text-sm focus:border-teal-400 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800"
          />
        </div>

        <button
          onClick={handleStart}
          disabled={!disease.trim() || isLoading}
          className="mt-2 w-full rounded-lg bg-teal-600 py-2.5 text-sm font-medium text-white transition-colors hover:bg-teal-700 disabled:opacity-40"
        >
          {isLoading ? "Starting..." : "Start research →"}
        </button>
      </div>
    </div>
  );
}