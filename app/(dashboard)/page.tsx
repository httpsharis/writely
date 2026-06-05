"use client";

import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { ActiveDraft } from "@/components/dashboard/ActiveDraft";
import { WritingStats } from "@/components/dashboard/WritingStats";
import { RecentWorkspace } from "@/components/dashboard/RecentWorkspace";
import { useDashboardData } from "../../hooks/useDashboardData";

export default function DashboardPage() {
  // Simulating a loading state so you can see your Phantom UI skeletons in action
  const { isLoading, stats, activeDraft, recentFiles } = useDashboardData();

  return (
    <div className="w-full mx-auto px-6 flex flex-col min-h-screen animate-in fade-in duration-700">
      {/* 1. The Welcome Header */}
      <DashboardHeader userName="Muhammad" />

      {/* 2. Primary Action Area */}
      <ActiveDraft isLoading={isLoading} draft={activeDraft} />

      {/* Editorial Hairline Divider */}
      <hr className="border-border my-4 md:my-8" />

      {/* 3. The Analytics Grid */}
      <WritingStats isLoading={isLoading} stats={stats} />

      {/* Editorial Hairline Divider */}
      <hr className="border-border my-4 md:my-8" />

      {/* 4. The Filing Cabinet */}
      <RecentWorkspace isLoading={isLoading} files={recentFiles} />
    </div>
  );
}
