"use client";

import { useState } from "react";
import { 
  useGetInboxNotesQuery, 
  useCreateInboxNoteMutation, 
  useDeleteNoteMutation,
  useUpdateNoteMutation,
  Note 
} from "@/redux/features/notes/noteApi";
import { useGetDocumentsQuery } from "@/redux/features/documents/documentApi";
import Link from "next/link";

// ---------------------------------------------------------
// SVG Icons
// ---------------------------------------------------------
const PlusIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
);
const LinkIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M10 13a5 5 0 007.07 0l2-2a5 5 0 00-7.07-7.07l-1 1"/>
    <path d="M14 11a5 5 0 00-7.07 0l-2 2a5 5 0 007.07 7.07l1-1"/>
  </svg>
);
const ArchiveIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <rect x="3" y="4" width="18" height="4" rx="1"/>
    <path d="M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8"/><line x1="10" y1="13" x2="14" y2="13"/>
  </svg>
);
const DeleteIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <line x1="5" y1="6" x2="19" y2="18"/><line x1="19" y1="6" x2="5" y2="18"/>
  </svg>
);
const ProjectIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M4 4h11a3 3 0 013 3v13H7a3 3 0 01-3-3V4z"/>
  </svg>
);

// Type Icons
const WorldbuildingIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 010 18M12 3a14 14 0 000 18"/></svg>;
const PlotIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M6 3h9l5 5v13H6z"/><path d="M15 3v5h5"/></svg>;
const LoreIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/></svg>;
const ResearchIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.5" y2="16.5"/></svg>;
const TimelineIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="9"/><polyline points="12 7 12 12 15.5 14"/></svg>;

const TAGS = [
  { id: "worldbuilding", label: "Worldbuilding", color: "#9b8de0", Icon: WorldbuildingIcon },
  { id: "plot", label: "Plot", color: "#c9975a", Icon: PlotIcon },
  { id: "lore", label: "Lore", color: "#6fb8b0", Icon: LoreIcon },
  { id: "research", label: "Research", color: "#6fa3d8", Icon: ResearchIcon },
  { id: "timeline", label: "Timeline", color: "#d18a9b", Icon: TimelineIcon },
];

function getTagConfig(type: string) {
  return TAGS.find(t => t.id === type) || { id: "misc", label: "Misc", color: "#948fa0", Icon: WorldbuildingIcon };
}

