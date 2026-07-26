"use client";

import { useDownloadStats } from "@/hooks/useDownloadStats";
import { Download } from "lucide-react";

export default function DownloadArea() {
  const { formattedTotal, isLoading, error } = useDownloadStats("windows");

  return (
    <div className="w-full border-y border-border/70 py-3.5 my-2 flex items-center justify-between font-mono text-xs sm:text-sm">
      <div className="flex items-center gap-2.5 text-foreground">
        <Download className="w-4 h-4 text-muted-foreground stroke-[2.2]" />
        <span className="font-medium text-foreground tracking-tight">
          {isLoading ? "..." : error ? "0" : formattedTotal} downloads
        </span>
      </div>
    </div>
  );
}
