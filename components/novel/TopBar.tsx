"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, Pencil, Trash2 } from "lucide-react";

interface TopBarProps {
  novelId: string;
  onDelete: () => void;
}

export default function TopBar({ novelId, onDelete }: TopBarProps) {
  const router = useRouter();
  
  return (
    <header className="sticky top-0 z-10 border-b-[3px] border-black bg-white px-4 py-3 md:px-6">
      <div className="mx-auto flex max-w-5xl items-center justify-between">
        <button
          onClick={() => router.push("/")}
          className="inline-flex cursor-pointer items-center gap-1.5 font-mono text-[11px] font-bold uppercase tracking-wider opacity-60 transition-opacity hover:opacity-100"
        >
          <ArrowLeft size={14} /> Dashboard
        </button>
        <div className="flex items-center gap-2">
          <button
            onClick={() => router.push(`/editor/${novelId}`)}
            className="inline-flex cursor-pointer items-center gap-1.5 border-2 border-black bg-primary px-3.5 py-1.5 font-mono text-[11px] font-bold uppercase tracking-wider transition-all hover:-translate-x-px hover:-translate-y-px hover:shadow-[3px_3px_0px_black]"
          >
            <Pencil size={12} /> Open Editor
          </button>
          <button
            onClick={onDelete}
            title="Delete novel"
            className="cursor-pointer border-2 border-transparent p-1.5 text-gray-400 transition-all hover:border-danger hover:text-danger"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    </header>
  );
}