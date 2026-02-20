"use client";

import { useState } from "react";
import { MessageSquare, Send, Trash2 } from "lucide-react";
import { addAuthorNote, removeAuthorNote } from "@/lib/api-client";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import type { AuthorNotesManagerProps } from "@/types/novelDashboard";

export default function AuthorNotesManager({ novel, setNovel }: AuthorNotesManagerProps) {
  const [noteText, setNoteText] = useState("");
  const [addingNote, setAddingNote] = useState(false);
  const [deleteNoteIndex, setDeleteNoteIndex] = useState<string | null>(null);

  async function handleAddNote() {
    if (!noteText.trim()) return;
    setAddingNote(true);
    setNovel(await addAuthorNote(novel._id, noteText.trim()));
    setNoteText("");
    setAddingNote(false);
  }

  return (
    <div className="mt-10">
      <h2 className="mb-4 font-mono text-[13px] font-bold tracking-[2px]">
        <MessageSquare size={14} className="mr-1.5 inline" /> AUTHOR&apos;S NOTES
      </h2>
      <div className="mb-4 border-[3px] border-black bg-white p-4 shadow-[3px_3px_0px_black]">
        <label className="mb-2 block font-mono text-[9px] font-bold uppercase tracking-[2px] text-gray-400">Add a public note</label>
        <div className="flex gap-2">
          <textarea
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
            rows={2}
            maxLength={2000}
            placeholder="Share an update..."
            className="flex-1 resize-none border-2 border-black p-3 text-sm outline-none"
            onKeyDown={(e) => { if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) handleAddNote(); }}
          />
          <button
            onClick={handleAddNote}
            disabled={!noteText.trim() || addingNote}
            className="inline-flex shrink-0 cursor-pointer items-center gap-1 self-end border-2 border-black bg-black px-3 py-2 font-mono text-[10px] font-bold uppercase tracking-wider text-white hover:bg-white hover:text-black disabled:opacity-40"
          >
            <Send size={12} /> Post
          </button>
        </div>
      </div>
      {(!novel.authorNotes || novel.authorNotes.length === 0) ? (
        <div className="border-2 border-dashed border-gray-300 py-8 text-center">
          <MessageSquare size={28} className="mx-auto mb-2 text-gray-300" />
          <p className="font-mono text-xs text-gray-400">No notes yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {[...novel.authorNotes].reverse().map((note, i) => (
            <div key={note._id ?? i} className="group border-[3px] border-black bg-white p-4 hover:shadow-[3px_3px_0px_black]">
              <div className="flex items-start justify-between gap-3">
                <p className="whitespace-pre-wrap text-sm leading-relaxed">{note.text}</p>
                <button
                  onClick={() => setDeleteNoteIndex(note._id as string)}
                  className="shrink-0 cursor-pointer text-gray-300 opacity-0 group-hover:opacity-100 hover:text-danger max-md:opacity-100"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      <ConfirmDialog
        open={deleteNoteIndex !== null}
        message="Delete this author note?"
        onConfirm={async () => {
          setNovel(await removeAuthorNote(novel._id, deleteNoteIndex!));
          setDeleteNoteIndex(null);
        }}
        onCancel={() => setDeleteNoteIndex(null)}
      />
    </div>
  );
}