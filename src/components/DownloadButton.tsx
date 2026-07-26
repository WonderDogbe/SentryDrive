"use client";

import { useState } from "react";

export default function DownloadButton({ 
  children, 
  className,
  platform = "windows" 
}: { 
  children: React.ReactNode; 
  className: string;
  platform?: string;
}) {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = () => {
    setIsDownloading(true);
    // Redirect to download endpoint which handles atomic counter increment and returns installer file stream
    window.location.href = `/api/download/${encodeURIComponent(platform)}`;

    setTimeout(() => {
      setIsDownloading(false);
    }, 3000);
  };

  return (
    <button 
      onClick={handleDownload} 
      disabled={isDownloading}
      className={`cursor-pointer ${className} ${isDownloading ? "opacity-80" : ""}`}
    >
      {isDownloading ? "Starting download..." : children}
    </button>
  );
}
