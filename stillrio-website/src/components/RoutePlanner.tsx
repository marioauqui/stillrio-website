"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";
import AddressAutocomplete from "./AddressAutocomplete";
import ClawMarks from "./ClawMarks";

const MapWithRoute = dynamic(() => import("./MapWithRoute"), { ssr: false });

type TravelMode = "drive";

const MODE_MAP: Record<TravelMode, string> = {
  drive: "driving",
};

interface WeatherData {
  temp: number;
  code: number;
  description: string;
  windSpeed: number;
  precipitation: number;
}

interface Suggestion {
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

interface RouteOption {
  distance: string;
  distanceKm: number;
  duration: string;
  durationMin: number;
  coordinates: [number, number][];
}

interface RouteResult {
  routes: RouteOption[];
  departureDisplay: string;
  weatherA: WeatherData | null;
  weatherB: WeatherData | null;
}

const SUGGESTION_CATEGORIES = ["Activities", "Food", "Sights", "Nature", "Cultural"];

const BUDGET_OPTIONS = [0, 10, 25, 50, 100, 200, 500] as const;
const BUDGET_LABELS = ["$0", "$10", "$25", "$50", "$100", "$200", "$500+"];

function BudgetRangeSlider({
  minVal,
  maxVal,
  onChange,
}: {
  minVal: number;
  maxVal: number;
  onChange: (min: number, max: number) => void;
}) {
  const minIdx = BUDGET_OPTIONS.indexOf(minVal as (typeof BUDGET_OPTIONS)[number]);
  const maxIdx = BUDGET_OPTIONS.indexOf(maxVal as (typeof BUDGET_OPTIONS)[number]);
  const safeMin = minIdx >= 0 ? minIdx : 0;
  const safeMax = maxIdx >= 0 ? maxIdx : BUDGET_OPTIONS.length - 1;
  const n = BUDGET_OPTIONS.length - 1;
  const trackRef = useRef<HTMLDivElement>(null);
  const draggingRef = useRef<"min" | "max" | null>(null);

  const pxToIdx = useCallback((clientX: number): number => {
    const track = trackRef.current;
    if (!track) return 0;
    const rect = track.getBoundingClientRect();
    const padding = 8;
    const trackLeft = rect.left + padding;
    const trackWidth = rect.width - padding * 2;
    if (trackWidth <= 0) return 0;
    const pct = Math.max(0, Math.min(1, (clientX - trackLeft) / trackWidth));
    return Math.round(pct * n);
  }, [n]);

  const handlePointerDown = useCallback(
    (which: "min" | "max") => (e: React.PointerEvent) => {
      e.preventDefault();
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
      draggingRef.current = which;
    },
    []
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (draggingRef.current === null) return;
      const idx = pxToIdx(e.clientX);
      if (draggingRef.current === "min") {
        const newMin = Math.min(idx, safeMax);
        onChange(BUDGET_OPTIONS[newMin], BUDGET_OPTIONS[safeMax]);
      } else {
        const newMax = Math.max(idx, safeMin);
        onChange(BUDGET_OPTIONS[safeMin], BUDGET_OPTIONS[newMax]);
      }
    },
    [safeMin, safeMax, pxToIdx, onChange]
  );

  const handlePointerUp = useCallback(() => {
    draggingRef.current = null;
  }, []);

  const minPct = (safeMin / n) * 100;
  const maxPct = (safeMax / n) * 100;

  return (
    <div className="w-full">
      <div
        ref={trackRef}
        className="relative h-8 px-1 select-none touch-none"
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
      >
        <div className="absolute top-1/2 left-2 right-2 h-1.5 -translate-y-1/2 overflow-hidden rounded-full bg-slate-200">
          <div
            className="absolute top-0 bottom-0 rounded-full bg-slate-600"
            style={{
              left: `${minPct}%`,
              width: `${maxPct - minPct}%`,
            }}
          />
        </div>
        <div
          role="slider"
          aria-valuemin={0}
          aria-valuemax={n}
          aria-valuenow={safeMin}
          tabIndex={0}
          onPointerDown={handlePointerDown("min")}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onKeyDown={(e) => {
            if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
              e.preventDefault();
              const newMin = Math.max(0, safeMin - 1);
              onChange(BUDGET_OPTIONS[newMin], BUDGET_OPTIONS[safeMax]);
            } else if (e.key === "ArrowRight" || e.key === "ArrowUp") {
              e.preventDefault();
              const newMin = Math.min(safeMax, safeMin + 1);
              onChange(BUDGET_OPTIONS[newMin], BUDGET_OPTIONS[safeMax]);
            }
          }}
          className="absolute top-1/2 z-10 h-4 w-4 -translate-x-1/2 -translate-y-1/2 cursor-grab rounded-full border-2 border-white bg-slate-800 shadow-md active:cursor-grabbing focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2"
          style={{ left: `calc(8px + (100% - 16px) * ${minPct} / 100)` }}
        />
        <div
          role="slider"
          aria-valuemin={0}
          aria-valuemax={n}
          aria-valuenow={safeMax}
          tabIndex={0}
          onPointerDown={handlePointerDown("max")}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onKeyDown={(e) => {
            if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
              e.preventDefault();
              const newMax = Math.max(safeMin, safeMax - 1);
              onChange(BUDGET_OPTIONS[safeMin], BUDGET_OPTIONS[newMax]);
            } else if (e.key === "ArrowRight" || e.key === "ArrowUp") {
              e.preventDefault();
              const newMax = Math.min(n, safeMax + 1);
              onChange(BUDGET_OPTIONS[safeMin], BUDGET_OPTIONS[newMax]);
            }
          }}
          className="absolute top-1/2 z-10 h-4 w-4 -translate-x-1/2 -translate-y-1/2 cursor-grab rounded-full border-2 border-white bg-slate-800 shadow-md active:cursor-grabbing focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2"
          style={{ left: `calc(8px + (100% - 16px) * ${maxPct} / 100)` }}
        />
      </div>
      <div className="mt-1 flex justify-between text-xs text-slate-500">
        <span>{BUDGET_LABELS[safeMin]}</span>
        <span>{BUDGET_LABELS[safeMax]}</span>
      </div>
    </div>
  );
}

