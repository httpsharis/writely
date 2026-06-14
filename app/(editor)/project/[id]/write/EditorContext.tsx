"use client";

import React, { createContext, useContext, useState } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

import { useGetCurrentUserQuery } from "@/redux/features/auth/authApi";
import {
  useGetDocumentByIdQuery,
  useCreateDocumentMutation,
  useUpdateDocumentMutation,
  type Document,
} from "@/redux/features/documents/documentApi";

type ExtendedDocument = Document & {
  children?: Document[];
  chapters?: Document[];
};

// 1. Define everything the Editor needs in one central cloud
export interface EditorContextType {
  novel: Document;
  chapters: Document[];
  activeChapter: Document | null;
  activeChapterId: string;
  publishedCount: number;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (val: boolean) => void;
  saveStatus: "saved" | "saving" | "off";
  setSaveStatus: (val: "saved" | "saving" | "off") => void;
  isPublishModalOpen: boolean;
  setIsPublishModalOpen: (val: boolean) => void;
  handleCreateChapter: () => Promise<void>;
  handleSelectChapter: (id: string) => void;
  handleToggleChapterPublish: (id: string, status: string) => Promise<void>;
  handleToggleNovelPublish: () => Promise<void>;
  handleAutoSave: (data: Partial<Document>) => Promise<void>;
}

const EditorContext = createContext<EditorContextType | undefined>(undefined);

// 2. The Provider handles all Redux fetching, loading states, and auto-saves
export function EditorProvider({ children }: { children: React.ReactNode }) {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const novelId = params.id as string;
  const urlChapterId = searchParams.get("chapterId");

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [saveStatus, setSaveStatus] = useState<"saved" | "saving" | "off">("saved");
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);

  const { data: authData, isLoading: isUserLoading } = useGetCurrentUserQuery();
  const { data, isLoading: isFetchingNovel, error: fetchError } = useGetDocumentByIdQuery(novelId, {
    skip: !authData?.user,
  });

  const [createChapter] = useCreateDocumentMutation();
  const [updateDocument] = useUpdateDocumentMutation();

  const novel = data?.document as ExtendedDocument | undefined;
  const chapters: Document[] = novel?.children || novel?.chapters || [];

  let activeChapter = chapters.find((c) => c._id === urlChapterId) || null;
  if (!activeChapter && chapters.length > 0) activeChapter = chapters[0];

  if (!activeChapter) {
    activeChapter = {
      _id: "draft", title: "", content: "", type: "chapter", status: "draft", parentId: novelId,
    } as unknown as Document;
  }

  const activeChapterId = activeChapter._id;
  const publishedCount = chapters.filter((c) => c.status === "published").length;

  const handleCreateChapter = async () => {
    try {
      const res = await createChapter({ title: "Untitled Chapter", type: "chapter", parentId: novelId }).unwrap();
      router.replace(`/project/${novelId}/write?chapterId=${res.document._id}`);
    } catch (err: unknown) {
      console.error("Manual create failed.");
    }
  };

  const handleSelectChapter = (chapterId: string) => router.replace(`/project/${novelId}/write?chapterId=${chapterId}`);

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
    setSaveStatus("saving");
    try {
      if (activeChapterId === "draft") {
        const res = await createChapter({
          title: updatedData.title || "Untitled Chapter",
          ...(updatedData.content !== undefined && { content: updatedData.content }),
          type: "chapter", parentId: novelId,
        }).unwrap();
        router.replace(`/project/${novelId}/write?chapterId=${res.document._id}`);
        setSaveStatus("saved");
      } else {
        await updateDocument({ id: activeChapterId, data: updatedData }).unwrap();
        setSaveStatus("saved");
      }
    } catch (err) {
      setSaveStatus("off");
    }
  };

  // 🟢 Fixed the loading check
  if (isUserLoading || isFetchingNovel) {
    return <div className="flex h-screen items-center justify-center bg-background"><Loader2 className="w-6 h-6 animate-spin text-muted-foreground" /></div>;
  }

  // 🟢 Guaranteed to catch missing novels before the Provider mounts
  if (fetchError || !novel) {
    return (
      <div className="flex h-screen items-center justify-center bg-background flex-col gap-4">
        <p className="font-serif text-xl text-foreground">Manuscript not found.</p>
        <button onClick={() => router.push("/library")} className="text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground">Return to Library</button>
      </div>
    );
  }

  return (
    <EditorContext.Provider value={{
      novel: novel as Document, // 🟢 Explicitly tell TS this is definitely a Document now
      chapters, activeChapter, activeChapterId, publishedCount,
      isSidebarOpen, setIsSidebarOpen, saveStatus, setSaveStatus,
      isPublishModalOpen, setIsPublishModalOpen,
      handleCreateChapter, handleSelectChapter, handleToggleChapterPublish,
      handleToggleNovelPublish, handleAutoSave
    }}>
      {children}
    </EditorContext.Provider>
  );
}

// 3. Custom Hook to use the Context
export const useEditorContext = () => {
  const context = useContext(EditorContext);
  if (!context) throw new Error("useEditorContext must be used inside EditorProvider");
  return context;
};