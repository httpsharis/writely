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

  console.log("RAW ANALYTICS DATA:", analytics);
  console.log("RAW DOCUMENTS DATA:", documentsData);

  const isLoading = loadingAnalytics || loadingDocs;

  // Find the most recently edited document to use as the "Active Draft"
  const recentDocs = documentsData?.documents || [];
  const activeDoc = recentDocs[0]; // Assuming the backend sorts by updatedAt descending

  const activeDraft = activeDoc
    ? {
        id: activeDoc._id, // ✅ FIX: Added the missing id property
        novelTitle: activeDoc.type === "novel" ? activeDoc.title : "Workspace",
        title: activeDoc.title,
        status: activeDoc.status,
        timeAgo: "Recently", // You can format activeDoc.updatedAt here using date-fns
        wordCount: 0, // Update if your document interface adds word counts
      }
    : undefined;
    
  const stats = analytics
    ? {
        dailyGoalProgress: analytics.wordsToday ?? 0,
        dailyGoalTarget: 2000,
        currentStreak: analytics.currentStreak ?? 0,
        totalWords: analytics.totalWords ?? 0, // ✅ FIX IT HERE
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
