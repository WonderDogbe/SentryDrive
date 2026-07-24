export default function Footer() {
  return (
    <footer className="w-full px-6 py-6 border-t border-border flex flex-col md:flex-row items-center justify-between text-xs text-muted-foreground bg-background/80 backdrop-blur-md">
      <div className="flex items-center gap-3">
        <a href="/" className="flex items-center">
          <img src="/CV-LOGO1.png" alt="SentryDrive" className="h-6 w-auto dark:hidden" />
          <img src="/CV-LOGO1-W.png" alt="SentryDrive" className="h-6 w-auto hidden dark:block" />
        </a>
        <div>© {new Date().getFullYear()} SentryDrive. All rights reserved.</div>
      </div>
      <div className="flex items-center gap-6 mt-4 md:mt-0">
        <a href="/privacy" className="hover:text-foreground transition-colors">Privacy</a>
        <a href="/terms" className="hover:text-foreground transition-colors">Terms</a>
      </div>
    </footer>
  );
}
