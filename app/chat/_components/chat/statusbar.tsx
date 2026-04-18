"use client";
import { useEffect, useState } from "react";

interface Props {
  message: string;
  step?: number;
  totalSteps?: number;
}

export function StatusBar({ message, step, totalSteps }: Props) {
  return (
    <div className="flex items-center gap-3 px-4 py-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl mb-4">
      <span className="w-2 h-2 rounded-full bg-teal-600 animate-pulse shrink-0" />
      <span className="text-sm text-zinc-500">{message}</span>
      {step && totalSteps && (
        <span className="ml-auto font-mono text-xs text-zinc-400">
          {step} / {totalSteps}
        </span>
      )}
    </div>
  );
}