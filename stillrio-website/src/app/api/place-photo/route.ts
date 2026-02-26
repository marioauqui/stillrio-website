import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const ref = request.nextUrl.searchParams.get("ref");
  const key = process.env.GOOGLE_PLACES_API_KEY ?? process.env.GOOGLE_MAPS_API_KEY;
  if (!ref || !key?.trim()) {
    return new NextResponse(null, { status: 404 });
  }
  try {
    const url = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${encodeURIComponent(ref)}&key=${encodeURIComponent(key.trim())}`;
    const res = await fetch(url, { redirect: "follow" });
    if (!res.ok) return new NextResponse(null, { status: 404 });
    const blob = await res.blob();
    const contentType = res.headers.get("content-type") ?? "image/jpeg";
    return new NextResponse(blob, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=86400",
      },
    });
  } catch {
    return new NextResponse(null, { status: 404 });
  }
}
