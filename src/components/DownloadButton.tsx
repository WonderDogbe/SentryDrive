"use client";

export default function DownloadButton({ 
  children, 
  className 
}: { 
  children: React.ReactNode; 
  className: string;
}) {
  const handleDownload = () => {
    window.location.href = "/api/download";
  };

  return (
    <button onClick={handleDownload} className={`cursor-pointer ${className}`}>
      {children}
    </button>
  );
}
