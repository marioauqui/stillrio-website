import { NextRequest, NextResponse } from "next/server";

const CATEGORIES = ["Activities", "Food", "Sights", "Nature", "Cultural"];

const CATEGORY_TO_PLACE_TYPE: Record<string, string> = {
  Food: "restaurant",
  Sights: "tourist_attraction",
  Activities: "amusement_park",
  Nature: "park",
  Cultural: "museum",
};

function sampleRouteCoords(coords: [number, number][], maxPoints: number): [number, number][] {
  if (coords.length <= maxPoints) return coords;
  const step = Math.floor(coords.length / (maxPoints + 1));
  const sampled: [number, number][] = [];
  for (let i = 1; i <= maxPoints; i++) {
    sampled.push(coords[Math.min(i * step, coords.length - 1)]);
  }
  return sampled;
}

interface GooglePlacePhoto {
  photo_reference: string;
}

interface GooglePlaceResult {
  name: string;
  place_id: string;
  formatted_address?: string;
  rating?: number;
  user_ratings_total?: number;
  types?: string[];
  photos?: GooglePlacePhoto[];
  geometry?: { location?: { lat: number; lng: number } };
  price_level?: number; // 0–4
}

interface SuggestionOut {
  name: string;
  category: string;
  location: string;
  description: string;
  rating?: number;
  userRatingsTotal?: number;
  url?: string;
  imageUrl?: string;
  lat?: number;
  lon?: number;
}

function haversineKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function distanceToRouteKm(placeLat: number, placeLon: number, route: [number, number][]): number {
  if (route.length < 2) return Infinity;
  let minKm = Infinity;
  for (let i = 0; i < route.length - 1; i++) {
    const [lat1, lon1] = route[i];
    const [lat2, lon2] = route[i + 1];
    for (let j = 0; j <= 5; j++) {
      const t = j / 5;
      const lat = lat1 + t * (lat2 - lat1);
      const lon = lon1 + t * (lon2 - lon1);
      const d = haversineKm(placeLat, placeLon, lat, lon);
      minKm = Math.min(minKm, d);
    }
  }
  return minKm;
}

function dollarToPriceLevel(dollar: number): number {
  if (dollar <= 10) return 0;
  if (dollar <= 25) return 1;
  if (dollar <= 50) return 1;
  if (dollar <= 100) return 2;
  if (dollar <= 200) return 3;
  return 4;
}

async function googlePlacesSearch(
  lat: number,
  lon: number,
  placeType: string,
  apiKey: string,
  queryOverride?: string,
  minPrice?: number,
  maxPrice?: number
): Promise<GooglePlaceResult[]> {
  const query = queryOverride ?? placeType;
  const params = new URLSearchParams({
    query,
    location: `${lat},${lon}`,
    radius: "8000",
    type: placeType,
    key: apiKey,
  });
  const res = await fetch(
    `https://maps.googleapis.com/maps/api/place/textsearch/json?${params}`,
    { next: { revalidate: 0 } }
  );
  if (!res.ok) return [];
  const data = await res.json();
  if (data.status !== "OK" && data.status !== "ZERO_RESULTS") return [];
  let results = (data.results ?? []).filter(
    (p: GooglePlaceResult) =>
      p.place_id && p.name && (p.rating ?? 0) >= 3.5 && (p.user_ratings_total ?? 0) >= 20
  );
  if (minPrice != null && minPrice >= 0 && maxPrice != null && maxPrice >= 0) {
    results = results.filter((p: GooglePlaceResult) => {
      const pl = p.price_level;
      if (pl == null) return true;
      return pl >= minPrice! && pl <= maxPrice!;
    });
  }
  return results;
}

function scorePlace(rating: number, userRatingsTotal: number): number {
  return rating * Math.log10(userRatingsTotal + 1);
}

