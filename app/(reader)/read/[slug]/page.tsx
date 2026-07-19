"use client";

import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { 
  useGetPublicDocumentQuery, 
  useLikePublicDocumentMutation,
  Document 
} from "@/redux/features/documents/documentApi";
import { Heart } from "lucide-react";

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

const ChevronRightIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6"/>
  </svg>
);

// ---------------------------------------------------------
// Main Page Component
// ---------------------------------------------------------
export default function PublicProjectHubPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const { data, isLoading, error } = useGetPublicDocumentQuery(slug);
  const [likeDocument, { isLoading: isLiking }] = useLikePublicDocumentMutation();
  
  const project = data?.document;

  const chapters = project?.chapters || [];
  const displayWordCount = project?.wordCount || 0;

  const handleLike = async () => {
    if (!project) return;
    try {
      await likeDocument(slug).unwrap();
    } catch (err) {
      console.error("Failed to like", err);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-[#131217]">
        <div className="w-6 h-6 animate-spin rounded-full border-t-2 border-[#c9975a]" />
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center bg-[#131217] text-[#ede9e2]">
        <p className="font-serif text-2xl mb-4">Manuscript not found or is private.</p>
        <button onClick={() => router.push("/")} className="text-xs font-bold uppercase tracking-widest text-[#948fa0] hover:text-[#ede9e2]">
          Return to Home
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-transparent text-[#ede9e2] font-sans antialiased">
      <main className="flex-1 px-14 py-12 pb-20 max-w-[1180px] mx-auto">
        
        {/* Page Header */}
        <div className="flex items-start justify-between gap-6 mb-7">
          <div className="w-full">
            <div className="flex items-center gap-1.5 text-[11px] font-semibold tracking-[0.09em] uppercase text-[#5c5868] mb-2.5">
              <span className="w-3 h-3"><HubIcon /></span>
              By {(project as any)?.owner?.name || "Unknown Author"}
            </div>
            <h1 className="font-serif font-medium text-[40px] tracking-[-0.01em] m-0 text-[#ede9e2]">
              {project.title || "Untitled"}
            </h1>
          </div>
          
          <div className="flex items-center gap-2.5 pt-1">
            <button 
              onClick={handleLike}
              disabled={isLiking}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-[20px] border border-[#c9975a] text-[#c9975a] text-xs transition-colors hover:bg-[rgba(201,151,90,0.1)] disabled:opacity-50`}
            >
              <Heart className="w-4 h-4 fill-current" />
              {project.likesCount || 0} Likes
            </button>
          </div>
        </div>

        <hr className="border-t border-[rgba(255,255,255,0.07)] my-10" />

        <div className="grid grid-cols-1 lg:grid-cols-[264px_1px_1fr] gap-10 items-start">
          
          {/* LEFT COLUMN */}
          <div className="flex flex-col">
            <div className="relative aspect-[2/3] rounded-xl border border-[rgba(255,255,255,0.14)] bg-[#1b1a21] flex flex-col items-center justify-center gap-2.5 text-[#5c5868] overflow-hidden mb-5">
              {project.coverImage ? (
                <Image src={project.coverImage} alt="Cover" fill className="object-cover" />
              ) : (
                <>
                  <span className="w-[30px] h-[30px] opacity-50"><PictureIcon /></span>
                  <span className="font-serif italic text-[13px]">No cover</span>
                </>
              )}
            </div>

            <div className="border border-[rgba(255,255,255,0.07)] rounded-[10px] overflow-hidden mb-6 bg-[#1b1a21]">
              <div className="flex items-center justify-between px-3.5 py-3 border-b border-[rgba(255,255,255,0.07)]">
                <span className="text-[10.5px] font-semibold tracking-[0.07em] uppercase text-[#5c5868]">Status</span>
                <span className="flex items-center gap-1.5 text-[13px] text-[#ede9e2]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#7cbf8e]" />
                  Published
                </span>
              </div>
              <div className="flex items-center justify-between px-3.5 py-3 border-b border-[rgba(255,255,255,0.07)]">
                <span className="text-[10.5px] font-semibold tracking-[0.07em] uppercase text-[#5c5868]">Word count</span>
                <span className="font-mono tabular-nums text-[13px] text-[#ede9e2] text-right">
                  {displayWordCount.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between px-3.5 py-3">
                <span className="text-[10.5px] font-semibold tracking-[0.07em] uppercase text-[#5c5868]">Last updated</span>
                <span className="font-mono tabular-nums text-[13px] text-[#ede9e2]">
                  {project.updatedAt ? new Date(project.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : "Recently"}
                </span>
              </div>
            </div>

            <div className="flex flex-col">
              <span className="text-[10.5px] font-semibold tracking-[0.07em] uppercase text-[#5c5868] mb-2">Synopsis</span>
              <p className="font-serif italic text-[14.5px] leading-[1.6] text-[#948fa0] m-0 p-2 -ml-2 whitespace-pre-wrap">
                {project.synopsis || "No synopsis available."}
              </p>
            </div>
          </div>

          {/* RULE */}
          <div className="hidden lg:block bg-[rgba(255,255,255,0.07)] h-full" />

          {/* RIGHT COLUMN */}
          <div className="flex flex-col">
            
            {/* Public Note */}
            <div className="mb-9">
              <div className="flex items-center justify-between mb-3.5">
                <span className="text-[10.5px] font-semibold tracking-[0.08em] uppercase text-[#5c5868]">Author's note</span>
              </div>
              <div className="border border-[rgba(255,255,255,0.07)] rounded-[10px] p-5 bg-[#1b1a21]">
                <p className="font-serif italic text-[17px] leading-[1.65] text-[#ede9e2] m-0 mb-2.5 p-2 -ml-2 min-h-[80px] whitespace-pre-wrap">
                  {project.authorNote || "No public note has been written for this project."}
                </p>
                <span className="text-[11px] text-[#5c5868] font-mono">
                  Updated {project.updatedAt ? new Date(project.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : "Recently"}
                </span>
              </div>
            </div>

            {/* Chapters */}
            <div className="mb-9">
              <div className="flex items-center justify-between mb-3.5">
                <span className="text-[10.5px] font-semibold tracking-[0.08em] uppercase text-[#5c5868]">Manuscript chapters</span>
              </div>
              <div className="flex flex-col gap-1.5">
                {chapters.length > 0 ? (
                  chapters.map((chapter: Document, i: number) => (
                    <div 
                      key={chapter._id}
                      onClick={() => router.push(`/read/chapter/${chapter.slug}`)}
                      className="group cursor-pointer flex items-center gap-4 px-4 py-4 border border-[rgba(255,255,255,0.07)] rounded-[10px] bg-[#1b1a21] transition-colors hover:bg-[#29272f] hover:border-[rgba(255,255,255,0.14)]"
                    >
                      <span className="font-mono text-[11px] text-[#c9975a] w-5 shrink-0">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <div className="flex-1 min-w-0 flex flex-col">
                        <span className="font-serif text-[18px] text-[#ede9e2] mb-1">
                          {chapter.title || "Untitled Chapter"}
                        </span>
                        <span className="flex items-center gap-2 text-[11.5px] text-[#5c5868] font-mono">
                          {chapter.wordCount || 0} words 
                          <span className="w-[3px] h-[3px] rounded-full bg-[#5c5868]" /> 
                          {new Date(chapter.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </span>
                      </div>
                      <div className="text-[#5c5868] shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:text-[#c9975a]">
                        <span className="w-4 h-4 block"><ChevronRightIcon /></span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="px-4 py-3.5 border border-dashed border-[rgba(255,255,255,0.14)] rounded-[10px] text-[12.5px] text-[#5c5868] text-center">
                    This manuscript currently has no chapters available.
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
