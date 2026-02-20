"use client";

export default function ProgressBar({ progressPct }: { progressPct: number }) {
  return (
    <div className="mb-8">
      <div className="mb-1 flex justify-between font-mono text-[9px] font-bold uppercase tracking-[2px] text-gray-400">
        <span>Progress</span>
        <span>{progressPct}%</span>
      </div>
      <div className="h-3 w-full border-2 border-black bg-white">
        <div
          className="h-full bg-primary transition-all duration-500"
          style={{ width: `${progressPct}%` }}
        />
      </div>
    </div>
  );
}