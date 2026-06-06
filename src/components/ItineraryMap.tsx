import React, { useEffect, useMemo, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Plane, Train, Car, Bus, Route as RouteIcon } from 'lucide-react';

// Fix default marker icon URLs (Vite bundling)
// We use custom divIcons anyway, but set defaults to avoid 404s.
// @ts-expect-error - private API
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

export interface ItineraryStop {
  day: number;
  location: string;
  travelFrom?: string | null;
  transport?: string | null;
  travelTime?: string | null;
}

interface Props {
  stops: ItineraryStop[];
  transportMode: string; // overall mode: flight/train/car/bus/mixed
  activeDay?: number | null;
  onSelectDay?: (day: number) => void;
  onLegsComputed?: (legs: LegInfo[]) => void;
}

export interface LegInfo {
  fromDay: number;
  toDay: number;
  from: string;
  to: string;
  transport: string;
  distanceKm: number | null;
  durationMin: number | null;
  source: 'osrm' | 'haversine';
}

type LatLng = { lat: number; lng: number };

const GEO_CACHE_KEY = 'osm-geocode-cache-v1';
const ROUTE_CACHE_KEY = 'osrm-route-cache-v1';

function readCache<T>(key: string): Record<string, T> {
  try { return JSON.parse(localStorage.getItem(key) || '{}'); } catch { return {}; }
}
function writeCache(key: string, val: unknown) {
  try { localStorage.setItem(key, JSON.stringify(val)); } catch { /* ignore */ }
}

async function geocode(place: string): Promise<LatLng | null> {
  const cache = readCache<LatLng>(GEO_CACHE_KEY);
  const key = place.toLowerCase().trim();
  if (cache[key]) return cache[key];
  try {
    const q = encodeURIComponent(`${place}, India`);
    const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&limit=1&countrycodes=in&q=${q}`, {
      headers: { 'Accept': 'application/json' },
    });
    const data = await res.json();
    if (Array.isArray(data) && data[0]) {
      const ll = { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
      cache[key] = ll;
      writeCache(GEO_CACHE_KEY, cache);
      return ll;
    }
  } catch { /* network fail */ }
  return null;
}

function haversineKm(a: LatLng, b: LatLng): number {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const la1 = (a.lat * Math.PI) / 180;
  const la2 = (b.lat * Math.PI) / 180;
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(la1) * Math.cos(la2) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

async function osrmRoute(a: LatLng, b: LatLng): Promise<{ coords: LatLng[]; distanceKm: number; durationMin: number } | null> {
  const cache = readCache<any>(ROUTE_CACHE_KEY);
  const key = `${a.lat.toFixed(3)},${a.lng.toFixed(3)}->${b.lat.toFixed(3)},${b.lng.toFixed(3)}`;
  if (cache[key]) return cache[key];
  try {
    const url = `https://router.project-osrm.org/route/v1/driving/${a.lng},${a.lat};${b.lng},${b.lat}?overview=full&geometries=geojson`;
    const res = await fetch(url);
    const data = await res.json();
    const route = data?.routes?.[0];
    if (!route) return null;
    const coords: LatLng[] = route.geometry.coordinates.map((c: [number, number]) => ({ lat: c[1], lng: c[0] }));
    const result = { coords, distanceKm: route.distance / 1000, durationMin: route.duration / 60 };
    cache[key] = result;
    writeCache(ROUTE_CACHE_KEY, cache);
    return result;
  } catch {
    return null;
  }
}

function legTransport(overall: string, dayTransport?: string | null): 'car' | 'bus' | 'train' | 'flight' {
  const t = (dayTransport || overall || '').toLowerCase();
  if (t.includes('flight') || t.includes('plane') || t.includes('air')) return 'flight';
  if (t.includes('train') || t.includes('rail')) return 'train';
  if (t.includes('bus')) return 'bus';
  if (t.includes('car') || t.includes('cab') || t.includes('taxi') || t.includes('drive')) return 'car';
  return 'car';
}

