"use client";

import { useState } from "react";
import { useDownloadStats } from "@/hooks/useDownloadStats";
import { ChevronDown, ChevronUp, HardDrive, ShieldCheck, History, Monitor } from "lucide-react";
import DownloadButton from "./DownloadButton";

function formatPlatformName(platform: string): string {
  if (platform.toLowerCase() === "other_devices") return "Other Devices";
  return platform;
}

export default function DownloadArea() {
  const { formattedTotal, compactTotal, currentVersion, releases, isLoading, error } = useDownloadStats("windows");
  const [showHistory, setShowHistory] = useState(false);

  const desktopPlatforms = [
    { id: "windows", label: "Windows (.exe)" },
    { id: "macOS", label: "macOS (.dmg)" },
    { id: "linux", label: "Linux (.AppImage)" },
  ];

  // Include Windows, macOS, Linux, and Other Devices (excluding Android/iOS individual entries)
  const filteredReleases = releases.filter((rel) => {
    const p = rel.platform.toLowerCase();
    return p === "windows" || p === "macos" || p === "linux" || p === "other_devices";
  });

  return (
    <div className="flex flex-col gap-3 pt-3 border-t border-border mt-2">
      {/* Desktop Target Installers Bar - Single Horizontal Row */}
      <div className="flex flex-col gap-1.5">
        <span className="text-xs text-muted-foreground font-medium">Available Installers:</span>
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {desktopPlatforms.map((p) => (
            <DownloadButton
              key={p.id}
              platform={p.id}
              className="text-[11px] whitespace-nowrap bg-secondary/80 hover:bg-secondary text-secondary-foreground border border-border px-2.5 py-1 rounded transition-colors inline-flex items-center gap-1.5 shrink-0"
            >
              <Monitor className="w-3 h-3 text-muted-foreground" />
              <span>{p.label}</span>
            </DownloadButton>
          ))}
        </div>
      </div>

      {/* Compact Download Metadata Line */}
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground pt-1">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          <span>Windows • macOS • Linux</span>
          <span>•</span>
          <span className="font-mono font-medium text-foreground">v{currentVersion}</span>
        </div>

        <div className="flex items-center gap-2 font-medium text-foreground">
          {isLoading ? (
            <span className="animate-pulse text-muted-foreground">Loading stats...</span>
          ) : error ? (
            <span className="text-muted-foreground">Offline</span>
          ) : (
            <span className="bg-secondary/60 px-2 py-0.5 rounded text-[11px] border border-border">
              {formattedTotal} Downloads
            </span>
          )}
        </div>
      </div>

      {/* Lifetime Downloads Indicator & Version History Toggle */}
      <div className="rounded-md border border-border/80 bg-card/40 p-3 text-xs flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <HardDrive className="w-4 h-4 text-muted-foreground" />
            <span className="text-muted-foreground">Lifetime Downloads:</span>
            <span className="font-semibold text-foreground font-mono">
              {isLoading ? "..." : `${compactTotal} (${formattedTotal})`}
            </span>
          </div>

          <button
            onClick={() => setShowHistory((prev) => !prev)}
            className="flex items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            type="button"
          >
            <History className="w-3 h-3" />
            <span>Version History</span>
            {showHistory ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>
        </div>

        {/* Collapsible Version History Breakdown */}
        {showHistory && (
          <div className="mt-2 pt-2 border-t border-border/60 flex flex-col gap-1.5 text-[11px]">
            <div className="font-medium text-muted-foreground flex justify-between px-1 mb-1">
              <span>Version</span>
              <span>Platform / Device</span>
              <span>Downloads</span>
              <span>Released</span>
            </div>
            {filteredReleases.length === 0 ? (
              <div className="text-muted-foreground italic px-1">No version record found.</div>
            ) : (
              filteredReleases.map((rel) => (
                <div
                  key={`${rel.version}-${rel.platform}`}
                  className="flex items-center justify-between px-1 py-0.5 rounded hover:bg-muted/40 font-mono transition-colors"
                >
                  <div className="flex items-center gap-1.5">
                    <span className="font-semibold text-foreground">{rel.version}</span>
                    {rel.isLatest && (
                      <span className="text-[9px] bg-emerald-500/10 text-emerald-500 font-sans border border-emerald-500/20 px-1 py-0.2 rounded">
                        Latest
                      </span>
                    )}
                  </div>
                  <span className="text-muted-foreground font-sans">{formatPlatformName(rel.platform)}</span>
                  <span className="text-foreground font-medium">{rel.downloads.toLocaleString()}</span>
                  <span className="text-muted-foreground text-[10px]">
                    {new Date(rel.releasedAt).toISOString().split("T")[0]}
                  </span>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
