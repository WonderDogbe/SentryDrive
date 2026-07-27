import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding release records for target platforms including v0.5.0...");

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
      isLatest: false,
      releasedAt: new Date("2026-07-20T00:00:00Z"),
    },
    {
      version: "0.5.0",
      platform: "windows",
      downloadCount: 0,
      downloadUrl: "/api/download/file?v=0.5.0&platform=windows",
      isLatest: true,
      releasedAt: new Date("2026-07-27T00:00:00Z"),
    },
    {
      version: "0.5.0",
      platform: "macOS",
      downloadCount: 0,
      downloadUrl: "/api/download/file?v=0.5.0&platform=macOS",
      isLatest: true,
      releasedAt: new Date("2026-07-27T00:00:00Z"),
    },
    {
      version: "0.5.0",
      platform: "linux",
      downloadCount: 0,
      downloadUrl: "/api/download/file?v=0.5.0&platform=linux",
      isLatest: true,
      releasedAt: new Date("2026-07-27T00:00:00Z"),
    },
    {
      version: "0.5.0",
      platform: "other_devices",
      downloadCount: 0,
      downloadUrl: "/api/download/file?v=0.5.0&platform=other_devices",
      isLatest: true,
      releasedAt: new Date("2026-07-27T00:00:00Z"),
    },
  ];

  // Mark all older records as not latest first
  await prisma.releaseDownload.updateMany({
    data: {
      isLatest: false,
    },
  });

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

  console.log("Database seeding complete for version 0.5.0.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
