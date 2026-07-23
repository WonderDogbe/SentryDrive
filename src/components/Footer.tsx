export default function Footer() {
  return (
    <footer className="w-full px-6 py-6 border-t border-border/50 flex flex-col md:flex-row items-center justify-between text-xs text-muted-foreground absolute bottom-0 left-0 bg-background/80 backdrop-blur-md">
      <div>© {new Date().getFullYear()} SecureVault. All rights reserved.</div>
      <div className="flex items-center gap-6 mt-4 md:mt-0">
        <a href="#privacy" className="hover:text-foreground transition-colors">Privacy</a>
        <a href="#terms" className="hover:text-foreground transition-colors">Terms</a>
        <a href="#github" className="hover:text-foreground transition-colors">GitHub</a>
        <a href="#docs" className="hover:text-foreground transition-colors">Documentation</a>
      </div>
    </footer>
  );
}
