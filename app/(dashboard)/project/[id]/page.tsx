"use client";

import { useState, useRef, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { 
  useGetDocumentByIdQuery, 
  useUpdateDocumentMutation, 
  useCreateDocumentMutation,
  Document 
} from "@/redux/features/documents/documentApi";
import { useGetCurrentUserQuery } from "@/redux/features/auth/authApi";
import { useUploadImageMutation } from "@/redux/features/uploads/uploadApi";

// ---------------------------------------------------------
// SVG Icons (Matching Prototype)
// ---------------------------------------------------------
const HubIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M4 4h11a3 3 0 013 3v13H7a3 3 0 01-3-3V4z"/><path d="M4 4a3 3 0 013 3v13"/>
  </svg>
);

const PictureIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
    <path d="M4 5.5A2.5 2.5 0 016.5 3H19v16H6.5A2.5 2.5 0 004 16.5v-11z"/>
    <path d="M4 16.5A2.5 2.5 0 016.5 19H19"/>
  </svg>
);

const EditNoteIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 013 3L7 19l-4 1 1-4z"/>
  </svg>
);

const PlusIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
);

const ChevronRightIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6"/>
  </svg>
);

const LoaderIcon = () => (
  <svg className="animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
  </svg>
);

// ---------------------------------------------------------
// InlineEdit Component
// ---------------------------------------------------------
function InlineEdit({ 
  value, 
  onSave, 
  className, 
  multiline = false,
  placeholder = "Edit...",
  type = "text",
  editTrigger,
  isEditingState
}: { 
  value: string; 
  onSave: (val: string) => void; 
  className?: string;
  multiline?: boolean;
  placeholder?: string;
  type?: string;
  editTrigger?: React.ReactNode;
  isEditingState?: [boolean, (val: boolean) => void];
}) {
  const [localIsEditing, setLocalIsEditing] = useState(false);
  const isEditing = isEditingState ? isEditingState[0] : localIsEditing;
  const setIsEditing = isEditingState ? isEditingState[1] : setLocalIsEditing;

  const [tempValue, setTempValue] = useState(value);
  const inputRef = useRef<any>(null);

  useEffect(() => { setTempValue(value); }, [value, isEditing]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      // Move cursor to end
      if (typeof inputRef.current.setSelectionRange === 'function') {
        const len = tempValue?.length || 0;
        inputRef.current.setSelectionRange(len, len);
      }
    }
  }, [isEditing]);

  const finishEdit = () => {
    setIsEditing(false);
    if (tempValue !== value) {
      onSave(tempValue);
    }
  };

  if (isEditing) {
    if (multiline) {
      return (
        <textarea
          ref={inputRef}
          value={tempValue}
          onChange={(e) => setTempValue(e.target.value)}
          onBlur={finishEdit}
          placeholder={placeholder}
          className={`bg-transparent outline-none resize-y w-full transition-colors ${className}`}
        />
      );
    }
    return (
      <input
        ref={inputRef}
        type={type}
        value={tempValue}
        onChange={(e) => setTempValue(e.target.value)}
        onBlur={finishEdit}
        onKeyDown={(e) => e.key === "Enter" && finishEdit()}
        placeholder={placeholder}
        className={`bg-transparent outline-none border-b border-[rgba(255,255,255,0.14)] focus:border-[#c9975a] min-w-[50px] w-full transition-colors ${className}`}
      />
    );
  }

  if (editTrigger) {
    return (
      <div className="w-full relative group">
        <div className={className}>{value || placeholder}</div>
        <div onClick={() => setIsEditing(true)} className="absolute inset-0 cursor-pointer" />
      </div>
    );
  }

  return (
    <div onClick={() => setIsEditing(true)} className={`cursor-text hover:opacity-80 transition-opacity whitespace-pre-wrap ${className}`}>
      {value || placeholder}
    </div>
  );
}

