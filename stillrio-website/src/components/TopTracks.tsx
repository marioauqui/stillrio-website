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

  const sectionClass = "px-6 py-14";
  const sectionStyle = { background: "var(--color-bg)" };
  const innerClass = "mx-auto max-w-[1040px]";

  const header = (
    <>
      <h2 className="text-2xl font-bold text-slate-900">Top Tracks for the Journey</h2>
      <p className="mt-1.5 text-sm text-slate-500">Just what&apos;s been playing.</p>
    </>
  );

  const rangeTabs = (disabled = false) => (
    <div className="mt-5 flex gap-5 border-b border-slate-200">
      {RANGES.map((r) => (
        <button
          key={r.value}
          disabled={disabled}
          onClick={() => !disabled && setRange(r.value)}
          className={`border-b-2 pb-3 text-sm capitalize transition-colors duration-150 ${
            !disabled && range === r.value
              ? "border-slate-900 font-medium text-slate-900"
              : "border-transparent text-slate-400 hover:text-slate-600"
          }`}
        >
          {r.label}
        </button>
      ))}
    </div>
  );

  if (loading && tracks.length === 0) {
    return (
      <section id="top-tracks" className={sectionClass} style={sectionStyle}>
        <div className={innerClass}>
          {header}
          {rangeTabs(true)}
          <div className="mt-5 space-y-2">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="flex items-center gap-3 py-2">
                <span className="w-7 text-xs text-slate-300">• {i + 1}</span>
                <div className="h-10 w-10 flex-shrink-0 animate-pulse rounded-lg bg-slate-200" />
                <div className="min-w-0 flex-1">
                  <div className="h-3.5 w-36 animate-pulse rounded bg-slate-200" />
                  <div className="mt-1.5 h-3 w-24 animate-pulse rounded bg-slate-200" />
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
      <section id="top-tracks" className={sectionClass} style={sectionStyle}>
        <div className={`${innerClass} text-center`}>
          {header}
          <p className="mt-5 text-sm text-slate-500">{error}</p>
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
    <section id="top-tracks" className={sectionClass} style={sectionStyle}>
      <div className={innerClass}>
        {header}
        {rangeTabs()}
        {tracks.length === 0 ? (
          <p className="mt-8 text-sm text-slate-500">No listening data for this period yet.</p>
        ) : (
          <ul className="mt-2 divide-y divide-slate-100">
            {tracks.map((t, i) => (
              <li key={t.id}>
                <a
                  href={t.url ?? "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center gap-3 rounded-xl px-2 py-3 transition-all duration-150 hover:bg-slate-100/70 ${
                    !t.url ? "pointer-events-none cursor-default opacity-50" : ""
                  }`}
                >
                  <span className="w-7 flex-shrink-0 text-xs text-slate-400">{i + 1}</span>
                  {t.imageUrl ? (
                    <img
                      src={t.imageUrl}
                      alt={t.album ?? t.name}
                      className="h-10 w-10 flex-shrink-0 rounded-lg object-cover shadow-elev-1"
                    />
                  ) : (
                    <div className="h-10 w-10 flex-shrink-0 rounded-lg bg-slate-200" />
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-slate-900">{t.name}</p>
                    <p className="truncate text-sm text-slate-500">{t.artist}</p>
                  </div>
                  {t.url && (
                    <svg
                      className="h-4 w-4 flex-shrink-0 text-slate-900"
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
