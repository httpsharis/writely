import type { Metadata, Viewport } from "next";
import { Inter, Lora, Plus_Jakarta_Sans, Fraunces, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/app/provider";
import { ThemeProvider } from "next-themes";
import { CommandPalette } from "@/components/shared/CommandPalette";
import { ClerkProvider } from "@clerk/nextjs";

// 1. Configure the UI Font (Inter)
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

// 2. Configure the Writing Fonts (Lora & Fraunces)
const lora = Lora({
  subsets: ["latin"],
  variable: "--font-lora",
  display: "swap",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
});

// 3. Sans Display Font (Plus Jakarta Sans)
const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-jakarta",
  display: "swap",
});

// 4. Code / Analytics Font (JetBrains Mono)
const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F5F0EB" },
    { media: "(prefers-color-scheme: dark)", color: "#0D0D0D" },
  ],
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://writely.app"),
  title: {
    default: "Writely — The Author's Second Brain",
    template: "%s | Writely",
  },
  description:
    "A modern, distraction-free writing environment and author's second brain for novelists, storytellers, and world-builders.",
  keywords: [
    "novel writing software",
    "author second brain",
    "world building tool",
    "writing app",
    "manuscript manager",
    "distraction free writing",
    "creative writing",
  ],
  authors: [{ name: "Writely Team" }],
  creator: "Writely",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://writely.app",
    siteName: "Writely",
    title: "Writely — The Author's Second Brain",
    description:
      "A modern, distraction-free writing environment and author's second brain for novelists, storytellers, and world-builders.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Writely — The Author's Second Brain",
    description:
      "A modern, distraction-free writing environment and author's second brain for novelists, storytellers, and world-builders.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${lora.variable} ${fraunces.variable} ${jakarta.variable} ${mono.variable} antialiased`}
      suppressHydrationWarning
    >
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          <ClerkProvider>
            <Providers>
              <CommandPalette />
              {children}
            </Providers>
          </ClerkProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
