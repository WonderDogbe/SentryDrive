"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "./ThemeToggle";
import DownloadButton from "./DownloadButton";

export default function Navigation() {
  const pathname = usePathname();
  const isHomePage = pathname === "/";

  return (
    <header className="fixed top-0 left-0 w-full z-50 px-6 py-4 flex items-center justify-between bg-background/80 backdrop-blur-md border-b border-border">
      <Link href="/" className="flex items-center">
        <img src="/CV-LOGO1.png" alt="SentryDrive" className="h-8 md:h-10 w-auto dark:hidden" />
        <img src="/CV-LOGO1-W.png" alt="SentryDrive" className="h-8 md:h-10 w-auto hidden dark:block" />
      </Link>
      <nav className="flex items-center gap-4 md:gap-6 text-sm font-medium">
        {isHomePage ? (
          <Link href="/features" className="hover:text-primary transition-colors">
            Features
          </Link>
        ) : (
          <Link href="/" className="hover:text-primary transition-colors">
            Home
          </Link>
        )}
        <ThemeToggle />
        <DownloadButton className="hidden md:inline-flex bg-foreground text-background px-4 py-2 rounded-md font-medium hover:bg-foreground/90 transition-colors active:scale-[0.98]">
          Download
        </DownloadButton>
      </nav>
    </header>
  );
}
