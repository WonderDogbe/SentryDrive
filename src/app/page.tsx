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
      <main className="flex-1 w-full max-w-7xl mx-auto px-6 flex flex-col md:grid md:grid-cols-12 gap-10 lg:gap-16 items-center pb-24 md:pb-0">
        
        {/* Left Column (approx 45% -> 5/12 cols) */}
        <div className="md:col-span-5 flex flex-col justify-center space-y-12 w-full pt-32 md:pt-0">
          <Hero />
          <Features />
          <DownloadArea />
        </div>

        {/* Right Column (approx 55% -> 7/12 cols) */}
        <div className="md:col-span-7 flex justify-center items-center w-full mt-12 md:mt-0">
          <AppPreview />
        </div>

      </main>

      <Footer />
    </div>
  );
}
