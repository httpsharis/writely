import type { Metadata } from "next";
import "./globals.css";
import { Inter } from "next/font/google";

import { Navbar } from "@/components/Navbar";
import { Providers } from "@/app/provider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter", // Optional: sets up a CSS variable
});

export const metadata: Metadata = {
  title: "Writely",
  description: "Writing app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.className} dark antialiased`}
      suppressHydrationWarning
    >
      <body>
        <Providers>
          <Navbar />

          <main className="pt-32 pb-20">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
