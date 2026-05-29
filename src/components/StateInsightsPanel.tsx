import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Cloud, CloudRain, Sun, Snowflake, Wind, Clock, MapPin, Loader2 } from 'lucide-react';

// Approximate coordinates of state capitals (used for weather lookup).
const STATE_COORDS: Record<string, { lat: number; lon: number }> = {
  andhrapradesh: { lat: 16.5062, lon: 80.6480 },
  arunachalpradesh: { lat: 27.0844, lon: 93.6053 },
  assam: { lat: 26.1433, lon: 91.7898 },
  bihar: { lat: 25.5941, lon: 85.1376 },
  chhattisgarh: { lat: 21.2514, lon: 81.6296 },
  goa: { lat: 15.4909, lon: 73.8278 },
  gujarat: { lat: 23.2156, lon: 72.6369 },
  haryana: { lat: 30.7333, lon: 76.7794 },
  himachalpradesh: { lat: 31.1048, lon: 77.1734 },
  jharkhand: { lat: 23.3441, lon: 85.3096 },
  karnataka: { lat: 12.9716, lon: 77.5946 },
  kerala: { lat: 8.5241, lon: 76.9366 },
  madhyapradesh: { lat: 23.2599, lon: 77.4126 },
  maharashtra: { lat: 19.0760, lon: 72.8777 },
  manipur: { lat: 24.8170, lon: 93.9368 },
  meghalaya: { lat: 25.5788, lon: 91.8933 },
  mizoram: { lat: 23.7271, lon: 92.7176 },
  nagaland: { lat: 25.6747, lon: 94.1086 },
  odisha: { lat: 20.2961, lon: 85.8245 },
  punjab: { lat: 30.7333, lon: 76.7794 },
  rajasthan: { lat: 26.9124, lon: 75.7873 },
  sikkim: { lat: 27.3314, lon: 88.6138 },
  tamilnadu: { lat: 13.0827, lon: 80.2707 },
  telangana: { lat: 17.3850, lon: 78.4867 },
  tripura: { lat: 23.8315, lon: 91.2868 },
  uttarpradesh: { lat: 26.8467, lon: 80.9462 },
  uttarakhand: { lat: 30.3165, lon: 78.0322 },
  westbengal: { lat: 22.5726, lon: 88.3639 },
  delhi: { lat: 28.6139, lon: 77.2090 },
};

interface WeatherData {
  temp: number;
  feels: number;
  wind: number;
  humidity: number;
  code: number;
}

const weatherInfo = (code: number) => {
  if ([0, 1].includes(code)) return { label: 'Clear', Icon: Sun, color: 'text-amber-500' };
  if ([2, 3].includes(code)) return { label: 'Cloudy', Icon: Cloud, color: 'text-slate-400' };
  if ([45, 48].includes(code)) return { label: 'Foggy', Icon: Cloud, color: 'text-slate-300' };
  if (code >= 51 && code <= 67) return { label: 'Rainy', Icon: CloudRain, color: 'text-blue-500' };
  if (code >= 71 && code <= 77) return { label: 'Snow', Icon: Snowflake, color: 'text-sky-300' };
  if (code >= 80 && code <= 82) return { label: 'Showers', Icon: CloudRain, color: 'text-blue-600' };
  if (code >= 95) return { label: 'Thunderstorm', Icon: CloudRain, color: 'text-indigo-600' };
  return { label: 'Fair', Icon: Sun, color: 'text-amber-500' };
};

interface Props {
  stateId: string;
  stateName: string;
  capital: string;
  famousFor: string;
}

