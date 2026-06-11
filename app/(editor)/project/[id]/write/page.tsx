"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { Loader2, Menu, Globe } from "lucide-react";
import NovelEditor from "@/components/editor/NovelEditor";
import EditorSidebar from "@/components/editor/EditorSidebar";
import AutoSaveIndicator from "@/components/shared/AutoSave";
import EditorWordCount from "@/components/editor/WordCount";
import PublishDialog from "@/components/editor/PublishDialog";

import {
  useGetDocumentByIdQuery,
  useCreateDocumentMutation,
  useUpdateDocumentMutation,
  type Document,
} from "@/redux/features/documents/documentApi";

// 🟢 Sub-component wrapped in Suspense for useSearchParams
function WritePageContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const novelId = params.id as string;
  const urlChapterId = searchParams.get("chapterId"); // 👈 The URL is our single source of truth

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [saveStatus, setSaveStatus] = useState<"saved" | "saving" | "off">("saved");
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);

  const hasAttemptedAutoCreate = useRef(false);

  const { data, isLoading: isFetchingNovel } = useGetDocumentByIdQuery(novelId);
  const [createChapter, { isLoading: isCreating }] = useCreateDocumentMutation();
  const [updateDocument] = useUpdateDocumentMutation();

  const novel = data?.document;
  const chapters = novel?.children || [];

  // 🟢 Derive active chapter directly from URL without any useEffect or useState!
  let activeChapter = chapters.find((c) => c._id === urlChapterId) || null;
  if (!activeChapter && chapters.length > 0) {
    activeChapter = chapters[0];
  }
  const activeChapterId = activeChapter?._id || null;
  const publishedCount = chapters.filter((c) => c.status === "published").length;

  // Frictionless Auto-Create: If no chapters exist, make one silently.
  useEffect(() => {
    if (!isFetchingNovel && chapters.length === 0 && !hasAttemptedAutoCreate.current && !isCreating) {
      hasAttemptedAutoCreate.current = true;
      createChapter({
        title: "Untitled Chapter",
        type: "chapter",
        parentId: novelId,
      })
        .unwrap()
        .then((res) => {
          // Update URL silently
          router.replace(`/project/${novelId}/write?chapterId=${res.document._id}`);
        })
        .catch((err) => {
          console.error("Auto-create failed", err);
        });
    }
  }, [isFetchingNovel, chapters.length, createChapter, novelId, isCreating, router]);

  const handleCreateChapter = async () => {
    try {
      const res = await createChapter({
        title: "Untitled Chapter",
        type: "chapter",
        parentId: novelId,
      }).unwrap();
      router.replace(`/project/${novelId}/write?chapterId=${res.document._id}`);
    } catch (err) {
      console.error("Failed to create chapter", err);
    }
  };

  const handleSelectChapter = (chapterId: string) => {
    // Just update the URL. React will automatically re-render and select the new chapter!
    router.replace(`/project/${novelId}/write?chapterId=${chapterId}`);
  };

  const handleToggleChapterPublish = async (chapterId: string, currentStatus: string) => {
    const newStatus = currentStatus === "published" ? "draft" : "published";
    await updateDocument({ id: chapterId, data: { status: newStatus } }).unwrap();
  };

  const handleToggleNovelPublish = async () => {
    if (!novel) return;
    const newStatus = novel.status === "published" ? "draft" : "published";
    await updateDocument({ id: novel._id, data: { status: newStatus } }).unwrap();
  };

  const handleAutoSave = async (updatedData: Partial<Document>) => {
    if (!activeChapterId) return;
    setSaveStatus("saving");
    try {
      await updateDocument({ id: activeChapterId, data: updatedData }).unwrap();
      setSaveStatus("saved");
    } catch (err) {
      setSaveStatus("off");
    }
  };

  if (isFetchingNovel || (chapters.length === 0 && isCreating)) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full bg-background overflow-hidden flex-row-reverse">
      {isPublishModalOpen && novel && (
        <PublishDialog
          novel={novel}
          publishedChapterCount={publishedCount}
          onTogglePublish={handleToggleNovelPublish}
          onClose={() => setIsPublishModalOpen(false)}
        />
      )}

      <EditorSidebar
        isOpen={isSidebarOpen}
        chapters={chapters}
        activeChapterId={activeChapterId}
        onSelectChapter={handleSelectChapter}
        onCreateChapter={handleCreateChapter}
        onTogglePublish={handleToggleChapterPublish}
      />

      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        <header className="flex items-center justify-between px-6 py-3 border-b border-border/50 shrink-0">
          <div className="flex items-center gap-6">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 -ml-2 text-muted-foreground hover:bg-secondary rounded-md transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
            <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground hidden sm:block">
              {novel?.title || "Draft"}
            </span>
            <div className="w-px h-4 bg-border hidden md:block" />
            <AutoSaveIndicator state={saveStatus} className="hidden md:flex" />
          </div>

          <div className="flex items-center gap-4">
            <EditorWordCount
              count={activeChapter?.wordCount || 0}
              label="Words"
              className="hidden sm:flex"
            />
            <div className="w-px h-4 bg-border mx-2 hidden sm:block" />

            <button
              onClick={() => setIsPublishModalOpen(true)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all ${
                novel?.status === "published"
                  ? "bg-brand/10 text-brand hover:bg-brand/20"
                  : "border border-border bg-transparent text-foreground hover:bg-foreground hover:text-background"
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              {novel?.status === "published" ? "Live" : "Publish"}
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto no-scrollbar relative flex flex-col">
          <NovelEditor
            chapter={activeChapter}
            onAutoSave={handleAutoSave}
            saveStatus={saveStatus}
          />
        </div>
      </main>
    </div>
  );
}

// Next.js requires useSearchParams to be wrapped in a Suspense boundary
export default function WritePage() {
  return (
    <Suspense fallback={
      <div className="flex h-screen items-center justify-center bg-background">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    }>
      <WritePageContent />
    </Suspense>
  );
}