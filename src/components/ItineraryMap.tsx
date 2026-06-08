import React, { useEffect, useMemo, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, Popup, Tooltip, useMap } from 'react-leaflet';
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

/** Generate a smooth curved arc between two points (great-circle-ish bezier) for flights. */
function curvedArc(a: LatLng, b: LatLng, segments = 64, curvature = 0.22): LatLng[] {
  const mid = { lat: (a.lat + b.lat) / 2, lng: (a.lng + b.lng) / 2 };
  const dx = b.lng - a.lng;
  const dy = b.lat - a.lat;
  // perpendicular offset for control point
  const ctrl = { lat: mid.lat - dx * curvature, lng: mid.lng + dy * curvature };
  const pts: LatLng[] = [];
  for (let i = 0; i <= segments; i++) {
    const t = i / segments;
    const u = 1 - t;
    const lat = u * u * a.lat + 2 * u * t * ctrl.lat + t * t * b.lat;
    const lng = u * u * a.lng + 2 * u * t * ctrl.lng + t * t * b.lng;
    pts.push({ lat, lng });
  }
  return pts;
}

function midpoint(coords: LatLng[]): LatLng {
  if (coords.length === 0) return { lat: 22.5, lng: 79 };
  return coords[Math.floor(coords.length / 2)];
}

function formatDuration(min: number | null): string {
  if (min == null) return '—';
  const h = Math.floor(min / 60);
  const m = Math.round(min % 60);
  if (h === 0) return `${m} min`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
}

function legTransport(overall: string, dayTransport?: string | null): 'car' | 'bus' | 'train' | 'flight' {
  const t = (dayTransport || overall || '').toLowerCase();
  if (t.includes('flight') || t.includes('plane') || t.includes('air')) return 'flight';
  if (t.includes('train') || t.includes('rail')) return 'train';
  if (t.includes('bus')) return 'bus';
  if (t.includes('car') || t.includes('cab') || t.includes('taxi') || t.includes('drive')) return 'car';
  return 'car';
}

function makeNumberIcon(num: number, active: boolean, isStart: boolean, isEnd: boolean): L.DivIcon {
  const size = active ? 44 : 34;
  const bg = active ? '#FF671F' : '#fff';
  const fg = active ? '#fff' : '#FF671F';
  const border = '#FF671F';
  const label = isStart ? 'Start' : isEnd ? 'End' : `Day ${num}`;
  const pulse = active
    ? `<span style="position:absolute;inset:-6px;border-radius:9999px;background:rgba(255,103,31,.35);animation:itineraryPulse 1.6s ease-out infinite;"></span>`
    : '';
  return L.divIcon({
    className: 'itinerary-marker',
    html: `
      <div style="position:relative;display:flex;flex-direction:column;align-items:center;">
        ${pulse}
        <div style="position:relative;width:${size}px;height:${size}px;border-radius:9999px;background:${bg};color:${fg};border:3px solid ${border};display:flex;align-items:center;justify-content:center;font-weight:800;font-family:system-ui;box-shadow:0 8px 20px rgba(0,0,0,.28);transition:all .2s ease;font-size:${active ? 16 : 14}px;">${num}</div>
        <div style="margin-top:4px;padding:2px 8px;background:#111827;color:#fff;border-radius:9999px;font-size:10px;font-weight:600;font-family:system-ui;white-space:nowrap;box-shadow:0 2px 6px rgba(0,0,0,.25)">${label}</div>
      </div>`,
    iconSize: [size, size + 22],
    iconAnchor: [size / 2, size / 2],
  });
}

