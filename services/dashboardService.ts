import connectDB from "@/database/db";
import Project from "@/models/Project";
import Document from "@/models/Document";

export interface DashboardSummaryResponse {
    activeProject: {
        id: string;
        title: string;
        currentChapter: string;
        words: string | number;
    } | null;
    recentActivity: Array<{
        id: string;
        title: string;
        type: "chapter" | "character" | "note" | "idea" | "plot";
        time: string;
    }>;
}

export async function getDashboardSummary(userId: string): Promise<DashboardSummaryResponse> {
    await connectDB();

    try {
        const activeProject = await Project.findOne({ userId })
            .sort({ updatedAt: -1 })
            .lean();

        // Querying the universal Document table
        const recentDocs = await Document.find({ userId })
            .sort({ updatedAt: -1 })
            .limit(3)
            .lean();

        return {
            activeProject: activeProject ? {
                id: activeProject._id.toString(),
                title: activeProject.title,
                currentChapter: "Latest Draft",
                words: activeProject.totalWords.toLocaleString()
            } : null,

            recentActivity: recentDocs.map(doc => ({
                id: doc._id.toString(),
                title: doc.title,
                type: doc.type as "chapter" | "character" | "note" | "idea" | "plot",
                time: new Date(doc.updatedAt).toLocaleDateString("en-US", {
                    month: 'short', day: 'numeric'
                })
            }))
        };
    } catch (error) {
        console.error("[Dashboard Service] Error:", error);
        throw new Error("Failed to load dashboard data.");
    }
}