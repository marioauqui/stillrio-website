"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import ClawMarks from "./ClawMarks";

const MapWithRoute = dynamic(() => import("./MapWithRoute"), { ssr: false });

type TravelMode = "walk" | "bike" | "drive";

const MODE_MAP: Record<TravelMode, string> = {
  walk: "walking",
  bike: "cycling",
  drive: "driving",
};

interface RouteResult {
  distance: string;
  duration: string;
  coordinates: [number, number][];
  summary: string;
}

export default function RoutePlanner() {
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [mode, setMode] = useState<TravelMode>("walk");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<RouteResult | null>(null);

  async function geocode(address: string): Promise<[number, number] | null> {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`
    );
    const data = await res.json();
    if (data?.length) {
      return [parseFloat(data[0].lon), parseFloat(data[0].lat)];
    }
    return null;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setResult(null);
    if (!start.trim() || !end.trim()) {
      setError("Please enter both start and end locations.");
      return;
    }
    setLoading(true);
    try {
      const startCoords = await geocode(start);
      const endCoords = await geocode(end);
      if (!startCoords || !endCoords) {
        setError("Could not find one or both locations. Try being more specific.");
        setLoading(false);
        return;
      }
      const osmProfile = MODE_MAP[mode];
      const res = await fetch(
        `https://router.project-osrm.org/route/v1/${osmProfile}/${startCoords[0]},${startCoords[1]};${endCoords[0]},${endCoords[1]}?overview=full&geometries=geojson`
      );
      const data = await res.json();
      if (data.code !== "Ok") {
        setError("Could not find a route. Try different locations or mode.");
        setLoading(false);
        return;
      }
      const route = data.routes[0];
      const coords = route.geometry.coordinates.map((c: number[]) => [c[1], c[0]] as [number, number]);
      const distKm = (route.distance / 1000).toFixed(2);
      const durMin = Math.round(route.duration / 60);
      setResult({
        distance: `${distKm} km`,
        duration: `${durMin} min`,
        coordinates: coords,
        summary: `${distKm} km, ~${durMin} min by ${mode}`,
      });
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section id="planner" className="bg-slate-100 px-6 py-20">
      <div className="mx-auto max-w-4xl">
        <h2 className="text-center text-3xl font-bold text-slate-800">
          Plan Your Adventure
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-center text-slate-600">
          Enter a start and end point, pick how you want to travel, and get a real route with map,
          distance, and time.
        </p>

        <form onSubmit={handleSubmit} className="mt-10 space-y-4">
          <div>
            <label htmlFor="start" className="block text-sm font-medium text-slate-700">
              Start
            </label>
            <input
              id="start"
              type="text"
              value={start}
              onChange={(e) => setStart(e.target.value)}
              placeholder="e.g. Central Park, NYC"
              className="mt-1 w-full rounded-xl border border-slate-300/80 bg-white/95 px-4 py-2 text-slate-900 transition-all duration-200 focus:border-slate-600 focus:outline-none focus:ring-2 focus:ring-slate-400/50 focus:ring-offset-1"
            />
          </div>
          <div>
            <label htmlFor="end" className="block text-sm font-medium text-slate-700">
              End
            </label>
            <input
              id="end"
              type="text"
              value={end}
              onChange={(e) => setEnd(e.target.value)}
              placeholder="e.g. Times Square, NYC"
              className="mt-1 w-full rounded-xl border border-slate-300/80 bg-white/95 px-4 py-2 text-slate-900 transition-all duration-200 focus:border-slate-600 focus:outline-none focus:ring-2 focus:ring-slate-400/50 focus:ring-offset-1"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">
              Travel mode
            </label>
            <div className="mt-2 flex flex-wrap gap-3">
              {(["walk", "bike", "drive"] as const).map((m) => (
                <label key={m} className="flex cursor-pointer items-center gap-2">
                  <input
                    type="radio"
                    name="mode"
                    checked={mode === m}
                    onChange={() => setMode(m)}
                    className="rounded-full"
                  />
                  <span className="capitalize text-slate-800">{m}</span>
                </label>
              ))}
            </div>
            <p className="mt-1 text-xs text-slate-500">
              Transit not available via this API; use walk, bike, or drive.
            </p>
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

        {result && (
          <div className="mt-8 space-y-4">
            <div className="flex flex-wrap gap-6 rounded-3xl bg-white/90 p-6 shadow-lg transition-shadow duration-300 hover:shadow-xl">
              <div>
                <span className="text-sm text-slate-500">Distance</span>
                <p className="text-xl font-semibold text-slate-800">
                  {result.distance}
                </p>
              </div>
              <div>
                <span className="text-sm text-slate-500">Duration</span>
                <p className="text-xl font-semibold text-slate-800">
                  {result.duration}
                </p>
              </div>
              <div>
                <span className="text-sm text-slate-500">Summary</span>
                <p className="font-medium text-slate-800">{result.summary}</p>
              </div>
            </div>
            <div className="h-[400px] overflow-hidden rounded-3xl border border-slate-200/80">
              <MapWithRoute coordinates={result.coordinates} />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