const StateInsightsPanel: React.FC<Props> = ({ stateId, stateName, capital, famousFor }) => {
  const coords = STATE_COORDS[stateId];
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (!coords) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    setError(null);
    fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${coords.lat}&longitude=${coords.lon}&current=temperature_2m,apparent_temperature,relative_humidity_2m,weather_code,wind_speed_10m&timezone=Asia%2FKolkata`,
    )
      .then((r) => r.json())
      .then((d) => {
        if (cancelled) return;
        const c = d.current;
        setWeather({
          temp: Math.round(c.temperature_2m),
          feels: Math.round(c.apparent_temperature),
          wind: Math.round(c.wind_speed_10m),
          humidity: Math.round(c.relative_humidity_2m),
          code: c.weather_code,
        });
      })
      .catch(() => !cancelled && setError('Weather unavailable'))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [coords]);

  const timeStr = new Intl.DateTimeFormat('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
    timeZone: 'Asia/Kolkata',
  }).format(now);
  const dateStr = new Intl.DateTimeFormat('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'Asia/Kolkata',
  }).format(now);

  const attractions = famousFor
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

  const wInfo = weather ? weatherInfo(weather.code) : null;

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="mt-12 mb-12"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Weather card */}
        <div className="rounded-2xl bg-gradient-to-br from-sky-500 to-blue-700 text-white p-6 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm uppercase tracking-widest opacity-80">Real-time Weather</p>
              <h3 className="text-xl font-display font-semibold">{capital}, {stateName}</h3>
            </div>
            {wInfo && <wInfo.Icon className={`w-12 h-12 ${wInfo.color} drop-shadow`} />}
          </div>

          {loading && (
            <div className="flex items-center gap-2 py-6">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Fetching latest conditions…</span>
            </div>
          )}

          {error && <p className="py-6 text-white/90">{error}</p>}

          {weather && wInfo && (
            <>
              <div className="flex items-end gap-3 mb-4">
                <span className="text-6xl font-bold tracking-tight">{weather.temp}°</span>
                <div className="pb-2">
                  <p className="text-lg font-medium">{wInfo.label}</p>
                  <p className="text-sm opacity-80">Feels like {weather.feels}°C</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-white/20">
                <div className="flex items-center gap-2">
                  <Wind className="w-4 h-4" />
                  <span className="text-sm">Wind {weather.wind} km/h</span>
                </div>
                <div className="flex items-center gap-2">
                  <Cloud className="w-4 h-4" />
                  <span className="text-sm">Humidity {weather.humidity}%</span>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Local time card */}
        <div className="rounded-2xl bg-gradient-to-br from-india-orange to-rose-600 text-white p-6 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm uppercase tracking-widest opacity-80">Local Time</p>
              <h3 className="text-xl font-display font-semibold">{capital}</h3>
            </div>
            <Clock className="w-12 h-12 opacity-90" />
          </div>
          <p className="text-5xl md:text-6xl font-bold tracking-tight tabular-nums">{timeStr}</p>
          <p className="mt-3 opacity-90">{dateStr}</p>
          <p className="mt-4 text-xs opacity-75 border-t border-white/20 pt-3">Timezone: Asia/Kolkata (IST · UTC+5:30)</p>
        </div>
      </div>

      {/* Nearby attractions */}
      {attractions.length > 0 && (
        <div className="bg-white rounded-2xl shadow-md p-6">
          <div className="flex items-center gap-2 mb-4">
            <MapPin className="w-5 h-5 text-india-orange" />
            <h3 className="text-xl font-display font-semibold">Nearby Attractions</h3>
          </div>
          <p className="text-sm text-muted-foreground mb-5">
            Recommended places to explore around {capital} and across {stateName}.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {attractions.map((a, i) => (
              <motion.div
                key={a}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className="group relative overflow-hidden rounded-xl border border-border bg-secondary/10 p-4 hover:shadow-lg transition-shadow"
              >
                <div className="absolute top-0 right-0 w-20 h-20 bg-india-orange/10 rounded-full -mr-10 -mt-10 group-hover:scale-150 transition-transform" />
                <div className="relative">
                  <p className="text-xs font-medium text-india-orange uppercase tracking-wider mb-1">Attraction #{i + 1}</p>
                  <p className="font-display font-semibold text-lg leading-tight">{a}</p>
                  <a
                    href={`https://www.google.com/maps/search/${encodeURIComponent(a + ', ' + stateName + ', India')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-sm text-india-orange mt-3 hover:underline"
                  >
                    View on map →
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </motion.section>
  );
};

export default StateInsightsPanel;