import { useState } from "react";
import {
  useGetPublicDocumentQuery,
  useLikePublicDocumentMutation
} from "../../../redux/features/documents/documentApi";
import type { Document } from "../../../redux/features/documents/documentApi";

// Safely type the populated owner field
export type PopulatedProject = Document & { owner?: { name: string } };

export function useHubEngine(slug: string) {
  // Inside useReaderEngine.ts
  const { data, isLoading, error } = useGetPublicDocumentQuery(slug, {
    refetchOnMountOrArgChange: true, // 🟢 SENIOR FIX: Bypasses the stale memory cache
  });
  const [likeDocument, { isLoading: isLiking }] = useLikePublicDocumentMutation();

  const project = data?.document as PopulatedProject | undefined;
  const chapters = project?.chapters || [];

  // --- Optimistic UI for Likes ---
  const [localLikes, setLocalLikes] = useState<number | null>(null);
  const [hasLiked, setHasLiked] = useState(false);
  const displayLikes = localLikes !== null ? localLikes : (project?.likesCount || 0);

  const handleLike = async () => {
    if (!project || hasLiked) return;

    // Instantly update UI for a snappy experience
    setLocalLikes(displayLikes + 1);
    setHasLiked(true);

    try {
      await likeDocument(slug).unwrap();
    } catch {
      // Revert silently if the network request fails
      setLocalLikes(displayLikes);
      setHasLiked(false);
    }
  };

  return {
    project,
    chapters,
    isLoading,
    error,
    displayLikes,
    hasLiked,
    isLiking,
    handleLike
  };
}