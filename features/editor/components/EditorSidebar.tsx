"use client";

import { useState } from "react";
import Image from "next/image";
import { Book, Users, StickyNote, Plus, Folder, Trash2, X } from "lucide-react";
import { getAvatarUrl } from "@/lib/cloudinary";
import { useEditorContext } from "../context/EditorContext";
import { useTrashDocumentMutation } from "@/redux/features/documents/documentApi";
import { useGetNovelCharactersQuery } from "@/redux/features/characters/characterApi";
import {
  useGetNovelNotesQuery,
  useGetInboxNotesQuery,
  useCreateNoteMutation,
  useCreateInboxNoteMutation,
  useUpdateNoteMutation,
  useDeleteNoteMutation,
  type Note,
} from "@/redux/features/notes/noteApi";

/* --- Constants for DRY Rendering --- */
const TABS = [
  { id: "chapters", label: "Chapters", Icon: Book },
  { id: "characters", label: "Cast", Icon: Users },
  { id: "notes", label: "Notes", Icon: StickyNote },
] as const;

const NOTE_TYPES = [
  "lore",
  "plot",
  "worldbuilding",
  "research",
  "timeline",
  "misc",
] as const;

export default function EditorSidebar() {
  const {
    novel,
    chapters,
    activeChapterId,
    handleSelectChapter,
    handleCreateChapter,
    handleChangeChapterStatus,
    liveWordCount,
    setIsSidebarOpen,
  } = useEditorContext();

  const [activeTab, setActiveTab] =
    useState<(typeof TABS)[number]["id"]>("chapters");
  const [chapterToDelete, setChapterToDelete] = useState<{
    id: string;
    title: string;
  } | null>(null);
  const [isCreatingNote, setIsCreatingNote] = useState(false);

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
  const [trashDocument] = useTrashDocumentMutation();

  const characters = charData?.characters || [];
  const notes = [
    ...(noteData?.notes || []),
    ...(inboxNoteData?.notes || []),
  ].sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
  );

  const closeOnMobile = () =>
    typeof window !== "undefined" &&
    window.innerWidth < 768 &&
    setIsSidebarOpen(false);

  const confirmTrash = async () => {
    if (!chapterToDelete) return;
    await trashDocument(chapterToDelete.id).unwrap();
    setChapterToDelete(null);
  };

  return (
    <aside className="flex min-h-0 w-full shrink-0 flex-col border-l border-editor-border bg-editor-bg transition-all duration-300 md:w-80">
      {/* Header Tabs */}
      <div className="flex shrink-0 items-stretch border-b border-editor-border">
        <div className="flex flex-1">
          {TABS.map(({ id, label, Icon }) => (
            <SidebarTab
              key={id}
              Icon={Icon}
              label={label}
              isActive={activeTab === id}
              onClick={() => setActiveTab(id)}
            />
          ))}
        </div>
        <button
          onClick={() => setIsSidebarOpen(false)}
          className="flex w-12 shrink-0 items-center justify-center border-l border-editor-border text-editor-text-tertiary transition-colors hover:bg-editor-surface-hover hover:text-editor-text-primary md:hidden"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Main Content Area */}
      <div className="no-scrollbar flex-1 overflow-y-auto p-4 sm:p-6">
        {activeTab === "chapters" && (
          <div className="flex flex-col gap-[2px]">
            <SidebarSectionHeader
              title="Manuscript"
              onNew={() => {
                handleCreateChapter();
                closeOnMobile();
              }}
            />
            <div className="mb-3 flex items-center gap-2 p-2 text-[12.5px] text-editor-text-secondary">
              <Folder
                strokeWidth={1.8}
                className="h-[14px] w-[14px] text-editor-text-tertiary"
              />{" "}
              All chapters
            </div>

            {chapters.map((chapter, i) => (
              <div
                key={chapter._id}
                onClick={() => {
                  handleSelectChapter(chapter._id);
                  closeOnMobile();
                }}
                data-active={chapter._id === activeChapterId}
                className="group relative flex cursor-pointer items-center justify-between gap-3 rounded-lg border border-transparent bg-transparent p-3 pl-4 text-left text-editor-text-secondary transition-colors hover:bg-editor-surface data-[active=true]:border-editor-border-strong data-[active=true]:bg-editor-surface-raised data-[active=true]:before:absolute data-[active=true]:before:-left-px data-[active=true]:before:bottom-1.5 data-[active=true]:before:top-1.5 data-[active=true]:before:w-[3px] data-[active=true]:before:rounded-sm data-[active=true]:before:bg-editor-gold"
              >
                {chapter._id === activeChapterId && (
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
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="truncate text-[14px] group-data-[active=true]:font-medium group-data-[active=true]:text-editor-text-primary">
                    {chapter.title || "Untitled Chapter"}
                  </span>
                </div>

                <span className="mr-2 hidden font-['JetBrains_Mono'] text-[11.5px] tabular-nums text-editor-text-tertiary sm:inline">
                  {(chapter._id === activeChapterId
                    ? liveWordCount
                    : chapter.wordCount || 0
                  ).toLocaleString()}
                </span>

                <div className="absolute right-2 top-1/2 flex -translate-y-1/2 items-center gap-1.5 rounded-md border border-editor-border bg-editor-bg/90 p-[3px] opacity-100 shadow-sm backdrop-blur-sm transition-opacity md:opacity-0 md:group-hover:opacity-100 md:group-data-[active=true]:opacity-100 md:group-data-[active=true]:bg-editor-surface-raised/90">
                  <ChapterStatusSelect
                    status={chapter.status}
                    onChange={(val) =>
                      handleChangeChapterStatus(chapter._id, val)
                    }
                  />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setChapterToDelete({
                        id: chapter._id,
                        title: chapter.title,
                      });
                    }}
                    className="flex rounded-md p-1 text-editor-text-secondary transition-colors hover:bg-red-500/10 hover:text-red-500"
                  >
                    <Trash2 strokeWidth={2} className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "characters" && (
          <div className="flex flex-col gap-[2px]">
            <SidebarSectionHeader title="Cast" />
            {!characters.length ? (
              <div className="flex items-center gap-3 rounded-lg p-[10px_12px] hover:bg-editor-surface">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-editor-border-strong bg-editor-surface-raised font-['Fraunces'] text-[13px] text-editor-gold">
                  ?
                </div>
                <div className="flex min-w-0 flex-col">
                  <div className="truncate text-[13.5px] text-editor-text-primary">
                    Add your first character
                  </div>
                  <div className="truncate text-[11.5px] text-editor-text-tertiary">
                    No characters yet
                  </div>
                </div>
              </div>
            ) : (
              characters.map((char) => (
                <div
                  key={char._id}
                  className="flex cursor-pointer items-center gap-3 rounded-lg p-[10px_12px] transition-colors hover:bg-editor-surface"
                >
                  <div className="relative flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full border border-editor-border-strong bg-editor-surface-raised font-['Fraunces'] text-[13px] text-editor-gold">
                    {char.avatarUrl ? (
                      <Image
                        src={getAvatarUrl(char.avatarUrl, 64)}
                        alt={char.name}
                        fill
                        sizes="32px"
                        className="object-cover"
                      />
                    ) : (
                      char.name.charAt(0)
                    )}
                  </div>
                  <div className="flex min-w-0 flex-col">
                    <div className="truncate text-[13.5px] text-editor-text-primary">
                      {char.name}
                    </div>
                    <div className="truncate text-[11.5px] text-editor-text-tertiary">
                      {char.role}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === "notes" && (
          <div className="flex flex-col gap-[2px]">
            <SidebarSectionHeader
              title="Notes"
              onNew={() => setIsCreatingNote(true)}
            />
            {isCreatingNote && (
              <NewNoteCard
                novelId={novel?._id || ""}
                onCancel={() => setIsCreatingNote(false)}
              />
            )}
            {!notes.length && !isCreatingNote ? (
              <div className="mb-2 rounded-lg border border-editor-border p-3 text-editor-text-tertiary text-[12px] leading-[1.5]">
                <div className="mb-1 text-[13px] text-editor-text-primary">
                  No notes yet
                </div>
                Jot down worldbuilding details, timeline notes, or anything you
                want to keep close while you write.
              </div>
            ) : (
              notes.map((note) => (
                <EditableNoteCard key={note._id} note={note} />
              ))
            )}
          </div>
        )}
      </div>

      {/* Trash Modal */}
      {chapterToDelete && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-xl border border-editor-border bg-editor-surface p-6 shadow-2xl">
            <h3 className="mb-2 font-['Fraunces'] text-lg font-semibold text-editor-text-primary">
              Move to Trash?
            </h3>
            <p className="mb-6 text-[13px] text-editor-text-secondary">
              Are you sure you want to move &quot;
              <span className="font-medium text-editor-text-primary">
                {chapterToDelete.title || "Untitled Chapter"}
              </span>
              &quot; to the trash?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setChapterToDelete(null)}
                className="rounded-lg px-4 py-2 text-[13px] text-editor-text-secondary hover:bg-editor-surface-hover"
              >
                Cancel
              </button>
              <button
                onClick={confirmTrash}
                className="rounded-lg bg-red-500/80 px-4 py-2 text-[13px] font-medium text-white hover:bg-red-500"
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

/* --- Extracted Micro-Components --- */

function SidebarSectionHeader({
  title,
  onNew,
}: {
  title: string;
  onNew?: () => void;
}) {
  return (
    <div className="mb-4 flex items-center justify-between px-2">
      <span className="text-[11px] font-bold uppercase tracking-[0.08em] text-editor-text-tertiary">
        {title}
      </span>
      {onNew && (
        <button
          onClick={onNew}
          className="flex cursor-pointer items-center gap-[5px] rounded-md px-2 py-[5px] text-[12px] font-medium text-editor-text-secondary hover:bg-editor-surface-hover hover:text-editor-gold"
        >
          <Plus strokeWidth={2} className="h-[13px] w-[13px]" /> New
        </button>
      )}
    </div>
  );
}

function ChapterStatusSelect({
  status,
  onChange,
}: {
  status: string;
  onChange: (val: string) => void;
}) {
  return (
    <select
      value={status}
      onChange={(e) => {
        e.stopPropagation();
        onChange(e.target.value);
      }}
      onClick={(e) => e.stopPropagation()}
      className="appearance-none rounded border border-editor-border bg-transparent px-1.5 py-1 text-[9px] font-semibold uppercase tracking-wider text-editor-text-secondary focus:outline-none hover:text-editor-text-primary cursor-pointer"
    >
      {["draft", "published", "archived"].map((s) => (
        <option
          key={s}
          value={s}
          className="bg-editor-surface text-editor-text-primary uppercase"
        >
          {s}
        </option>
      ))}
    </select>
  );
}

function SidebarTab({
  Icon,
  label,
  isActive,
  onClick,
}: {
  Icon: React.ElementType;
  label: string;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      data-active={isActive}
      className="flex flex-1 flex-col items-center gap-1.5 border-b-2 border-transparent pb-[12px] pt-[14px] text-[10.5px] font-semibold uppercase tracking-[0.07em] text-editor-text-tertiary transition-colors hover:text-editor-text-secondary data-[active=true]:border-editor-gold data-[active=true]:text-editor-gold"
    >
      <Icon strokeWidth={1.8} className="h-[17px] w-[17px]" />
      <span>{label}</span>
    </button>
  );
}

function EditableNoteCard({ note }: { note: Note }) {
  const [isEditing, setIsEditing] = useState(false);
  const [updateNote] = useUpdateNoteMutation();
  const [deleteNote] = useDeleteNoteMutation();

  const initialContent =
    typeof note.content === "string"
      ? note.content
      : JSON.stringify(note.content || "");
  const [text, setText] = useState(initialContent);
  const [type, setType] = useState(note.type);

  const handleBlur = () => {
    setIsEditing(false);
    if (text !== initialContent || type !== note.type)
      updateNote({ noteId: note._id, data: { content: text, type } });
  };

  return (
    <div
      className="group relative mb-2 cursor-pointer rounded-lg border border-editor-border p-3 hover:border-editor-gold-dim"
      onClick={() => !isEditing && setIsEditing(true)}
    >
      <div className="mb-2 flex items-center justify-between gap-2">
        <div className="truncate text-[13px] font-semibold text-editor-text-primary">
          {note.title || "Untitled"}
        </div>
        <div className="flex shrink-0 gap-2">
          {!note.novelId && (
            <span className="rounded bg-[#5c5868]/20 px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-widest text-[#948fa0]">
              Global
            </span>
          )}
          {!isEditing && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (window.confirm("Delete note?")) deleteNote(note._id);
              }}
              className="text-editor-text-tertiary opacity-0 transition-opacity hover:text-red-500 md:group-hover:opacity-100"
            >
              <Trash2 className="h-3 w-3" />
            </button>
          )}
        </div>
      </div>

      {isEditing ? (
        <div className="flex flex-col gap-2">
          <textarea
            autoFocus
            className="w-full resize-none rounded border border-white/5 bg-black/20 p-2 text-[12px] text-editor-text-secondary outline-none focus:border-editor-gold/50"
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={Math.max(3, text.split("\n").length)}
          />
          <div className="mt-1 flex items-center justify-between gap-2">
            <select
              value={type}
              onChange={(e) => setType(e.target.value as Note["type"])}
              className="rounded border border-editor-border bg-transparent p-1 text-[10px] uppercase tracking-wider text-editor-text-secondary"
            >
              {NOTE_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleBlur();
              }}
              className="rounded bg-editor-surface-hover px-3 py-1 text-xs text-editor-text-primary hover:text-editor-gold"
            >
              Done
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="line-clamp-6 whitespace-pre-wrap text-[12px] text-editor-text-tertiary">
            {text || "Empty note..."}
          </div>
          <div className="mt-3 text-[9px] font-bold uppercase tracking-widest text-[#c9975a]/70">
            {note.type}
          </div>
        </>
      )}
    </div>
  );
}

function NewNoteCard({
  novelId,
  onCancel,
}: {
  novelId: string;
  onCancel: () => void;
}) {
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [type, setType] = useState<Note["type"]>("lore");
  const [isGlobal, setIsGlobal] = useState(false);

  // ✅ FIX: Renamed the aliases to prevent block-scope collision
  const [createNote, { isLoading: isCreatingLocal }] = useCreateNoteMutation();
  const [createInboxNote, { isLoading: isCreatingGlobal }] =
    useCreateInboxNoteMutation();

  const handleSave = async () => {
    if (!title.trim() && !text.trim()) return onCancel();
    try {
      const data = {
        title: title.trim() || "Untitled Note",
        content: text.trim(),
        type,
      };
      await (
        isGlobal ? createInboxNote({ data }) : createNote({ novelId, data })
      ).unwrap();
      onCancel();
    } catch (err) {
      console.error("Failed to create note:", err);
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
        className="mb-2 w-full bg-transparent text-[13px] font-semibold text-editor-text-primary outline-none placeholder:text-editor-text-tertiary"
      />
      <textarea
        className="w-full resize-none rounded border border-white/5 bg-black/20 p-2 text-[12px] text-editor-text-secondary outline-none focus:border-editor-gold/50"
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={4}
        placeholder="Write your note..."
      />

      <div className="mt-3 flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-4 text-[11px] text-editor-text-secondary">
          <label className="flex cursor-pointer items-center gap-1.5">
            <input
              type="radio"
              checked={!isGlobal}
              onChange={() => setIsGlobal(false)}
              className="accent-[#c9975a]"
            />{" "}
            This Novel
          </label>
          <label className="flex cursor-pointer items-center gap-1.5">
            <input
              type="radio"
              checked={isGlobal}
              onChange={() => setIsGlobal(true)}
              className="accent-[#c9975a]"
            />{" "}
            Global Inbox
          </label>
        </div>
        <div className="flex items-center justify-between gap-2">
          <select
            value={type}
            onChange={(e) => setType(e.target.value as Note["type"])}
            className="rounded border border-editor-border bg-transparent p-1 text-[10px] uppercase tracking-wider text-editor-text-secondary"
          >
            {NOTE_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
          <div className="flex items-center gap-2">
            <button
              onClick={onCancel}
              className="text-xs text-editor-text-tertiary hover:text-white"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isCreatingLocal || isCreatingGlobal}
              className="rounded bg-[#c9975a] px-3 py-1 text-xs font-medium text-black hover:bg-[#d4a872] disabled:opacity-50"
            >
              {isCreatingLocal || isCreatingGlobal ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
