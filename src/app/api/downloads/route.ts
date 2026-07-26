import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { syncGitHubReleases } from "@/lib/githubSync";
import { getGlobalCounts } from "@/lib/globalStore";

export const dynamic = "force-dynamic";

function formatCompactNumber(num: number): string {
  if (num >= 1_000_000) {
    return `${(num / 1_000_000).toFixed(1).replace(/\.0$/, "")}M+`;
  }
  if (num >= 10_000) {
    return `${Math.floor(num / 1_000)}K+`;
  }
  return num.toLocaleString("en-US");
}

const DEFAULT_RELEASES = [
  {
    id: "default-040-win",
    version: "0.4.0",
    platform: "windows",
    downloads: 0,
    downloadUrl: "/api/download/file?v=0.4.0&platform=windows",
    isLatest: true,
    releasedAt: "2026-07-20T00:00:00.000Z",
  },
  {
    id: "default-040-mac",
    version: "0.4.0",
    platform: "macOS",
    downloads: 0,
    downloadUrl: "/api/download/file?v=0.4.0&platform=macOS",
    isLatest: true,
    releasedAt: "2026-07-20T00:00:00.000Z",
  },
  {
    id: "default-040-linux",
    version: "0.4.0",
    platform: "linux",
    downloads: 0,
    downloadUrl: "/api/download/file?v=0.4.0&platform=linux",
    isLatest: true,
    releasedAt: "2026-07-20T00:00:00.000Z",
  },
  {
    id: "default-040-other",
    version: "0.4.0",
    platform: "other_devices",
    downloads: 0,
    downloadUrl: "/api/download/file?v=0.4.0&platform=other_devices",
    isLatest: true,
    releasedAt: "2026-07-20T00:00:00.000Z",
  },
  {
    id: "default-030-win",
    version: "0.3.0",
    platform: "windows",
    downloads: 0,
    downloadUrl: "/api/download/file?v=0.3.0&platform=windows",
    isLatest: false,
    releasedAt: "2026-07-01T00:00:00.000Z",
  },
  {
    id: "default-020-win",
    version: "0.2.0",
    platform: "windows",
    downloads: 0,
    downloadUrl: "/api/download/file?v=0.2.0&platform=windows",
    isLatest: false,
    releasedAt: "2026-06-01T00:00:00.000Z",
  },
  {
    id: "default-010-win",
    version: "0.1.0",
    platform: "windows",
    downloads: 0,
    downloadUrl: "/api/download/file?v=0.1.0&platform=windows",
    isLatest: false,
    releasedAt: "2026-05-01T00:00:00.000Z",
  },
];

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const targetPlatform = searchParams.get("platform") || "windows";

    await syncGitHubReleases().catch((err) =>
      console.warn("GitHub release sync non-blocking error:", err)
    );

    const globalCounts: Record<string, number> = await getGlobalCounts().catch(() => ({}));

    let baseReleases = DEFAULT_RELEASES;

    try {
      const dbReleases = await prisma.releaseDownload.findMany({
        orderBy: [
          { releasedAt: "desc" },
          { version: "desc" }
        ],
      });

      if (dbReleases && dbReleases.length > 0) {
        baseReleases = dbReleases.map((rel) => ({
          id: rel.id,
          version: rel.version,
          platform: rel.platform,
          downloads: rel.downloadCount,
          downloadUrl: rel.downloadUrl,
          isLatest: rel.isLatest,
          releasedAt: rel.releasedAt.toISOString(),
        }));
      }
    } catch (dbError) {
      console.warn("Prisma DB read error, using default releases:", dbError);
    }

    // Consistently merge global counts into current release version objects
    const mappedReleases = baseReleases.map((rel) => {
      const key = rel.platform.toLowerCase() === "other_devices" ? "other_devices" : rel.platform.toLowerCase();
      const globalExtra = rel.isLatest ? (globalCounts[key] || 0) : 0;
      return {
        ...rel,
        downloads: Math.max(rel.downloads, globalExtra),
      };
    });

    // Total downloads is ALWAYS the exact sum of all version release downloads
    const totalDownloads = mappedReleases.reduce((sum, r) => sum + r.downloads, 0);

    const latestRelease = mappedReleases.find(
      (r) => r.platform.toLowerCase() === targetPlatform.toLowerCase() && r.isLatest
    ) || mappedReleases.find((r) => r.isLatest) || mappedReleases[0];

    const currentVersion = latestRelease ? latestRelease.version : "0.4.0";

    const responsePayload = {
      totalDownloads,
      formattedTotal: totalDownloads.toLocaleString("en-US"),
      compactTotal: formatCompactNumber(totalDownloads),
      currentVersion,
      platform: targetPlatform,
      releases: mappedReleases,
    };

    return NextResponse.json(responsePayload, {
      status: 200,
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate",
      },
    });
  } catch (error) {
    console.error("Error fetching download statistics:", error);
    const globalCounts: Record<string, number> = await getGlobalCounts().catch(() => ({}));
    const fallbackReleases = DEFAULT_RELEASES.map((rel) => {
      const key = rel.platform.toLowerCase() === "other_devices" ? "other_devices" : rel.platform.toLowerCase();
      const globalExtra = rel.isLatest ? (globalCounts[key] || 0) : 0;
      return { ...rel, downloads: Math.max(rel.downloads, globalExtra) };
    });
    const totalDownloads = fallbackReleases.reduce((sum, r) => sum + r.downloads, 0);
    return NextResponse.json({
      totalDownloads,
      formattedTotal: totalDownloads.toLocaleString("en-US"),
      compactTotal: formatCompactNumber(totalDownloads),
      currentVersion: "0.4.0",
      platform: "windows",
      releases: fallbackReleases,
    });
  }
}
