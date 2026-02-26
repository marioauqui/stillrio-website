import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q");
  if (!q?.trim()) {
    return NextResponse.json([]);
  }
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(q)}&limit=8`,
      {
        headers: { "User-Agent": "StillRioRoutePlanner/1.0" },
      }
    );
    const data = await res.json();
    const results = Array.isArray(data)
      ? data.map((r: { display_name: string; lat: string; lon: string }) => ({
          display_name: r.display_name,
          lat: r.lat,
          lon: r.lon,
        }))
      : [];
    return NextResponse.json(results);
  } catch (err) {
    console.error("Search error:", err);
    return NextResponse.json([]);
  }
}
