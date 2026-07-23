export default function DownloadArea() {
  return (
    <div className="flex flex-col gap-2 pt-4 border-t border-border mt-2">
      <div className="flex items-center gap-4 text-xs text-muted-foreground">
        <span>Windows 10/11</span>
        <span>•</span>
        <span>v1.0.0</span>
        <span>•</span>
        <span>64-bit</span>
        <span>•</span>
        <span>~12 MB</span>
      </div>
      <div className="flex items-center gap-4 text-xs text-muted-foreground mt-2">
        <a href="#github" className="hover:text-foreground transition-colors">GitHub</a>
        <a href="#release-notes" className="hover:text-foreground transition-colors">Release Notes</a>
      </div>
    </div>
  );
}
