"use client";

import { useRouter } from "next/navigation";

export default function ErrorState({ error }: { error: string }) {
  const router = useRouter();
  return (
    <div className="flex h-dvh flex-col items-center justify-center gap-4 bg-grid">
      <p className="font-mono text-sm text-danger">
        {error || "Novel not found"}
      </p>
      <button
        onClick={() => router.push("/")}
        className="cursor-pointer border-2 border-black bg-white px-4 py-2 font-mono text-xs font-bold transition-all hover:bg-gray-100"
      >
        Back to Dashboard
      </button>
    </div>
  );
}