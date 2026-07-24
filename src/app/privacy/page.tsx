import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

export default function PrivacyPage() {
  return (
    <div className="flex flex-col min-h-screen relative overflow-hidden bg-background text-foreground">
      <Navigation />
      
      <main className="flex-1 w-full max-w-4xl mx-auto px-6 pt-32 pb-20 flex flex-col justify-center">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Privacy Policy</h1>
        <p className="text-sm text-muted-foreground mb-8">Last updated: July 2026</p>

        <div className="space-y-6 text-sm text-muted-foreground leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-base font-semibold text-foreground">1. Zero Telemetry & 100% Offline</h2>
            <p>
              SentryDrive is designed from the ground up as an offline-first application. We do not collect, track, or transmit any personal data, usage analytics, device telemetry, or file information.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-semibold text-foreground">2. Local Storage Only</h2>
            <p>
              All vault encryption keys, settings, and file operations remain strictly on your local disk. Your data never leaves your computer and is never sent to external servers or cloud services.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-semibold text-foreground">3. Network Communication</h2>
            <p>
              The desktop application makes zero outbound network requests. It operates fully isolated from the internet to guarantee maximum security and data privacy.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-semibold text-foreground">4. Contact & Support</h2>
            <p>
              If you have any questions about SentryDrive's privacy practices, feel free to reach out via our open-source repository.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
