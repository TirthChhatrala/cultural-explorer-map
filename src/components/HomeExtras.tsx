import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Calendar, TrendingUp, Globe2, Users, Languages, MapPin, Mountain, Flag } from 'lucide-react';

// ---------- Festival Countdown ----------
interface Festival {
  name: string;
  date: string; // ISO date for the upcoming celebration
  emoji: string;
  region: string;
  color: string;
}

const FESTIVALS: Festival[] = [
  { name: 'Holi', date: '2026-03-03', emoji: '🎨', region: 'Pan-India', color: 'from-pink-500 to-violet-500' },
  { name: 'Diwali', date: '2026-11-08', emoji: '🪔', region: 'Pan-India', color: 'from-amber-500 to-orange-600' },
  { name: 'Pongal', date: '2027-01-14', emoji: '🌾', region: 'Tamil Nadu', color: 'from-yellow-500 to-orange-500' },
  { name: 'Onam', date: '2026-08-26', emoji: '🌸', region: 'Kerala', color: 'from-green-500 to-emerald-600' },
  { name: 'Durga Puja', date: '2026-09-26', emoji: '🛕', region: 'West Bengal', color: 'from-red-500 to-rose-600' },
  { name: 'Ganesh Chaturthi', date: '2026-09-14', emoji: '🐘', region: 'Maharashtra', color: 'from-fuchsia-500 to-purple-600' },
];

const useCountdown = (target: string) => {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);
  const diff = Math.max(0, new Date(target).getTime() - now);
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff / 3600000) % 24);
  const minutes = Math.floor((diff / 60000) % 60);
  const seconds = Math.floor((diff / 1000) % 60);
  return { days, hours, minutes, seconds };
};

const CountdownCard: React.FC<{ f: Festival }> = ({ f }) => {
  const { days, hours, minutes, seconds } = useCountdown(f.date);
  return (
    <motion.div
      whileHover={{ y: -4 }}
      className={`relative rounded-2xl p-5 text-white bg-gradient-to-br ${f.color} shadow-lg overflow-hidden`}
    >
      <div className="absolute -right-4 -top-4 text-7xl opacity-20">{f.emoji}</div>
      <p className="text-xs uppercase tracking-widest opacity-90">{f.region}</p>
      <h3 className="text-2xl font-display font-bold mt-1">{f.name}</h3>
      <div className="grid grid-cols-4 gap-2 mt-4">
        {[
          { v: days, l: 'Days' },
          { v: hours, l: 'Hrs' },
          { v: minutes, l: 'Min' },
          { v: seconds, l: 'Sec' },
        ].map(x => (
          <div key={x.l} className="bg-white/20 backdrop-blur rounded-lg p-2 text-center">
            <div className="text-xl font-bold tabular-nums">{String(x.v).padStart(2, '0')}</div>
            <div className="text-[10px] opacity-90">{x.l}</div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export const FestivalCountdownSection: React.FC = () => {
  const upcoming = [...FESTIVALS]
    .filter(f => new Date(f.date).getTime() > Date.now())
    .sort((a, b) => +new Date(a.date) - +new Date(b.date))
    .slice(0, 3);

  return (
    <section className="mb-24">
      <div className="flex items-end justify-between mb-8">
        <div>
          <div className="flex items-center gap-2 text-india-orange mb-2">
            <Calendar className="w-5 h-5" />
            <span className="text-sm uppercase tracking-widest font-medium">Upcoming Festivals</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-display font-bold">Live Festival Countdown</h2>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {upcoming.map(f => (
          <CountdownCard key={f.name} f={f} />
        ))}
      </div>
    </section>
  );
};

// ---------- Trending Destinations ----------
const TRENDING = [
  { id: 'rajasthan', name: 'Rajasthan', tag: 'Royal Heritage', score: 98, image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?q=80&w=1000&auto=format&fit=crop' },
  { id: 'kerala', name: 'Kerala', tag: 'Backwaters', score: 95, image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?q=80&w=1000&auto=format&fit=crop' },
  { id: 'himachalpradesh', name: 'Himachal', tag: 'Himalayan Escape', score: 93, image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?q=80&w=1000&auto=format&fit=crop' },
  { id: 'goa', name: 'Goa', tag: 'Beaches', score: 91, image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?q=80&w=1000&auto=format&fit=crop' },
];

export const TrendingDestinationsSection: React.FC = () => {
  const navigate = useNavigate();
  return (
    <section className="mb-24">
      <div className="flex items-center gap-2 text-india-orange mb-2">
        <TrendingUp className="w-5 h-5" />
        <span className="text-sm uppercase tracking-widest font-medium">Trending Now</span>
      </div>
      <h2 className="text-3xl md:text-4xl font-display font-bold mb-8">Most-Loved Destinations This Week</h2>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        {TRENDING.map((t, i) => (
          <motion.button
            key={t.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            whileHover={{ y: -6 }}
            onClick={() => navigate(`/state/${t.id}`)}
            className="relative h-60 rounded-2xl overflow-hidden text-left shadow-lg group"
          >
            <img src={t.image} alt={t.name} className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
            <div className="absolute top-3 right-3 bg-india-orange text-white text-xs font-bold px-2 py-1 rounded-full">
              🔥 {t.score}
            </div>
            <div className="absolute bottom-0 left-0 p-4 text-white">
              <p className="text-xs uppercase tracking-widest opacity-90">{t.tag}</p>
              <p className="text-xl font-display font-semibold">{t.name}</p>
            </div>
          </motion.button>
        ))}
      </div>
    </section>
  );
};

// ---------- India Fact Cards ----------
const FACTS = [
  { icon: Users, label: 'Population', value: '1.43 B', sub: "World's most populous", color: 'bg-amber-500' },
  { icon: MapPin, label: 'States & UTs', value: '28 + 8', sub: 'Diverse regions', color: 'bg-rose-500' },
  { icon: Languages, label: 'Languages', value: '120+', sub: '22 officially recognised', color: 'bg-violet-500' },
  { icon: Mountain, label: 'Highest Peak', value: '8,586 m', sub: 'Kangchenjunga', color: 'bg-sky-500' },
  { icon: Globe2, label: 'Coastline', value: '7,516 km', sub: 'Across 9 states', color: 'bg-emerald-500' },
  { icon: Flag, label: 'Independence', value: '15 Aug 1947', sub: '77+ years', color: 'bg-orange-500' },
];

export const IndiaFactCardsSection: React.FC = () => (
  <section className="mb-24">
    <div className="text-center mb-10">
      <div className="inline-flex items-center gap-2 text-india-orange mb-2">
        <Globe2 className="w-5 h-5" />
        <span className="text-sm uppercase tracking-widest font-medium">Country Snapshot</span>
      </div>
      <h2 className="text-3xl md:text-4xl font-display font-bold">India at a Glance</h2>
    </div>
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {FACTS.map((f, i) => (
        <motion.div
          key={f.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.06 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-md hover:shadow-xl transition border border-border"
        >
          <div className={`w-10 h-10 rounded-xl ${f.color} text-white flex items-center justify-center mb-3`}>
            <f.icon className="w-5 h-5" />
          </div>
          <p className="text-xs uppercase tracking-wider text-muted-foreground">{f.label}</p>
          <p className="text-xl font-bold mt-1">{f.value}</p>
          <p className="text-xs text-muted-foreground mt-1">{f.sub}</p>
        </motion.div>
      ))}
    </div>
  </section>
);