// ---------------------------------------------------------
// Main Page Component
// ---------------------------------------------------------
export default function ProjectLobbyPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = (params.projectId || params.id) as string;

  const { data: authData, isLoading: isUserLoading } = useGetCurrentUserQuery();
  const { data, isLoading: isDocLoading, error } = useGetDocumentByIdQuery(projectId, {
    skip: !authData?.user,
  });
  
  const [updateDocument] = useUpdateDocumentMutation();
  const [createDocument, { isLoading: isCreating }] = useCreateDocumentMutation();
  const [uploadImage, { isLoading: isUploading }] = useUploadImageMutation();
  const project = data?.document;

  const [isEditingNote, setIsEditingNote] = useState(false);
  const [coverInput, setCoverInput] = useState("");
  const [showCoverInput, setShowCoverInput] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const chapters = project?.chapters || (project as any)?.children || [];
  const isPublished = project?.status === "published";
  const displayWordCount = chapters.length > 0 
    ? chapters.reduce((total: number, chap: Document) => total + (chap.wordCount || 0), 0)
    : (project?.wordCount || 0);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const res = await uploadImage(file).unwrap();
      if (res.url) {
        handleUpdate("coverImage", res.url);
        setShowCoverInput(false);
      }
    } catch (err) {
      console.error("Failed to upload image", err);
    }
  };

  const handleUpdate = async (field: keyof Document, value: any) => {
    if (!project) return;
    try {
      await updateDocument({
        id: project._id,
        data: { [field]: value }
      }).unwrap();
    } catch (err) {
      console.error("Failed to update", err);
    }
  };

  const handleChapterUpdate = async (chapterId: string, title: string) => {
    try {
      await updateDocument({
        id: chapterId,
        data: { title }
      }).unwrap();
    } catch (err) {
      console.error("Failed to update chapter", err);
    }
  };

  const handleCreateChapter = async () => {
    if (!project) return;
    try {
      const newChap = await createDocument({
        title: "Untitled Chapter",
        type: "chapter",
        parentId: project._id,
      }).unwrap();
      router.push(`/project/${project._id}/write?chapterId=${newChap.document._id}`);
    } catch (err) {
      console.error(err);
    }
  };

  if (isUserLoading || isDocLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-[#131217]">
        <div className="w-6 h-6 animate-spin rounded-full border-t-2 border-[#c9975a]" />
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center bg-[#131217] text-[#ede9e2]">
        <p className="font-serif text-2xl mb-4">Manuscript not found.</p>
        <button onClick={() => router.push("/library")} className="text-xs font-bold uppercase tracking-widest text-[#948fa0] hover:text-[#ede9e2]">
          Return to Library
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-transparent text-[#ede9e2] font-sans antialiased">
      {/* We assume the Sidebar is handled in layout.tsx, so we only render <main> content here */}
      <main className="flex-1 px-14 py-12 pb-20 max-w-[1180px] mx-auto">
        
        {/* Page Header */}
        <div className="flex items-start justify-between gap-6 mb-7">
          <div className="w-full">
            <div className="flex items-center gap-1.5 text-[11px] font-semibold tracking-[0.09em] uppercase text-[#5c5868] mb-2.5">
              <span className="w-3 h-3"><HubIcon /></span>
              Project hub
            </div>
            <InlineEdit 
              value={project.title || "Untitled"} 
              onSave={(val) => handleUpdate("title", val)}
              className="font-serif font-medium text-[40px] tracking-[-0.01em] m-0 text-[#ede9e2]"
            />
          </div>
          
          <div className="flex items-center gap-2.5 pt-1">
            <button 
              onClick={() => handleUpdate("status", isPublished ? "draft" : "published")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-[20px] border border-[rgba(255,255,255,0.14)] text-xs bg-[#1b1a21] transition-colors hover:bg-[#29272f] ${isPublished ? 'text-[#ede9e2]' : 'text-[#948fa0]'}`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${isPublished ? 'bg-[#7cbf8e]' : 'bg-[#5c5868]'}`} />
              {isPublished ? "Published" : "Draft"}
            </button>
            {/* Gear icon removed as requested */}
          </div>
        </div>

        <hr className="border-t border-[rgba(255,255,255,0.07)] my-10" />

        <div className="grid grid-cols-1 lg:grid-cols-[264px_1px_1fr] gap-10 items-start">
          
          {/* LEFT COLUMN */}
          <div className="flex flex-col">
            <div className="relative aspect-[2/3] rounded-xl border border-[rgba(255,255,255,0.14)] bg-[#1b1a21] flex flex-col items-center justify-center gap-2.5 text-[#5c5868] overflow-hidden mb-5 group">
              {project.coverImage ? (
                <Image src={project.coverImage} alt="Cover" fill className="object-cover" />
              ) : (
                <>
                  <span className="w-[30px] h-[30px] opacity-50"><PictureIcon /></span>
                  <span className="font-serif italic text-[13px]">No cover</span>
                </>
              )}
              
              {!showCoverInput && (
                <div 
                  onClick={() => setShowCoverInput(true)}
                  className="absolute inset-0 bg-[rgba(19,18,23,0.82)] flex items-center justify-center text-xs font-medium text-[#c9975a] opacity-0 transition-opacity group-hover:opacity-100 cursor-pointer"
                >
                  Upload or Link Cover
                </div>
              )}

              {showCoverInput && (
                <div className="absolute inset-0 bg-[rgba(19,18,23,0.95)] flex flex-col items-center justify-center p-4 gap-3 z-10">
                  <span className="text-[10px] uppercase tracking-widest text-[#948fa0] font-semibold">Cover URL</span>
                  <input 
                    autoFocus
                    value={coverInput}
                    onChange={(e) => setCoverInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && coverInput) {
                        handleUpdate("coverImage", coverInput);
                        setShowCoverInput(false);
                      }
                    }}
                    placeholder="https://..."
                    className="w-full bg-[#1b1a21] border border-[rgba(255,255,255,0.14)] rounded text-[11px] px-2 py-1.5 text-[#ede9e2] outline-none focus:border-[#c9975a]"
                  />
                  
                  <span className="text-[10px] uppercase tracking-widest text-[#5c5868] font-semibold">— OR —</span>
                  
                  <input 
                    type="file"
                    accept="image/*"
                    className="hidden"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                  />
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                    className="w-full bg-[#29272f] text-[#ede9e2] text-[10px] font-semibold rounded py-1.5 border border-[rgba(255,255,255,0.07)] hover:bg-[#c9975a] hover:text-[#131217] transition-colors disabled:opacity-50"
                  >
                    {isUploading ? "Uploading..." : "Upload from Computer"}
                  </button>

                  <div className="flex gap-2 w-full mt-1">
                    <button 
                      onClick={() => setShowCoverInput(false)}
                      className="flex-1 text-[10px] py-1 text-[#948fa0] hover:text-[#ede9e2]"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={() => {
                        if(coverInput) handleUpdate("coverImage", coverInput);
                        setShowCoverInput(false);
                      }}
                      className="flex-1 bg-[#c9975a] text-[#131217] text-[10px] font-semibold rounded py-1"
                    >
                      Save Link
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="border border-[rgba(255,255,255,0.07)] rounded-[10px] overflow-hidden mb-6">
              <div className="flex items-center justify-between px-3.5 py-3 border-b border-[rgba(255,255,255,0.07)]">
                <span className="text-[10.5px] font-semibold tracking-[0.07em] uppercase text-[#5c5868]">Status</span>
                <span className="flex items-center gap-1.5 text-[13px] text-[#ede9e2]">
                  <span className={`w-1.5 h-1.5 rounded-full ${isPublished ? 'bg-[#7cbf8e]' : 'bg-[#5c5868]'}`} />
                  {isPublished ? "Published" : "Draft"}
                </span>
              </div>
              <div className="flex items-center justify-between px-3.5 py-3 border-b border-[rgba(255,255,255,0.07)]">
                <span className="text-[10.5px] font-semibold tracking-[0.07em] uppercase text-[#5c5868]">Word count</span>
                <span className="font-mono tabular-nums text-[13px] text-[#ede9e2] text-right">
                  {displayWordCount.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between px-3.5 py-3">
                <span className="text-[10.5px] font-semibold tracking-[0.07em] uppercase text-[#5c5868]">Last edited</span>
                <span className="font-mono tabular-nums text-[13px] text-[#ede9e2]">
                  {project.updatedAt ? new Date(project.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : "Recently"}
                </span>
              </div>
            </div>

            <div className="flex flex-col">
              <span className="text-[10.5px] font-semibold tracking-[0.07em] uppercase text-[#5c5868] mb-2">Synopsis</span>
              <InlineEdit
                multiline
                placeholder="Write a synopsis..."
                value={project.synopsis || ""}
                onSave={(val) => handleUpdate("synopsis", val)}
                className="font-serif italic text-[14.5px] leading-[1.6] text-[#948fa0] m-0 p-2 -ml-2"
              />
            </div>
          </div>

          {/* RULE */}
          <div className="hidden lg:block bg-[rgba(255,255,255,0.07)] h-full" />

          {/* RIGHT COLUMN */}
          <div className="flex flex-col">
            
            {/* Public Note */}
            <div className="mb-9">
              <div className="flex items-center justify-between mb-3.5">
                <span className="text-[10.5px] font-semibold tracking-[0.08em] uppercase text-[#5c5868]">Public note</span>
                <button 
                  onClick={() => setIsEditingNote(true)}
                  className="flex items-center gap-1.5 border-none bg-transparent text-[#948fa0] text-xs font-medium px-1.5 py-1 rounded-md transition-colors hover:bg-[#29272f] hover:text-[#c9975a]"
                >
                  <span className="w-3 h-3"><EditNoteIcon /></span>
                  Edit note
                </button>
              </div>
              <div className="border border-[rgba(255,255,255,0.07)] rounded-[10px] p-5 bg-[#1b1a21]">
                <InlineEdit
                  multiline
                  isEditingState={[isEditingNote, setIsEditingNote]}
                  placeholder="Write an update for your readers..."
                  value={project.authorNote || "No public note has been written for this project yet."}
                  onSave={(val) => handleUpdate("authorNote", val)}
                  className="font-serif italic text-[17px] leading-[1.65] text-[#ede9e2] m-0 mb-2.5 p-2 -ml-2 min-h-[80px]"
                />
                {!isEditingNote && (
                  <span className="text-[11px] text-[#5c5868] font-mono">
                    Updated {project.updatedAt ? new Date(project.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : "Recently"}
                  </span>
                )}
              </div>
            </div>

            {/* Chapters */}
            <div className="mb-9">
              <div className="flex items-center justify-between mb-3.5">
                <span className="text-[10.5px] font-semibold tracking-[0.08em] uppercase text-[#5c5868]">Manuscript chapters</span>
                <button 
                  onClick={handleCreateChapter}
                  disabled={isCreating}
                  className="flex items-center gap-1.5 bg-[#c9975a] text-[#131217] text-xs font-semibold px-3 py-1.5 rounded transition-opacity hover:opacity-90 disabled:opacity-50"
                >
                  {isCreating ? <span className="w-3 h-3"><LoaderIcon /></span> : <span className="w-3 h-3"><PlusIcon /></span>}
                  Create chapter
                </button>
              </div>
              <div className="flex flex-col gap-1.5">
                {chapters.length > 0 ? (
                  chapters.map((chapter: Document, i: number) => (
                    <div 
                      key={chapter._id}
                      className="group flex items-center gap-4 px-4 py-4 border border-[rgba(255,255,255,0.07)] rounded-[10px] bg-[#1b1a21] transition-colors hover:bg-[#29272f] hover:border-[rgba(255,255,255,0.14)]"
                    >
                      <span className="font-mono text-[11px] text-[#c9975a] w-5 shrink-0">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <div className="flex-1 min-w-0 flex flex-col">
                        {/* Chapter Title Edit */}
                        <InlineEdit
                          value={chapter.title || "Untitled Chapter"}
                          onSave={(val) => handleChapterUpdate(chapter._id, val)}
                          className="font-serif text-[18px] text-[#ede9e2] mb-1"
                        />
                        <span className="flex items-center gap-2 text-[11.5px] text-[#5c5868] font-mono">
                          {chapter.wordCount || 0} words 
                          <span className="w-[3px] h-[3px] rounded-full bg-[#5c5868]" /> 
                          Edited {new Date(chapter.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </span>
                      </div>
                      <button 
                        onClick={() => router.push(`/project/${project._id}/write?chapterId=${chapter._id}`)}
                        className="text-[#5c5868] shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:text-[#c9975a]"
                      >
                        <span className="w-4 h-4 block"><ChevronRightIcon /></span>
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="px-4 py-3.5 border border-dashed border-[rgba(255,255,255,0.14)] rounded-[10px] text-[12.5px] text-[#5c5868] text-center">
                    One chapter so far — create another to keep the manuscript moving
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>

      </main>
    </div>
  );
}