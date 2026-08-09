"use client";

import { useState } from "react";
import { Book, Users, StickyNote, Plus, Folder, Trash2 } from "lucide-react";
import { useEditorContext } from "../context/EditorContext";
import { useGetNovelCharactersQuery } from "@/redux/features/characters/characterApi";
import {
  useGetNovelNotesQuery,
  useGetInboxNotesQuery,
  useCreateNoteMutation,
  useCreateInboxNoteMutation,
  useUpdateNoteMutation,
  useDeleteNoteMutation,
} from "@/redux/features/notes/noteApi";
import type { Note } from "@/redux/features/notes/noteApi";
import { useTrashDocumentMutation } from "@/redux/features/documents/documentApi";
import Image from "next/image";

/**
 * EditorSidebar: The author's contextual workspace.
 * Manages manuscript navigation, character reference (Cast), and project notes.
 * Fetches specific contextual data dynamically based on the active novel's ID.
 */
export default function EditorSidebar() {
  const {
    novel,
    chapters,
    activeChapterId,
    handleSelectChapter,
    handleCreateChapter,
    handleChangeChapterStatus,
    liveWordCount,
  } = useEditorContext();

  const [activeTab, setActiveTab] = useState<
    "chapters" | "characters" | "notes"
  >("chapters");
  const [chapterToDelete, setChapterToDelete] = useState<{
    id: string;
    title: string;
  } | null>(null);

  // Contextual Data Queries (Skipped safely if novel isn't loaded yet)
  const { data: charData } = useGetNovelCharactersQuery(novel?._id || "", {
    skip: !novel?._id,
  });
  const { data: noteData } = useGetNovelNotesQuery(
    { novelId: novel?._id || "" },
    { skip: !novel?._id },
  );
  const { data: inboxNoteData } = useGetInboxNotesQuery(undefined, {
    skip: !novel?._id,
  });

  const characters = charData?.characters || [];
  
  const novelNotes = noteData?.notes || [];
  const globalNotes = inboxNoteData?.notes || [];
  const notes = [...novelNotes, ...globalNotes].sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );

  const [isCreatingNote, setIsCreatingNote] = useState(false);

  const [trashDocument] = useTrashDocumentMutation();

  /** Trashes the selected chapter and clears the modal state */
  const confirmTrash = async () => {
    if (!chapterToDelete) return;
    await trashDocument(chapterToDelete.id).unwrap();
    setChapterToDelete(null);
  };

  return (
    <aside className="flex min-h-0 w-80 shrink-0 flex-col border-l border-editor-border bg-editor-bg transition-all duration-300">
      {/* --- Sidebar Navigation Tabs --- */}
      <div className="flex shrink-0 border-b border-editor-border">
        <SidebarTab
          icon={<Book strokeWidth={1.8} className="h-[17px] w-[17px]" />}
          label="Chapters"
          isActive={activeTab === "chapters"}
          onClick={() => setActiveTab("chapters")}
        />
        <SidebarTab
          icon={<Users strokeWidth={1.8} className="h-[17px] w-[17px]" />}
          label="Cast"
          isActive={activeTab === "characters"}
          onClick={() => setActiveTab("characters")}
        />
        <SidebarTab
          icon={<StickyNote strokeWidth={1.8} className="h-[17px] w-[17px]" />}
          label="Notes"
          isActive={activeTab === "notes"}
          onClick={() => setActiveTab("notes")}
        />
      </div>

      {/* --- Tab Content Area --- */}
      <div className="no-scrollbar flex-1 overflow-y-auto p-6">
        {/* 1. CHAPTERS TAB */}
        {activeTab === "chapters" && (
          <div className="flex flex-col gap-[2px]">
            <div className="mb-4 flex items-center justify-between px-2">
              <span className="text-[11px] font-bold uppercase tracking-[0.08em] text-editor-text-tertiary">
                Manuscript
              </span>
              <button
                onClick={handleCreateChapter}
                className="flex cursor-pointer items-center gap-[5px] rounded-md border-none bg-transparent px-2 py-[5px] text-[12px] font-medium text-editor-text-secondary transition-colors hover:bg-editor-surface-hover hover:text-editor-gold"
              >
                <Plus strokeWidth={2} className="h-[13px] w-[13px]" /> New
              </button>
            </div>

            <div className="mb-3 flex items-center gap-2 p-2 text-[12.5px] text-editor-text-secondary">
              <Folder
                strokeWidth={1.8}
                className="h-[14px] w-[14px] text-editor-text-tertiary"
              />{" "}
              All chapters
            </div>

            {chapters.map((chapter, index) => {
              const isActive = chapter._id === activeChapterId;
              const num = String(index + 1).padStart(2, "0");

              return (
                <div
                  key={chapter._id}
                  onClick={() => handleSelectChapter(chapter._id)}
                  data-active={isActive}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) =>
                    e.key === "Enter" && handleSelectChapter(chapter._id)
                  }
                  className="group relative flex cursor-pointer items-center justify-between gap-3 rounded-lg border border-transparent bg-transparent p-3 pl-4 text-left text-editor-text-secondary transition-colors hover:bg-editor-surface data-[active=true]:border-editor-border-strong data-[active=true]:bg-editor-surface-raised data-[active=true]:before:absolute data-[active=true]:before:-left-px data-[active=true]:before:bottom-1.5 data-[active=true]:before:top-1.5 data-[active=true]:before:w-[3px] data-[active=true]:before:rounded-sm data-[active=true]:before:bg-editor-gold"
                >
                  {isActive && (
                    <span
                      className="absolute right-[14px] top-[-1px] h-[16px] w-[10px] bg-editor-gold"
                      style={{
                        clipPath:
                          "polygon(0 0, 100% 0, 100% 100%, 50% 76%, 0 100%)",
                      }}
                    />
                  )}

                  <div className="flex min-w-0 flex-1 items-center gap-3">
                    <span className="w-4 shrink-0 font-['JetBrains_Mono'] text-[11px] text-editor-text-tertiary group-data-[active=true]:text-editor-gold">
                      {num}
                    </span>
                    <span className="overflow-hidden text-ellipsis whitespace-nowrap text-[14px] group-data-[active=true]:font-medium group-data-[active=true]:text-editor-text-primary">
                      {chapter.title || "Untitled Chapter"}
                    </span>
                  </div>

                  <span className="mr-2 tabular-nums font-['JetBrains_Mono'] text-[11.5px] text-editor-text-tertiary">
                    {isActive
                      ? liveWordCount.toLocaleString()
                      : chapter.wordCount?.toLocaleString() || 0}
                  </span>

                  {/* Chapter Actions (Hover Reveal) */}
                  <div className="absolute right-2 top-1/2 flex -translate-y-1/2 items-center gap-1.5 rounded-md border border-editor-border bg-editor-bg/90 p-[3px] opacity-0 shadow-sm backdrop-blur-sm transition-opacity group-hover:opacity-100 group-data-[active=true]:bg-editor-surface-raised/90">
                    <select
                      value={chapter.status}
                      onChange={(e) => {
                        e.stopPropagation();
                        handleChangeChapterStatus(chapter._id, e.target.value);
                      }}
                      onClick={(e) => e.stopPropagation()}
                      className="cursor-pointer appearance-none rounded border border-editor-border bg-transparent px-1.5 py-1 text-[9px] font-semibold uppercase tracking-wider text-editor-text-secondary transition-colors hover:text-editor-text-primary focus:outline-none"
                    >
                      <option
                        value="draft"
                        className="uppercase bg-editor-surface text-editor-text-primary"
                      >
                        Draft
                      </option>
                      <option
                        value="published"
                        className="uppercase bg-editor-surface text-editor-text-primary"
                      >
                        Published
                      </option>
                      <option
                        value="archived"
                        className="uppercase bg-editor-surface text-editor-text-primary"
                      >
                        Archived
                      </option>
                    </select>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setChapterToDelete({
                          id: chapter._id,
                          title: chapter.title,
                        });
                      }}
                      title="Move to Trash"
                      className="flex cursor-pointer items-center justify-center rounded-md border-none bg-transparent p-1 text-editor-text-secondary transition-colors hover:bg-red-500/10 hover:text-red-500"
                    >
                      <Trash2 strokeWidth={2} className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* 2. CHARACTERS TAB */}
        {activeTab === "characters" && (
          <div className="flex flex-col gap-[2px]">
            <div className="mb-4 flex items-center justify-between px-2">
              <span className="text-[11px] font-bold uppercase tracking-[0.08em] text-editor-text-tertiary">
                Cast
              </span>
              <button className="flex cursor-pointer items-center gap-[5px] rounded-md border-none bg-transparent px-2 py-[5px] text-[12px] font-medium text-editor-text-secondary transition-colors hover:bg-editor-surface-hover hover:text-editor-gold">
                <Plus strokeWidth={2} className="h-[13px] w-[13px]" /> New
              </button>
            </div>

            {characters.length === 0 ? (
              <div className="flex items-center gap-3 rounded-lg bg-transparent p-[10px_12px] transition-colors hover:bg-editor-surface">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full border border-editor-border-strong bg-editor-surface-raised font-['Fraunces'] text-[13px] text-editor-gold">
                  ?
                </div>
                <div className="flex min-w-0 flex-col">
                  <div className="overflow-hidden text-ellipsis whitespace-nowrap text-[13.5px] text-editor-text-primary">
                    Add your first character
                  </div>
                  <div className="overflow-hidden text-ellipsis whitespace-nowrap text-[11.5px] text-editor-text-tertiary">
                    No characters yet
                  </div>
                </div>
              </div>
            ) : (
              characters.map((char) => (
                <div
                  key={char._id}
                  className="flex cursor-pointer items-center gap-3 rounded-lg bg-transparent p-[10px_12px] transition-colors hover:bg-editor-surface"
                >
                  <div className="relative flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full border border-editor-border-strong bg-editor-surface-raised font-['Fraunces'] text-[13px] text-editor-gold">
                    {char.avatarUrl ? (
                      <Image
                        src={char.avatarUrl}
                        alt={char.name}
                        fill
                        className="object-cover"
                        sizes="32px"
                      />
                    ) : (
                      char.name.charAt(0)
                    )}
                  </div>
                  <div className="flex min-w-0 flex-col">
                    <div className="overflow-hidden text-ellipsis whitespace-nowrap text-[13.5px] text-editor-text-primary">
                      {char.name}
                    </div>
                    <div className="overflow-hidden text-ellipsis whitespace-nowrap text-[11.5px] text-editor-text-tertiary">
                      {char.role}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* 3. NOTES TAB */}
        {activeTab === "notes" && (
          <div className="flex flex-col gap-[2px]">
            <div className="mb-4 flex items-center justify-between px-2">
              <span className="text-[11px] font-bold uppercase tracking-[0.08em] text-editor-text-tertiary">
                Notes
              </span>
              <button 
                onClick={() => setIsCreatingNote(true)}
                className="flex cursor-pointer items-center gap-[5px] rounded-md border-none bg-transparent px-2 py-[5px] text-[12px] font-medium text-editor-text-secondary transition-colors hover:bg-editor-surface-hover hover:text-editor-gold"
              >
                <Plus strokeWidth={2} className="h-[13px] w-[13px]" /> New
              </button>
            </div>

            {isCreatingNote && (
              <NewNoteCard 
                novelId={novel?._id || ""}
                onCancel={() => setIsCreatingNote(false)}
                onSuccess={() => setIsCreatingNote(false)}
              />
            )}

            {notes.length === 0 && !isCreatingNote ? (
              <div className="mb-2 rounded-lg border border-editor-border bg-transparent p-3">
                <div className="mb-1 text-[13px] text-editor-text-primary">
                  No notes yet
                </div>
                <div className="leading-[1.5] text-[12px] text-editor-text-tertiary">
                  Jot down worldbuilding details, timeline notes, or anything
                  you want to keep close while you write.
                </div>
              </div>
            ) : (
              notes.map((note) => (
                <EditableNoteCard key={note._id} note={note} />
              ))
            )}
          </div>
        )}
      </div>

      {/* --- Delete Confirmation Modal --- */}
      {chapterToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-sm animate-in zoom-in-95 fade-in rounded-xl border border-editor-border bg-editor-surface p-6 shadow-2xl duration-200">
            <h3 className="mb-2 font-['Fraunces'] text-lg font-semibold text-editor-text-primary">
              Move to Trash?
            </h3>
            <p className="mb-6 leading-relaxed text-[13px] text-editor-text-secondary">
              Are you sure you want to move &quot;
              <span className="font-medium text-editor-text-primary">
                {chapterToDelete.title || "Untitled Chapter"}
              </span>
              &quot; to the trash? You can restore it later from your library.
            </p>
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setChapterToDelete(null)}
                className="cursor-pointer rounded-lg border border-editor-border bg-transparent px-4 py-2 text-[13px] font-medium text-editor-text-secondary transition-colors hover:bg-editor-surface-hover"
              >
                Cancel
              </button>
              <button
                onClick={confirmTrash}
                className="cursor-pointer rounded-lg border border-red-500/50 bg-red-500/80 px-4 py-2 text-[13px] font-medium text-white transition-colors hover:bg-red-500"
              >
                Move to Trash
              </button>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}

/** Micro-component for the top navigation tabs */
function SidebarTab({
  icon,
  label,
  isActive,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      data-active={isActive}
      className="flex flex-1 cursor-pointer flex-col items-center gap-1.5 border-b-2 border-transparent bg-transparent pb-[12px] pt-[14px] text-[10.5px] font-semibold uppercase tracking-[0.07em] text-editor-text-tertiary transition-colors hover:text-editor-text-secondary data-[active=true]:border-editor-gold data-[active=true]:text-editor-gold"
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

/** Micro-component for updating notes instantly on blur */
function EditableNoteCard({ note }: { note: Note }) {
  const [isEditing, setIsEditing] = useState(false);
  const [updateNote] = useUpdateNoteMutation();
  const [deleteNote] = useDeleteNoteMutation();

  const initialContent =
    typeof note.content === "string"
      ? note.content
      : note.content
        ? JSON.stringify(note.content)
        : note.title;

  const [text, setText] = useState<string>(initialContent);
  const [type, setType] = useState(note.type);

  const handleBlur = () => {
    setIsEditing(false);
    if (text !== initialContent || type !== note.type) {
      updateNote({ noteId: note._id, data: { content: text, type } });
    }
  };

  const isGlobal = !note.novelId;

  return (
    <div
      className="group relative mb-2 cursor-pointer rounded-lg border border-editor-border p-3 transition-colors hover:border-editor-gold-dim"
      onClick={() => !isEditing && setIsEditing(true)}
    >
      <div className="mb-2 flex items-center justify-between">
        <div className="text-[13px] font-semibold text-editor-text-primary">
          {note.title || "Untitled"}
        </div>
        <div className="flex gap-2">
          {isGlobal && (
            <span className="rounded bg-[#5c5868]/20 px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-widest text-[#948fa0]">
              Global
            </span>
          )}
          {!isEditing && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (window.confirm("Delete this note?")) {
                  deleteNote(note._id);
                }
              }}
              className="text-editor-text-tertiary hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>
      
      {isEditing ? (
        <div className="flex flex-col gap-2">
          <textarea
            autoFocus
            className="m-0 w-full resize-none rounded bg-black/20 p-2 font-sans text-[12px] leading-[1.5] text-editor-text-secondary outline-none border border-white/5 focus:border-editor-gold/50"
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={Math.max(3, text.split("\n").length)}
            placeholder="Write your note..."
          />
          <div className="flex items-center justify-between mt-1">
            <select
              value={type}
              onChange={(e) => setType(e.target.value as Note["type"])}
              className="bg-transparent border border-editor-border rounded text-[10px] text-editor-text-secondary p-1 uppercase tracking-wider"
            >
              <option value="lore">Lore</option>
              <option value="plot">Plot</option>
              <option value="worldbuilding">Worldbuilding</option>
              <option value="research">Research</option>
              <option value="timeline">Timeline</option>
              <option value="misc">Misc</option>
            </select>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleBlur();
              }}
              className="px-3 py-1 bg-editor-surface-hover rounded text-xs text-editor-text-primary hover:text-editor-gold"
            >
              Done
            </button>
          </div>
        </div>
      ) : (
        <div className="whitespace-pre-wrap leading-[1.5] text-[12px] text-editor-text-tertiary line-clamp-6">
          {text || "Empty note..."}
        </div>
      )}
      {!isEditing && (
        <div className="mt-3 text-[9px] font-bold uppercase tracking-widest text-[#c9975a]/70">
          {note.type}
        </div>
      )}
    </div>
  );
}

function NewNoteCard({ novelId, onCancel, onSuccess }: { novelId: string, onCancel: () => void, onSuccess: () => void }) {
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [type, setType] = useState<Note["type"]>("lore");
  const [isGlobal, setIsGlobal] = useState(false);
  
  const [createNote, { isLoading: isCreatingLocal }] = useCreateNoteMutation();
  const [createInboxNote, { isLoading: isCreatingGlobal }] = useCreateInboxNoteMutation();

  const isSaving = isCreatingLocal || isCreatingGlobal;

  const handleSave = async () => {
    if (!title.trim() && !text.trim()) {
      onCancel();
      return;
    }
    
    try {
      const data = {
        title: title.trim() || "Untitled Note",
        content: text.trim(),
        type,
      };

      if (isGlobal) {
        await createInboxNote({ data }).unwrap();
      } else {
        await createNote({ novelId, data }).unwrap();
      }
      onSuccess();
    } catch (err) {
      console.error("Failed to create note:", err);
      alert("Failed to save note");
    }
  };

  return (
    <div className="mb-4 rounded-lg border border-editor-gold/50 bg-editor-surface-raised p-3 shadow-lg">
      <input
        autoFocus
        type="text"
        placeholder="Note Title..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full bg-transparent text-[13px] font-semibold text-editor-text-primary outline-none placeholder:text-editor-text-tertiary mb-2"
      />
      <textarea
        className="w-full resize-none rounded bg-black/20 p-2 font-sans text-[12px] leading-[1.5] text-editor-text-secondary outline-none border border-white/5 focus:border-editor-gold/50"
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={4}
        placeholder="Write your note..."
      />
      
      <div className="flex flex-col gap-3 mt-3">
        <div className="flex items-center gap-4 text-[11px] text-editor-text-secondary">
          <label className="flex items-center gap-1.5 cursor-pointer">
            <input 
              type="radio" 
              checked={!isGlobal} 
              onChange={() => setIsGlobal(false)}
              className="accent-[#c9975a]" 
            />
            This Novel
          </label>
          <label className="flex items-center gap-1.5 cursor-pointer">
            <input 
              type="radio" 
              checked={isGlobal} 
              onChange={() => setIsGlobal(true)}
              className="accent-[#c9975a]" 
            />
            Global Inbox
          </label>
        </div>

        <div className="flex items-center justify-between">
          <select
            value={type}
            onChange={(e) => setType(e.target.value as Note["type"])}
            className="bg-transparent border border-editor-border rounded text-[10px] text-editor-text-secondary p-1 uppercase tracking-wider"
          >
            <option value="lore">Lore</option>
            <option value="plot">Plot</option>
            <option value="worldbuilding">Worldbuilding</option>
            <option value="research">Research</option>
            <option value="timeline">Timeline</option>
            <option value="misc">Misc</option>
          </select>

          <div className="flex items-center gap-2">
            <button
              onClick={onCancel}
              className="text-xs text-editor-text-tertiary hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="px-3 py-1 bg-[#c9975a] text-black font-medium rounded text-xs hover:bg-[#d4a872] disabled:opacity-50 transition-colors"
            >
              {isSaving ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
