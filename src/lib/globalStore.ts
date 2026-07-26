import { Redis } from "@upstash/redis";
import fs from "fs";
import path from "path";

// Initialize Upstash Redis / Vercel KV client if environment variables exist
const redisUrl = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;

const redis = redisUrl && redisToken ? new Redis({ url: redisUrl, token: redisToken }) : null;

const LOCAL_DATA_FILE = path.join(process.cwd(), "data", "downloads.json");

// In-memory fallback
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

const localCounts = globalForDownloads.downloadCounts;

function readLocalFile(): Record<string, number> {
  try {
    if (fs.existsSync(LOCAL_DATA_FILE)) {
      const data = fs.readFileSync(LOCAL_DATA_FILE, "utf-8");
      return JSON.parse(data);
    }
  } catch (e) {
    // Ignore error on read-only environments
  }
  return localCounts;
}

function writeLocalFile(counts: Record<string, number>) {
  try {
    const dir = path.dirname(LOCAL_DATA_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(LOCAL_DATA_FILE, JSON.stringify(counts, null, 2), "utf-8");
  } catch (e) {
    // Ignore error on read-only serverless lambdas
  }
}

export async function incrementGlobalCount(platform: string): Promise<void> {
  const p = platform.toLowerCase();
  let key = "windows";
  if (p.includes("mac")) key = "macOS";
  else if (p.includes("linux")) key = "linux";
  else if (p.includes("other")) key = "other_devices";

  // 1. Increment in Upstash Redis / Vercel KV if configured (Serverless Cloud Persistence)
  if (redis) {
    try {
      await redis.incr(`downloads:${key}`);
      console.log(`[GlobalStore] Redis incremented downloads:${key}`);
    } catch (err) {
      console.error("[GlobalStore] Redis increment error:", err);
    }
  }

  // 2. Increment local memory & file
  localCounts[key] = (localCounts[key] || 0) + 1;
  writeLocalFile(localCounts);
}

export async function resetGlobalCounts(): Promise<void> {
  // 1. Reset Upstash Redis / Vercel KV cloud store if connected
  if (redis) {
    try {
      const keys = ["downloads:windows", "downloads:macOS", "downloads:linux", "downloads:other_devices"];
      for (const k of keys) {
        await redis.set(k, 0);
      }
      console.log("[GlobalStore] Upstash Redis / Vercel KV cloud store successfully reset to 0.");
    } catch (err) {
      console.error("[GlobalStore] Redis reset error:", err);
    }
  }

  // 2. Reset memory & file
  localCounts.windows = 0;
  localCounts.macOS = 0;
  localCounts.linux = 0;
  localCounts.other_devices = 0;
  writeLocalFile(localCounts);
}

export async function getGlobalCounts(): Promise<Record<string, number>> {
  const fileData = readLocalFile();

  // 1. Fetch from Upstash Redis if configured
  if (redis) {
    try {
      const keys = ["downloads:windows", "downloads:macOS", "downloads:linux", "downloads:other_devices"];
      const values = await redis.mget<number[]>(...keys);

      return {
        windows: (values[0] ?? 0) + (fileData.windows || 0),
        macOS: (values[1] ?? 0) + (fileData.macOS || 0),
        linux: (values[2] ?? 0) + (fileData.linux || 0),
        other_devices: (values[3] ?? 0) + (fileData.other_devices || 0),
      };
    } catch (err) {
      console.error("[GlobalStore] Redis fetch error:", err);
    }
  }

  return fileData;
}
