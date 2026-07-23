export default function Navigation() {
  return (
    <header className="fixed top-0 left-0 w-full z-50 px-6 py-4 flex items-center justify-between">
      <div>Logo</div>
      <nav className="flex items-center gap-6 text-sm font-medium">
        <a href="#features" className="hover:text-primary transition-colors">Features</a>
        <a href="#privacy" className="hover:text-primary transition-colors">Privacy</a>
        <button className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors">
          Download
        </button>
      </nav>
    </header>
  );
}
