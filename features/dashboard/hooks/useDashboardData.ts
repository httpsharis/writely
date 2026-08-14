import { useMemo } from "react";
import { useGetDocumentsQuery } from "@/redux/features/documents/documentApi";
import { useGetDashboardAnalyticsQuery } from "@/redux/features/analytics/analyticsApi";

export interface DashboardDoc { _id: string; title: string; type: string; updatedAt: string; parentId?: string; synopsis?: string; status?: string; wordCount?: number; }

const EMPTY_DOCS: DashboardDoc[] = [];
const EMPTY_ANALYTICS: Partial<{ totalWords: number; activeProjects: number; currentStreak: number; chaptersWritten: number; dailyGoalProgress: number; dailyGoalTarget: number; }> = {};

export function useDashboardData() {
    const { data: rawDocs, isLoading: loadingDocs } = useGetDocumentsQuery();
    const { data: rawAnalytics, isLoading: loadingAnalytics } = useGetDashboardAnalyticsQuery();

    const documents: DashboardDoc[] = Array.isArray(rawDocs)
        ? rawDocs
        : (rawDocs as { documents?: DashboardDoc[] })?.documents ||
        (rawDocs as { data?: DashboardDoc[] })?.data ||
        EMPTY_DOCS;

    const analytics = (rawAnalytics as { analytics?: typeof EMPTY_ANALYTICS })?.analytics ||
        (rawAnalytics as { data?: typeof EMPTY_ANALYTICS })?.data ||
        (rawAnalytics as typeof EMPTY_ANALYTICS) ||
        EMPTY_ANALYTICS;

    const activeDraft = useMemo(() => documents.filter(d => d.type === "novel").sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())[0] || null, [documents]);
    const recentFiles = useMemo(() => [...documents].sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()).slice(0, 5), [documents]);

    const liveStats = useMemo(() => {
        const chapters = documents.filter(d => d.type === "chapter");
        const novels = documents.filter(d => d.type === "novel");

        const liveWordCount = chapters.reduce((sum, chap) => sum + (chap.wordCount || 0), 0);

        return {
            totalWords: liveWordCount > 0 ? liveWordCount : (analytics.totalWords || 0),
            activeProjects: novels.length > 0 ? novels.length : (analytics.activeProjects || 0),
            chaptersWritten: chapters.length > 0 ? chapters.length : (analytics.chaptersWritten || 0),
            currentStreak: analytics.currentStreak || 1,
            dailyGoalProgress: analytics.dailyGoalProgress || 0,
            dailyGoalTarget: analytics.dailyGoalTarget || 2000,
        };
    }, [documents, analytics]);

    return {
        isLoading: loadingDocs || loadingAnalytics,
        activeDraft,
        recentFiles,
        stats: liveStats
    };
}