import { NextRequest, NextResponse } from "next/server";

function getRedirectUri(request: NextRequest): string {
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return `${process.env.NEXT_PUBLIC_APP_URL.replace(/\/$/, "")}/api/spotify-callback`;
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}/api/spotify-callback`;
  }
  // Local dev: use 127.0.0.1 (Spotify no longer accepts localhost)
  const origin = request.nextUrl.origin;
  const base = origin.replace(/^https?:\/\/localhost/, "http://127.0.0.1");
  return `${base.replace(/\/$/, "")}/api/spotify-callback`;
}

export async function GET(request: NextRequest) {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const redirectUri = getRedirectUri(request);

  if (!clientId) {
    return NextResponse.redirect(new URL("/?spotify=missing-keys", request.url));
  }

  const scopes = ["user-read-currently-playing", "user-read-playback-state", "user-top-read"].join(" ");
  const params = new URLSearchParams({
    client_id: clientId,
    response_type: "code",
    redirect_uri: redirectUri,
    scope: scopes,
    show_dialog: "true",
  });

  return NextResponse.redirect(`https://accounts.spotify.com/authorize?${params}`);
}
