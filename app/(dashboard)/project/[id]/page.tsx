"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, PenTool, Loader2 } from "lucide-react";
import { ProjectHero } from "@/components/project/ProjectHero";
import { ManuscriptList } from "@/components/project/ManuscriptList";
import { useGetDocumentByIdQuery, useCreateDocumentMutation } from "@/redux/features/documents/documentApi";

// Strictly type the child documents (chapters)
interface ChildDocument {
  _id: string;
  title?: string;
  status: string;
  wordCount?: number;
  updatedAt?: string;
}

export default function ProjectLobby() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;

  const { data, isLoading, error } = useGetDocumentByIdQuery(projectId);
  const [createChapter, { isLoading: isCreating }] = useCreateDocumentMutation();

  const handleCreateChapter = async () => {
    try {
      const result = await createChapter({
        title: "Untitled Chapter",
        type: "chapter",
        parentId: projectId,
      }).unwrap();
      // 🟢 Uses the URL query parameter
      router.push(`/project/${projectId}/write?chapterId=${result.document._id}`);
    } catch (err) {
      console.error("Failed to create chapter:", err);
    }
  };

  const handleOpenEditor = async (chaptersList: ChildDocument[]) => {
    if (chaptersList.length > 0) {
      // 🟢 Uses the URL query parameter
      router.push(`/project/${projectId}/write?chapterId=${chaptersList[0]._id}`);
    } else {
      await handleCreateChapter();
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error || !data?.document) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background gap-3">
        <p className="text-muted-foreground text-sm">
          {error ? "Failed to load project." : "Project not found."}
        </p>
        <Link
          href="/project"
          className="text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors"
        >
          Back to Library
        </Link>
      </div>
    );
  }

  const novel = data.document;
  const chapters: ChildDocument[] = novel.children || [];

  const stats = {
    chapters: chapters.length,
    words: chapters.reduce((sum: number, ch: ChildDocument) => sum + (ch.wordCount || 0), 0),
    views: 0,
    followers: 0,
  };

  const projectData = {
    title: novel.title,
    description: novel.synopsis || "No synopsis provided. Open settings to add one.",
    status: novel.status,
    stats,
    coverImage: novel.coverImage || null, 
  };

  const formattedChapters = chapters.map((ch: ChildDocument) => ({
    id: ch._id,
    title: ch.title || "Untitled Chapter",
    status: ch.status,
    words: ch.wordCount || 0,
    date: ch.updatedAt
      ? new Date(ch.updatedAt).toLocaleDateString(undefined, {
          month: "short",
          day: "numeric",
        })
      : "Today",
  }));

  return (
    <div className="min-h-screen w-full pb-40 px-4 md:px-8 pt-6 md:pt-10">
      <div className="max-w-5xl mx-auto flex flex-col h-full w-full">
        <div className="flex items-center justify-between mb-12">
          <Link
            href="/project"
            className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4 stroke-[1.5]" />
            Library
          </Link>

          <button
            onClick={() => handleOpenEditor(chapters)}
            disabled={isCreating}
            className="flex items-center gap-2 px-6 py-2 rounded-full bg-foreground text-background hover:bg-foreground/90 transition-all font-bold text-xs uppercase tracking-widest disabled:opacity-50"
          >
            {isCreating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <PenTool className="w-3.5 h-3.5" />}
            {isCreating ? "Loading..." : "Open Editor"}
          </button>
        </div>

        <ProjectHero project={projectData} />

        <div className="flex flex-col lg:flex-row gap-16 mt-8">
          <ManuscriptList
            chapters={formattedChapters}
            onCreateChapter={handleCreateChapter}
            onChapterClick={(chapterId) =>
              // 🟢 Uses the URL query parameter
              router.push(`/project/${projectId}/write?chapterId=${chapterId}`)
            }
            isCreating={isCreating}
          />
        </div>
      </div>
    </div>
  );
}