function makeNumberIcon(num: number, active: boolean): L.DivIcon {
  const size = active ? 40 : 32;
  const bg = active ? '#FF671F' : '#fff';
  const fg = active ? '#fff' : '#FF671F';
  const border = '#FF671F';
  return L.divIcon({
    className: 'itinerary-marker',
    html: `<div style="width:${size}px;height:${size}px;border-radius:9999px;background:${bg};color:${fg};border:3px solid ${border};display:flex;align-items:center;justify-content:center;font-weight:700;font-family:system-ui;box-shadow:0 6px 16px rgba(0,0,0,.25);transition:all .2s ease">${num}</div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
}

const FitBounds: React.FC<{ points: LatLng[] }> = ({ points }) => {
  const map = useMap();
  useEffect(() => {
    if (points.length === 0) return;
    const b = L.latLngBounds(points.map(p => [p.lat, p.lng] as [number, number]));
    map.fitBounds(b, { padding: [40, 40], maxZoom: 8 });
  }, [points, map]);
  return null;
};

const FlyToActive: React.FC<{ point: LatLng | null }> = ({ point }) => {
  const map = useMap();
  useEffect(() => {
    if (point) map.flyTo([point.lat, point.lng], 9, { duration: 0.8 });
  }, [point, map]);
  return null;
};

const transportColor: Record<string, string> = {
  car: '#FF671F',
  bus: '#0EA5E9',
  train: '#16A34A',
  flight: '#8B5CF6',
};

const ItineraryMap: React.FC<Props> = ({ stops, transportMode, activeDay, onSelectDay, onLegsComputed }) => {
  const [points, setPoints] = useState<(LatLng | null)[]>([]);
  const [legs, setLegs] = useState<{ coords: LatLng[]; mode: string; color: string; dashed: boolean; info: LegInfo }[]>([]);
  const [loading, setLoading] = useState(false);
  const onLegsRef = useRef(onLegsComputed);
  onLegsRef.current = onLegsComputed;

  // Geocode all stops
  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      const results: (LatLng | null)[] = [];
      for (const s of stops) {
        const pt = await geocode(s.location);
        results.push(pt);
      }
      if (!cancelled) setPoints(results);
      if (!cancelled) setLoading(false);
    })();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stops.map(s => s.location).join('|')]);

  // Compute legs whenever points or transport change
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const newLegs: typeof legs = [];
      const infos: LegInfo[] = [];
      for (let i = 0; i < points.length - 1; i++) {
        const a = points[i]; const b = points[i + 1];
        if (!a || !b) continue;
        const mode = legTransport(transportMode, stops[i + 1]?.transport);
        const color = transportColor[mode];
        let coords: LatLng[] = [a, b];
        let distanceKm: number | null = null;
        let durationMin: number | null = null;
        let source: 'osrm' | 'haversine' = 'haversine';
        if (mode === 'car' || mode === 'bus') {
          const r = await osrmRoute(a, b);
          if (r) {
            coords = r.coords;
            distanceKm = r.distanceKm;
            // bus is ~1.3x slower than driving
            durationMin = mode === 'bus' ? r.durationMin * 1.3 : r.durationMin;
            source = 'osrm';
          }
        }
        if (distanceKm == null) {
          const km = haversineKm(a, b);
          distanceKm = mode === 'flight' ? km : km * 1.25; // rough land factor
          if (mode === 'flight') durationMin = (km / 700) * 60 + 60; // cruise + buffer
          else if (mode === 'train') durationMin = (km / 60) * 60;
          else durationMin = (km / 50) * 60;
        }
        const info: LegInfo = {
          fromDay: stops[i].day,
          toDay: stops[i + 1].day,
          from: stops[i].location,
          to: stops[i + 1].location,
          transport: mode,
          distanceKm,
          durationMin,
          source,
        };
        infos.push(info);
        newLegs.push({ coords, mode, color, dashed: mode === 'flight' || mode === 'train', info });
      }
      if (!cancelled) {
        setLegs(newLegs);
        onLegsRef.current?.(infos);
      }
    })();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [points, transportMode, stops.map(s => s.transport || '').join('|')]);

  const validPoints = useMemo(() => points.filter(Boolean) as LatLng[], [points]);
  const activePoint = useMemo(() => {
    if (activeDay == null) return null;
    const idx = stops.findIndex(s => s.day === activeDay);
    return idx >= 0 ? points[idx] ?? null : null;
  }, [activeDay, points, stops]);

  const activeLegIdx = useMemo(() => {
    if (activeDay == null) return -1;
    return legs.findIndex(l => l.info.toDay === activeDay);
  }, [activeDay, legs]);

  return (
    <div className="relative w-full h-full">
      <MapContainer
        center={[22.5, 79]}
        zoom={5}
        scrollWheelZoom
        style={{ width: '100%', height: '100%', borderRadius: 12 }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {legs.map((leg, i) => (
          <Polyline
            key={i}
            positions={leg.coords.map(c => [c.lat, c.lng]) as [number, number][]}
            pathOptions={{
              color: leg.color,
              weight: activeLegIdx === i ? 6 : 4,
              opacity: activeLegIdx === -1 || activeLegIdx === i ? 0.95 : 0.4,
              dashArray: leg.dashed ? '8 8' : undefined,
            }}
          />
        ))}

        {points.map((pt, idx) => {
          if (!pt) return null;
          const s = stops[idx];
          const active = activeDay === s.day;
          return (
            <Marker
              key={idx}
              position={[pt.lat, pt.lng]}
              icon={makeNumberIcon(s.day, active)}
              eventHandlers={{ click: () => onSelectDay?.(s.day) }}
            >
              <Popup>
                <div style={{ fontFamily: 'system-ui', minWidth: 180 }}>
                  <div style={{ fontWeight: 700, color: '#FF671F' }}>Day {s.day}</div>
                  <div style={{ fontSize: 14, marginBottom: 4 }}>{s.location}</div>
                  {s.travelFrom && (
                    <div style={{ fontSize: 12, color: '#666' }}>
                      From: {s.travelFrom}<br />
                      {s.transport && <>Mode: {s.transport}<br /></>}
                      {s.travelTime && <>Time: {s.travelTime}</>}
                    </div>
                  )}
                </div>
              </Popup>
            </Marker>
          );
        })}

        <FitBounds points={validPoints} />
        <FlyToActive point={activePoint} />
      </MapContainer>

      {/* Legend */}
      <div className="absolute top-3 right-3 z-[400] bg-background/95 backdrop-blur rounded-lg shadow-lg border border-border p-3 text-xs space-y-1.5">
        <div className="font-semibold mb-1">Transport</div>
        <div className="flex items-center gap-2"><Car className="w-3 h-3" style={{ color: transportColor.car }} /> Car / Cab</div>
        <div className="flex items-center gap-2"><Bus className="w-3 h-3" style={{ color: transportColor.bus }} /> Bus</div>
        <div className="flex items-center gap-2"><Train className="w-3 h-3" style={{ color: transportColor.train }} /> Train</div>
        <div className="flex items-center gap-2"><Plane className="w-3 h-3" style={{ color: transportColor.flight }} /> Flight</div>
        <div className="flex items-center gap-2"><RouteIcon className="w-3 h-3 text-muted-foreground" /> Mixed (per leg)</div>
      </div>

      {loading && (
        <div className="absolute bottom-3 left-3 z-[400] bg-background/95 backdrop-blur rounded-md px-3 py-1.5 text-xs shadow border border-border">
          Locating destinations…
        </div>
      )}
    </div>
  );
};

export default ItineraryMap;