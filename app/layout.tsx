import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/app/provider";
import { ThemeProvider } from "next-themes";
import { CommandPalette } from "@/components/shared/CommandPalette";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Writely_",
  description: "Your stories, beautifully organized.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.className} antialiased`} suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="dark" forcedTheme="dark" disableTransitionOnChange>
          <Providers>
            <CommandPalette />
            {children}
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}