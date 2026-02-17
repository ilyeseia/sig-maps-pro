import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "next-themes";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "GIS Maps Pro - نظام المعلومات الجغرافية",
  description: "نظام معلومات جغرافية متكامل لإنشاء وإدارة الخرائط والطبقات الجغرافية مع أدوات الرسم والتحليل",
  keywords: ["GIS", "خرائط", "معلومات جغرافية", "MapLibre", "Next.js", "TypeScript"],
  authors: [{ name: "GIS Maps Pro Team" }],
  icons: {
    icon: "/logo.png",
  },
  openGraph: {
    title: "GIS Maps Pro",
    description: "نظام معلومات جغرافية متكامل",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
