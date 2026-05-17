import { redirect } from "next/navigation";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { ActiveProjectHero } from "@/components/dashboard/ActiveProjectHero";
import { WritingStats } from "@/components/dashboard/WritingStatus";
import { YourBooks } from "@/components/dashboard/YourBooks";
import { RecentDrafts } from "@/components/dashboard/RecentDraft";
import { getAuthenticatedEmail } from "@/lib/api-helpers";
import connectDB from "@/lib/db";
import Project from "@/models/Project";
import Note from "@/models/Note";
import Chapter from "@/models/Chapter";

export default async function DashboardPage() {
  const email = await getAuthenticatedEmail();
  if (!email) {
    redirect("/login");
  }

  await connectDB();
  
  // Fetch Projects
  const projects = await Project.find({ userEmail: email }).sort({ updatedAt: -1 }).lean();
  
  // Format for YourBooks
  const bookProps = projects.map((p, i) => {
    const gradients = [
      "from-blue-600 to-violet-600",
      "from-indigo-600 to-cyan-600",
      "from-zinc-600 to-neutral-800",
      "from-orange-500 to-rose-500"
    ];
    return {
      id: p._id.toString(),
      title: p.title,
      status: p.isPublished ? "published" : p.status || "draft",
      words: `${(p.stats?.currentWordCount || 0).toLocaleString()}`,
      progress: p.stats?.goalWordCount 
        ? `${Math.round(((p.stats.currentWordCount || 0) / p.stats.goalWordCount) * 100)}%` 
        : "0%",
      gradient: gradients[i % gradients.length]
    };
  });

  // Active Project is the most recently updated one
  const activeProjectDoc = projects[0];
  const activeProject = activeProjectDoc ? {
    id: activeProjectDoc._id.toString(),
    title: activeProjectDoc.title,
    wordCount: (activeProjectDoc.stats?.currentWordCount || 0).toLocaleString(),
    sessionCount: "+0" // We'd need session tracking for this, mock for now
  } : undefined;

  // Fetch Recent Notes & Chapters for RecentDrafts
  const projectIds = projects.map(p => p._id);
  const chapters = await Chapter.find({ projectId: { $in: projectIds } })
    .sort({ updatedAt: -1 })
    .limit(3)
    .lean();
    
  const notes = await Note.find({ userEmail: email })
    .sort({ updatedAt: -1 })
    .limit(3)
    .lean();

  const allDrafts = [...chapters.map(c => ({
    id: c._id.toString(),
    title: c.title || "Untitled Chapter",
    type: "Chapter",
    time: c.updatedAt ? new Date(c.updatedAt).toLocaleDateString() : "Recently",
    href: `/editor/${c.projectId}`, // We assume chapter editing is inside the project editor
  })), ...notes.map(n => ({
    id: n._id.toString(),
    title: n.title || "Untitled Note",
    type: "Note",
    time: n.updatedAt ? new Date(n.updatedAt).toLocaleDateString() : "Recently",
    href: `/notes`, // Adjust if there's a specific route for a single note
  }))].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()).slice(0, 3);

  return (
    <div className="min-h-screen bg-[#FAFAFA] dark:bg-[#0A0A0B] selection:bg-indigo-500/30 pb-24">
      {/* Increased padding and space-y to let the design breathe */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-10 sm:pt-16 flex flex-col space-y-10 sm:space-y-12">
        
        <DashboardHeader />
        
        <div className="space-y-6">
          <ActiveProjectHero project={activeProject} />
          <WritingStats />
        </div>
        
        <YourBooks books={bookProps} />
        
        <RecentDrafts drafts={allDrafts} />

      </div>
    </div>
  );
}