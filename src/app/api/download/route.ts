import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const platform = searchParams.get("platform") || "windows";
    const version = searchParams.get("v") || searchParams.get("version");

    // Build URL to stream endpoint without pre-incrementing
    const redirectUrl = new URL("/api/download/file", request.url);
    redirectUrl.searchParams.set("platform", platform);
    if (version) {
      redirectUrl.searchParams.set("version", version);
    }

    return NextResponse.redirect(redirectUrl.toString(), 307);
  } catch (error) {
    console.error("Error in download redirect route:", error);
    return NextResponse.redirect(new URL("/api/download/file", request.url), 307);
  }
}
