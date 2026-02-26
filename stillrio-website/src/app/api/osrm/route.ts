import { NextRequest, NextResponse } from "next/server";

const PROFILE_MAP: Record<string, string> = {
  driving: "driving-car",
  walking: "foot-walking",
  cycling: "cycling-regular",
};

async function tryOSRM(coords: string, profile: string, alternatives = true): Promise<Response | null> {
  try {
    const alt = alternatives ? "&alternatives=true" : "";
    const url = `https://router.project-osrm.org/route/v1/${profile}/${coords}?overview=full&geometries=geojson${alt}`;
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 15000);
    const res = await fetch(url, { signal: ctrl.signal });
    clearTimeout(t);
    return res.ok ? res : null;
  } catch {
    return null;
  }
}

async function tryOpenRouteService(coords: string, profile: string): Promise<object | null> {
  const key = process.env.OPENROUTESERVICE_API_KEY;
  if (!key?.trim()) return null;

  const parts = coords.split(";");
  if (parts.length !== 2) return null;

  const coordPairs = parts.map((p) => {
    const [lon, lat] = p.split(",").map(Number);
    return [lon, lat];
  });

  const orsProfile = PROFILE_MAP[profile] ?? "driving-car";

  try {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 15000);
    const res = await fetch(
      `https://api.openrouteservice.org/v2/directions/${orsProfile}/geojson`,
      {
        method: "POST",
        headers: {
          Authorization: key,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ coordinates: coordPairs }),
        signal: ctrl.signal,
      }
    );
    clearTimeout(t);
    if (!res.ok) return null;

    const geojson = await res.json();
    const feature = geojson?.features?.[0];
    if (!feature?.geometry?.coordinates?.length) return null;

    const coordinates = feature.geometry.coordinates as [number, number][];
    const summary = feature.properties?.summary ?? {};

    return {
      code: "Ok",
      routes: [
        {
          distance: (summary.distance ?? 0),
          duration: summary.duration ?? 0,
          geometry: {
            coordinates,
          },
        },
      ],
    };
  } catch {
    return null;
  }
}

export async function GET(request: NextRequest) {
  const coords = request.nextUrl.searchParams.get("coords");
  const profile = request.nextUrl.searchParams.get("profile") ?? "driving";
  if (!coords) {
    return NextResponse.json({ error: "Missing coords" }, { status: 400 });
  }
  try {
    const orsKey = process.env.OPENROUTESERVICE_API_KEY?.trim();
    if (orsKey) {
      const orsData = await tryOpenRouteService(coords, profile);
      if (orsData) return NextResponse.json(orsData);
    }

    const osrmRes = await tryOSRM(coords, profile);
    if (osrmRes) {
      const data = await osrmRes.json();
      return NextResponse.json(data);
    }

    const orsData = await tryOpenRouteService(coords, profile);
    if (orsData) {
      return NextResponse.json(orsData);
    }

    return NextResponse.json(
      { error: "Routing service unavailable. Try again later, or add OPENROUTESERVICE_API_KEY for a reliable fallback." },
      { status: 503 }
    );
  } catch (err) {
    console.error("OSRM error:", err);
    return NextResponse.json({ error: "Routing failed" }, { status: 500 });
  }
}
