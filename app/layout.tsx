import type { Metadata } from "next";
import { Inter, Lora, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Providers } from "@/app/provider";
import { ThemeProvider } from "next-themes";
import { CommandPalette } from "@/components/shared/CommandPalette";

// 1. Configure the UI Font (Inter)
const inter = Inter({ 
  subsets: ["latin"],
  variable: '--font-inter',
  display: 'swap',
});

// 2. Configure the Writing Font (Lora)
const lora = Lora({ 
  subsets: ["latin"],
  variable: '--font-lora',
  display: 'swap',
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-jakarta",
});

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
    <html lang="en" className={`${inter.variable} ${lora.variable} ${jakarta.variable} antialiased`} suppressHydrationWarning>
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