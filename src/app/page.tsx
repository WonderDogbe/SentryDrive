import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import AppPreview from "@/components/AppPreview";
import Features from "@/components/Features";
import DownloadArea from "@/components/DownloadArea";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen relative overflow-hidden">
      <Navigation />
      
      {/* Main Layout Container */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-6 flex flex-col md:grid md:grid-cols-12 gap-6 lg:gap-10 items-center pt-20 md:pt-20 pb-4 md:pb-4">
        
        {/* Left Column (approx 45% -> 5/12 cols) */}
        <div className="md:col-span-5 flex flex-col justify-center w-full">
          <div className="mb-6 md:mb-6">
            <Hero />
          </div>
          
          {/* Mobile-only App Preview */}
          <div className="block md:hidden w-full mb-6">
            <AppPreview />
          </div>

          <div className="space-y-6 md:space-y-6">
            <Features />
            <DownloadArea />
          </div>
        </div>

        {/* Desktop-only Right Column (approx 55% -> 7/12 cols) */}
        <div className="hidden md:flex md:col-span-7 justify-center items-center w-full">
          <AppPreview />
        </div>

      </main>

      <Footer />
    </div>
  );
}
