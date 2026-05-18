import { Navbar } from "@/components/shared/Navbar"; // Adjust the import path if yours is different

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        // We use your CSS variables for the background and text
        <div className="min-h-screen bg-background text-foreground selection:bg-foreground/10">

            {/* 1. The Floating Navbar */}
            <Navbar />

            {/* 2. The Main Content Area */}
            {/* pt-28 ensures the content starts *below* the floating navbar */}
            <main className="pt-14 sm:pt-20 pb-12">
                {children}
            </main>

        </div>
    );
}