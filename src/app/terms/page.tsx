import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

export default function TermsPage() {
  return (
    <div className="flex flex-col min-h-screen relative overflow-hidden bg-background text-foreground">
      <Navigation />
      
      <main className="flex-1 w-full max-w-4xl mx-auto px-6 pt-32 pb-20 flex flex-col justify-center">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Terms of Service</h1>
        <p className="text-sm text-muted-foreground mb-8">Last updated: July 2026</p>

        <div className="space-y-6 text-sm text-muted-foreground leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-base font-semibold text-foreground">1. Acceptance of Terms</h2>
            <p>
              By downloading, installing, or using SentryDrive, you agree to be bound by these terms. If you do not agree, do not use the software.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-semibold text-foreground">2. License & Usage</h2>
            <p>
              SentryDrive is provided as-is for personal and commercial use. You are responsible for ensuring that you maintain backups of any critical files before running cleanup or encryption routines.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-semibold text-foreground">3. Disclaimer of Warranties</h2>
            <p>
              SentryDrive is provided "AS IS", without warranty of any kind, express or implied. In no event shall the authors or copyright holders be liable for any claim, damages, or data loss arising from the use of the software.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-semibold text-foreground">4. Modifications</h2>
            <p>
              We reserve the right to modify these terms at any time by updating this page or issuing new software release notes.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
