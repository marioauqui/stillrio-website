"use client";

import { useEffect, useMemo } from "react";
import { MapContainer, TileLayer, Polyline, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

function FitBounds({ coordinates }: { coordinates: [number, number][] }) {
  const map = useMap();
  useEffect(() => {
    if (coordinates.length < 2) return;
    const bounds = L.latLngBounds(coordinates);
    map.fitBounds(bounds, { padding: [30, 30] });
  }, [map, coordinates]);
  return null;
}

export default function MapWithRoute({ coordinates }: { coordinates: [number, number][] }) {
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
      scrollWheelZoom={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {coordinates.length >= 2 && (
        <>
          <Polyline positions={coordinates} color="#0ea5e9" weight={4} opacity={0.8} />
          <FitBounds coordinates={coordinates} />
        </>
      )}
    </MapContainer>
  );
}
