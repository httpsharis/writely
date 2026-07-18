"use client";

import { useState } from "react";
import { Book, Users, StickyNote, Plus, Folder, Eye, EyeOff, Trash } from "lucide-react";
import { useEditorContext } from "@/app/(editor)/project/[id]/write/EditorContext";
import { useGetNovelCharactersQuery } from "@/redux/features/characters/characterApi";
import { useGetNovelNotesQuery, useUpdateNoteMutation, Note } from "@/redux/features/notes/noteApi";
import { useTrashDocumentMutation } from "@/redux/features/documents/documentApi";

export default function EditorSidebar() {
  const { 
    novel,
    chapters, 
    activeChapterId, 
    handleSelectChapter, 
    handleCreateChapter,
    handleChangeChapterStatus,
    liveWordCount
  } = useEditorContext();

  const [activeTab, setActiveTab] = useState("chapters");
  const [chapterToDelete, setChapterToDelete] = useState<{id: string, title: string} | null>(null);

  const { data: charData } = useGetNovelCharactersQuery(novel?._id || "", { skip: !novel?._id });
  const characters = charData?.characters || [];

  const { data: noteData } = useGetNovelNotesQuery({ novelId: novel?._id || "" }, { skip: !novel?._id });
  const notes = noteData?.notes || [];

  const [trashDocument] = useTrashDocumentMutation();

  const confirmTrash = async () => {
    if (chapterToDelete) {
      await trashDocument(chapterToDelete.id).unwrap();
      setChapterToDelete(null);
    }
  };

  return (
    <aside className="flex flex-col min-h-0 bg-editor-bg border-l border-editor-border w-80 shrink-0 transition-all duration-300">
      
      <div className="flex shrink-0 border-b border-editor-border">
        <SidebarTab 
          icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-[17px] h-[17px]"><path d="M4 4h11a3 3 0 013 3v13H7a3 3 0 01-3-3V4z"/><path d="M4 4a3 3 0 013 3v13"/></svg>} 
          label="Chapters" 
          isActive={activeTab === "chapters"} 
          onClick={() => setActiveTab("chapters")} 
        />
        <SidebarTab 
          icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-[17px] h-[17px]"><circle cx="9" cy="8" r="3"/><path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6"/><circle cx="17" cy="9" r="2.3"/><path d="M15.5 14a4.7 4.7 0 015.5 4.6"/></svg>} 
          label="Cast" 
          isActive={activeTab === "characters"} 
          onClick={() => setActiveTab("characters")} 
        />
        <SidebarTab 
          icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-[17px] h-[17px]"><path d="M6 3h9l5 5v13H6z"/><path d="M15 3v5h5"/></svg>} 
          label="Notes" 
          isActive={activeTab === "notes"} 
          onClick={() => setActiveTab("notes")} 
        />
      </div>

      <div className="flex-1 overflow-y-auto p-6 no-scrollbar">
        {activeTab === "chapters" && (
          <div className="flex flex-col gap-[2px]">
            <div className="flex items-center justify-between mb-4 px-2">
              <span className="text-[11px] font-bold tracking-[0.08em] text-editor-text-tertiary uppercase">Manuscript</span>
              <button 
                onClick={handleCreateChapter}
                className="flex items-center gap-[5px] border-none bg-transparent text-editor-text-secondary text-[12px] font-medium py-[5px] px-2 rounded-md transition-colors hover:bg-editor-surface-hover hover:text-editor-gold cursor-pointer"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="w-[13px] h-[13px]"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                New
              </button>
            </div>
            
            <div className="flex items-center gap-2 p-2 text-[12.5px] text-editor-text-secondary mb-3">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-[14px] h-[14px] text-editor-text-tertiary"><path d="M3 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V7z"/></svg>
              All chapters
            </div>
            
            {chapters.map((chapter, index) => {
              const isActive = chapter._id === activeChapterId;
              const num = String(index + 1).padStart(2, '0');

              return (
                <div 
                  key={chapter._id}
                  onClick={() => handleSelectChapter(chapter._id)}
                  data-active={isActive}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => { if (e.key === 'Enter') handleSelectChapter(chapter._id); }}
                  className="group relative flex items-center justify-between gap-3 p-3 pl-4 rounded-lg bg-transparent border border-transparent text-left text-editor-text-secondary transition-colors hover:bg-editor-surface data-[active=true]:bg-editor-surface-raised data-[active=true]:border-editor-border-strong data-[active=true]:before:absolute data-[active=true]:before:-left-px data-[active=true]:before:top-1.5 data-[active=true]:before:bottom-1.5 data-[active=true]:before:w-[3px] data-[active=true]:before:rounded-sm data-[active=true]:before:bg-editor-gold cursor-pointer"
                >
                  {isActive && <span className="absolute right-[14px] top-[-1px] w-[10px] h-[16px] bg-editor-gold" style={{ clipPath: "polygon(0 0, 100% 0, 100% 100%, 50% 76%, 0 100%)" }}></span>}
                  
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <span className="font-['JetBrains_Mono'] text-[11px] text-editor-text-tertiary w-4 shrink-0 group-data-[active=true]:text-editor-gold">{num}</span>
                    <span className="flex-1 text-[14px] whitespace-nowrap overflow-hidden text-ellipsis group-data-[active=true]:text-editor-text-primary group-data-[active=true]:font-medium">
                      {chapter.title || "Untitled Chapter"}
                    </span>
                  </div>
                  
                  <span className="font-['JetBrains_Mono'] text-[11.5px] text-editor-text-tertiary tabular-nums mr-2">
                    {isActive ? liveWordCount.toLocaleString() : (chapter.wordCount?.toLocaleString() || 0)}
                  </span>

                  <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity bg-editor-bg/90 backdrop-blur-sm p-[3px] rounded-md group-data-[active=true]:bg-editor-surface-raised/90 border border-editor-border shadow-sm">
                    <select
                      value={chapter.status}
                      onChange={(e) => {
                        e.stopPropagation();
                        handleChangeChapterStatus(chapter._id, e.target.value);
                      }}
                      onClick={(e) => e.stopPropagation()}
                      className="bg-transparent border border-editor-border text-[9px] text-editor-text-secondary focus:outline-none cursor-pointer rounded px-1.5 py-1 appearance-none font-semibold uppercase tracking-wider hover:text-editor-text-primary transition-colors"
                    >
                      <option value="draft" className="bg-editor-surface text-editor-text-primary uppercase">Draft</option>
                      <option value="published" className="bg-editor-surface text-editor-text-primary uppercase">Published</option>
                      <option value="archived" className="bg-editor-surface text-editor-text-primary uppercase">Archived</option>
                    </select>
                    <button
                      onClick={(e) => { e.stopPropagation(); setChapterToDelete({ id: chapter._id, title: chapter.title }); }}
                      title="Move to Trash"
                      className="p-1 rounded-md transition-colors border-none bg-transparent flex items-center justify-center cursor-pointer text-editor-text-secondary hover:text-red-500 hover:bg-red-500/10"
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {activeTab === "characters" && (
          <div className="flex flex-col gap-[2px]">
            <div className="flex items-center justify-between mb-4 px-2">
              <span className="text-[11px] font-bold tracking-[0.08em] text-editor-text-tertiary uppercase">Cast</span>
              <button className="flex items-center gap-[5px] border-none bg-transparent text-editor-text-secondary text-[12px] font-medium py-[5px] px-2 rounded-md transition-colors hover:bg-editor-surface-hover hover:text-editor-gold">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="w-[13px] h-[13px]"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                New
              </button>
            </div>
            {characters.length === 0 ? (
              <div className="flex items-center gap-3 p-[10px_12px] rounded-lg bg-transparent transition-colors hover:bg-editor-surface">
                <div className="w-8 h-8 rounded-full bg-editor-surface-raised border border-editor-border-strong flex items-center justify-center font-['Fraunces'] text-[13px] text-editor-gold shrink-0 overflow-hidden">
                  ?
                </div>
                <div className="flex flex-col min-w-0">
                  <div className="text-[13.5px] text-editor-text-primary whitespace-nowrap overflow-hidden text-ellipsis">Add your first character</div>
                  <div className="text-[11.5px] text-editor-text-tertiary whitespace-nowrap overflow-hidden text-ellipsis">No characters yet</div>
                </div>
              </div>
            ) : (
              characters.map(char => (
                <div key={char._id} className="flex items-center gap-3 p-[10px_12px] rounded-lg bg-transparent transition-colors hover:bg-editor-surface cursor-pointer">
                  <div className="w-8 h-8 rounded-full bg-editor-surface-raised border border-editor-border-strong flex items-center justify-center font-['Fraunces'] text-[13px] text-editor-gold shrink-0 overflow-hidden">
                    {char.avatarUrl ? (
                      <img src={char.avatarUrl} alt={char.name} className="w-full h-full object-cover" />
                    ) : (
                      char.name.charAt(0)
                    )}
                  </div>
                  <div className="flex flex-col min-w-0">
                    <div className="text-[13.5px] text-editor-text-primary whitespace-nowrap overflow-hidden text-ellipsis">{char.name}</div>
                    <div className="text-[11.5px] text-editor-text-tertiary whitespace-nowrap overflow-hidden text-ellipsis">{char.role}</div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === "notes" && (
          <div className="flex flex-col gap-[2px]">
            <div className="flex items-center justify-between mb-4 px-2">
              <span className="text-[11px] font-bold tracking-[0.08em] text-editor-text-tertiary uppercase">Notes</span>
              <button className="flex items-center gap-[5px] border-none bg-transparent text-editor-text-secondary text-[12px] font-medium py-[5px] px-2 rounded-md transition-colors hover:bg-editor-surface-hover hover:text-editor-gold cursor-pointer">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="w-[13px] h-[13px]"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                New
              </button>
            </div>
            {notes.length === 0 ? (
              <div className="p-3 rounded-lg border border-editor-border mb-2 bg-transparent">
                <div className="text-[13px] text-editor-text-primary mb-1">No notes yet</div>
                <div className="text-[12px] text-editor-text-tertiary leading-[1.5]">Jot down worldbuilding details, timeline notes, or anything you want to keep close while you write.</div>
              </div>
            ) : (
              notes.map(note => <EditableNoteCard key={note._id} note={note} />)
            )}
          </div>
        )}
      </div>

      {chapterToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-editor-surface border border-editor-border rounded-xl shadow-2xl max-w-sm w-full p-6 animate-in fade-in zoom-in-95 duration-200">
            <h3 className="text-lg font-['Fraunces'] font-semibold text-editor-text-primary mb-2">Move to Trash?</h3>
            <p className="text-[13px] text-editor-text-secondary mb-6 leading-relaxed">
              Are you sure you want to move "<span className="text-editor-text-primary font-medium">{chapterToDelete.title || "Untitled Chapter"}</span>" to the trash? You can restore it later from your library.
            </p>
            <div className="flex items-center justify-end gap-3">
              <button 
                onClick={() => setChapterToDelete(null)}
                className="px-4 py-2 text-[13px] font-medium text-editor-text-secondary bg-transparent border border-editor-border rounded-lg hover:bg-editor-surface-hover transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button 
                onClick={confirmTrash}
                className="px-4 py-2 text-[13px] font-medium text-white bg-red-500/80 border border-red-500/50 rounded-lg hover:bg-red-500 transition-colors cursor-pointer"
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

function SidebarTab({ icon, label, isActive, onClick }: { icon: React.ReactNode, label: string, isActive: boolean, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      data-active={isActive}
      className="flex-1 flex flex-col items-center gap-1.5 pt-[14px] pb-[12px] border-b-2 border-transparent bg-transparent text-editor-text-tertiary text-[10.5px] font-semibold tracking-[0.07em] uppercase transition-colors hover:text-editor-text-secondary data-[active=true]:text-editor-gold data-[active=true]:border-editor-gold"
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

function EditableNoteCard({ note }: { note: Note }) {
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(note.content || note.title);
  const [updateNote] = useUpdateNoteMutation();

  const handleBlur = () => {
    setIsEditing(false);
    if (text !== (note.content || note.title)) {
      updateNote({ noteId: note._id, data: { content: text } });
    }
  };

  return (
    <div 
      className="p-3 rounded-lg border border-editor-border mb-2 transition-colors hover:border-editor-gold-dim cursor-pointer group" 
      onClick={() => { if (!isEditing) setIsEditing(true); }}
    >
      <div className="text-[13px] text-editor-text-primary mb-1">{note.title}</div>
      {isEditing ? (
        <textarea
          autoFocus
          className="w-full bg-transparent border-none outline-none font-sans text-[12px] text-editor-text-secondary resize-none leading-[1.5] focus:ring-0 p-0 m-0"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onBlur={handleBlur}
          rows={Math.max(2, text.split('\n').length)}
        />
      ) : (
        <div className="text-[12px] text-editor-text-tertiary leading-[1.5] whitespace-pre-wrap">
          {text || "Click to add note content..."}
        </div>
      )}
      <div className="text-[9px] font-bold text-editor-text-tertiary/50 uppercase tracking-widest mt-2">{note.type}</div>
    </div>
  );
}