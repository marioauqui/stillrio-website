# StillRio — Creator HQ & Adventure Planner

A personal brand website for StillRio featuring a creator hub and an interactive route planner.

## Features

- **Brand Hub**: Hero section, social links (YouTube, TikTok, Instagram), and embedded videos
- **Route Planner**: Enter start/end points, pick travel mode (walk, bike, drive), and get real routes with map, distance, and duration
- **Modern Stack**: Next.js 16, React 19, TypeScript, Tailwind CSS
- **Deploy-ready**: Built for Vercel

## Setup

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Run the dev server**

   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000)

## Customization

- **Social links**: Update URLs in `src/components/SocialLinks.tsx`
- **Video embed**: Change `videoId` in `src/components/VideoEmbed.tsx` to your YouTube video ID
- **Metadata**: Edit `layout.tsx` for title and description

## Route Planner

Uses free, open-source services (no API keys required):

- **Geocoding**: OpenStreetMap Nominatim
- **Routing**: OSRM (Open Source Routing Machine)
- **Map**: Leaflet + OpenStreetMap tiles

## Deploy on Vercel

1. Push this repo to GitHub
2. Import the project in [Vercel](https://vercel.com)
3. Deploy (Vercel will auto-detect Next.js)

## Scripts

- `npm run dev` — Development server
- `npm run build` — Production build
- `npm run start` — Run production build locally
- `npm run lint` — Run ESLint