function timeAgo(dateString: string) {
  if (!dateString) return "Recently";
  const date = new Date(dateString);
  const now = new Date();
  const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
  if (diffInHours < 1) return "Just now";
  if (diffInHours < 24) return `${diffInHours} hrs ago`;
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays === 1) return "Yesterday";
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export default function InboxPage() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [captureText, setCaptureText] = useState("");
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const { data: notesData, isLoading } = useGetInboxNotesQuery();
  const { data: projectsData } = useGetDocumentsQuery({ type: "novel" });
  
  const [createNote] = useCreateInboxNoteMutation();
  const [deleteNote] = useDeleteNoteMutation();
  const [updateNote] = useUpdateNoteMutation();

  const notes = notesData?.notes || [];
  const projects = projectsData?.documents || [];

  const filteredNotes = activeFilter === "all" 
    ? notes 
    : notes.filter(n => n.type === activeFilter);

  const handleCapture = async () => {
    if (!captureText.trim()) return;
    try {
      await createNote({
        data: {
          title: captureText,
          content: "",
          // Automatically assign type if filter is selected, otherwise default to 'misc'
          type: activeFilter !== "all" ? (activeFilter as Note['type']) : "misc"
        }
      }).unwrap();
      setCaptureText("");
    } catch (err: unknown) {
      console.error(
        "RAW ERROR OBJECT:",
        JSON.stringify(err, Object.getOwnPropertyNames(err), 2)
      );
    }
  };

  const handleLinkToProject = async (noteId: string, novelId: string) => {
    try {
      await updateNote({ noteId, data: { novelId } }).unwrap();
      setActiveDropdown(null);
    } catch (err) {
      console.error("Failed to link note:", err);
    }
  };

  return (
    <div className="min-h-screen bg-transparent text-[#ede9e2] font-sans antialiased flex justify-center py-14 px-10 pb-20">
      <div className="w-full max-w-[860px]">
        
        <h1 className="font-serif font-medium text-[38px] tracking-[-0.01em] m-0 mb-2">Inbox</h1>
        <p className="text-[14px] text-[#948fa0] m-0 mb-7">Your raw ideas, research, and plot fragments. Triage them later.</p>

        {/* Capture Box */}
        <div className="flex items-center gap-3 px-[18px] py-4 border border-[rgba(255,255,255,0.14)] rounded-xl bg-[#1b1a21] mb-8 transition-colors focus-within:border-[#c9975a] focus-within:bg-[#232128]">
          <span className="w-[22px] h-[22px] rounded-md border border-[rgba(255,255,255,0.14)] flex items-center justify-center text-[#5c5868] shrink-0">
            <span className="w-3 h-3"><PlusIcon /></span>
          </span>
          <input 
            type="text" 
            placeholder="Capture a raw idea, plot point, or piece of lore…"
            value={captureText}
            onChange={(e) => setCaptureText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleCapture()}
            className="flex-1 bg-transparent border-none outline-none text-[#ede9e2] text-[14.5px] placeholder:text-[#5c5868]"
          />
          <span className="font-mono text-[10.5px] text-[#5c5868] border border-[rgba(255,255,255,0.14)] rounded px-1.5 py-0.5 shrink-0">Enter</span>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-1.5 mb-[18px] flex-wrap">
          <button 
            onClick={() => setActiveFilter("all")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[12px] font-medium transition-colors ${
              activeFilter === "all" 
                ? "text-[#ede9e2] border-[rgba(255,255,255,0.14)] bg-[#1b1a21]" 
                : "text-[#5c5868] border-[rgba(255,255,255,0.07)] hover:text-[#948fa0] hover:border-[rgba(255,255,255,0.14)]"
            }`}
          >
            All <span className="text-[#5c5868]">·</span> {notes.length}
          </button>
          
          {TAGS.map(tag => (
            <button 
              key={tag.id}
              onClick={() => setActiveFilter(tag.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[12px] font-medium transition-colors ${
                activeFilter === tag.id 
                  ? "text-[#ede9e2] border-[rgba(255,255,255,0.14)] bg-[#1b1a21]" 
                  : "text-[#5c5868] border-[rgba(255,255,255,0.07)] hover:text-[#948fa0] hover:border-[rgba(255,255,255,0.14)]"
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: tag.color }} />
              {tag.label}
            </button>
          ))}
        </div>

        {/* List Header */}
        <div className="flex items-center justify-between px-[18px] mb-2.5">
          <span className="text-[10.5px] font-semibold tracking-[0.08em] uppercase text-[#5c5868]">Captured note</span>
          <span className="text-[10.5px] font-semibold tracking-[0.08em] uppercase text-[#5c5868]">Tag</span>
        </div>

        {/* Rows */}
        <div className="flex flex-col gap-1.5">
          {isLoading && (
            <div className="py-10 text-center text-[#5c5868] text-sm">Loading notes...</div>
          )}
          {!isLoading && filteredNotes.length === 0 && (
            <div className="py-10 text-center text-[#5c5868] text-sm border border-dashed border-[rgba(255,255,255,0.07)] rounded-xl">
              No ideas captured yet. Type above to begin.
            </div>
          )}
          
          {filteredNotes.map(note => {
            const tag = getTagConfig(note.type);
            const Icon = tag.Icon;
            const linkedProject = note.novelId ? projects.find(p => p._id === note.novelId) : null;

            return (
              <div key={note._id} className="group relative flex items-center gap-[14px] px-[18px] py-[14px] border border-[rgba(255,255,255,0.07)] rounded-[10px] bg-[#1b1a21] transition-colors hover:bg-[#29272f] hover:border-[rgba(255,255,255,0.14)]">
                
                <div 
                  className="w-[34px] h-[34px] rounded-lg flex items-center justify-center shrink-0"
                  style={{ backgroundColor: `${tag.color}22`, color: tag.color }}
                >
                  <span className="w-4 h-4"><Icon /></span>
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="text-[14.5px] font-medium text-[#ede9e2] mb-[3px] whitespace-nowrap overflow-hidden text-ellipsis">
                    {note.title}
                  </div>
                  {note.content && (
                    <div className="text-[12.5px] text-[#5c5868] whitespace-nowrap overflow-hidden text-ellipsis">
                      {typeof note.content === 'string' ? note.content : "Rich text content..."}
                    </div>
                  )}
                  {linkedProject && (
                    <Link href={`/project/${linkedProject._id}`} className="inline-flex items-center gap-1 text-[11px] text-[#c9975a] mt-1 hover:underline">
                      <span className="w-2.5 h-2.5"><ProjectIcon /></span>
                      {linkedProject.title}
                    </Link>
                  )}
                </div>

                <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full border border-[rgba(255,255,255,0.14)] text-[10.5px] font-semibold tracking-[0.05em] uppercase text-[#948fa0] shrink-0 whitespace-nowrap">
                  <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: tag.color }} />
                  {tag.label}
                </div>

                <div className="font-mono text-[11.5px] text-[#5c5868] w-[76px] text-right shrink-0">
                  {timeAgo(note.createdAt)}
                </div>

                <div className="flex items-center gap-0.5 shrink-0 opacity-0 -translate-x-1 transition-all group-hover:opacity-100 group-hover:translate-x-0 relative">
                  
                  {/* Link Button & Dropdown */}
                  <div className="relative">
                    <button 
                      onClick={() => setActiveDropdown(activeDropdown === note._id ? null : note._id)}
                      title="Link to project"
                      className="w-[26px] h-[26px] border-none bg-transparent rounded-md flex items-center justify-center text-[#5c5868] hover:bg-[#232128] hover:text-[#c9975a] transition-colors"
                    >
                      <span className="w-[13px] h-[13px]"><LinkIcon /></span>
                    </button>
                    
                    {activeDropdown === note._id && (
                      <div className="absolute right-0 top-full mt-1 w-48 bg-[#1b1a21] border border-[rgba(255,255,255,0.14)] rounded-lg shadow-xl z-50 overflow-hidden">
                        <div className="px-3 py-2 text-[10px] font-semibold uppercase tracking-widest text-[#5c5868] border-b border-[rgba(255,255,255,0.07)]">
                          Link to project
                        </div>
                        <div className="max-h-48 overflow-y-auto p-1">
                          {projects.length === 0 ? (
                            <div className="px-2 py-3 text-xs text-[#5c5868] text-center">No projects found</div>
                          ) : (
                            projects.map(p => (
                              <button 
                                key={p._id}
                                onClick={() => handleLinkToProject(note._id, p._id)}
                                className="w-full text-left px-2 py-1.5 text-xs text-[#ede9e2] rounded hover:bg-[#29272f] transition-colors"
                              >
                                {p.title}
                              </button>
                            ))
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  <button 
                    title="Archive"
                    className="w-[26px] h-[26px] border-none bg-transparent rounded-md flex items-center justify-center text-[#5c5868] hover:bg-[#232128] hover:text-[#c9975a] transition-colors"
                  >
                    <span className="w-[13px] h-[13px]"><ArchiveIcon /></span>
                  </button>
                  <button 
                    title="Delete"
                    onClick={() => {
                      if(confirm("Delete this idea?")) deleteNote(note._id);
                    }}
                    className="w-[26px] h-[26px] border-none bg-transparent rounded-md flex items-center justify-center text-[#5c5868] hover:bg-[#232128] hover:text-[#d88] transition-colors"
                  >
                    <span className="w-[13px] h-[13px]"><DeleteIcon /></span>
                  </button>
                </div>

              </div>
            );
          })}
        </div>

        <p className="text-center text-[12px] text-[#5c5868] mt-6">
          {filteredNotes.length} captured note{filteredNotes.length !== 1 ? 's' : ''} · use the tag filters above to triage faster
        </p>

      </div>
    </div>
  );
}