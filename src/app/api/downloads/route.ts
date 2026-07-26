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

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const targetPlatform = searchParams.get("platform") || "windows";

    // Synchronize real release metrics from GitHub API asynchronously if available
    await syncGitHubReleases().catch((err) =>
      console.warn("GitHub release sync non-blocking error:", err)
    );

    // Fetch real releases from the database
    const releases = await prisma.releaseDownload.findMany({
      orderBy: [
        { releasedAt: "desc" },
        { version: "desc" }
      ],
    });

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
