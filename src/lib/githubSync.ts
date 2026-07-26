import { prisma } from "@/lib/db";

interface GitHubAsset {
  name: string;
  download_count: number;
  browser_download_url: string;
}

interface GitHubRelease {
  tag_name: string;
  published_at: string;
  prerelease: boolean;
  draft: boolean;
  assets: GitHubAsset[];
}

export async function syncGitHubReleases(): Promise<boolean> {
  try {
    const response = await fetch(
      "https://api.github.com/repos/christliebdela/SentryDrive/releases",
      {
        headers: {
          Accept: "application/vnd.github.v3+json",
          "User-Agent": "SentryDrive-App",
        },
        next: { revalidate: 60 },
      }
    );

    if (!response.ok) {
      console.warn(`GitHub API returned status ${response.status}`);
      return false;
    }

    const releases: GitHubRelease[] = await response.json();

    if (!Array.isArray(releases) || releases.length === 0) {
      return false;
    }

    // Process published releases
    const validReleases = releases.filter((r) => !r.draft);

    for (let i = 0; i < validReleases.length; i++) {
      const rel = validReleases[i];
      const cleanVersion = rel.tag_name.replace(/^v/, "");
      const isLatest = i === 0 && !rel.prerelease;
      const releasedAt = new Date(rel.published_at);

      // Find platform-specific assets if available
      const windowsAsset = rel.assets.find((a) =>
        a.name.toLowerCase().endsWith(".exe") || a.name.toLowerCase().includes("win")
      );
      const macAsset = rel.assets.find((a) =>
        a.name.toLowerCase().endsWith(".dmg") || a.name.toLowerCase().includes("mac")
      );
      const linuxAsset = rel.assets.find((a) =>
        a.name.toLowerCase().endsWith(".appimage") || a.name.toLowerCase().endsWith(".tar.gz") || a.name.toLowerCase().includes("linux")
      );

      // Windows
      const windowsCount = windowsAsset ? windowsAsset.download_count : 0;
      const windowsUrl = windowsAsset ? windowsAsset.browser_download_url : "/api/download/file";

      await prisma.releaseDownload.upsert({
        where: {
          version_platform: {
            version: cleanVersion,
            platform: "windows",
          },
        },
        update: {
          isLatest,
          downloadUrl: windowsUrl,
          releasedAt,
          // Only update download count if GitHub has a non-zero count, preserving local tracked count if higher
          downloadCount: {
            set: windowsCount,
          },
        },
        create: {
          version: cleanVersion,
          platform: "windows",
          downloadCount: windowsCount,
          downloadUrl: windowsUrl,
          isLatest,
          releasedAt,
        },
      });

      // macOS if asset present
      if (macAsset) {
        await prisma.releaseDownload.upsert({
          where: {
            version_platform: {
              version: cleanVersion,
              platform: "macOS",
            },
          },
          update: {
            isLatest,
            downloadUrl: macAsset.browser_download_url,
            downloadCount: macAsset.download_count,
            releasedAt,
          },
          create: {
            version: cleanVersion,
            platform: "macOS",
            downloadCount: macAsset.download_count,
            downloadUrl: macAsset.browser_download_url,
            isLatest,
            releasedAt,
          },
        });
      }

      // Linux if asset present
      if (linuxAsset) {
        await prisma.releaseDownload.upsert({
          where: {
            version_platform: {
              version: cleanVersion,
              platform: "linux",
            },
          },
          update: {
            isLatest,
            downloadUrl: linuxAsset.browser_download_url,
            downloadCount: linuxAsset.download_count,
            releasedAt,
          },
          create: {
            version: cleanVersion,
            platform: "linux",
            downloadCount: linuxAsset.download_count,
            downloadUrl: linuxAsset.browser_download_url,
            isLatest,
            releasedAt,
          },
        });
      }
    }

    return true;
  } catch (error) {
    console.error("Error syncing GitHub releases:", error);
    return false;
  }
}
