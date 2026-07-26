import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Resetting all release download counts to 0...");

  // Explicitly reset all existing database records to 0
  await prisma.releaseDownload.updateMany({
    data: {
      downloadCount: 0,
    },
  });

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
        downloadCount: 0,
        isLatest: rel.isLatest,
        downloadUrl: rel.downloadUrl,
      },
      create: rel,
    });
  }

  console.log("Database reset complete. All download counts are strictly 0.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
