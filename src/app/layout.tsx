import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SentryDrive | Protect What Matters",
  description: "SentryDrive is an offline-first premium tool to protect your files and clean up the rest.",
  openGraph: {
    title: "SentryDrive",
    description: "SentryDrive is an offline-first premium tool to protect your files and clean up the rest.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SentryDrive",
    description: "SentryDrive is an offline-first premium tool to protect your files and clean up the rest.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-[var(--background)] text-[var(--foreground)]">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
