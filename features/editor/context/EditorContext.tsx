"use client";

import React, { createContext, useContext, useState, useRef } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

import { useGetCurrentUserQuery } from "@/redux/features/auth/authApi";
import {
  useGetDocumentByIdQuery,
  useCreateDocumentMutation,
  useUpdateDocumentMutation,
  type Document,
} from "@/redux/features/documents/documentApi";

/** * Extension of the base Document type to account for populated child references.
 */
type ExtendedDocument = Document & {
  children?: Document[];
  chapters?: Document[];
};

/**
 * Global state definition for the Editor Environment.
 */
export interface EditorContextType {
  novel: Document;
  chapters: Document[];
  activeChapter: Document;
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
  handleChangeChapterStatus: (id: string, status: string) => Promise<void>;
  handleToggleNovelPublish: () => Promise<void>;
  handleAutoSave: (data: Partial<Document>) => Promise<void>;
  liveWordCount: number;
  setLiveWordCount: (val: number) => void;
}

const EditorContext = createContext<EditorContextType | undefined>(undefined);

/**
 * EditorProvider: Centralized state manager for the writing environment.
 * Handles optimistic UI locking, dynamic routing, and auto-save synchronicity.
 */
export function EditorProvider({ children }: { children: React.ReactNode }) {
  const { id: novelId } = useParams() as { id: string };
  const chapterId = useSearchParams().get("chapterId");
  const router = useRouter();

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [saveStatus, setSaveStatus] = useState<"saved" | "saving" | "off">(
    "saved",
  );
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);

  /** Optimistic lock to prevent race conditions during rapid auto-saves on new chapters */
  const newlyCreatedIdRef = useRef<string | null>(null);

  const { data: authData, isLoading: isUserLoading } = useGetCurrentUserQuery();
  const {
    data,
    isLoading: isFetchingNovel,
    error: fetchError,
  } = useGetDocumentByIdQuery(novelId, { skip: !authData?.user });

  const [createChapter] = useCreateDocumentMutation();
  const [updateDocument] = useUpdateDocumentMutation();

  const novel = data?.document as ExtendedDocument | undefined;
  const chapters: Document[] = novel?.children || novel?.chapters || [];

  const activeChapter =
    chapters.find((c) => c._id === chapterId) ||
    chapters[0] ||
    ({ _id: "draft", status: "draft" } as Document);
  const activeChapterId = activeChapter._id;

  const [prevChapterId, setPrevChapterId] = useState(activeChapterId);
  const [liveWordCount, setLiveWordCount] = useState(
    activeChapter?.wordCount || 0,
  );

  if (activeChapterId !== prevChapterId) {
    setPrevChapterId(activeChapterId);
    setLiveWordCount(activeChapter?.wordCount || 0);
  }
  // --- Core Mutations ---

  const handleCreateChapter = async () => {
    const res = await createChapter({
      title: "Untitled Chapter",
      type: "chapter",
      parentId: novelId,
    }).unwrap();
    newlyCreatedIdRef.current = null;
    router.replace(`/project/${novelId}/write?chapterId=${res.document._id}`);
  };

  const handleSelectChapter = (id: string) => {
    newlyCreatedIdRef.current = null;
    router.replace(`/project/${novelId}/write?chapterId=${id}`);
  };

  const handleChangeChapterStatus = async (id: string, status: string) => {
    await updateDocument({ id, data: { status } as Partial<Document> });
  };

  const handleToggleNovelPublish = async () => {
    if (!novel) return;

    const newStatus = novel.status === "published" ? "draft" : "published";

    try {
      console.log(`Attempting to change Novel status to: ${newStatus}...`);

      // 🟢 SENIOR FIX: .unwrap() forces Redux to throw an error if the backend rejects it!
      await updateDocument({
        id: novel._id,
        data: { status: newStatus },
      }).unwrap();

      console.log("✅ Successfully published novel to the database!");
    } catch (err) {
      console.error("❌ FAILED to publish novel. Backend rejected it:", err);
      alert("Backend rejected the publish request! Check your F12 Console.");
    }
  };

  const handleAutoSave = async (updatedData: Partial<Document>) => {
    setSaveStatus("saving");
    try {
      const targetId = newlyCreatedIdRef.current || activeChapterId;

      const finalPayload = { wordCount: liveWordCount, ...updatedData };

      if (targetId === "draft") {
        const res = await createChapter({
          title: "Untitled Chapter",
          ...finalPayload,
          type: "chapter",
          parentId: novelId,
        }).unwrap();
        newlyCreatedIdRef.current = res.document._id; // Instantly lock the new ID
        router.replace(
          `/project/${novelId}/write?chapterId=${res.document._id}`,
        );
      } else {
        await updateDocument({ id: targetId, data: finalPayload }).unwrap();
      }
      setSaveStatus("saved");
    } catch {
      setSaveStatus("off");
    }
  };

  // --- Render Guards ---

  if (isUserLoading || isFetchingNovel) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (fetchError || !novel) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-4 bg-background">
        <p className="font-serif text-xl text-foreground">
          Manuscript not found.
        </p>
        <button
          onClick={() => router.push("/library")}
          className="text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground"
        >
          Return to Library
        </button>
      </div>
    );
  }

  return (
    <EditorContext.Provider
      value={{
        novel: novel as Document,
        chapters,
        activeChapter,
        activeChapterId,
        publishedCount: chapters.filter((c) => c.status === "published").length,
        isSidebarOpen,
        setIsSidebarOpen,
        saveStatus,
        setSaveStatus,
        isPublishModalOpen,
        setIsPublishModalOpen,
        liveWordCount,
        setLiveWordCount,
        handleCreateChapter,
        handleSelectChapter,
        handleChangeChapterStatus,
        handleToggleNovelPublish,
        handleAutoSave,
      }}
    >
      {children}
    </EditorContext.Provider>
  );
}

/** Hook to consume the Editor Context securely. */
export const useEditorContext = () => {
  const context = useContext(EditorContext);
  if (!context)
    throw new Error("useEditorContext must be used inside EditorProvider");
  return context;
};
