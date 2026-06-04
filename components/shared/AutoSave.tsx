"use client";

import { CheckCircle2, Cloud, CloudOff } from "lucide-react";

interface AutoSaveIndicatorProps {
  state: "saved" | "saving" | "off";
  className?: string;
}

export default function AutoSaveIndicator({ state, className = "" }: AutoSaveIndicatorProps) {
  return (
    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary/50 border border-border/50 text-xs font-medium text-muted-foreground cursor-pointer hover:bg-secondary transition-colors ${className}`}>
      {state === "saved" && (
        <><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /><span>Saved</span></>
      )}
      {state === "saving" && (
        <><Cloud className="w-3.5 h-3.5 text-primary animate-pulse" /><span>Saving...</span></>
      )}
      {state === "off" && (
        <><CloudOff className="w-3.5 h-3.5 text-red-400" /><span>Auto-save Off</span></>
      )}
    </div>
  );
}