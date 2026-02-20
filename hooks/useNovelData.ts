import { useEffect, useState, useCallback } from "react";
import { fetchNovel, fetchChapters } from "../lib/api-client";
import type { NovelData, ChapterSummary } from "../lib/api-client";

export function useNovelData(novelId: string) {
    const [novel, setNovel] = useState<NovelData | null>(null);
    const [chapters, setChapters] = useState<ChapterSummary[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Reset state during the render cycle if the ID changes
    const [prevId, setPrevId] = useState(novelId);
    if (prevId !== novelId) {
        setPrevId(novelId);
        setLoading(true);
        setNovel(null);
        setChapters([]);
    }

    const load = useCallback(async () => {
        try {
            const [n, c] = await Promise.all([
                fetchNovel(novelId),
                fetchChapters(novelId),
            ]);
            setNovel(n);
            setChapters(c);
        } catch {
            setError("Failed to load novel");
        } finally {
            setLoading(false);
        }
    }, [novelId]);

    useEffect(() => {
        load();
    }, [load]);

    return { novel, chapters, loading, error, setNovel, setChapters };
}