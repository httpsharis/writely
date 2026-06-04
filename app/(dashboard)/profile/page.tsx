"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { AuthorIdentity } from "@/components/profile/AuthorIdentity";
import { StatsAndWorks } from "@/components/profile/StatsAndWorks";
import { useGetProfileDashboardQuery } from "@/redux/features/analytics/analyticsApi";

export default function ProfilePage() {
  const [isMounted, setIsMounted] = useState(false);
  const { user } = useAuth();
  
  // Fetch real data from your backend
  const { data: dashboardData, isLoading, isError } = useGetProfileDashboardQuery();

  useEffect(() => {
    const timer = setTimeout(() => setIsMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  if (!isMounted) return null;

  // Render a simple loading state if the API is still fetching
  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto flex items-center justify-center h-full w-full py-32">
        <p className="text-muted-foreground font-medium animate-pulse">Loading profile data...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="max-w-4xl mx-auto flex items-center justify-center h-full w-full py-32">
        <p className="text-red-500 font-medium">Failed to load profile data.</p>
      </div>
    );
  }

  // Extract the data payload (assuming your backend wraps it in { data: ... })
  const stats = dashboardData?.data?.stats;
  const recentDocuments = dashboardData?.data?.recentDocuments;

  return (
    <div className="max-w-4xl mx-auto flex flex-col h-auto w-full animate-in fade-in duration-700 pb-32 md:pb-12 px-4 md:px-8 pt-6 md:pt-10 no-scrollbar">
      
      <ProfileHeader user={user} />
      
      <AuthorIdentity user={user} />

      <StatsAndWorks 
        stats={stats} 
        projects={recentDocuments} 
      />

    </div>
  );
}