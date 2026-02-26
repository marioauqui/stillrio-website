"use client";

import { useEffect, useMemo } from "react";
import { MapContainer, TileLayer, Polyline, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface PlaceMarker {
  name: string;
  lat: number;
  lon: number;
  category?: string;
  number?: number;
}

function createPlaceIcon(num: number) {
  return L.divIcon({
    className: "leaflet-div-icon place-marker",
    html: `<div class="place-marker-inner" style="
      width: 28px; height: 28px; border-radius: 50%;
      background: #0f172a; border: 2px solid white;
      box-shadow: 0 2px 6px rgba(0,0,0,0.4);
      display: flex; align-items: center; justify-content: center;
      font-size: 13px; font-weight: 700; color: white; line-height: 1;
    ">${num}</div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
  });
}

function FitBounds({
  coordinates,
  places,
}: {
  coordinates: [number, number][];
  places: PlaceMarker[];
}) {
  const map = useMap();
  useEffect(() => {
    const allPoints: [number, number][] = [...coordinates];
    places.forEach((p) => allPoints.push([p.lat, p.lon]));
    if (allPoints.length < 2) return;
    const bounds = L.latLngBounds(allPoints);
    map.fitBounds(bounds, { padding: [40, 40] });
  }, [map, coordinates, places]);
  return null;
}

export default function MapWithRoute({
  coordinates,
  places = [],
}: {
  coordinates: [number, number][];
  places?: PlaceMarker[];
}) {
  const center: [number, number] = useMemo(() => {
    if (coordinates.length === 0) return [40.7128, -74.006];
    const mid = Math.floor(coordinates.length / 2);
    return coordinates[mid];
  }, [coordinates]);

  return (
    <MapContainer
      center={center}
      zoom={12}
      style={{ height: "100%", width: "100%" }}
      scrollWheelZoom={false}
      doubleClickZoom={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {coordinates.length >= 2 && (
        <>
          <Polyline positions={coordinates} color="#0ea5e9" weight={4} opacity={0.8} />
          <FitBounds coordinates={coordinates} places={places} />
        </>
      )}
      {places.map((place, i) => (
        <Marker
          key={`${place.lat}-${place.lon}-${i}`}
          position={[place.lat, place.lon]}
          icon={createPlaceIcon(place.number ?? i + 1)}
        >
          <Popup>
            <span className="mr-1.5 rounded-full bg-slate-800 px-1.5 py-0.5 text-xs font-bold text-white">
              {place.number ?? i + 1}
            </span>
            <span className="font-semibold">{place.name}</span>
            {place.category && (
              <span className="ml-1 text-xs text-slate-500">({place.category})</span>
            )}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
