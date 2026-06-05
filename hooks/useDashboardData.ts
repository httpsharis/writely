// hooks/useDashboardData.ts
import { useGetDashboardAnalyticsQuery } from "../redux/features/analytics/analyticsApi";
import {
  documentApi,
  type Document,
} from "../redux/features/documents/documentApi";

export function useDashboardData() {
  const { data: analytics, isLoading: loadingAnalytics } =
    useGetDashboardAnalyticsQuery();
  const { data: documentsData, isLoading: loadingDocs } =
    documentApi.endpoints.getDocuments.useQuery();

  const isLoading = loadingAnalytics || loadingDocs;

  // Find the most recently edited document to use as the "Active Draft"
  const recentDocs = documentsData?.documents || [];
  const activeDoc = recentDocs[0]; // Assuming the backend sorts by updatedAt descending

  const activeDraft = activeDoc
    ? {
        novelTitle: activeDoc.type === "novel" ? activeDoc.title : "Workspace",
        title: activeDoc.title,
        status: activeDoc.status,
        timeAgo: "Recently", // You can format activeDoc.updatedAt here using date-fns
        wordCount: 0, // Update if your document interface adds word counts
      }
    : undefined;

  const stats = analytics
    ? {
        dailyGoalProgress: analytics.wordsToday,
        dailyGoalTarget: 2000, // Replace with dynamic goal if added to backend
        currentStreak: analytics.currentStreak,
        totalWords: 84500, // Replace with total from backend when available
      }
    : undefined;

  return {
    isLoading,
    stats,
    activeDraft,
    recentFiles: recentDocs.slice(0, 4).map((doc: Document) => ({
      id: doc._id,
      title: doc.title,
      type: doc.type,
      timeAgo: "Recently",
      category: (doc.type === "novel" ? "novel" : "chapter") as
        | "novel"
        | "chapter",
    })),
  };
}
