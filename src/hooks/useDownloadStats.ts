"use client";

import { useState, useEffect, useCallback } from "react";

export interface ReleaseItem {
  id: string;
  version: string;
  platform: string;
  downloads: number;
  downloadUrl: string;
  isLatest: boolean;
  releasedAt: string;
}

export interface DownloadStatsResponse {
  totalDownloads: number;
  formattedTotal: string;
  compactTotal: string;
  currentVersion: string;
  platform: string;
  releases: ReleaseItem[];
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

export function useDownloadStats(platform: string = "windows"): DownloadStatsResponse {
  const [totalDownloads, setTotalDownloads] = useState<number>(0);
  const [formattedTotal, setFormattedTotal] = useState<string>("0");
  const [compactTotal, setCompactTotal] = useState<string>("0");
  const [currentVersion, setCurrentVersion] = useState<string>("0.5.0");
  const [releases, setReleases] = useState<ReleaseItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    try {
      setError(null);
      const res = await fetch(`/api/downloads?platform=${encodeURIComponent(platform)}&_t=${Date.now()}`, {
        cache: "no-store",
      });

      if (!res.ok) {
        throw new Error(`Failed to fetch statistics (Status: ${res.status})`);
      }

      const data = await res.json();
      setTotalDownloads(data.totalDownloads ?? 0);
      setFormattedTotal(data.formattedTotal ?? "0");
      setCompactTotal(data.compactTotal ?? "0");
      setCurrentVersion(data.currentVersion ?? "0.5.0");
      setReleases(data.releases ?? []);
    } catch (err) {
      console.error("Error in useDownloadStats hook:", err);
      setError(err instanceof Error ? err.message : "An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  }, [platform]);

  useEffect(() => {
    fetchStats();

    // Auto-poll every 3 seconds to keep counts live across all sessions
    const interval = setInterval(fetchStats, 3000);

    // Re-fetch when browser window regains focus after download
    const handleFocus = () => fetchStats();
    window.addEventListener("focus", handleFocus);

    return () => {
      clearInterval(interval);
      window.removeEventListener("focus", handleFocus);
    };
  }, [fetchStats]);

  return {
    totalDownloads,
    formattedTotal,
    compactTotal,
    currentVersion,
    platform,
    releases,
    isLoading,
    error,
    refresh: fetchStats,
  };
}
