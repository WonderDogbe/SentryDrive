import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  try {
    const filename = "Sentry Drive_0.4.0_x64-setup.exe";
    const filePath = path.join(process.cwd(), "public", filename);
    
    if (!fs.existsSync(filePath)) {
      return new NextResponse("File not found in public folder", { status: 404 });
    }

    const fileBuffer = fs.readFileSync(filePath);

    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/octet-stream",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Content-Length": fileBuffer.length.toString(),
        "Cache-Control": "no-cache, no-store, must-revalidate",
      },
    });
  } catch (error) {
    return new NextResponse("Error streaming setup executable", { status: 500 });
  }
}
