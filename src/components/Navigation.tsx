import { ThemeToggle } from "./ThemeToggle";

export default function Navigation() {
  return (
    <header className="fixed top-0 left-0 w-full z-50 px-6 py-4 flex items-center justify-between bg-background/80 backdrop-blur-md border-b border-border">
      <a href="#" className="flex items-center">
        <img src="/CV-LOGO1.png" alt="Clean Vault" className="h-8 md:h-10 w-auto dark:hidden" />
        <img src="/CV-LOGO1-W.png" alt="Clean Vault" className="h-8 md:h-10 w-auto hidden dark:block" />
      </a>
      <nav className="flex items-center gap-6 text-sm font-medium">
        <a href="#features" className="hover:text-primary transition-colors hidden md:inline-block">Features</a>
        <a href="#privacy" className="hover:text-primary transition-colors hidden md:inline-block">Privacy</a>
        <ThemeToggle />
        <button className="bg-foreground text-background px-4 py-2 rounded-md font-medium hover:bg-foreground/90 transition-colors active:scale-[0.98]">
          Download
        </button>
      </nav>
    </header>
  );
}