const SUBCATEGORIES: Record<string, string[]> = {
  Food: [
    "American", "Italian", "Mexican", "Asian", "BBQ", "Seafood", "Cafe", "Bakery",
    "Pizza", "Sushi", "Burger", "Wings", "Calamari", "Tacos", "Ramen", "Pho",
    "Vegetarian", "Indian", "Thai", "Chinese", "French", "Steakhouse",
    "Breakfast", "Food truck", "Fine dining", "Fast food",
  ],
  Sights: [
    "Museums", "Landmarks", "Viewpoints", "Historic sites", "Art galleries",
    "Monuments", "Scenic drives", "Architecture", "Churches", "Parks",
  ],
  Nature: [
    "Parks", "Beaches", "Hiking trails", "Waterfalls", "Wildlife", "Gardens",
    "Lakes", "Mountains", "Forests", "Canyons", "Caves",
  ],
  Cultural: [
    "Museums", "Art galleries", "Theaters", "Historic sites", "Cultural centers",
    "Music venues", "Festivals", "Markets", "Craft markets",
  ],
  Activities: [
    "Adventure", "Sports", "Shopping", "Entertainment", "Wineries", "Breweries",
    "Golf", "Skiing", "Water sports", "Tours", "Zoos", "Aquariums",
  ],
};

// WMO weather code → human-readable (common codes)
const WEATHER_DESC: Record<number, string> = {
  0: "Clear",
  1: "Mainly clear",
  2: "Partly cloudy",
  3: "Overcast",
  45: "Foggy",
  48: "Foggy",
  51: "Drizzle",
  53: "Drizzle",
  55: "Drizzle",
  61: "Rain",
  63: "Rain",
  65: "Heavy rain",
  71: "Snow",
  73: "Snow",
  75: "Heavy snow",
  80: "Rain showers",
  81: "Rain showers",
  82: "Heavy showers",
  95: "Thunderstorm",
  96: "Thunderstorm",
  99: "Thunderstorm",
};

function getWeatherDesc(code: number): string {
  return WEATHER_DESC[code] ?? "Unknown";
}

