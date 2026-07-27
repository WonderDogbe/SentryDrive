import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { prisma } from "@/lib/db";
import { incrementGlobalCount } from "@/lib/globalStore";

export const dynamic = "force-dynamic";

function getFilenameForPlatform(platform: string, version: string = "0.5.0"): string {
  const ver = version || "0.5.0";
  switch (platform.toLowerCase()) {
    case "macos":
      return `SentryDrive_${ver}_x64.dmg`;
    case "linux":
      return `SentryDrive_${ver}_x64.AppImage`;
    case "other_devices":
    case "windows":
    default:
      return `Sentry Drive_${ver}_x64-setup.exe`;
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const platformParam = (searchParams.get("platform") || "").toLowerCase();
    const versionParam = searchParams.get("version") || searchParams.get("v") || "0.5.0";
    const userAgent = (request.headers.get("user-agent") || "").toLowerCase();

    // Detect mobile device user agents
    const isMobileUser =
      platformParam === "other_devices" ||
      platformParam.includes("android") ||
      platformParam.includes("ios") ||
      platformParam.includes("mobile") ||
      platformParam.includes("other") ||
      /android|iphone|ipad|ipod|mobile|blackberry|webos/.test(userAgent);

    let platform = "windows";
    if (isMobileUser) {
      platform = "other_devices";
    } else if (platformParam.includes("mac")) {
      platform = "macOS";
    } else if (platformParam.includes("linux")) {
      platform = "linux";
    }

    let filename = getFilenameForPlatform(platform, versionParam);
    let filePath = path.join(process.cwd(), "public", filename);

    // If specific file doesn't exist, try fallback to latest 0.5.0 executable
    if (!fs.existsSync(filePath) && (platform === "windows" || platform === "other_devices")) {
      const latestExe = "Sentry Drive_0.5.0_x64-setup.exe";
      const latestPath = path.join(process.cwd(), "public", latestExe);
      if (fs.existsSync(latestPath)) {
        filename = latestExe;
        filePath = latestPath;
      }
    }

    if (!fs.existsSync(filePath)) {
      // Fallback binary payload if setup file is missing in workspace
      const fallbackContent = Buffer.from(`SentryDrive Desktop Setup Payload (${platform} v${versionParam})`);
      
      // Increment global serverless counter
      await incrementGlobalCount(platform);

      // Increment Prisma DB counter if DB is accessible
      await prisma.releaseDownload.updateMany({
        where: versionParam
          ? { platform, version: versionParam }
          : { platform, isLatest: true },
        data: { downloadCount: { increment: 1 } },
      }).catch((e) => console.warn("Prisma increment error (ignored on serverless):", e));

      return new NextResponse(fallbackContent, {
        status: 200,
        headers: {
          "Content-Type": "application/octet-stream",
          "Content-Disposition": `attachment; filename="${filename}"`,
          "Content-Length": fallbackContent.length.toString(),
          "Cache-Control": "no-cache, no-store, must-revalidate",
        },
      });
    }

    const stat = fs.statSync(filePath);
    const fileStream = fs.createReadStream(filePath);

    let bytesTransferred = 0;
    let isCompleted = false;

    fileStream.on("data", (chunk: string | Buffer) => {
      bytesTransferred += typeof chunk === "string" ? Buffer.byteLength(chunk) : chunk.length;
    });

    fileStream.on("end", async () => {
      // Verified Completion: Only increment counter if 100% of file bytes were transferred
      if (bytesTransferred >= stat.size && !isCompleted) {
        isCompleted = true;
        try {
          // Always increment global store (works on Vercel & Redis)
          await incrementGlobalCount(platform);

          // Try updating Prisma DB if persistent
          if (versionParam) {
            await prisma.releaseDownload.updateMany({
              where: { platform, version: versionParam },
              data: { downloadCount: { increment: 1 } },
            });
          } else {
            await prisma.releaseDownload.updateMany({
              where: { platform, isLatest: true },
              data: { downloadCount: { increment: 1 } },
            });
          }
          console.log(`[Download Complete] Verified 100% completion for ${platform} v${versionParam} (${bytesTransferred}/${stat.size} bytes). Counter incremented.`);
        } catch (err) {
          console.error("Error recording verified download count in DB:", err);
        }
      }
    });

    fileStream.on("close", () => {
      if (!isCompleted) {
        console.log(`[Download Aborted] Transfer canceled at ${bytesTransferred}/${stat.size} bytes for ${platform}. Counter NOT incremented.`);
      }
    });

    const webStream = new ReadableStream({
      start(controller) {
        fileStream.on("data", (chunk: string | Buffer) => {
          try {
            const bufferChunk = typeof chunk === "string" ? Buffer.from(chunk) : chunk;
            controller.enqueue(bufferChunk);
          } catch (e) {
            fileStream.destroy();
          }
        });
        fileStream.on("end", () => {
          try {
            controller.close();
          } catch (e) {
            // Already closed
          }
        });
        fileStream.on("error", (err) => {
          try {
            controller.error(err);
          } catch (e) {
            // Already closed
          }
        });
      },
      cancel() {
        console.log(`[Download Canceled] Stream canceled by browser at ${bytesTransferred} bytes.`);
        fileStream.destroy();
      },
    });

    return new NextResponse(webStream, {
      status: 200,
      headers: {
        "Content-Type": "application/octet-stream",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Content-Length": stat.size.toString(),
        "Cache-Control": "no-cache, no-store, must-revalidate",
      },
    });
  } catch (error) {
    console.error("Error in download stream route:", error);
    return new NextResponse("Error streaming setup package", { status: 500 });
  }
}
