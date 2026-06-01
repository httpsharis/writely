import { MobileBottomBar } from "@/components/shared/MobileBottomBar";
import { AppSidebar } from "@/components/shared/Sidebar"; // <-- Notice the capitalized "Sidebar" file name!

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen w-full bg-[#0B0D14] overflow-hidden">
      
      {/* Desktop Sidebar: Visible only on larger screens */}
      <div className="hidden md:block shrink-0">
        <AppSidebar />
      </div>

      {/* Main Writing Canvas: Scrolls independently */}
      <main className="flex-1 min-w-0 overflow-y-auto p-4 md:p-8 pb-20 md:pb-8">
        {children}
      </main>

      {/* Mobile Bottom Bar: Visible only on small screens */}
      <div className="md:hidden fixed bottom-0 w-full z-50">
        <MobileBottomBar />
      </div>

    </div>
  );
}