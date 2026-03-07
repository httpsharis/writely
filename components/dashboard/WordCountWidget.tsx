'use client';

import type { DailyWordCountData } from '@/types/dashboard';

interface WordCountWidgetProps {
  data: DailyWordCountData;
}

export function WordCountWidget({ data }: WordCountWidgetProps) {
  const percentage = data.goal > 0 ? Math.min((data.current / data.goal) * 100, 100) : 0;
  const isComplete = percentage >= 100;

  return (
    <div className="border-2 border-black bg-white p-6 dark:border-neutral-700 dark:bg-neutral-900">
      <div className="mb-4 flex items-baseline justify-between">
        <h3 className="font-mono text-[11px] font-bold uppercase tracking-[2px] dark:text-neutral-300">
          Daily Words
        </h3>
        <span className="font-mono text-[10px] text-neutral-400">
          {data.current.toLocaleString()} / {data.goal.toLocaleString()}
        </span>
      </div>

      {/* Progress bar */}
      <div className="mb-3 h-3 w-full border-2 border-black bg-neutral-100 dark:border-neutral-600 dark:bg-neutral-800">
        <div
          className={`h-full transition-all duration-500 ${
            isComplete ? 'bg-success' : 'bg-primary'
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>

      <p className="font-mono text-[10px] text-neutral-400">
        {isComplete
          ? 'Goal reached — keep the momentum!'
          : `${Math.round(percentage)}% — ${(data.goal - data.current).toLocaleString()} words to go`}
      </p>
    </div>
  );
}
