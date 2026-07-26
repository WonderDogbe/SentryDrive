// In-memory global store to guarantee live download counter increments on serverless (Vercel) & local environments
const globalForDownloads = globalThis as unknown as {
  downloadCounts: Record<string, number>;
};

if (!globalForDownloads.downloadCounts) {
  globalForDownloads.downloadCounts = {
    windows: 0,
    macOS: 0,
    linux: 0,
    other_devices: 0,
  };
}

export const inMemoryDownloadCounts = globalForDownloads.downloadCounts;

export function incrementInMemoryCount(platform: string) {
  const p = platform.toLowerCase();
  let key = "windows";
  if (p.includes("mac")) key = "macOS";
  else if (p.includes("linux")) key = "linux";
  else if (p.includes("other")) key = "other_devices";

  inMemoryDownloadCounts[key] = (inMemoryDownloadCounts[key] || 0) + 1;
  console.log(`[InMemoryStore] Incremented ${key} to ${inMemoryDownloadCounts[key]}`);
}

export function getInMemoryCount(platform: string): number {
  const p = platform.toLowerCase();
  let key = "windows";
  if (p.includes("mac")) key = "macOS";
  else if (p.includes("linux")) key = "linux";
  else if (p.includes("other")) key = "other_devices";

  return inMemoryDownloadCounts[key] || 0;
}
