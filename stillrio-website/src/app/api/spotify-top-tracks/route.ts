import { NextRequest, NextResponse } from "next/server";

const VALID_RANGES = ["short_term", "medium_term", "long_term"] as const;
type TimeRange = (typeof VALID_RANGES)[number];

interface SpotifyTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

interface SpotifyTrack {
  id: string;
  name: string;
  artists: Array<{ name: string; id: string }>;
  album: {
    name: string;
    images: Array<{ url: string; width: number }>;
  };
  external_urls: { spotify: string };
}

interface SpotifyTopTracksResponse {
  items: SpotifyTrack[];
}

export async function GET(request: NextRequest) {
  const range = (request.nextUrl.searchParams.get("range") ?? "medium_term") as TimeRange;
  if (!VALID_RANGES.includes(range)) {
    return NextResponse.json({ error: "Invalid range. Use short_term, medium_term, or long_term" }, { status: 400 });
  }

  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
  const refreshToken = process.env.SPOTIFY_REFRESH_TOKEN;

  const missing: string[] = [];
  if (!clientId) missing.push("SPOTIFY_CLIENT_ID");
  if (!clientSecret) missing.push("SPOTIFY_CLIENT_SECRET");
  if (!refreshToken) missing.push("SPOTIFY_REFRESH_TOKEN");

  if (missing.length > 0) {
    return NextResponse.json(
      {
        error: `Spotify not configured. Missing in .env.local: ${missing.join(", ")}. Add them, then visit /api/spotify-auth to get a refresh token.`,
      },
      { status: 503 }
    );
  }

  try {
    const tokenRes = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`,
      },
      body: new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: refreshToken as string,
      }),
      cache: "no-store",
    });

    if (!tokenRes.ok) {
      const err = await tokenRes.text();
      console.error("Spotify token error:", err);
      return NextResponse.json(
        { error: "Spotify auth failed. Re-run /api/spotify-auth to get a new refresh token." },
        { status: 503 }
      );
    }

    const tokenData: SpotifyTokenResponse = await tokenRes.json();
    const limit = Math.min(20, parseInt(request.nextUrl.searchParams.get("limit") ?? "8", 10) || 8);

    const apiRes = await fetch(
      `https://api.spotify.com/v1/me/top/tracks?time_range=${range}&limit=${limit}`,
      {
        headers: { Authorization: `Bearer ${tokenData.access_token}` },
        cache: "no-store",
      }
    );

    if (!apiRes.ok) {
      const err = await apiRes.text();
      if (apiRes.status === 401 || apiRes.status === 403) {
        return NextResponse.json(
          { error: "Need user-top-read scope. Visit /api/spotify-auth to re-authorize." },
          { status: 503 }
        );
      }
      console.error("Spotify top tracks error:", err);
      return NextResponse.json({ error: "Could not fetch top tracks" }, { status: 500 });
    }

    const data: SpotifyTopTracksResponse = await apiRes.json();
    const tracks = (data?.items ?? []).map((t) => ({
      id: t.id,
      name: t.name,
      artist: t.artists?.map((a) => a.name).join(", ") ?? "Unknown",
      album: t.album?.name ?? null,
      imageUrl: t.album?.images?.[0]?.url ?? t.album?.images?.[1]?.url ?? null,
      url: t.external_urls?.spotify ?? null,
    }));

    return NextResponse.json({ tracks, range });
  } catch (err) {
    console.error("Spotify API error:", err);
    return NextResponse.json(
      { error: "Could not fetch Spotify data" },
      { status: 500 }
    );
  }
}
