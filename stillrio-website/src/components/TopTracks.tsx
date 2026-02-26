"use client";

import { useState, useEffect } from "react";

interface Track {
  id: string;
  name: string;
  artist: string;
  album: string | null;
  imageUrl: string | null;
  url: string | null;
}

const RANGES = [
  { value: "short_term", label: "last 4 weeks" },
  { value: "medium_term", label: "last 6 months" },
  { value: "long_term", label: "last 12 months" },
] as const;

export default function TopTracks() {
  const [range, setRange] = useState<(typeof RANGES)[number]["value"]>("short_term");
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError(null);

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);

    fetch(`/api/spotify-top-tracks?range=${range}&limit=8`, { signal: controller.signal })
      .then((res) => {
        if (!mounted) return res;
        if (res.status === 503) {
          return res.json().then((b) => {
            if (mounted) {
              setError(b?.error ?? "Spotify not configured");
              setTracks([]);
            }
            return null;
          });
        }
        return res.json().then((data) => {
          if (mounted) {
            setTracks(data?.tracks ?? []);
            setError(null);
          }
          return null;
        });
      })
      .catch((err) => {
        if (mounted) {
          setError(
            err?.name === "AbortError"
              ? "Request timed out. Check your connection."
              : "Could not fetch listening data"
          );
          setTracks([]);
        }
      })
      .finally(() => {
        clearTimeout(timeout);
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
      clearTimeout(timeout);
      controller.abort();
    };
  }, [range]);

  if (loading && tracks.length === 0) {
    return (
      <section id="top-tracks" className="border-t border-slate-200/80 bg-slate-50 px-6 py-12">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-2xl font-bold text-slate-800">
            Top Tracks / Things to listen when Adventuring
          </h2>
          <div className="mt-4 flex gap-6 border-b border-slate-200">
            {RANGES.map((r) => (
              <button key={r.value} disabled className="border-b-2 border-transparent pb-3 text-sm capitalize text-slate-400">
                {r.label}
              </button>
            ))}
          </div>
          <div className="mt-4 space-y-2">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="flex items-center gap-3 py-2">
                <span className="w-8 text-slate-400">• {i + 1}</span>
                <div className="h-10 w-10 flex-shrink-0 animate-pulse rounded bg-slate-200" />
                <div className="min-w-0 flex-1">
                  <div className="h-4 w-32 animate-pulse rounded bg-slate-200" />
                  <div className="mt-1 h-3 w-20 animate-pulse rounded bg-slate-200" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="top-tracks" className="border-t border-slate-200/80 bg-slate-50 px-6 py-12">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-2xl font-bold text-slate-800">Top Tracks / Things to listen when Adventuring</h2>
          <p className="mt-4 text-sm text-slate-500">{error}</p>
          <p className="mt-2 text-xs text-slate-400">
            If you see &quot;Need user-top-read scope&quot;, visit{" "}
            <a href="/api/spotify-auth" className="text-slate-600 underline hover:text-slate-800">
              /api/spotify-auth
            </a>{" "}
            to re-authorize.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section id="top-tracks" className="border-t border-slate-200/80 bg-slate-50 px-6 py-12">
      <div className="mx-auto max-w-3xl">
        <h2 className="text-2xl font-bold text-slate-800">
          Top Tracks / Things to listen when Adventuring
        </h2>
        <div className="mt-4 flex gap-6 border-b border-slate-200">
          {RANGES.map((r) => (
            <button
              key={r.value}
              onClick={() => setRange(r.value)}
              className={`border-b-2 pb-3 text-sm capitalize transition-colors ${
                range === r.value
                  ? "border-slate-800 font-medium text-slate-800"
                  : "border-transparent text-slate-500 hover:text-slate-700"
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
        {tracks.length === 0 ? (
          <p className="mt-8 text-slate-500">No listening data for this period yet.</p>
        ) : (
          <ul className="mt-2 divide-y divide-slate-200/80">
            {tracks.map((t, i) => (
              <li key={t.id}>
                <a
                  href={t.url ?? "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center gap-3 py-3 transition-colors hover:bg-slate-100/50 ${
                    !t.url ? "pointer-events-none cursor-default opacity-60" : ""
                  }`}
                >
                  <span className="w-8 flex-shrink-0 text-sm text-slate-500">• {i + 1}</span>
                  {t.imageUrl ? (
                    <img
                      src={t.imageUrl}
                      alt={t.album ?? t.name}
                      className="h-10 w-10 flex-shrink-0 rounded object-cover"
                    />
                  ) : (
                    <div className="h-10 w-10 flex-shrink-0 rounded bg-slate-200" />
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-slate-800">{t.name}</p>
                    <p className="truncate text-sm text-slate-600">{t.artist}</p>
                  </div>
                  {t.url && (
                    <svg
                      className="h-5 w-5 flex-shrink-0 text-[#1DB954]"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      aria-hidden
                    >
                      <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.121-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18 12.42c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
                    </svg>
                  )}
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
