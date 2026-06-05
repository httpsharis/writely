"use client";

import QuickCapture from "@/components/inbox/QuickCapture";
import NoteItem from "@/components/inbox/NoteItem";

// MOCK DATA matching your Mongoose Schema
const MOCK_NOTES = [
  { id: "1", title: "The magic system is tied to eye color", type: "worldbuilding" as const, date: "2 hrs ago", snippet: "If a user overdraws their mana, their eyes permanently shift toward silver." },
  { id: "2", title: "Aria needs to lose the map in Chapter 4", type: "plot" as const, date: "Yesterday", snippet: "She gets ambushed by the syndicate. Jax steals it back later." },
  { id: "3", title: "History of the Glass Citadel", type: "lore" as const, date: "May 12", snippet: "Built 400 years ago after the breaking of the old continent." },
  { id: "4", title: "18th Century Victorian street lamps", type: "research" as const, date: "May 10", snippet: "Look into how gas lamps were lit, I want to use that for the lower rings." },
  { id: "5", title: "Timeline of the Old Gods war", type: "timeline" as const, date: "May 08" },
];

export default function InboxPage() {
  return (
    <div className="max-w-[720px] mx-auto px-8 py-12 flex flex-col">
      
      {/* Header */}
      <div className="flex flex-col gap-2 mb-8">
        <h1 className="text-[32px] font-semibold tracking-tight text-[#1A1008] dark:text-[#F0EBE4] leading-none">
          Inbox
        </h1>
        <p className="text-[14px] text-[#9C8870] dark:text-[#5C5652]">
          Your raw ideas, research, and plot fragments. Triage them later.
        </p>
      </div>

      {/* Componentized Quick Capture */}
      <QuickCapture />

      {/* Notes List */}
      <div className="flex flex-col">
        {/* List Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#E8E0D5] dark:border-[#242424] mb-2">
          <span className="text-[10px] uppercase tracking-[0.1em] text-[#9C8870] dark:text-[#5C5652] font-semibold">
            Captured Note
          </span>
          <span className="text-[10px] uppercase tracking-[0.1em] text-[#9C8870] dark:text-[#5C5652] font-semibold">
            Status
          </span>
        </div>

        {/* Componentized Mapping */}
        {MOCK_NOTES.map((note) => (
          <NoteItem 
            key={note.id}
            title={note.title}
            type={note.type}
            date={note.date}
            snippet={note.snippet}
          />
        ))}
      </div>

    </div>
  );
}