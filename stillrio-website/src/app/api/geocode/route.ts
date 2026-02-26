import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q");
  if (!q?.trim()) {
    return NextResponse.json({ error: "Missing query" }, { status: 400 });
  }
  try {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 10000);
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(q)}&limit=1`,
      {
        headers: { "User-Agent": "StillRioRoutePlanner/1.0" },
        signal: ctrl.signal,
      }
    );
    clearTimeout(t);
    const data = await res.json();
    if (Array.isArray(data) && data.length > 0) {
      const { lat, lon } = data[0];
      return NextResponse.json([parseFloat(lon), parseFloat(lat)]);
    }
    return NextResponse.json(null);
  } catch (err) {
    console.error("Geocode error:", err);
    return NextResponse.json({ error: "Geocode failed" }, { status: 500 });
  }
}
