import { NextResponse } from "next/server";

interface SpotifyTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  scope?: string;
  refresh_token?: string;
}

interface SpotifyCurrentlyPlaying {
  item?: {
    name: string;
    artists: Array<{ name: string }>;
    album: {
      name: string;
      images: Array<{ url: string; width: number }>;
    };
    external_urls: { spotify: string };
  };
  is_playing: boolean;
}

export async function GET() {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
  const refreshToken = process.env.SPOTIFY_REFRESH_TOKEN;

  if (!clientId || !clientSecret || !refreshToken) {
    return NextResponse.json(
      { error: "Spotify not configured. Add SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET, and SPOTIFY_REFRESH_TOKEN to .env.local" },
      { status: 503 }
    );
  }

  try {
    // Get fresh access token
    const tokenRes = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`,
      },
      body: new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: refreshToken,
      }),
      cache: "no-store",
    });

    if (!tokenRes.ok) {
      const err = await tokenRes.text();
      console.error("Spotify token error:", err);
      return NextResponse.json(
        { error: "Spotify auth failed. Refresh token may have expired—re-run the setup to get a new one." },
        { status: 503 }
      );
    }

    const tokenData: SpotifyTokenResponse = await tokenRes.json();

    // Fetch currently playing
    const playerRes = await fetch("https://api.spotify.com/v1/me/player/currently-playing", {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
      },
      cache: "no-store",
    });

    if (playerRes.status === 204 || !playerRes.ok) {
      return NextResponse.json({ playing: false });
    }

    const data: SpotifyCurrentlyPlaying = await playerRes.json();
    const item = data?.item;

    if (!item) {
      return NextResponse.json({ playing: false });
    }

    const image = item.album?.images?.[0]?.url ?? item.album?.images?.[1]?.url;
    const artists = item.artists?.map((a) => a.name).join(", ") ?? "Unknown Artist";

    return NextResponse.json({
      playing: data.is_playing ?? true,
      track: item.name,
      artist: artists,
      album: item.album?.name ?? null,
      imageUrl: image ?? null,
      url: item.external_urls?.spotify ?? null,
    });
  } catch (err) {
    console.error("Spotify API error:", err);
    return NextResponse.json(
      { error: "Could not fetch Spotify data" },
      { status: 500 }
    );
  }
}
