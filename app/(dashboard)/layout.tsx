import { MobileBottomBar } from "@/components/shared/MobileBottomBar";
import { AppSidebar } from "@/components/shared/Sidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen w-full bg-background text-foreground overflow-hidden">
      
      {/* Desktop Sidebar: Visible only on larger screens */}
      <div className="hidden md:block shrink-0">
        <AppSidebar />
      </div>

      {/* Main Writing Canvas: Scrolls independently with generous bottom clearance for mobile bar */}
      <main className="flex-1 min-w-0 overflow-y-auto p-4 sm:p-6 md:p-8 pb-48 md:pb-8 overscroll-contain">
        {children}
      </main>

      {/* Mobile Bottom Bar: Rendered on mobile screens */}
      <MobileBottomBar />

    </div>
  );
}