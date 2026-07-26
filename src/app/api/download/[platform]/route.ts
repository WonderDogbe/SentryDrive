import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ platform: string }> }
) {
  try {
    const resolvedParams = await params;
    const platformInput = resolvedParams.platform.toLowerCase();
    const userAgent = (request.headers.get("user-agent") || "").toLowerCase();

    // Check if user is on a mobile device or explicitly requesting mobile/other
    const isMobileUser =
      platformInput.includes("android") ||
      platformInput.includes("ios") ||
      platformInput.includes("mobile") ||
      platformInput.includes("other") ||
      /android|iphone|ipad|ipod|mobile|blackberry|webos/.test(userAgent);

    let platform = "windows";
    if (isMobileUser) {
      platform = "other_devices";
    } else if (platformInput.includes("mac")) {
      platform = "macOS";
    } else if (platformInput.includes("linux")) {
      platform = "linux";
    }

    const redirectUrl = new URL("/api/download/file", request.url);
    redirectUrl.searchParams.set("platform", platform);

    return NextResponse.redirect(redirectUrl.toString(), 307);
  } catch (error) {
    console.error("Error processing platform download route:", error);
    return NextResponse.redirect(new URL("/api/download/file", request.url), 307);
  }
}
