"use client";

import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";

interface InlineEditProps {
  value: string;
  onSave: (value: string) => void;
  isReadOnly?: boolean;
  multiline?: boolean;
  placeholder?: string;
  className?: string;
  type?: "text" | "number";
}

/**
 * Highly optimized inline editor.
 * Uses render-phase state updates to sync props safely without useEffect cascading renders.
 */
export default function InlineEdit({
  value,
  onSave,
  isReadOnly = false,
  multiline = false,
  placeholder,
  className = "",
  type = "text",
}: InlineEditProps) {
  const [localValue, setLocalValue] = useState(value);
  const [prevValue, setPrevValue] = useState(value);

  if (value !== prevValue) {
    setPrevValue(value);
    setLocalValue(value);
  }

  const handleBlur = () => {
    if (localValue !== value) onSave(localValue);
  };

  if (isReadOnly) {
    if (!localValue) return null;
    return <div className={`whitespace-pre-wrap ${className}`}>{localValue}</div>;
  }

  if (multiline) {
    return (
      <Textarea
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        onBlur={handleBlur}
        placeholder={placeholder}
        className={`resize-none bg-transparent border-none shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 p-0 m-0 ${className}`}
      />
    );
  }

  return (
    <input
      type={type}
      value={localValue}
      onChange={(e) => setLocalValue(e.target.value)}
      onBlur={handleBlur}
      onKeyDown={(e) => e.key === "Enter" && handleBlur()}
      placeholder={placeholder}
      className={`bg-transparent outline-none border-none p-0 w-full ${className}`}
    />
  );
}