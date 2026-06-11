"use client";

interface EditorWordCountProps {
  count: number;
  label?: string;
  className?: string;
}

export default function EditorWordCount({ count, label = "Words", className = "" }: EditorWordCountProps) {
  return (
    <div className={`flex flex-col items-end ${className}`}>
      <span className="text-sm font-bold text-foreground transition-all">
        {count.toLocaleString()}
      </span>
      <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider -mt-1">
        {label}
      </span>
    </div>
  );
}