async function fetchWeather(lat: number, lon: number): Promise<WeatherData | null> {
  try {
    const res = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code,precipitation,wind_speed_10m&temperature_unit=fahrenheit&wind_speed_unit=mph&precipitation_unit=inch&timezone=auto`
    );
    const data = await res.json();
    const cur = data?.current;
    if (!cur) return null;
    return {
      temp: Math.round(cur.temperature_2m),
      code: cur.weather_code,
      description: getWeatherDesc(cur.weather_code),
      windSpeed: Math.round(cur.wind_speed_10m ?? 0),
      precipitation: cur.precipitation ?? 0,
    };
  } catch {
    return null;
  }
}

function getDefaultDate(): string {
  const d = new Date();
  return d.toISOString().slice(0, 10);
}

function getDefaultTime(): string {
  const d = new Date();
  const h = d.getHours().toString().padStart(2, "0");
  const m = d.getMinutes().toString().padStart(2, "0");
  return `${h}:${m}`;
}

function formatDistance(km: number): string {
  const miles = km * 0.621371;
  return `${miles.toFixed(1)} mi`;
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

const DETOUR_SPEED_KMH: Record<TravelMode, number> = {
  drive: 50,
};

function estimateDetourMinutes(distanceKm: number, mode: TravelMode): number {
  const speed = DETOUR_SPEED_KMH[mode];
  const roundTripKm = distanceKm * 2;
  return Math.round((roundTripKm / speed) * 60);
}

function formatDetourRange(minutes: number): string {
  if (minutes <= 3) return "~5 min";
  const low = Math.max(5, Math.floor(minutes / 5) * 5);
  const high = Math.ceil(minutes / 5) * 5 + 5;
  return low >= high ? `~${low} min` : `${low}-${high} min`;
}

function formatDuration(totalMinutes: number): string {
  const days = Math.floor(totalMinutes / 1440);
  const remaining = totalMinutes % 1440;
  const hours = Math.floor(remaining / 60);
  const mins = Math.round(remaining % 60);
  const parts: string[] = [];
  if (days > 0) parts.push(`${days} d`);
  if (hours > 0) parts.push(`${hours} h`);
  if (mins > 0 || parts.length === 0) parts.push(`${mins} min`);
  return parts.join(" ");
}

function formatDurationRange(totalMinutes: number): string {
  const variance = 0.12;
  const low = Math.max(0, totalMinutes * (1 - variance));
  const high = totalMinutes * (1 + variance);
  const lowStr = formatDuration(Math.floor(low));
  const highStr = formatDuration(Math.ceil(high));
  return lowStr === highStr ? lowStr : `${lowStr}–${highStr}`;
}

export default function RoutePlanner() {
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [mode, setMode] = useState<TravelMode>("drive");
  const [departureDate, setDepartureDate] = useState(() => getDefaultDate());
  const [departureTime, setDepartureTime] = useState(() => getDefaultTime());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<RouteResult | null>(null);
  const [selectedRouteIndex, setSelectedRouteIndex] = useState(0);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [suggestionsLoading, setSuggestionsLoading] = useState(false);
  const [suggestionsError, setSuggestionsError] = useState<string | null>(null);
  const [suggestionsNeedsSetup, setSuggestionsNeedsSetup] = useState(false);
  const [numPlaces, setNumPlaces] = useState(5);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedSubcategories, setSelectedSubcategories] = useState<Record<string, string[]>>({});
  const [subcategorySearch, setSubcategorySearch] = useState<Record<string, string>>({});
  const [customSubcategoryInput, setCustomSubcategoryInput] = useState<Record<string, string>>({});
  const [budgetByCategory, setBudgetByCategory] = useState<Record<string, { min: number; max: number }>>({});
  const [maxDeviationMinutes, setMaxDeviationMinutes] = useState(30);

  const FOOD_QUICK_PICKS = ["Pizza", "Burger", "Wings", "Sushi", "Tacos", "BBQ", "Seafood", "Ramen"];
  const [suggestionsProgress, setSuggestionsProgress] = useState(0);
  const [suggestionsStage, setSuggestionsStage] = useState("");
  const suggestionsStartRef = useRef<number | null>(null);

  // Progress indicator: estimated ~20–30s total, stages every ~6s
  const STAGES = [
    { at: 0, msg: "Asking AI for ideas…" },
    { at: 6, msg: "Finding locations…" },
    { at: 12, msg: "Checking distances…" },
    { at: 18, msg: "Almost there…" },
  ];
  const ESTIMATED_MS = 25000;

  useEffect(() => {
    if (!suggestionsLoading) {
      suggestionsStartRef.current = null;
      setSuggestionsProgress(0);
      setSuggestionsStage("");
      return;
    }
    suggestionsStartRef.current = Date.now();
    setSuggestionsProgress(0);
    setSuggestionsStage(STAGES[0].msg);

    const iv = setInterval(() => {
      const start = suggestionsStartRef.current;
      if (start == null) return;
      const elapsed = (Date.now() - start) / 1000;
      const pct = Math.min(95, (elapsed / (ESTIMATED_MS / 1000)) * 100);
      setSuggestionsProgress(pct);
      const stage = [...STAGES].reverse().find((s) => elapsed >= s.at);
      if (stage) setSuggestionsStage(stage.msg);
    }, 400);

    return () => clearInterval(iv);
  }, [suggestionsLoading]);

  async function fetchWithTimeout(
    url: string,
    ms = 15000,
    opts?: RequestInit
  ): Promise<Response> {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), ms);
    try {
      const res = await fetch(url, { ...opts, signal: ctrl.signal });
      return res;
    } finally {
      clearTimeout(t);
    }
  }

  async function geocode(address: string): Promise<[number, number] | null> {
    try {
      const res = await fetchWithTimeout(`/api/geocode?q=${encodeURIComponent(address)}`);
      if (!res.ok) return null;
    const data = await res.json();
      return Array.isArray(data) && data.length === 2
        ? ([Number(data[0]), Number(data[1])] as [number, number])
        : null;
    } catch {
      return null;
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setResult(null);
    setSuggestions([]);
    setSuggestionsError(null);
    setSuggestionsNeedsSetup(false);
    if (!start.trim() || !end.trim()) {
      setError("Please enter both start and end locations.");
      return;
    }
    setLoading(true);
    try {
      const [startCoords, endCoords] = await Promise.all([geocode(start), geocode(end)]);
      if (!startCoords || !endCoords) {
        setError("Could not find one or both locations. Try being more specific.");
        setLoading(false);
        return;
      }
      const osmProfile = MODE_MAP[mode];
      const coords = `${startCoords[0]},${startCoords[1]};${endCoords[0]},${endCoords[1]}`;
      const [startLon, startLat] = startCoords;
      const [endLon, endLat] = endCoords;
      const straightLineKm = haversineKm(startLat, startLon, endLat, endLon);

      const res = await fetchWithTimeout(
        `/api/osrm?coords=${encodeURIComponent(coords)}&profile=${encodeURIComponent(osmProfile)}`
      );
      if (!res.ok) {
        let msg = "Could not find a route. Try different locations or mode.";
        if (res.status === 503) {
          try {
            const body = await res.json();
            if (body?.error) msg = body.error;
          } catch {
            msg = "Routing service unavailable. Try again in a moment, or add OPENROUTESERVICE_API_KEY (see .env.example) for a reliable fallback.";
          }
        }
        if (straightLineKm > 1500) {
          msg = "This route crosses an ocean—doesn't work unless you have a plane or a flying car!";
        }
        setError(msg);
        setLoading(false);
        return;
      }
      const data = await res.json();
      if (data.code !== "Ok") {
        const msg =
          straightLineKm > 1500
            ? "This route crosses an ocean—doesn't work unless you have a plane or a flying car!"
            : "Could not find a route. Try different locations or mode.";
        setError(msg);
        setLoading(false);
        return;
      }
      type RawRoute = { distance: number; duration: number; geometry: { coordinates: number[][] } };
      const rawRoutes: (RawRoute | undefined)[] = Array.isArray(data.routes)
        ? data.routes
        : data.routes?.[0]
          ? [data.routes[0]]
          : [];
      const routes: RouteOption[] = rawRoutes
        .slice(0, 3)
        .filter((r): r is RawRoute => !!r?.geometry?.coordinates?.length)
        .map((route: { distance: number; duration: number; geometry: { coordinates: number[][] } }) => {
          const coords = route.geometry.coordinates.map((c: number[]) => [c[1], c[0]] as [number, number]);
          const distKm = route.distance / 1000;
          const durMin = Math.round(route.duration / 60);
          return {
            distance: formatDistance(distKm),
            distanceKm: distKm,
            duration: formatDurationRange(durMin),
            durationMin: durMin,
            coordinates: coords,
          };
        });

      if (routes.length === 0) {
        setError("Could not find a route. Try different locations or mode.");
        setLoading(false);
        return;
      }

      // Fetch weather at both points (Open-Meteo API)
      const [latA, lonA] = [startCoords[1], startCoords[0]];
      const [latB, lonB] = [endCoords[1], endCoords[0]];
      const [weatherA, weatherB] = await Promise.all([
        fetchWeather(latA, lonA),
        fetchWeather(latB, lonB),
      ]);

      const dep = new Date(`${departureDate}T${departureTime}`);
      const departureDisplay = Number.isNaN(dep.getTime())
        ? "Not set"
        : dep.toLocaleString(undefined, {
            weekday: "short",
            month: "short",
            day: "numeric",
            hour: "numeric",
            minute: "2-digit",
          });

      setResult({ routes, departureDisplay, weatherA, weatherB });
      setSelectedRouteIndex(0);
    } catch (err) {
      const msg =
        err instanceof Error && err.name === "AbortError"
          ? "Request timed out. The routing service may be busy—try again in a moment, or add a free OpenRouteService API key (see .env.example) for reliable routing."
          : "Something went wrong. Please try again.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  async function fetchSuggestions() {
    if (!result) return;
    setSuggestionsLoading(true);
    setSuggestionsError(null);
    setSuggestionsNeedsSetup(false);
    try {
      const res = await fetchWithTimeout("/api/suggestions", 120000, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          start,
          end,
          numPlaces,
          categories: selectedCategories,
          coordinates: result.routes[selectedRouteIndex]?.coordinates ?? result.routes[0].coordinates,
          maxDeviationMinutes,
          subcategories: selectedSubcategories,
          budgetByCategory,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        const msg = data?.error ?? "Failed to get suggestions";
        if (res.status === 503 && msg.includes("GROQ_API_KEY")) {
          setSuggestionsNeedsSetup(true);
          return;
        }
        setSuggestionsError(msg);
        return;
      }
      const data = await res.json();
      setSuggestions(Array.isArray(data) ? data : []);
      setSuggestionsProgress(100);
    } catch (err) {
      const isTimeout =
        err instanceof Error && (err.name === "AbortError" || err.message?.includes("aborted"));
      setSuggestionsError(
        isTimeout
          ? "Suggestions took too long (usually 20–30 sec). Try fewer places (e.g. 3) or click again."
          : err instanceof Error
            ? err.message
            : "Could not load suggestions."
      );
    } finally {
      setSuggestionsLoading(false);
    }
  }

  function handleSuggestionsRequest() {
    fetchSuggestions();
  }

  function toggleCategory(cat: string) {
    const willAdd = !selectedCategories.includes(cat);
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
    if (willAdd) {
      setSelectedSubcategories((p) => ({ ...p, [cat]: [] }));
      setBudgetByCategory((p) => ({ ...p, [cat]: { min: 0, max: 500 } }));
    } else {
      setSelectedSubcategories((p) => {
        const next = { ...p };
        delete next[cat];
        return next;
      });
      setBudgetByCategory((p) => {
        const next = { ...p };
        delete next[cat];
        return next;
      });
    }
  }

  function setCategoryBudget(cat: string, min: number, max: number) {
    setBudgetByCategory((p) => ({ ...p, [cat]: { min, max } }));
  }

  function toggleSubcategory(cat: string, sub: string) {
    setSelectedSubcategories((prev) => {
      const arr = prev[cat] ?? [];
      const next = arr.includes(sub) ? arr.filter((s) => s !== sub) : [...arr, sub];
      return { ...prev, [cat]: next };
    });
  }

  function addCustomSubcategory(cat: string) {
    const val = (customSubcategoryInput[cat] ?? "").trim();
    if (!val) return;
    setSelectedSubcategories((prev) => {
      const arr = prev[cat] ?? [];
      if (arr.includes(val)) return prev;
      return { ...prev, [cat]: [...arr, val] };
    });
    setCustomSubcategoryInput((prev) => ({ ...prev, [cat]: "" }));
  }

  function removeSubcategory(cat: string, sub: string) {
    setSelectedSubcategories((prev) => {
      const arr = (prev[cat] ?? []).filter((s) => s !== sub);
      return { ...prev, [cat]: arr };
    });
  }

  return (
    <section id="planner" className="bg-gradient-to-b from-slate-50 to-slate-100 px-6 py-16">
      <div className="mx-auto max-w-4xl">
        <h2 className="text-center text-3xl font-bold tracking-tight text-slate-800">
          Plan Your Road Trip
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-center text-slate-600">
          Enter your start and destination, set your departure time, and get a driving route with live weather and suggested stops along the way.
        </p>

        {/* Step-by-step instructions */}
        <div className="mt-8 rounded-2xl border border-slate-200/80 bg-white/95 p-6 shadow-sm">
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-500">How it works</h3>
          <ol className="space-y-3 text-sm text-slate-700">
            <li className="flex gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-800 text-xs font-bold text-white">1</span>
              <span><strong>Enter locations</strong> — Type your starting point (e.g. NYC) and destination (e.g. Austin, TX). Address autocomplete helps you pick the right place.</span>
            </li>
            <li className="flex gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-800 text-xs font-bold text-white">2</span>
              <span><strong>Set departure</strong> — Choose when you plan to leave. We use this to show live weather at your start and destination.</span>
            </li>
            <li className="flex gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-800 text-xs font-bold text-white">3</span>
              <span><strong>Get your route</strong> — Click &quot;Get Route&quot; to see distance, driving time, and a map with your path.</span>
            </li>
            <li className="flex gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-800 text-xs font-bold text-white">4</span>
              <span><strong>Find stops</strong> — After your route loads, check categories (Food, Sights, etc.), pick subcategories if you want (e.g. Italian, BBQ), then click &quot;Get suggestions&quot; for AI-powered places along your route. Each suggestion shows how much time it adds (+X min detour).</span>
            </li>
          </ol>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-500">Your route</h3>
            <div className="space-y-4">
              <AddressAutocomplete
              id="start"
                label="Start"
              value={start}
                onChange={setStart}
                placeholder="e.g. 350 5th Ave, NYC or a city name"
              />
              <AddressAutocomplete
                id="end"
                label="End"
                value={end}
                onChange={setEnd}
                placeholder="e.g. 123 Main St, Austin TX or a city name"
              />
            </div>
          </div>
          <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-500">Departure</h3>
            <div className="grid gap-4 sm:grid-cols-2">
          <div>
                <label htmlFor="departure-date" className="block text-sm font-medium text-slate-700">
                Departure date
            </label>
            <input
                id="departure-date"
                type="date"
                value={departureDate}
                onChange={(e) => setDepartureDate(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-300/80 bg-white/95 px-4 py-2 text-slate-900 transition-all duration-200 focus:border-slate-600 focus:outline-none focus:ring-2 focus:ring-slate-400/50 focus:ring-offset-1"
            />
          </div>
          <div>
                <label htmlFor="departure-time" className="block text-sm font-medium text-slate-700">
                Departure time
            </label>
                  <input
                id="departure-time"
                type="time"
                value={departureTime}
                onChange={(e) => setDepartureTime(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-300/80 bg-white/95 px-4 py-2 text-slate-900 transition-all duration-200 focus:border-slate-600 focus:outline-none focus:ring-2 focus:ring-slate-400/50 focus:ring-offset-1"
              />
              </div>
            </div>
          </div>
          <div className="relative">
            <span className="absolute -left-2 top-1/2 -translate-y-1/2 lg:-left-4">
              <ClawMarks variant="dark" size={28} />
            </span>
          <button
            type="submit"
            disabled={loading}
              className="w-full rounded-xl bg-slate-800 px-6 py-3 font-semibold tracking-wide text-white transition-all duration-200 hover:bg-slate-700 disabled:opacity-50 active:scale-[0.99]"
          >
            {loading ? "Finding route…" : "Get Route"}
          </button>
            <span className="absolute -right-2 top-1/2 -translate-y-1/2 lg:-right-4 -scale-x-100">
              <ClawMarks variant="dark" size={28} />
            </span>
          </div>
        </form>

        {error && (
          <p className="mt-4 rounded-lg bg-red-100 p-4 text-red-700">
            {error}
          </p>
        )}

        {result && result.routes.length > 0 && (() => {
          const currentRoute = result.routes[selectedRouteIndex] ?? result.routes[0];
          if (!currentRoute) return null;
          const baseMin = result.routes[0]?.durationMin ?? 0;
          return (
          <div className="mt-8 space-y-6">
            {result.routes.length > 1 && (
              <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">
                <span className="mb-3 block text-xs font-medium uppercase tracking-wider text-slate-500">Choose a route</span>
                <p className="mb-3 text-sm text-slate-600">Alternative paths in case one has traffic or delays.</p>
                <div className="flex flex-wrap gap-2">
                  {result.routes.map((r, i) => {
                    const extraMin = i === 0 ? 0 : r.durationMin - baseMin;
                    return (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setSelectedRouteIndex(i)}
                        className={`rounded-xl px-4 py-2.5 text-sm font-medium transition-colors ${
                          selectedRouteIndex === i
                            ? "bg-slate-800 text-white"
                            : "border border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
                        }`}
                      >
                        Route {i + 1}
                        {i === 0 ? " (fastest)" : ` (+${extraMin} min)`}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
            <div className="flex flex-wrap gap-6 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
              <div>
                <span className="text-sm text-slate-500">Distance</span>
                <p className="text-xl font-semibold text-slate-800">
                  {currentRoute.distance}
                </p>
              </div>
              <div>
                <span className="text-sm text-slate-500">Duration</span>
                <p className="text-xl font-semibold text-slate-800" title="Range accounts for typical traffic variance">
                  {currentRoute.duration}
                </p>
              </div>
              <div>
                <span className="text-sm text-slate-500">Leaving</span>
                <p className="font-medium text-slate-800">{result.departureDisplay}</p>
              </div>
              <div>
                <span className="text-sm text-slate-500">Summary</span>
                <p className="font-medium text-slate-800">
                  {currentRoute.distance}, ~{currentRoute.duration} by {mode}
                </p>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-slate-200/80 bg-white/80 p-5 shadow-sm">
                <span className="text-sm font-medium text-slate-500">Weather at start (A)</span>
                {result.weatherA ? (
                  <div className="mt-2 space-y-1">
                    <p className="text-lg font-semibold text-slate-800">
                      {result.weatherA.temp}°F · {result.weatherA.description}
                    </p>
                    <p className="text-sm text-slate-600">
                      Wind {result.weatherA.windSpeed} mph
                      {result.weatherA.precipitation > 0 && ` · ${result.weatherA.precipitation.toFixed(2)} in precip`}
                    </p>
                  </div>
                ) : (
                  <p className="mt-2 text-sm text-slate-500">Weather unavailable</p>
                )}
              </div>
              <div className="rounded-2xl border border-slate-200/80 bg-white/80 p-5 shadow-sm">
                <span className="text-sm font-medium text-slate-500">Weather at destination (B)</span>
                {result.weatherB ? (
                  <div className="mt-2 space-y-1">
                    <p className="text-lg font-semibold text-slate-800">
                      {result.weatherB.temp}°F · {result.weatherB.description}
                    </p>
                    <p className="text-sm text-slate-600">
                      Wind {result.weatherB.windSpeed} mph
                      {result.weatherB.precipitation > 0 && ` · ${result.weatherB.precipitation.toFixed(2)} in precip`}
                    </p>
                  </div>
                ) : (
                  <p className="mt-2 text-sm text-slate-500">Weather unavailable</p>
                )}
              </div>
            </div>
            <div className="overflow-hidden rounded-2xl border border-slate-200/80 shadow-sm">
              <p className="bg-slate-50 px-4 py-2 text-xs text-slate-500">Map — Use +/- to zoom. Suggested places appear as numbered markers.</p>
              <div className="h-[400px]">
                <MapWithRoute
                coordinates={currentRoute.coordinates}
                places={suggestions
                  .filter((s): s is Suggestion & { lat: number; lon: number } => s.lat != null && s.lon != null)
                  .map((s, i) => ({ name: s.name, lat: s.lat!, lon: s.lon!, category: s.category, number: i + 1 }))}
                />
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-bold text-slate-800">Suggest places along the way</h3>
              <p className="mt-1 text-sm text-slate-600">
                Choose categories (Food, Sights, etc.)—places matching <strong>any</strong> selected category will appear. Optionally narrow with subcategories (e.g. Italian, Museums), pick how far off-route you&apos;re willing to go, then click &quot;Get suggestions&quot; for AI-powered stops. Each place shows estimated detour time.
              </p>

              <div className="mt-5 flex flex-wrap items-center gap-6">
                <div>
                  <label className="block text-xs font-medium uppercase tracking-wider text-slate-500">How far off route?</label>
                  <select
                    value={maxDeviationMinutes}
                    onChange={(e) => setMaxDeviationMinutes(Number(e.target.value))}
                    className="mt-1 rounded-lg border border-slate-300/80 bg-white px-3 py-2 text-sm text-slate-800"
                  >
                    <option value={15}>15 min</option>
                    <option value={30}>30 min</option>
                    <option value={45}>45 min</option>
                    <option value={60}>1 hour</option>
                    <option value={90}>1.5 hours</option>
                    <option value={120}>2 hours</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium uppercase tracking-wider text-slate-500">How many?</label>
                  <select
                    value={numPlaces}
                    onChange={(e) => setNumPlaces(Number(e.target.value))}
                    className="mt-1 rounded-lg border border-slate-300/80 bg-white px-3 py-2 text-sm text-slate-800"
                  >
                    {[3, 5, 7, 10].map((n) => (
                      <option key={n} value={n}>{n} places</option>
                    ))}
                  </select>
                </div>
                <div className="w-full">
                  <span className="block text-xs font-medium uppercase tracking-wider text-slate-500">Categories</span>
                  <div className="mt-1.5 space-y-2">
                    {SUGGESTION_CATEGORIES.map((cat) => (
                      <div key={cat}>
                        <label className="flex cursor-pointer items-center gap-1.5">
                          <input
                            type="checkbox"
                            checked={selectedCategories.includes(cat)}
                            onChange={() => toggleCategory(cat)}
                            className="rounded border-slate-300"
                          />
                          <span className="text-sm text-slate-700">{cat}</span>
                        </label>
                        {selectedCategories.includes(cat) && SUBCATEGORIES[cat] && (
                          <div className="ml-5 mt-2 rounded-lg border border-slate-200 bg-slate-50/50 p-3">
                            <div className="mb-3">
                              <span className="mb-2 block text-xs font-medium text-slate-500">Budget (per stop)</span>
                              <BudgetRangeSlider
                                minVal={budgetByCategory[cat]?.min ?? 0}
                                maxVal={budgetByCategory[cat]?.max ?? 500}
                                onChange={(min, max) => setCategoryBudget(cat, min, max)}
                              />
                            </div>
                            {cat === "Food" && (
                              <div className="mb-3">
                                <span className="mb-1.5 block text-xs font-medium text-slate-500">Quick picks</span>
                                <div className="flex flex-wrap gap-1.5">
                                  {FOOD_QUICK_PICKS.map((pick) => (
                                    <button
                                      key={pick}
                                      type="button"
                                      onClick={() => toggleSubcategory(cat, pick)}
                                      className={`rounded-full px-2.5 py-1 text-xs font-medium transition-colors ${
                                        selectedSubcategories[cat]?.includes(pick)
                                          ? "bg-slate-800 text-white"
                                          : "bg-white border border-slate-300 text-slate-700 hover:bg-slate-100"
                                      }`}
                                    >
                                      {pick}
                                    </button>
                                  ))}
                                </div>
                              </div>
                            )}
                            <div className="mb-2 flex items-center gap-2">
                              <input
                                type="text"
                                placeholder={`Search ${cat.toLowerCase()} types (e.g. pi→Pizza, bu→Burger)...`}
                                value={subcategorySearch[cat] ?? ""}
                                onChange={(e) => setSubcategorySearch((prev) => ({ ...prev, [cat]: e.target.value }))}
                                className="flex-1 rounded-lg border border-slate-200 px-2 py-1.5 text-sm"
                              />
                              <div className="flex shrink-0 gap-1">
                                <button
                                  type="button"
                                  onClick={() =>
                                    setSelectedSubcategories((prev) => ({
                                      ...prev,
                                      [cat]: SUBCATEGORIES[cat].filter((s) =>
                                        (subcategorySearch[cat] ?? "")
                                          .toLowerCase()
                                          .split(" ")
                                          .every((q) => s.toLowerCase().includes(q))
                                      ),
                                    }))
                                  }
                                  className="rounded border border-slate-300 bg-white px-2 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50"
                                >
                                  All
                                </button>
                                <button
                                  type="button"
                                  onClick={() =>
                                    setSelectedSubcategories((prev) => ({ ...prev, [cat]: [] }))
                                  }
                                  className="rounded border border-slate-300 bg-white px-2 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50"
                                >
                                  Clear
                                </button>
                              </div>
                            </div>
                            <div className="max-h-32 overflow-auto">
                              {SUBCATEGORIES[cat]
                                .filter((s) =>
                                  (subcategorySearch[cat] ?? "")
                                    .toLowerCase()
                                    .split(" ")
                                    .every((q) => s.toLowerCase().includes(q))
                                )
                                .map((sub) => (
                                  <label key={sub} className="mb-1 flex cursor-pointer items-center gap-1.5">
                                    <input
                                      type="checkbox"
                                      checked={selectedSubcategories[cat]?.includes(sub)}
                                      onChange={() => toggleSubcategory(cat, sub)}
                                      className="rounded border-slate-300"
                                    />
                                    <span className="text-sm text-slate-600">{sub}</span>
                                  </label>
                                ))}
                            </div>
                            <div className="mt-3 flex items-center gap-2 border-t border-slate-200 pt-3">
                              <input
                                type="text"
                                placeholder="Or type custom (wings, pho, doughnuts…)"
                                value={customSubcategoryInput[cat] ?? ""}
                                onChange={(e) => setCustomSubcategoryInput((prev) => ({ ...prev, [cat]: e.target.value }))}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") {
                                    e.preventDefault();
                                    addCustomSubcategory(cat);
                                  }
                                }}
                                className="flex-1 rounded-lg border border-slate-200 px-2 py-1.5 text-sm"
                              />
                              <button
                                type="button"
                                onClick={() => addCustomSubcategory(cat)}
                                className="rounded border border-slate-300 bg-white px-2 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50"
                              >
                                Add
                              </button>
                            </div>
                            {(selectedSubcategories[cat]?.length ?? 0) > 0 && (
                              <div className="mt-2 flex flex-wrap gap-1">
                                {selectedSubcategories[cat]?.map((sub) => (
                                  <span
                                    key={sub}
                                    className="inline-flex items-center gap-1 rounded-full bg-slate-200 px-2 py-0.5 text-xs font-medium text-slate-800"
                                  >
                                    {sub}
                                    <button
                                      type="button"
                                      onClick={() => removeSubcategory(cat, sub)}
                                      className="ml-0.5 -mr-0.5 rounded-full p-0.5 hover:bg-slate-300"
                                      aria-label={`Remove ${sub}`}
                                    >
                                      ×
                                    </button>
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleSuggestionsRequest}
                  disabled={suggestionsLoading || selectedCategories.length === 0}
                  className="rounded-xl bg-slate-800 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-slate-700 disabled:opacity-50"
                >
                  {suggestionsLoading ? "Generating…" : "Get suggestions"}
                </button>
              </div>

              {suggestionsLoading && (
                <div className="mt-4 space-y-2">
                  <p className="text-sm font-medium text-slate-700">{suggestionsStage}</p>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200">
                    <div
                      className="h-full rounded-full bg-slate-700 transition-all duration-300 ease-out"
                      style={{ width: `${suggestionsProgress}%` }}
                    />
                  </div>
                  <p className="text-xs text-slate-500">
                    Usually takes 20–30 seconds. Hang tight!
                  </p>
                </div>
              )}
              {suggestionsNeedsSetup && (
                <p className="mt-4 rounded-lg bg-slate-100 border border-slate-200 p-4 text-sm text-slate-700">
                  Suggestions are temporarily unavailable.
                </p>
              )}
              {suggestionsError && (
                <p className="mt-4 rounded-lg bg-amber-50 p-3 text-sm text-amber-800">{suggestionsError}</p>
              )}

              {suggestions.length > 0 && (
                <>
                <p className="mt-6 rounded-lg bg-slate-100 border border-slate-200 px-4 py-3 text-sm text-slate-700">
                  Share your journey with <span className="font-semibold text-slate-800">#stillrio</span> and <span className="font-semibold text-slate-800">#berio</span> on social!
                </p>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  {suggestions.map((s, i) => (
                    <div
                      key={i}
                      className="relative overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-sm"
                    >
                      <div className="absolute right-3 bottom-3 z-10 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-800 text-xs font-bold text-white shadow-md">
                        {i + 1}
                      </div>
                      <a
                        href={s.url ?? `https://www.google.com/search?q=${encodeURIComponent(`${s.name} ${s.location}`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block aspect-video w-full overflow-hidden bg-gradient-to-br from-slate-200 to-slate-300"
                      >
                        {s.imageUrl ? (
                          <img
                            src={s.imageUrl}
                            alt={s.name}
                            className="h-full w-full object-cover transition-transform hover:scale-105"
                          />
                        ) : (
                          <div className="flex h-full w-full flex-col items-center justify-center gap-2 px-4 text-center text-slate-500">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <span className="text-sm font-medium">View on Google</span>
                            <span className="text-xs">Add GOOGLE_PLACES_API_KEY to .env.local for photos</span>
                          </div>
                        )}
                      </a>
                      <div className="p-4">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="font-semibold text-slate-800">{s.name}</p>
                            <p className="text-xs font-medium uppercase text-slate-500">{s.category} · {s.location}</p>
                          </div>
                          <a
                            href={s.url ?? `https://www.google.com/search?q=${encodeURIComponent(`${s.name} ${s.location}`)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="shrink-0 rounded-lg bg-slate-100 px-2 py-1.5 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-200"
                          >
                            {s.url ? "View on Google" : "Search on Google"}
                          </a>
                        </div>
                        <p className="mt-2 text-sm text-slate-600">{s.description}</p>
                        <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1">
                            {s.lat != null && s.lon != null && result && (
                            <p className="text-sm font-medium text-slate-600">
                              +{formatDetourRange(estimateDetourMinutes(distanceToRouteKm(s.lat, s.lon, currentRoute.coordinates), mode))} detour
                            </p>
                          )}
                          {s.rating != null && s.userRatingsTotal != null && (
                            <p className="flex items-center gap-1 text-sm text-amber-600">
                              <span>★</span>
                              <span className="font-medium">{s.rating.toFixed(1)}</span>
                              <span className="text-slate-500">({s.userRatingsTotal.toLocaleString()} reviews)</span>
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                    ))}
                </div>
                </>
              )}
            </div>
          </div>
        );
        })()}
      </div>
    </section>
  );
}
