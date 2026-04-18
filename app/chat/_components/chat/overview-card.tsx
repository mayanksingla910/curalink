interface Props {
  overview: string;
  personalizedNote?: string;
  disease: string;
}

export function OverviewCard({ overview, personalizedNote, disease }: Props) {
  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 mb-4">
      <p className="text-xs font-medium tracking-widest uppercase text-teal-600 dark:text-teal-400 mb-3">
        Condition overview
      </p>
      <p className="font-serif text-[17px] leading-relaxed text-zinc-800 dark:text-zinc-100">
        {overview}
      </p>
      {personalizedNote && (
        <p className="mt-4 pt-4 border-t border-zinc-100 dark:border-zinc-800 text-sm text-zinc-500 italic leading-relaxed">
          {personalizedNote}
        </p>
      )}
    </div>
  );
}