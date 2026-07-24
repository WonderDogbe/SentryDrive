import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Lock, HardDriveDownload, Trash2, Cpu, Laptop, ShieldCheck } from "lucide-react";

const fullFeatures = [
  {
    icon: Lock,
    title: "Encrypted Local Vault",
    description: "Keep your sensitive files safely locked away using zero-knowledge local encryption standards."
  },
  {
    icon: HardDriveDownload,
    title: "Drag & Drop Interface",
    description: "Effortlessly secure files and folders with a simple drag-and-drop workflow built for desktop speed."
  },
  {
    icon: Trash2,
    title: "Smart System Cleanup",
    description: "Scan and remove temporary caches, duplicate files, and system junk to free up valuable storage space."
  },
  {
    icon: Cpu,
    title: "Ultra Low Overhead",
    description: "Optimized native execution ensuring minimal CPU and RAM footprint during heavy operations."
  },
  {
    icon: Laptop,
    title: "Cross-Platform Support",
    description: "Consistent, ultra-responsive native experience across Windows, macOS, and Linux systems."
  },
  {
    icon: ShieldCheck,
    title: "100% Offline & Private",
    description: "Zero network telemetry or telemetry calls. Your data never leaves your machine."
  }
];

export default function FeaturesPage() {
  return (
    <div className="flex flex-col min-h-screen relative overflow-hidden bg-background text-foreground">
      <Navigation />
      
      <main className="flex-1 w-full max-w-5xl mx-auto px-6 pt-32 pb-20 flex flex-col justify-center">
        <div className="mb-10 text-center max-w-2xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">SentryDrive Features</h1>
          <p className="text-muted-foreground text-sm">
            Everything you need to secure your private files and keep your operating system running fast.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {fullFeatures.map((feat, index) => {
            const Icon = feat.icon;
            return (
              <div 
                key={index} 
                className="p-6 rounded-lg border border-border bg-secondary/50 flex flex-col gap-3 transition-colors hover:border-foreground/20"
              >
                <div className="p-2 rounded-md bg-secondary w-fit border border-border">
                  <Icon className="w-5 h-5 text-foreground" />
                </div>
                <h3 className="font-semibold text-base">{feat.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{feat.description}</p>
              </div>
            );
          })}
        </div>
      </main>

      <Footer />
    </div>
  );
}