function makeLegLabelIcon(text: string, color: string): L.DivIcon {
  return L.divIcon({
    className: 'itinerary-leg-label',
    html: `<div style="display:inline-flex;align-items:center;gap:4px;padding:3px 8px;border-radius:9999px;background:#fff;color:${color};border:1.5px solid ${color};font-size:11px;font-weight:700;font-family:system-ui;box-shadow:0 4px 10px rgba(0,0,0,.18);white-space:nowrap;">${text}</div>`,
    iconSize: [1, 1],
    iconAnchor: [0, 0],
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

const transportLabel: Record<string, string> = {
  car: 'Car / Cab',
  bus: 'Bus',
  train: 'Train',
  flight: 'Flight',
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
        if (mode === 'car' || mode === 'bus' || mode === 'train') {
          // OSRM road geometry is used as a visual approximation for trains too
          // (rail routing isn't available on the public OSRM demo). Adjust speed below.
          const r = await osrmRoute(a, b);
          if (r) {
            coords = r.coords;
            distanceKm = r.distanceKm;
            if (mode === 'bus') durationMin = r.durationMin * 1.3;
            else if (mode === 'train') durationMin = (r.distanceKm / 60) * 60; // avg 60 km/h
            else durationMin = r.durationMin;
            source = 'osrm';
          }
        } else if (mode === 'flight') {
          coords = curvedArc(a, b);
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
          <React.Fragment key={i}>
            {/* halo for depth */}
            <Polyline
              positions={leg.coords.map(c => [c.lat, c.lng]) as [number, number][]}
              pathOptions={{
                color: leg.color,
                weight: activeLegIdx === i ? 11 : 8,
                opacity: activeLegIdx === -1 || activeLegIdx === i ? 0.18 : 0.08,
              }}
            />
            <Polyline
              positions={leg.coords.map(c => [c.lat, c.lng]) as [number, number][]}
              pathOptions={{
                color: leg.color,
                weight: activeLegIdx === i ? 6 : 4,
                opacity: activeLegIdx === -1 || activeLegIdx === i ? 0.95 : 0.4,
                dashArray: leg.dashed ? '10 8' : undefined,
                className: leg.dashed ? 'itinerary-dash-anim' : undefined,
                lineCap: 'round',
                lineJoin: 'round',
              }}
            />
            <Marker
              position={[midpoint(leg.coords).lat, midpoint(leg.coords).lng]}
              icon={makeLegLabelIcon(
                `${transportLabel[leg.mode]} · ${Math.round(leg.info.distanceKm || 0)} km · ${formatDuration(leg.info.durationMin)}`,
                leg.color,
              )}
              interactive={false}
            />
          </React.Fragment>
        ))}

        {points.map((pt, idx) => {
          if (!pt) return null;
          const s = stops[idx];
          const active = activeDay === s.day;
          const isStart = idx === 0;
          const isEnd = idx === points.length - 1 && points.length > 1;
          return (
            <Marker
              key={idx}
              position={[pt.lat, pt.lng]}
              icon={makeNumberIcon(s.day, active, isStart, isEnd)}
              eventHandlers={{ click: () => onSelectDay?.(s.day) }}
            >
              <Popup className="itinerary-popup">
                <div style={{ fontFamily: 'system-ui', minWidth: 220 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                    <span style={{ background: '#FF671F', color: '#fff', padding: '3px 10px', borderRadius: 9999, fontSize: 11, fontWeight: 700, letterSpacing: 0.3 }}>
                      {isStart ? 'START' : isEnd ? 'END' : `DAY ${s.day}`}
                    </span>
                    {s.transport && (
                      <span style={{ fontSize: 11, color: '#6b7280', fontWeight: 600, textTransform: 'capitalize' }}>{s.transport}</span>
                    )}
                  </div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: '#111827', marginBottom: 6 }}>{s.location}</div>
                  {s.travelFrom && (
                    <div style={{ fontSize: 12, color: '#4b5563', borderTop: '1px solid #e5e7eb', paddingTop: 6, lineHeight: 1.5 }}>
                      <div><strong style={{ color: '#111827' }}>From:</strong> {s.travelFrom}</div>
                      {s.travelTime && <div><strong style={{ color: '#111827' }}>Travel:</strong> {s.travelTime}</div>}
                    </div>
                  )}
                </div>
              </Popup>
              <Tooltip direction="top" offset={[0, -10]} opacity={0.95}>
                <span style={{ fontWeight: 600 }}>{s.location}</span>
              </Tooltip>
            </Marker>
          );
        })}

        <FitBounds points={validPoints} />
        <FlyToActive point={activePoint} />
      </MapContainer>

      {/* Legend */}
      <div className="absolute top-3 right-3 z-[400] bg-background/95 backdrop-blur-md rounded-xl shadow-xl border border-border p-3 text-xs space-y-1.5 min-w-[140px]">
        <div className="font-semibold mb-1.5 text-[11px] uppercase tracking-wider text-muted-foreground">Transport</div>
        <div className="flex items-center gap-2"><span className="inline-block w-3 h-[3px] rounded-full" style={{ background: transportColor.car }} /><Car className="w-3 h-3" style={{ color: transportColor.car }} /> Car / Cab</div>
        <div className="flex items-center gap-2"><span className="inline-block w-3 h-[3px] rounded-full" style={{ background: transportColor.bus }} /><Bus className="w-3 h-3" style={{ color: transportColor.bus }} /> Bus</div>
        <div className="flex items-center gap-2"><span className="inline-block w-3 h-[3px] rounded-full border-dashed border-t-[3px]" style={{ borderColor: transportColor.train }} /><Train className="w-3 h-3" style={{ color: transportColor.train }} /> Train</div>
        <div className="flex items-center gap-2"><span className="inline-block w-3 h-[3px] rounded-full border-dashed border-t-[3px]" style={{ borderColor: transportColor.flight }} /><Plane className="w-3 h-3" style={{ color: transportColor.flight }} /> Flight</div>
        <div className="flex items-center gap-2 pt-1 border-t border-border/60"><RouteIcon className="w-3 h-3 text-muted-foreground" /> Mixed (per leg)</div>
      </div>

      {loading && (
        <div className="absolute bottom-3 left-3 z-[400] bg-background/95 backdrop-blur-md rounded-full px-4 py-2 text-xs shadow-xl border border-border flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-india-orange animate-pulse" />
          Locating destinations…
        </div>
      )}
    </div>
  );
};

export default ItineraryMap;