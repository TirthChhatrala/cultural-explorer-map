import React, { useMemo, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Tooltip, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useNavigate } from 'react-router-dom';
import { states } from '@/data/states';
import { MapPin } from 'lucide-react';

// Fix default marker icons for Leaflet + Vite (we use divIcons; this prevents 404s)
// @ts-expect-error - private API
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Capital coordinates for every Indian state (matches src/data/states.ts ids)
const stateCoords: Record<string, [number, number]> = {
  andhrapradesh: [16.5062, 80.6480], // Amaravati
  arunachalpradesh: [27.0844, 93.6053], // Itanagar
  assam: [26.1445, 91.7362], // Dispur / Guwahati
  bihar: [25.5941, 85.1376], // Patna
  chhattisgarh: [21.2514, 81.6296], // Raipur
  goa: [15.4909, 73.8278], // Panaji
  gujarat: [23.2156, 72.6369], // Gandhinagar
  haryana: [30.7333, 76.7794], // Chandigarh
  himachalpradesh: [31.1048, 77.1734], // Shimla
  jharkhand: [23.3441, 85.3096], // Ranchi
  karnataka: [12.9716, 77.5946], // Bangalore
  kerala: [8.5241, 76.9366], // Thiruvananthapuram
  madhyapradesh: [23.2599, 77.4126], // Bhopal
  maharashtra: [19.0760, 72.8777], // Mumbai
  manipur: [24.8170, 93.9368], // Imphal
  meghalaya: [25.5788, 91.8933], // Shillong
  mizoram: [23.7271, 92.7176], // Aizawl
  nagaland: [25.6701, 94.1077], // Kohima
  odisha: [20.2961, 85.8245], // Bhubaneswar
  punjab: [30.7333, 76.7794], // Chandigarh
  rajasthan: [26.9124, 75.7873], // Jaipur
  sikkim: [27.3389, 88.6065], // Gangtok
  tamilnadu: [13.0827, 80.2707], // Chennai
  telangana: [17.3850, 78.4867], // Hyderabad
  tripura: [23.8315, 91.2868], // Agartala
  uttarpradesh: [26.8467, 80.9462], // Lucknow
  uttarakhand: [30.3165, 78.0322], // Dehradun
  westbengal: [22.5726, 88.3639], // Kolkata
  delhi: [28.6139, 77.2090], // New Delhi
};

function makeStatePin(name: string, active: boolean): L.DivIcon {
  const size = active ? 40 : 30;
  const bg = active ? '#FF671F' : '#ffffff';
  const fg = active ? '#ffffff' : '#FF671F';
  const pulse = active
    ? `<span style="position:absolute;inset:-6px;border-radius:9999px;background:rgba(255,103,31,.35);animation:itineraryPulse 1.6s ease-out infinite;"></span>`
    : '';
  return L.divIcon({
    className: 'home-state-marker',
    html: `
      <div style="position:relative;display:flex;flex-direction:column;align-items:center;">
        ${pulse}
        <div style="position:relative;width:${size}px;height:${size}px;border-radius:9999px;background:${bg};color:${fg};border:3px solid #FF671F;display:flex;align-items:center;justify-content:center;box-shadow:0 6px 16px rgba(0,0,0,.28);transition:all .2s ease;">
          <svg xmlns="http://www.w3.org/2000/svg" width="${Math.round(size*0.5)}" height="${Math.round(size*0.5)}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
        </div>
        ${active ? `<div style="margin-top:4px;padding:2px 8px;background:#111827;color:#fff;border-radius:9999px;font-size:10px;font-weight:600;font-family:system-ui;white-space:nowrap;box-shadow:0 2px 6px rgba(0,0,0,.25)">${name}</div>` : ''}
      </div>`,
    iconSize: [size, size + (active ? 22 : 0)],
    iconAnchor: [size / 2, size / 2],
  });
}

const FitToIndia: React.FC = () => {
  const map = useMap();
  React.useEffect(() => {
    const b = L.latLngBounds([[6.5, 68], [35.5, 97.5]]);
    map.fitBounds(b, { padding: [20, 20] });
  }, [map]);
  return null;
};

const HomeIndiaMap: React.FC = () => {
  const navigate = useNavigate();
  const [active, setActive] = useState<string | null>(null);

  const markers = useMemo(
    () => states.filter(s => stateCoords[s.id]).map(s => ({ state: s, pos: stateCoords[s.id] })),
    []
  );

  return (
    <div className="relative w-full h-full">
      <MapContainer
        center={[22.5, 79]}
        zoom={5}
        scrollWheelZoom
        style={{ width: '100%', height: '100%', borderRadius: 16 }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <FitToIndia />

        {markers.map(({ state, pos }) => (
          <Marker
            key={state.id}
            position={pos}
            icon={makeStatePin(state.name, active === state.id)}
            eventHandlers={{
              click: () => setActive(state.id),
              mouseover: () => setActive(state.id),
            }}
          >
            <Tooltip direction="top" offset={[0, -14]} opacity={0.95}>
              <span style={{ fontWeight: 600 }}>{state.name}</span>
            </Tooltip>
            <Popup className="home-state-popup" maxWidth={320} minWidth={260}>
              <div style={{ fontFamily: 'system-ui', width: 280 }}>
                <div style={{ position: 'relative', height: 120, borderRadius: 10, overflow: 'hidden', marginBottom: 10 }}>
                  <img
                    src={state.image}
                    alt={state.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                  />
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,.55), transparent 60%)' }} />
                  <div style={{ position: 'absolute', bottom: 8, left: 10, right: 10, color: '#fff' }}>
                    <div style={{ display: 'inline-block', background: '#FF671F', padding: '2px 8px', borderRadius: 9999, fontSize: 10, fontWeight: 700, letterSpacing: 0.3, marginBottom: 4 }}>
                      {state.capital}
                    </div>
                    <div style={{ fontSize: 16, fontWeight: 800, lineHeight: 1.2 }}>{state.name}</div>
                  </div>
                </div>
                <div style={{ fontSize: 12, color: '#4b5563', lineHeight: 1.5, marginBottom: 8 }}>
                  {state.description}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, fontSize: 11, color: '#374151', marginBottom: 10 }}>
                  <div><strong style={{ color: '#111827' }}>Language:</strong> {state.language}</div>
                  <div><strong style={{ color: '#111827' }}>Area:</strong> {state.area}</div>
                  <div style={{ gridColumn: '1 / -1' }}><strong style={{ color: '#111827' }}>Famous for:</strong> {state.famousFor}</div>
                </div>
                <button
                  onClick={() => navigate(state.path)}
                  style={{
                    width: '100%',
                    background: '#FF671F',
                    color: '#fff',
                    border: 'none',
                    padding: '8px 12px',
                    borderRadius: 9999,
                    fontSize: 12,
                    fontWeight: 700,
                    cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(255,103,31,.35)',
                  }}
                >
                  Explore {state.name} →
                </button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      <div className="absolute top-3 left-3 z-[400] bg-background/95 backdrop-blur-md rounded-xl shadow-xl border border-border px-3 py-2 text-xs flex items-center gap-2">
        <MapPin className="w-3.5 h-3.5 text-india-orange" />
        <span className="font-semibold">Explore India</span>
        <span className="text-muted-foreground">— tap a state</span>
      </div>
    </div>
  );
};

export default HomeIndiaMap;