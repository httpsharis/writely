"use client";

import { useEffect, useState } from "react";
import { useGetCurrentUserQuery } from "@/redux/features/auth/authApi";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { AuthorIdentity } from "@/components/profile/AuthorIdentity";
import { StatsAndWorks } from "@/components/profile/StatsAndWorks";
import { useGetDashboardAnalyticsQuery } from "@/redux/features/analytics/analyticsApi";
import { useGetUserDashboardQuery, useGetMinimalDashboardQuery } from "@/redux/features/users/userApi";
import { useGetMyProfileQuery } from "@/redux/features/profile/profileApi";
import { BarChart3, Settings, LayoutDashboard } from "lucide-react";
import { AnalyticsDashboard } from "@/components/profile/AnalyticsDashboard";
import { ProfileSettings } from "@/components/profile/ProfileSettings";

export default function ProfilePage() {
  const [isMounted, setIsMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<"overview" | "analytics" | "settings">("overview");
  const { data: userData, isLoading: isUserLoading } = useGetCurrentUserQuery();
  const user = userData?.user;
  
  // Fetch real data from your backend
  const { data: minDashData, isLoading: isLoadingMinDash, isError: isErrorMinDash } = useGetMinimalDashboardQuery();
  const { data: globalStats, isLoading: isLoadingGlobalStats, isError: isErrorGlobalStats } = useGetDashboardAnalyticsQuery();
  const { data: userDashboardData, isLoading: isLoadingUserDash, isError: isErrorUserDash } = useGetUserDashboardQuery();
  const { data: myProfile, isLoading: isLoadingProfile, isError: isErrorProfile } = useGetMyProfileQuery();

  useEffect(() => {
    const timer = setTimeout(() => setIsMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  if (!isMounted) return null;

  if (isLoadingMinDash || isLoadingGlobalStats || isLoadingProfile || isLoadingUserDash || isUserLoading) {
    return (
      <div className="max-w-4xl mx-auto flex items-center justify-center h-full w-full py-32">
        <p className="text-muted-foreground font-medium animate-pulse">Loading profile data...</p>
      </div>
    );
  }

  if (isErrorMinDash || isErrorGlobalStats || isErrorUserDash || isErrorProfile) {
    return (
      <div className="max-w-4xl mx-auto flex flex-col items-center justify-center h-full w-full py-32 text-center space-y-2">
        <p className="text-red-500 font-medium text-lg">Failed to load profile data.</p>
        <p className="text-muted-foreground text-sm max-w-sm">
          {isErrorMinDash && "Minimal Dashboard failed to load. "}
          {isErrorGlobalStats && "Global Stats failed to load. "}
          {isErrorUserDash && "User Dashboard failed to load. "}
          {isErrorProfile && "User Profile failed to load."}
        </p>
      </div>
    );
  }

  // Extract the data payload
  const stats = {
    totalWords: globalStats?.totalWords || 0,
    currentStreak: globalStats?.currentStreak || 0,
    activeProjects: minDashData?.recentDocuments?.length || 0,
  };
  const recentDocuments = minDashData?.recentDocuments || [];

  return (
    <div className="max-w-5xl mx-auto flex flex-col h-auto w-full animate-in fade-in duration-700 pb-32 md:pb-12 px-4 md:px-8 pt-6 md:pt-10 no-scrollbar">
      
      <ProfileHeader user={user} myProfile={myProfile} />
      
      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 mb-8 border-b border-border pb-4 mt-12 md:mt-16">
        <button
          onClick={() => setActiveTab("overview")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${
            activeTab === "overview" 
              ? "bg-primary/10 text-primary border border-primary/20" 
              : "text-muted-foreground hover:bg-card hover:text-foreground border border-transparent"
          }`}
        >
          <LayoutDashboard className="w-4 h-4" /> Overview
        </button>
        <button
          onClick={() => setActiveTab("analytics")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${
            activeTab === "analytics" 
              ? "bg-primary/10 text-primary border border-primary/20" 
              : "text-muted-foreground hover:bg-card hover:text-foreground border border-transparent"
          }`}
        >
          <BarChart3 className="w-4 h-4" /> Analytics
        </button>
        <button
          onClick={() => setActiveTab("settings")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${
            activeTab === "settings" 
              ? "bg-primary/10 text-primary border border-primary/20" 
              : "text-muted-foreground hover:bg-card hover:text-foreground border border-transparent"
          }`}
        >
          <Settings className="w-4 h-4" /> Settings
        </button>
      </div>

      {activeTab === "overview" && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-12">
          <AuthorIdentity user={user || null} myProfile={myProfile} />
          <StatsAndWorks stats={stats} projects={recentDocuments} />
        </div>
      )}

      {activeTab === "analytics" && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <AnalyticsDashboard analyticsData={userDashboardData} stats={stats} />
        </div>
      )}

      {activeTab === "settings" && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <ProfileSettings profile={myProfile} />
        </div>
      )}

    </div>
  );
}