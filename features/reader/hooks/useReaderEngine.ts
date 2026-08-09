import { useState, useEffect } from "react";
import {
  useGetPublicDocumentQuery,
  useLikePublicDocumentMutation,
  useRecordViewMutation
} from "@/redux/features/documents/documentApi";
import type { Document } from "@/redux/features/documents/documentApi";

/** Extended type to safely handle the populated novel data from the backend */
type PopulatedChapter = Document & { novel?: Document & { chapters: Document[] } };

export function useReaderEngine(slug: string) {
  const { data, isLoading, error } = useGetPublicDocumentQuery(slug, {
    refetchOnMountOrArgChange: true, // 🟢 SENIOR FIX: Always fetch fresh data for public pages!
  });
  const [likeDocument, { isLoading: isLiking }] = useLikePublicDocumentMutation();
  const [recordView] = useRecordViewMutation();

  const fetchedDocument = data?.document as PopulatedChapter | undefined;
  const isNovel = fetchedDocument?.type === "novel"

  // If it's a Novel, grab the chapters directly. If it's a Chapter, grab them from the populated parent.
  const novel = isNovel ? fetchedDocument : fetchedDocument?.novel;
  const chapter = isNovel ? null : fetchedDocument;
  const chapters = novel?.chapters || [];

  // --- Optimistic UI for Likes ---
  const [localLikes, setLocalLikes] = useState<number | null>(null);
  const [hasLiked, setHasLiked] = useState(false);
  const displayLikes = localLikes !== null ? localLikes : (chapter?.likesCount || 0);

  useEffect(() => {
    if (typeof window !== "undefined") {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setHasLiked(!!localStorage.getItem(`liked_${slug}`));
    }
  }, [slug]);

  const handleLike = async () => {
    if (!chapter || hasLiked) return;

    // Instantly update UI for a snappy experience
    setLocalLikes(displayLikes + 1);
    setHasLiked(true);
    if (typeof window !== "undefined") {
      localStorage.setItem(`liked_${slug}`, "true");
    }

    try {
      await likeDocument(slug).unwrap();
    } catch {
      // Revert silently if the network request fails
      setLocalLikes(displayLikes);
      setHasLiked(false);
      if (typeof window !== "undefined") {
        localStorage.removeItem(`liked_${slug}`);
      }
    }
  };
  
  // --- The 10-Second View Tracker ---
  useEffect(() => {
    if (!slug) return;

    if (typeof window !== "undefined" && sessionStorage.getItem(`viewed_${slug}`)) {
      return; // Already viewed in this session
    }

    const timer = setTimeout(() => {
      recordView(slug)
        .unwrap()
        .then(() => {
          if (typeof window !== "undefined") {
            sessionStorage.setItem(`viewed_${slug}`, "true");
          }
        })
        .catch((err: unknown) => console.error("Failed to track view", err));
    }, 10000); // 10 seconds

    // Cleanup: if they bounce before 10 seconds, the view is canceled
    return () => clearTimeout(timer);
  }, [slug, recordView]);

  // --- Next / Previous Chapter Math ---
  const currentIndex = chapters.findIndex((c) => c._id === chapter?._id);
  const prevChapter = currentIndex > 0 ? chapters[currentIndex - 1] : null;
  const nextChapter = currentIndex !== -1 && currentIndex < chapters.length - 1 ? chapters[currentIndex + 1] : null;

  return {
    chapter,
    novel,
    chapters,
    isLoading,
    error,
    displayLikes,
    hasLiked,
    isLiking,
    handleLike,
    prevChapter,
    nextChapter,
    currentIndex
  };
}