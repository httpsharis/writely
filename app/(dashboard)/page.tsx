import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth"; // Make sure this path to authOptions is correct
import { redirect } from "next/navigation";

import { ActiveProject } from "@/components/dashboard/ActiveProject";
import { QuickLinks } from "@/components/dashboard/QuickLinks";
import { Scratchpad } from "@/components/dashboard/Scratchpad";
import { RecentActivity } from "@/components/dashboard/RecentActivity";

export default async function DashboardPage() {
  // 1. Get the current user's session
  const session = await getServerSession(authOptions);

  // 2. If they aren't logged in, redirect to login
  const userId = (session?.user as any)?.id;
  if (!userId) {
    redirect("/login");
  }

  // 3. Fetch the actual data directly from your external API (TODO)
  const dashboardData = { activeProject: undefined };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col animate-in fade-in duration-700">
      <header className="mb-8 pl-2">
        <h1 className="text-3xl sm:text-4xl font-serif italic font-medium tracking-tight text-foreground">
          Welcome back, Writer.
        </h1>
        <p className="text-foreground/50 mt-1.5 font-medium">
          The blank page is waiting for you.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 sm:gap-6">
        {/* Row 1 */}
        <div className="md:col-span-7">
          <ActiveProject
            project={dashboardData?.activeProject || undefined} // Now this has actual data!
            isLoading={false}
          />
        </div>
        <div className="md:col-span-5">
          <QuickLinks />
        </div>

        {/* Row 2 */}
        <div className="md:col-span-7">
          {/* Note: In the future, you can also pass dashboardData.recentActivity to this component */}
          <RecentActivity />
        </div>
        <div className="md:col-span-5">
          <Scratchpad />
        </div>
      </div>
    </div>
  );
}
