"use client";

import { useParams, useRouter } from "next/navigation";
import { useHubEngine } from "@/features/hub/hooks/useHubEngine";
import { HubSidebar } from "@/features/hub/components/HubSidebar";
import { HubChapterList } from "@/features/hub/components/HubChapterList";

export default function PublicProjectHubPage() {
  const router = useRouter();
  const slug = useParams().slug as string;

  // We no longer need the Like mutator here since it's just a display page!
  const { project, chapters, isLoading, error } = useHubEngine(slug);

  if (isLoading) return <div className="flex h-screen items-center justify-center bg-[#131217]"><div className="h-6 w-6 animate-spin rounded-full border-t-2 border-[#c9975a]" /></div>;
  if (error || !project) return <div className="flex h-screen flex-col items-center justify-center bg-[#131217] text-[#ede9e2]"><p className="mb-4 font-serif text-2xl">Manuscript not found.</p><button onClick={() => router.push("/")} className="text-[10px] font-bold uppercase tracking-widest text-[#948fa0] transition-colors hover:text-[#ede9e2]">Return Home</button></div>;

  return (
    <div className="min-h-screen bg-[#131217] font-sans text-[#ede9e2] antialiased">
      {/* Responsive Container */}
      <main className="mx-auto max-w-[1000px] px-6 py-12 md:px-12 lg:py-20">
        
        {/* Responsive Flexbox: Stack on mobile, side-by-side on desktop */}
        <div className="flex flex-col items-start gap-12 lg:flex-row lg:gap-16">
          
          {/* Left: Identity (Sidebar) */}
          <aside className="w-full lg:w-[320px] lg:shrink-0">
            <HubSidebar project={project} />
          </aside>

          {/* Right: Content Area */}
          <div className="flex w-full flex-1 flex-col">
            
            {/* Author's Note (Only renders if the author wrote one) */}
            {project.authorNote && (
              <div className="mb-12">
                <span className="mb-4 block text-[10px] font-bold uppercase tracking-widest text-[#5c5868]">Author&apos;s Note</span>
                <div className="rounded-xl border border-white/5 bg-[#1b1a21] p-5 shadow-sm md:p-6">
                  <p className="m-0 whitespace-pre-wrap font-serif text-[16px] italic leading-[1.7] text-[#ede9e2]">
                    {project.authorNote}
                  </p>
                </div>
              </div>
            )}

            {/* Chapter List */}
            <div>
              <span className="mb-4 block text-[10px] font-bold uppercase tracking-widest text-[#5c5868]">Table of Contents</span>
              <HubChapterList chapters={chapters} />
            </div>

          </div>
        </div>

      </main>
    </div>
  );
}