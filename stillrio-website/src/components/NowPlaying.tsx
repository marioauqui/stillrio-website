"use client";

import { useState, useEffect } from "react";

interface SpotifyData {
  playing: boolean;
  track?: string;
  artist?: string;
  album?: string | null;
  imageUrl?: string | null;
  url?: string | null;
}

export default function NowPlaying() {
  const [data, setData] = useState<SpotifyData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function fetchNowPlaying() {
      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 10000);
        const res = await fetch("/api/spotify", { signal: controller.signal });
        clearTimeout(timeout);
        if (!mounted) return;

        if (res.status === 503) {
          const body = await res.json();
          setError(body?.error ?? "Spotify not configured");
          setData(null);
          return;
        }

        const json = await res.json();
        setData(json);
        setError(null);
      } catch (err) {
        if (mounted) {
          setError(
            err instanceof Error && err.name === "AbortError"
              ? "Request timed out"
              : "Could not fetch"
          );
          setData(null);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    }

    fetchNowPlaying();
    const iv = setInterval(fetchNowPlaying, 30000);
    return () => {
      mounted = false;
      clearInterval(iv);
    };
  }, []);

  if (loading) {
    return (
      <section className="border-t border-slate-200/80 bg-slate-50 px-6 py-12">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-center text-2xl font-bold text-slate-800">
            Currently listening to
          </h2>
          <div className="mt-6 flex justify-center">
            <div className="h-20 w-20 animate-pulse rounded-lg bg-slate-200" />
            <div className="ml-4 flex flex-col justify-center gap-2">
              <div className="h-4 w-32 animate-pulse rounded bg-slate-200" />
              <div className="h-3 w-24 animate-pulse rounded bg-slate-200" />
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="border-t border-slate-200/80 bg-slate-50 px-6 py-12">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-2xl font-bold text-slate-800">
            Currently listening to
          </h2>
          <p className="mt-4 text-sm text-slate-500">
            {error}
          </p>
          <p className="mt-2 text-xs text-slate-400">
            Add SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET, and SPOTIFY_REFRESH_TOKEN to .env.local, then visit{" "}
            <a href="/api/spotify-auth" className="text-slate-600 underline hover:text-slate-800">
              /api/spotify-auth
            </a>{" "}
            to get your refresh token. Open the site via <code>http://127.0.0.1:3000</code> when authorizing.
          </p>
        </div>
      </section>
    );
  }

  if (!data?.playing || !data.track) {
    return (
      <section className="border-t border-slate-200/80 bg-slate-50 px-6 py-12">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-2xl font-bold text-slate-800">
            Currently listening to
          </h2>
          <p className="mt-4 text-slate-600">
            Nothing playing right now. Check back when something&apos;s on!
          </p>
        </div>
      </section>
    );
  }

  const content = (
    <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
      {data.imageUrl && (
        <img
          src={data.imageUrl}
          alt={data.album ?? data.track}
          className="h-24 w-24 rounded-lg shadow-md"
        />
      )}
      <div className="flex flex-col items-center text-center sm:items-start sm:text-left">
        <p className="font-semibold text-slate-800">{data.track}</p>
        <p className="text-slate-600">{data.artist}</p>
        {data.album && (
          <p className="text-sm text-slate-500">{data.album}</p>
        )}
        {data.url && (
          <a
            href={data.url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-[#1DB954] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#1ed760]"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.121-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18 12.42c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
            </svg>
            Play on Spotify
          </a>
        )}
      </div>
    </div>
  );

  return (
    <section className="border-t border-slate-200/80 bg-slate-50 px-6 py-12">
      <div className="mx-auto max-w-4xl">
        <h2 className="text-center text-2xl font-bold text-slate-800">
          Currently listening to
        </h2>
        <div className="mt-6">
          {data.url ? (
            <a
              href={data.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block transition-opacity hover:opacity-90"
            >
              {content}
            </a>
          ) : (
            content
          )}
        </div>
      </div>
    </section>
  );
}
