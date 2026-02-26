import { NextRequest, NextResponse } from "next/server";

function getRedirectUri(request: NextRequest): string {
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return `${process.env.NEXT_PUBLIC_APP_URL.replace(/\/$/, "")}/api/spotify-callback`;
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}/api/spotify-callback`;
  }
  const origin = request.nextUrl.origin;
  const base = origin.replace(/^https?:\/\/localhost/, "http://127.0.0.1");
  return `${base.replace(/\/$/, "")}/api/spotify-callback`;
}

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  const error = request.nextUrl.searchParams.get("error");
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
  const redirectUri = getRedirectUri(request);

  if (error) {
    const html = `
      <!DOCTYPE html>
      <html>
        <head><title>Spotify - Error</title></head>
        <body style="font-family: system-ui; max-width: 500px; margin: 2rem auto; padding: 2rem;">
          <h1>Spotify authorization failed</h1>
          <p>Error: ${error}</p>
          <p><a href="/">← Back to site</a></p>
        </body>
      </html>
    `;
    return new NextResponse(html, { headers: { "Content-Type": "text/html" } });
  }

  if (!code || !clientId || !clientSecret) {
    const html = `
      <!DOCTYPE html>
      <html>
        <head><title>Spotify - Error</title></head>
        <body style="font-family: system-ui; max-width: 500px; margin: 2rem auto; padding: 2rem;">
          <h1>Spotify setup incomplete</h1>
          <p>Add SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET to .env.local first.</p>
          <p><a href="/">← Back to site</a></p>
        </body>
      </html>
    `;
    return new NextResponse(html, { headers: { "Content-Type": "text/html" } });
  }

  try {
    const tokenRes = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`,
      },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code,
        redirect_uri: redirectUri,
      }),
    });

    if (!tokenRes.ok) {
      const err = await tokenRes.text();
      const html = `
        <!DOCTYPE html>
        <html>
          <head><title>Spotify - Error</title></head>
          <body style="font-family: system-ui; max-width: 500px; margin: 2rem auto; padding: 2rem;">
            <h1>Token exchange failed</h1>
            <p>${err}</p>
            <p><a href="/">← Back to site</a></p>
          </body>
        </html>
      `;
      return new NextResponse(html, { headers: { "Content-Type": "text/html" } });
    }

    const data = await tokenRes.json();
    const refreshToken = data.refresh_token;

    if (!refreshToken) {
      const html = `
        <!DOCTYPE html>
        <html>
          <head><title>Spotify - Error</title></head>
          <body style="font-family: system-ui; max-width: 500px; margin: 2rem auto; padding: 2rem;">
            <h1>No refresh token received</h1>
            <p>Try again or check your Spotify app settings.</p>
            <p><a href="/">← Back to site</a></p>
          </body>
        </html>
      `;
      return new NextResponse(html, { headers: { "Content-Type": "text/html" } });
    }

    const html = `
      <!DOCTYPE html>
      <html>
        <head><title>Spotify - Success</title></head>
        <body style="font-family: system-ui; max-width: 560px; margin: 2rem auto; padding: 2rem;">
          <h1>Spotify connected</h1>
          <p>Add this to your <code>.env.local</code>:</p>
          <pre style="background: #1e293b; color: #e2e8f0; padding: 1rem; border-radius: 0.5rem; overflow-x: auto; font-size: 0.875rem;">SPOTIFY_REFRESH_TOKEN=${refreshToken}</pre>
          <p style="color: #64748b; font-size: 0.875rem;">Then restart your dev server. The "Currently listening to" section will show what you're playing on Spotify.</p>
          <p><a href="/" style="color: #0ea5e9;">← Back to site</a></p>
        </body>
      </html>
    `;
    return new NextResponse(html, { headers: { "Content-Type": "text/html" } });
  } catch (err) {
    const html = `
      <!DOCTYPE html>
      <html>
        <head><title>Spotify - Error</title></head>
        <body style="font-family: system-ui; max-width: 500px; margin: 2rem auto; padding: 2rem;">
          <h1>Something went wrong</h1>
          <p>${err instanceof Error ? err.message : "Unknown error"}</p>
          <p><a href="/">← Back to site</a></p>
        </body>
      </html>
    `;
    return new NextResponse(html, { headers: { "Content-Type": "text/html" } });
  }
}
