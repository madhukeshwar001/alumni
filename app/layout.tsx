import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "AlumNexus – Centralized Alumni Intelligence & Engagement Platform",
  description:
    "AlumNexus is a modern, interactive alumni engagement platform connecting alumni, students, faculty, and administrators within a single ecosystem.",
  keywords: ["alumni", "college", "network", "mentorship", "Tamil Nadu", "engineering"],
  generator: "v0.app",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f5fafa" },
    { media: "(prefers-color-scheme: dark)", color: "#0d1117" },
  ],
  userScalable: false,
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        {children}
        <Toaster richColors position="top-right" closeButton />
        <Analytics />
      </body>
    </html>
  );
}
