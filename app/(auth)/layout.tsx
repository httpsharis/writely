import React from "react";

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <main className="w-full min-h-screen bg-[#FAFAFA] dark:bg-[#0A0A0B]">
            {children}
        </main>
    );
}