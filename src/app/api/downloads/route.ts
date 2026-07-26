import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { syncGitHubReleases } from "@/lib/githubSync";

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

// Auto-seed default release records if database is empty on serverless / Vercel deployment
async function ensureInitialReleasesExist() {
  try {
    const count = await prisma.releaseDownload.count();
    if (count > 0) return;

    console.log("Database is empty. Auto-initializing baseline release records...");

    const initialReleases = [
      {
        version: "0.1.0",
        platform: "windows",
        downloadCount: 0,
        downloadUrl: "/api/download/file?v=0.1.0&platform=windows",
        isLatest: false,
        releasedAt: new Date("2026-05-01T00:00:00Z"),
      },
      {
        version: "0.2.0",
        platform: "windows",
        downloadCount: 0,
        downloadUrl: "/api/download/file?v=0.2.0&platform=windows",
        isLatest: false,
        releasedAt: new Date("2026-06-01T00:00:00Z"),
      },
      {
        version: "0.3.0",
        platform: "windows",
        downloadCount: 0,
        downloadUrl: "/api/download/file?v=0.3.0&platform=windows",
        isLatest: false,
        releasedAt: new Date("2026-07-01T00:00:00Z"),
      },
      {
        version: "0.4.0",
        platform: "windows",
        downloadCount: 0,
        downloadUrl: "/api/download/file?v=0.4.0&platform=windows",
        isLatest: true,
        releasedAt: new Date("2026-07-20T00:00:00Z"),
      },
      {
        version: "0.4.0",
        platform: "macOS",
        downloadCount: 0,
        downloadUrl: "/api/download/file?v=0.4.0&platform=macOS",
        isLatest: true,
        releasedAt: new Date("2026-07-20T00:00:00Z"),
      },
      {
        version: "0.4.0",
        platform: "linux",
        downloadCount: 0,
        downloadUrl: "/api/download/file?v=0.4.0&platform=linux",
        isLatest: true,
        releasedAt: new Date("2026-07-20T00:00:00Z"),
      },
      {
        version: "0.4.0",
        platform: "other_devices",
        downloadCount: 0,
        downloadUrl: "/api/download/file?v=0.4.0&platform=other_devices",
        isLatest: true,
        releasedAt: new Date("2026-07-20T00:00:00Z"),
      },
    ];

    for (const rel of initialReleases) {
      await prisma.releaseDownload.upsert({
        where: {
          version_platform: {
            version: rel.version,
            platform: rel.platform,
          },
        },
        update: {
          isLatest: rel.isLatest,
          downloadUrl: rel.downloadUrl,
        },
        create: rel,
      });
    }
  } catch (err) {
    console.error("Error auto-initializing baseline release records:", err);
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const targetPlatform = searchParams.get("platform") || "windows";

    // Auto-initialize if database is empty on Vercel deployment
    await ensureInitialReleasesExist();

    // Synchronize real release metrics from GitHub API asynchronously if available
    await syncGitHubReleases().catch((err) =>
      console.warn("GitHub release sync non-blocking error:", err)
    );

    // Fetch real releases from the database
    let releases = await prisma.releaseDownload.findMany({
      orderBy: [
        { releasedAt: "desc" },
        { version: "desc" }
      ],
    });

    // Fallback double check if empty
    if (releases.length === 0) {
      await ensureInitialReleasesExist();
      releases = await prisma.releaseDownload.findMany({
        orderBy: [
          { releasedAt: "desc" },
          { version: "desc" }
        ],
      });
    }

    // Calculate real lifetime total across all version downloads
    const totalDownloads = releases.reduce((sum, r) => sum + r.downloadCount, 0);

    // Identify current stable version
    const latestRelease = releases.find(
      (r) => r.platform.toLowerCase() === targetPlatform.toLowerCase() && r.isLatest
    ) || releases.find((r) => r.isLatest) || releases[0];

    const currentVersion = latestRelease ? latestRelease.version : "0.4.0";

    const responsePayload = {
      totalDownloads,
      formattedTotal: totalDownloads.toLocaleString("en-US"),
      compactTotal: formatCompactNumber(totalDownloads),
      currentVersion,
      platform: targetPlatform,
      releases: releases.map((rel) => ({
        id: rel.id,
        version: rel.version,
        platform: rel.platform,
        downloads: rel.downloadCount,
        downloadUrl: rel.downloadUrl,
        isLatest: rel.isLatest,
        releasedAt: rel.releasedAt.toISOString(),
      })),
    };

    return NextResponse.json(responsePayload, {
      status: 200,
      headers: {
        "Cache-Control": "no-store, max-age=0",
      },
    });
  } catch (error) {
    console.error("Error fetching download statistics:", error);
    return NextResponse.json(
      { error: "Failed to retrieve download statistics." },
      { status: 500 }
    );
  }
}
