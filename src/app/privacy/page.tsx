import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { ShieldCheck, Lock, EyeOff, ServerOff } from "lucide-react";

const privacyHighlights = [
  {
    icon: ServerOff,
    title: "Zero Data Collected",
    description: "No analytics, no tracking, and no phone-home telemetry of any kind."
  },
  {
    icon: Lock,
    title: "Zero-Knowledge Encryption",
    description: "Encryption keys are derived locally. Only you hold the key to your files."
  },
  {
    icon: EyeOff,
    title: "No Third-Party Cookies",
    description: "No tracking cookies, marketing pixels, or external advertising scripts."
  }
];

export default function PrivacyPage() {
  return (
    <div className="flex flex-col min-h-screen relative overflow-hidden bg-background text-foreground">
      <Navigation />
      
      <main className="flex-1 w-full max-w-4xl mx-auto px-6 pt-32 pb-20 flex flex-col justify-center">
        <div className="mb-10 text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary border border-border text-xs font-medium text-muted-foreground mb-4">
            <ShieldCheck className="w-3.5 h-3.5 text-foreground" /> Privacy First Architecture
          </div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">Privacy Policy</h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            SentryDrive is engineered from the ground up to protect your privacy. Your data stays entirely on your machine.
          </p>
          <p className="text-xs text-muted-foreground/70 mt-2">Last updated: July 2026</p>
        </div>

        {/* Highlights Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          {privacyHighlights.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="p-5 rounded-lg border border-border bg-secondary/40 flex flex-col gap-2">
                <div className="p-2 rounded-md bg-secondary w-fit border border-border text-foreground">
                  <Icon className="w-4 h-4" />
                </div>
                <h3 className="font-semibold text-sm">{item.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{item.description}</p>
              </div>
            );
          })}
        </div>

        {/* Detailed Sections */}
        <div className="space-y-6 text-sm text-muted-foreground leading-relaxed">
          <section className="space-y-2 p-6 rounded-lg border border-border bg-secondary/20">
            <h2 className="text-base font-semibold text-foreground">1. Zero Telemetry & 100% Offline</h2>
            <p>
              SentryDrive is designed from the ground up as an offline-first application. We do not collect, track, store, or transmit any personal data, usage analytics, device telemetry, or file metadata.
            </p>
          </section>

          <section className="space-y-2 p-6 rounded-lg border border-border bg-secondary/20">
            <h2 className="text-base font-semibold text-foreground">2. On-Device Encryption & Key Management</h2>
            <p>
              All vault encryption keys, settings, and file operations remain strictly on your local disk. Master passwords are used locally to derive encryption keys via secure memory-hard algorithms and are never stored in plaintext or sent anywhere.
            </p>
          </section>

          <section className="space-y-2 p-6 rounded-lg border border-border bg-secondary/20">
            <h2 className="text-base font-semibold text-foreground">3. Smart Cleanup & Local Deletion</h2>
            <p>
              When using SentryDrive's cleanup and shredding tools, files selected for deletion are processed entirely on your local machine. Temporary files and caches are deleted directly from disk according to your instructions, with zero external reporting.
            </p>
          </section>

          <section className="space-y-2 p-6 rounded-lg border border-border bg-secondary/20">
            <h2 className="text-base font-semibold text-foreground">4. Network Isolation & Outbound Requests</h2>
            <p>
              The SentryDrive desktop application makes zero outbound network requests during normal operation. It operates in full isolation from the internet to guarantee maximum security and absolute data privacy.
            </p>
          </section>

          <section className="space-y-2 p-6 rounded-lg border border-border bg-secondary/20">
            <h2 className="text-base font-semibold text-foreground">5. Third-Party Trackers & Advertising</h2>
            <p>
              We believe your file manager and security software should be 100% free of commercial tracking. SentryDrive contains zero third-party SDKs, zero advertising networks, zero tracking pixels, and zero analytics providers.
            </p>
          </section>

          <section className="space-y-2 p-6 rounded-lg border border-border bg-secondary/20">
            <h2 className="text-base font-semibold text-foreground">6. Code Transparency & Auditing</h2>
            <p>
              SentryDrive's architecture and source code are open and auditable by the community. Anyone can verify that no backdoor data logging or secret network calls exist in the codebase.
            </p>
          </section>

          <section className="space-y-2 p-6 rounded-lg border border-border bg-secondary/20">
            <h2 className="text-base font-semibold text-foreground">7. Contact & Security Reports</h2>
            <p>
              If you have any questions, concerns, or security disclosures regarding SentryDrive's privacy practices, please reach out or open an issue on our GitHub repository.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
