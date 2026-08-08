"use client";

import { useRef } from "react";
import { useRouter } from "next/navigation";
import {
  useCreateDocumentMutation,
  useUpdateDocumentMutation,
  type Document,
} from "../../../redux/features/documents/documentApi";

/**
 * useChapterMutations: Centralized engine for editor database interactions.
 * Encapsulates RTK Query logic, optimistic UI locking, and dynamic route syncing.
 */
export function useChapterMutations(
  novelId: string,
  activeChapterId: string,
  setSaveStatus: (val: "saved" | "saving" | "off") => void,
) {
  const router = useRouter();

  // Optimistic lock to prevent race conditions during rapid auto-saves on new chapters
  const newlyCreatedIdRef = useRef<string | null>(null);

  const [createChapter] = useCreateDocumentMutation();
  const [updateDocument] = useUpdateDocumentMutation();

  const handleCreateChapter = async () => {
    try {
      const res = await createChapter({
        title: "Untitled Chapter",
        type: "chapter",
        parentId: novelId,
      }).unwrap();

      newlyCreatedIdRef.current = null; // Clear lock on manual create
      router.replace(`/project/${novelId}/write?chapterId=${res.document._id}`);
    } catch (err) {
      console.error("Failed to create chapter.", err);
    }
  };

  const handleSelectChapter = (id: string) => {
    newlyCreatedIdRef.current = null; // Clear lock when navigating manually
    router.replace(`/project/${novelId}/write?chapterId=${id}`);
  };

  const handleChangeChapterStatus = async (id: string, status: string) => {
    await updateDocument({
      id,
      data: { status } as Partial<Document>,
    }).unwrap();
  };

  const handleToggleNovelPublish = async (novel: Document | undefined) => {
    if (!novel) return;
    const newStatus = novel.status === "published" ? "draft" : "published";
    await updateDocument({
      id: novel._id,
      data: { status: newStatus } as Partial<Document>,
    }).unwrap();
  };

  const handleAutoSave = async (updatedData: Partial<Document>) => {
    setSaveStatus("saving");
    try {
      const targetId = newlyCreatedIdRef.current || activeChapterId;

      if (targetId === "draft") {
        const res = await createChapter({
          title: "Untitled Chapter",
          ...updatedData,
          type: "chapter",
          parentId: novelId,
        }).unwrap();

        newlyCreatedIdRef.current = res.document._id; // Instantly lock the new ID
        router.replace(
          `/project/${novelId}/write?chapterId=${res.document._id}`,
        );
      } else {
        await updateDocument({ id: targetId, data: updatedData }).unwrap();
      }
      setSaveStatus("saved");
    } catch (err) {
      setSaveStatus("off");
      console.error("Autosave failed", err);
    }
  };

  return {
    handleCreateChapter,
    handleSelectChapter,
    handleChangeChapterStatus,
    handleToggleNovelPublish,
    handleAutoSave,
  };
}
