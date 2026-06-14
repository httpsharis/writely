"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { Loader2, ArrowRight, FileText, Clock, Settings, BookOpen, Edit2, Check } from "lucide-react";
import { useGetDocumentByIdQuery } from "@/redux/features/documents/documentApi";
import { useGetCurrentUserQuery } from "@/redux/features/auth/authApi";

// STRICT TYPING: Define the exact shape of a chapter item in the list
interface ChapterItem {
  _id: string;
  title?: string;
  wordCount?: number;
  updatedAt: string | Date;
}

export default function ProjectLobbyPage() {
  const params = useParams();
  const router = useRouter();
  
  // Extract the ID from the URL
  const projectId = (params.projectId || params.id) as string;

  // FETCH USER FIRST
  const { data: authData, isLoading: isUserLoading } = useGetCurrentUserQuery();

  // FETCH DOCUMENT
  const { data, isLoading: isDocLoading, error } = useGetDocumentByIdQuery(projectId, {
    skip: !authData?.user, 
  });
  
  const project = data?.document;

  // STATE: Author's Note & Notification Banner
  const [isEditingNote, setIsEditingNote] = useState(false);
  const [authorNote, setAuthorNote] = useState("Currently undergoing heavy edits for the second act. The pacing should feel much tighter now. Thanks for following along.");
  const [banner, setBanner] = useState<{ message: string } | null>(null);

  // Trigger Notification Banner
  const showNotification = (message: string) => {
    setBanner({ message });
    setTimeout(() => setBanner(null), 4000);
  };

  // Handle Note Save
  const handleSaveNote = () => {
    setIsEditingNote(false);
    // Here you would typically fire an RTK Query mutation to save to the backend
    showNotification("Public note updated successfully.");
  };

  const chapters: ChapterItem[] = project?.children || project?.chapters || [
    { _id: 'mock-1', title: "Prologue: The Fall", wordCount: 1250, updatedAt: "2024-06-14T10:00:00.000Z" },
    { _id: 'mock-2', title: "Chapter One: Embers", wordCount: 3420, updatedAt: "2024-06-13T10:00:00.000Z" }
  ];

  // HYBRID LOADING STATE
  if (isUserLoading || isDocLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  // ERROR / NOT FOUND STATE
  if (error || !project) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center bg-background">
        <p className="font-serif text-2xl text-foreground mb-4">Manuscript not found.</p>
        <button 
          onClick={() => router.push("/library")}
          className="text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors border-b border-border/40 pb-1"
        >
          Return to Library
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-12 md:px-12 md:py-20 animate-in fade-in duration-700 relative">
      
      {/* 🟢 NOTIFICATION BANNER */}
      {banner && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-top-4 fade-in duration-300">
          <div className="bg-foreground text-background px-6 py-3 rounded-full flex items-center gap-3 shadow-2xl">
            <Check className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-widest">{banner.message}</span>
          </div>
        </div>
      )}

      {/* Editorial Header / Breadcrumb */}
      <div className="flex items-center justify-between border-b border-border/40 pb-8 mb-16">
        <div className="flex flex-col">
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2">
            Project Hub
          </p>
          <h1 className="font-serif text-4xl md:text-5xl text-foreground tracking-tight line-clamp-1">
            {project.title || "Untitled"}
          </h1>
        </div>
        <button className="p-3 rounded-full text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-all">
          <Settings className="w-5 h-5" />
        </button>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 items-start">
        
        {/* LEFT COLUMN: The Book's Identity */}
        <div className="lg:col-span-4 flex flex-col space-y-12 sticky top-12">
          
          {/* Cover Image Container */}
          <div className="relative aspect-[2/3] w-full overflow-hidden bg-secondary/20 border border-border/40 rounded-sm">
            {project.coverImage ? (
              <Image
                src={project.coverImage}
                alt={`${project.title} cover`}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 33vw"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center p-6 text-center">
                <BookOpen className="w-12 h-12 text-muted-foreground/30 mb-4" />
                <span className="font-serif text-sm uppercase tracking-widest text-muted-foreground absolute bottom-8">
                  No Cover
                </span>
              </div>
            )}
          </div>

          {/* Metadata Block */}
          <div className="flex flex-col space-y-5 pt-2">
            <div className="flex justify-between items-center">
              <span className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">Status</span>
              <span className="text-[10px] uppercase tracking-widest font-bold text-foreground bg-secondary px-3 py-1 rounded-full">
                {project.status || "Drafting"}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">Word Count</span>
              <span className="flex items-center gap-1.5 text-sm font-serif text-foreground">
                <FileText className="w-3.5 h-3.5 text-muted-foreground" />
                {(project.wordCount || 0).toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">Last Edited</span>
              <span className="flex items-center gap-1.5 text-sm font-serif text-foreground">
                <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                {project.updatedAt 
                  ? new Date(project.updatedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
                  : "Recently"}
              </span>
            </div>
          </div>

          {/* Synopsis */}
          <div className="pt-8 border-t border-border/40">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-4">
              Synopsis
            </h3>
            <p className="font-serif text-sm leading-relaxed text-foreground/80 whitespace-pre-wrap">
              {project.synopsis || "No synopsis has been written for this project yet."}
            </p>
          </div>

        </div>

        {/* RIGHT COLUMN: The Author's Workspace */}
        <div className="lg:col-span-8 flex flex-col pt-2">
          
          {/* 🟢 Interactive Public Note Section */}
          <div className="mb-20">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                Public Note / Update
              </h3>
              {!isEditingNote && (
                <button 
                  onClick={() => setIsEditingNote(true)}
                  className="group flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Edit2 className="w-3 h-3 group-hover:scale-110 transition-transform" />
                  Edit Note
                </button>
              )}
            </div>

            {isEditingNote ? (
              <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                <textarea
                  value={authorNote}
                  onChange={(e) => setAuthorNote(e.target.value)}
                  className="w-full bg-transparent border-b border-foreground pb-4 focus:outline-none font-serif text-xl leading-relaxed text-foreground resize-none min-h-[100px]"
                  placeholder="Write an update for your readers..."
                  autoFocus
                />
                <div className="flex justify-end gap-6 mt-6">
                  <button 
                    onClick={() => setIsEditingNote(false)}
                    className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleSaveNote}
                    className="text-[10px] font-bold uppercase tracking-widest text-background bg-foreground px-6 py-2.5 rounded-full hover:bg-foreground/90 transition-all shadow-sm"
                  >
                    Publish Update
                  </button>
                </div>
              </div>
            ) : (
              <p className="font-serif italic text-xl text-foreground/90 leading-relaxed border-l border-border/40 pl-6">
                "{authorNote}"
              </p>
            )}
          </div>

          {/* Chapters Section Header */}
          <div className="flex items-end justify-between mb-8 border-t border-border/40 pt-12">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              Manuscript Chapters
            </h3>
            
            {/* New Chapter Minimal Action */}
            <button 
              onClick={() => router.push(`/project/${project._id}/write`)}
              className="text-[10px] font-bold uppercase tracking-widest text-foreground hover:text-muted-foreground transition-colors flex items-center gap-2"
            >
              + Create Chapter
            </button>
          </div>

          {/* Chapter List - Decluttered */}
          <div className="divide-y divide-border/40">
            {chapters.length > 0 ? (
              chapters.map((chapter: ChapterItem) => (
                <div 
                  key={chapter._id} 
                  onClick={() => router.push(`/project/${project._id}/write?chapterId=${chapter._id}`)}
                  className="group py-6 flex items-center justify-between hover:bg-secondary/10 transition-colors cursor-pointer -mx-4 px-4 rounded-sm"
                >
                  <div className="flex flex-col gap-2">
                    <h4 className="font-serif text-2xl text-foreground group-hover:text-muted-foreground transition-colors">
                      {chapter.title || "Untitled Chapter"}
                    </h4>
                    <div className="flex items-center gap-3 text-[11px] uppercase tracking-widest font-bold text-muted-foreground">
                      <span>{chapter.wordCount?.toLocaleString() || 0} words</span>
                      <span>•</span>
                      <span>Edited {new Date(chapter.updatedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                    </div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-muted-foreground opacity-0 group-hover:opacity-100 transform -translate-x-4 group-hover:translate-x-0 transition-all duration-300" />
                </div>
              ))
            ) : (
              // Empty State for Chapters
              <div className="py-16 text-center">
                <p className="font-serif italic text-muted-foreground mb-8">The canvas is blank. Your story begins here.</p>
                <button 
                  onClick={() => router.push(`/project/${project._id}/write`)}
                  className="group inline-flex items-center gap-4 px-8 py-4 bg-foreground text-background hover:bg-foreground/90 transition-all rounded-full"
                >
                  <span className="text-xs font-bold uppercase tracking-widest">
                    Start First Chapter
                  </span>
                  <ArrowRight className="w-4 h-4 transform transition-transform group-hover:translate-x-1" />
                </button>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}