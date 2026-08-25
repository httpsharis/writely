"use client";

import { useRouter } from "next/navigation";
import {
  useGetDocumentByIdQuery,
  useUpdateDocumentMutation,
  useCreateDocumentMutation,
  type Document,
} from "@/redux/features/documents/documentApi";
import { useGetCurrentUserQuery } from "@/redux/features/auth/authApi";
import { useUploadImageMutation } from "@/redux/features/uploads/uploadApi";

/** Extended Document type to include populated relational fields */
export type ExtendedProject = Document & {
  owner?: string | { _id?: string; id?: string };
  children?: Document[];
  chapters?: Document[];
  authorNote?: string;
  coverImage?: string;
  synopsis?: string;
  targetWords?: number;
  viewsCount?: number;
  likesCount?: number;
};

/**
 * useProjectHub: Pure data and business logic engine for the Project Lobby.
 * Manages RTK Query fetching, authorization checks, and database mutations.
 * Strictly decoupled from local UI state.
 */
export function useProjectHub(projectId: string) {
  const router = useRouter();

  const { data: authData, isLoading: isUserLoading } = useGetCurrentUserQuery();

  const {
    data,
    isLoading: isDocLoading,
    error,
  } = useGetDocumentByIdQuery(projectId, {
    skip: !projectId || projectId === "undefined",
  });

  const [updateDocument] = useUpdateDocumentMutation();
  const [createDocument, { isLoading: isCreating }] =
    useCreateDocumentMutation();
  const [uploadImage, { isLoading: isUploading }] = useUploadImageMutation();

  const project = data?.document as ExtendedProject | undefined;

  // Strict Authorization & Status checks
  // 1. Unified Loading State
  const isLoading = isUserLoading || isDocLoading;

  // 2. Normalize IDs for robust ownership matching
  const currentUserId = authData?.user?._id || authData?.user?.id;
  const projectOwnerId = 
    typeof project?.owner === "object" && project?.owner !== null
      ? project.owner._id || project.owner.id
      : project?.owner;

  const isOwner = Boolean(
    currentUserId && projectOwnerId && String(currentUserId) === String(projectOwnerId)
  );

  const isReadOnly = isLoading ? false : (!isOwner);

  // 3. Derived State
  const isPublished = project?.status === "published";
  const chapters = project?.chapters || project?.children || [];

  // 4. Safe Aggregation (Defaults to 0, avoids NaN)
  const displayWordCount = chapters.length
    ? chapters.reduce((sum, chap) => sum + (chap.wordCount || 0), 0)
    : project?.wordCount || 0;

  /** * Generic handler to patch specific fields on the current project.
   * Uses TypeScript Generics <K> to strictly bind the value type to the specific key being updated.
   */
  const handleUpdate = async <K extends keyof ExtendedProject>(
    field: K,
    value: ExtendedProject[K],
  ) => {
    if (isReadOnly || !project) return;
    try {
      await updateDocument({
        id: project._id,
        data: { [field]: value } as Partial<Document>,
      }).unwrap();
    } catch (err) {
      console.error(`Failed to update ${String(field)}`, err);
    }
  };

  /** Handles file selection, Cloudinary upload, and database patching */
  const handleFileUpload = async (file: File) => {
    if (isReadOnly) return;
    try {
      const res = await uploadImage(file).unwrap();
      if (res.url) await handleUpdate("coverImage", res.url);
      return true; // Indicate success to the UI component
    } catch (err) {
      console.error("Failed to upload image", err);
      return false;
    }
  };

  /** Instantly creates a new chapter and routes the user directly to the Editor */
  const handleCreateChapter = async () => {
    if (isReadOnly || !project) return;
    try {
      const newChap = await createDocument({
        title: "Untitled Chapter",
        type: "chapter",
        parentId: project._id,
      }).unwrap();
      router.push(
        `/project/${project._id}/write?chapterId=${newChap.document._id}`,
      );
    } catch (err) {
      console.error("Failed to create chapter", err);
    }
  };

  const handleChapterUpdate = async <K extends keyof Document>(
    chapterId: string,
    field: K,
    value: Document[K],
  ) => {
    if (isReadOnly) return;
    try {
      await updateDocument({
        id: chapterId,
        data: { [field]: value } as Partial<Document>,
      }).unwrap();
    } catch (err) {
      console.error(`Failed to update chapter ${String(field)}`, err);
    }
  };

  return {
    project,
    chapters,
    isLoading: isUserLoading || isDocLoading,
    error,
    isReadOnly,
    isPublished,
    displayWordCount,
    isCreating,
    isUploading,
    handleUpdate,
    handleFileUpload,
    handleCreateChapter,
    handleChapterUpdate,
    router,
  };
}