export async function POST(request: NextRequest) {
  let body: {
    start: string;
    end: string;
    numPlaces: number;
    categories: string[];
    coordinates: [number, number][];
    maxDeviationMinutes?: number;
    subcategories?: Record<string, string[]>;
    budgetByCategory?: Record<string, { min: number; max: number }>;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { start, end, numPlaces = 5, categories = CATEGORIES, coordinates, maxDeviationMinutes = 30, subcategories = {}, budgetByCategory = {} } = body;
  // Max one-way distance so round-trip detour ≈ maxDeviationMinutes at 50 km/h
  const maxDevKm = ((maxDeviationMinutes / 60) * 50) / 2;
  if (!start?.trim() || !end?.trim() || !Array.isArray(coordinates) || coordinates.length < 2) {
    return NextResponse.json({ error: "Missing start, end, or route coordinates" }, { status: 400 });
  }

  const selectedCats = Array.isArray(categories) && categories.length > 0 ? categories : CATEGORIES;
  const targetCount = Math.min(Math.max(numPlaces, 3), 12);

  const googleKey = process.env.GOOGLE_PLACES_API_KEY ?? process.env.GOOGLE_MAPS_API_KEY;
  if (googleKey?.trim()) {
    try {
      const points = sampleRouteCoords(coordinates, 4);
      const seen = new Map<string, { place: GooglePlaceResult; category: string; score: number }>();

      const typeToQuery: Record<string, string> = {
        restaurant: "restaurant",
        tourist_attraction: "attraction",
        amusement_park: "activities",
        park: "park",
        museum: "museum",
      };
      const searchTerms: { cat: string; query: string; type: string }[] = [];
      for (const cat of selectedCats) {
        const type = CATEGORY_TO_PLACE_TYPE[cat] ?? "establishment";
        const subs = (subcategories as Record<string, string[]>)[cat] ?? [];
        if (subs.length > 0) {
          for (const sub of subs) {
            searchTerms.push({ cat, query: `${sub} ${typeToQuery[type] ?? type}`, type });
          }
        } else {
          searchTerms.push({ cat, query: typeToQuery[type] ?? type, type });
        }
      }
      const budget = budgetByCategory as Record<string, { min: number; max: number }>;
      for (const [lat, lon] of points) {
        for (const { cat, query, type } of searchTerms) {
          const b = budget[cat];
          const minPrice = b ? dollarToPriceLevel(b.min) : undefined;
          const maxPrice = b ? dollarToPriceLevel(b.max) : undefined;
          const results = await googlePlacesSearch(lat, lon, type, googleKey.trim(), query, minPrice, maxPrice);
          for (const p of results) {
            const rating = p.rating ?? 0;
            const total = p.user_ratings_total ?? 0;
            const s = scorePlace(rating, total);
            const existing = seen.get(p.place_id);
            if (!existing || existing.score < s) {
              seen.set(p.place_id, { place: p, category: cat, score: s });
            }
          }
        }
      }

      let filtered = [...seen.values()]
        .filter(({ place }) => {
          const loc = place.geometry?.location;
          if (!loc) return true;
          const dist = distanceToRouteKm(loc.lat, loc.lng, coordinates);
          return dist <= maxDevKm;
        })
        .sort((a, b) => b.score - a.score)
        .slice(0, targetCount);

      const suggestions: SuggestionOut[] = filtered.map(({ place, category }) => {
        const addr = place.formatted_address ?? "";
        const city = addr.split(",").slice(-3, -1).join(",").trim() || addr;
        const desc =
          place.rating && place.user_ratings_total
            ? `${place.rating.toFixed(1)} ★ · ${place.user_ratings_total.toLocaleString()} Google reviews`
            : "Highly rated on Google";
        const photoRef = place.photos?.[0]?.photo_reference;
        const geo = place.geometry?.location;
        return {
          name: place.name,
          category,
          location: city || "Along your route",
          description: desc,
          rating: place.rating,
          userRatingsTotal: place.user_ratings_total,
          url: `https://www.google.com/maps/place/?q=place_id:${place.place_id}`,
          imageUrl: photoRef ? `/api/place-photo?ref=${encodeURIComponent(photoRef)}` : undefined,
          lat: geo?.lat,
          lon: geo?.lng,
        };
      });

      return NextResponse.json(suggestions);
    } catch (err) {
      console.error("Google Places suggestions error:", err);
      return NextResponse.json({ error: "Could not load places. Please try again." }, { status: 502 });
    }
  }

  const aiKey = process.env.GROQ_API_KEY ?? process.env.OPENAI_API_KEY;
  if (!aiKey?.trim()) {
    return NextResponse.json(
      { error: "Suggestions require GOOGLE_PLACES_API_KEY (or GROQ_API_KEY/OPENAI_API_KEY) in .env.local" },
      { status: 503 }
    );
  }

  const routeSample = sampleRouteCoords(coordinates, 8)
    .map(([lat, lon]) => `${lat.toFixed(4)},${lon.toFixed(4)}`)
    .join(" | ");

  const systemPrompt = `You are a travel advisor. Given a road trip route, suggest interesting places to stop along the way. Return ONLY valid JSON, no other text.`;
  const subcatHint =
    Object.keys(subcategories).length > 0
      ? "\nPreferred types within each category (prioritize these when possible): " +
        Object.entries(subcategories)
          .filter(([, subs]) => subs.length > 0)
          .map(([cat, subs]) => `${cat}: ${subs.join(", ")}`)
          .join("; ")
      : "";

  const budgetHint =
    Object.keys(budgetByCategory).length > 0
      ? "\nBudget per stop (typical cost for one person): " +
        Object.entries(budgetByCategory)
          .filter(([, b]) => b && typeof b.min === "number" && typeof b.max === "number")
          .map(([cat, b]) => {
            const minStr = b.min === 0 ? "$0" : `$${b.min}`;
            const maxStr = b.max >= 500 ? "$500+" : `$${b.max}`;
            return `${cat}: ${minStr}–${maxStr}`;
          })
          .join("; ")
      : "";

  const userPrompt = `Route: ${start} → ${end}

Midpoints along the route (lat,lon): ${routeSample}

The user is willing to go up to ${maxDeviationMinutes} minutes off the main route. Suggest only places that are a reasonable detour.${budgetHint}

Suggest ${targetCount + 3} places to visit along this route (we filter by distance). Mix of categories: ${selectedCats.join(", ")}.${subcatHint}

For each suggestion include:
- name: string (place/attraction/restaurant name)
- category: string (one of: ${selectedCats.join(", ")})
- location: string (city/region, e.g. "Washington, DC" or "Virginia")
- description: string (1-2 sentences why it's worth a stop)

Return a JSON array like:
[{"name":"...","category":"...","location":"...","description":"..."}]`;

  const baseUrl = process.env.GROQ_API_KEY
    ? "https://api.groq.com/openai/v1"
    : (process.env.OPENAI_BASE_URL ?? "https://api.openai.com/v1");
  const model = process.env.GROQ_API_KEY ? "llama-3.3-70b-versatile" : "gpt-4o-mini";

  try {
    const res = await fetch(`${baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${aiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        response_format: { type: "json_object" },
        temperature: 0.7,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error("AI API error:", res.status, err);
      return NextResponse.json({ error: "AI service error. Check your API key." }, { status: 502 });
    }

    const data = await res.json();
    const content = data?.choices?.[0]?.message?.content;
    if (!content) {
      return NextResponse.json({ error: "No AI response" }, { status: 502 });
    }

    const parsed = JSON.parse(content);
    let rawSuggestions = Array.isArray(parsed) ? parsed : (parsed.suggestions ?? parsed.places ?? []);
    if (!Array.isArray(rawSuggestions) && typeof parsed === "object") {
      const arr = Object.values(parsed).find((v) => Array.isArray(v));
      if (arr) rawSuggestions = arr;
    }
    const aiSuggestions = Array.isArray(rawSuggestions) ? rawSuggestions : [];

    // Geocode AI suggestions in parallel (Photon/ORS fast, Nominatim fallback slow)
    const googleKey = process.env.GOOGLE_PLACES_API_KEY ?? process.env.GOOGLE_MAPS_API_KEY;
    const orsKey = process.env.OPENROUTESERVICE_API_KEY?.trim();

    async function geocodePhoton(query: string): Promise<[number, number] | null> {
      try {
        const res = await fetch(
          `https://photon.komoot.io/api/?q=${encodeURIComponent(query)}&limit=1`,
          { headers: { "Accept": "application/json" } }
        );
        const data = await res.json();
        const feat = data?.features?.[0];
        const coords = feat?.geometry?.coordinates;
        if (Array.isArray(coords) && coords.length >= 2) {
          return [coords[1], coords[0]]; // photon returns [lon,lat]
        }
      } catch {
        /* ignore */
      }
      return null;
    }

    async function geocodeORS(query: string): Promise<[number, number] | null> {
      if (!orsKey) return null;
      try {
        const res = await fetch(
          `https://api.openrouteservice.org/geocode/search?api_key=${orsKey}&text=${encodeURIComponent(query)}`,
          { next: { revalidate: 0 } }
        );
        const data = await res.json();
        const feat = data?.features?.[0];
        const coords = feat?.geometry?.coordinates;
        if (Array.isArray(coords) && coords.length >= 2) {
          return [coords[1], coords[0]]; // GeoJSON is [lon,lat]
        }
      } catch {
        /* ignore */
      }
      return null;
    }

    async function geocodeNominatim(query: string): Promise<[number, number] | null> {
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`,
          { headers: { "User-Agent": "StillRioRoutePlanner/1.0" } }
        );
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          return [parseFloat(data[0].lat), parseFloat(data[0].lon)];
        }
      } catch {
        /* ignore */
      }
      return null;
    }

    async function geocodePlaceFast(query: string): Promise<[number, number] | null> {
      if (orsKey) {
        const ors = await geocodeORS(query);
        if (ors) return ors;
      }
      return geocodePhoton(query);
    }

    async function findPlacePhoto(lat: number, lon: number, name: string, apiKey: string): Promise<string | null> {
      try {
        const params = new URLSearchParams({
          query: name,
          location: `${lat},${lon}`,
          radius: "5000",
          key: apiKey,
        });
        const res = await fetch(
          `https://maps.googleapis.com/maps/api/place/textsearch/json?${params}`,
          { next: { revalidate: 0 } }
        );
        const data = await res.json();
        const ref = data?.results?.[0]?.photos?.[0]?.photo_reference;
        return ref ? `/api/place-photo?ref=${encodeURIComponent(ref)}` : null;
      } catch {
        return null;
      }
    }

    // Geocode all in parallel (Photon/ORS are fast; Nominatim fallback sequential)
    const toGeocode = aiSuggestions
      .filter((s) => s?.name)
      .slice(0, targetCount + 5)
      .map((s) => ({ name: s?.name ?? "", location: s?.location ?? "", category: s?.category ?? "Unknown", description: s?.description ?? "", query: (s?.location ? `${s.name}, ${s.location}` : s.name) ?? "" }));

    let geocodeResults = await Promise.all(
      toGeocode.map(async (item) => {
        const coords = await geocodePlaceFast(item.query);
        return { ...item, coords };
      })
    );

    // Fallback: Nominatim for failures (1 req/sec)
    for (let i = 0; i < geocodeResults.length; i++) {
      const r = geocodeResults[i];
      if (r.coords == null) {
        await new Promise((res) => setTimeout(res, 1100));
        const c = await geocodeNominatim(r.query);
        geocodeResults[i] = { ...r, coords: c };
      }
    }

    const withCoords = geocodeResults
      .filter((r): r is typeof r & { coords: [number, number] } => r.coords != null)
      .filter((r) => distanceToRouteKm(r.coords[0], r.coords[1], coordinates) <= maxDevKm)
      .slice(0, targetCount);

    // Fetch photos in parallel for final list
    const withPhotos = googleKey?.trim()
      ? await Promise.all(
          withCoords.map(async (r) => {
            const imageUrl = await findPlacePhoto(r.coords[0], r.coords[1], r.name, googleKey);
            return { ...r, imageUrl };
          })
        )
      : withCoords.map((r) => ({ ...r, imageUrl: null }));

    const enriched: SuggestionOut[] = withPhotos.map((r) => ({
      name: r.name,
      category: r.category,
      location: r.location || "Along your route",
      description: r.description ?? "",
      url: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(r.query)}`,
      imageUrl: r.imageUrl ?? undefined,
      lat: r.coords[0],
      lon: r.coords[1],
    }));

    return NextResponse.json(enriched);
  } catch (err) {
    console.error("Suggestions error:", err);
    return NextResponse.json({ error: "Failed to get suggestions" }, { status: 500 });
  }
}
