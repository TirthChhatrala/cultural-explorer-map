import React, { useMemo, useState } from 'react';
import Layout from '../components/Layout';
import { states } from '../data/states';
import { motion } from 'framer-motion';
import { ArrowLeftRight, MapPin, Users, Languages, Star, Flag } from 'lucide-react';

const Row: React.FC<{
  icon: React.ElementType;
  label: string;
  a: React.ReactNode;
  b: React.ReactNode;
}> = ({ icon: Icon, label, a, b }) => (
  <div className="grid grid-cols-3 gap-4 py-4 border-b border-border last:border-0">
    <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
      <Icon className="w-4 h-4 text-india-orange" /> {label}
    </div>
    <div className="text-sm">{a}</div>
    <div className="text-sm">{b}</div>
  </div>
);

const CompareCultures: React.FC = () => {
  const [aId, setAId] = useState(states[0]?.id ?? '');
  const [bId, setBId] = useState(states[1]?.id ?? '');
  const a = useMemo(() => states.find(s => s.id === aId), [aId]);
  const b = useMemo(() => states.find(s => s.id === bId), [bId]);

  const swap = () => {
    setAId(bId);
    setBId(aId);
  };

  return (
    <Layout>
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 text-india-orange mb-2">
            <ArrowLeftRight className="w-5 h-5" />
            <span className="text-sm uppercase tracking-widest font-medium">Compare Cultures</span>
          </div>
          <h1 className="text-4xl font-display font-bold mb-3">Side-by-Side Explorer</h1>
          <p className="text-muted-foreground">Pick any two states to see how they differ in geography, language and heritage.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-4 items-center mb-8">
          <select
            value={aId}
            onChange={e => setAId(e.target.value)}
            className="w-full p-3 rounded-xl border border-border bg-white dark:bg-gray-800 focus:ring-2 focus:ring-india-orange/40"
          >
            {states.map(s => (<option key={s.id} value={s.id}>{s.name}</option>))}
          </select>
          <button
            onClick={swap}
            className="h-12 w-12 mx-auto rounded-full bg-india-orange text-white flex items-center justify-center hover:rotate-180 transition-transform"
            aria-label="Swap"
          >
            <ArrowLeftRight className="w-5 h-5" />
          </button>
          <select
            value={bId}
            onChange={e => setBId(e.target.value)}
            className="w-full p-3 rounded-xl border border-border bg-white dark:bg-gray-800 focus:ring-2 focus:ring-india-orange/40"
          >
            {states.map(s => (<option key={s.id} value={s.id}>{s.name}</option>))}
          </select>
        </div>

        {a && b && (
          <motion.div
            key={`${a.id}-${b.id}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-border overflow-hidden"
          >
            <div className="grid grid-cols-2">
              {[a, b].map(s => (
                <div key={s.id} className="relative h-40">
                  <img src={s.image} alt={s.name} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <div className="absolute bottom-3 left-4 text-white">
                    <p className="text-xs uppercase opacity-90">{s.capital}</p>
                    <p className="text-2xl font-display font-bold">{s.name}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-6">
              <Row icon={Users} label="Population" a={a.population} b={b.population} />
              <Row icon={MapPin} label="Area" a={a.area} b={b.area} />
              <Row icon={Languages} label="Language" a={a.language} b={b.language} />
              <Row icon={Star} label="Famous For" a={a.famousFor} b={b.famousFor} />
              <Row icon={Flag} label="Capital" a={a.capital} b={b.capital} />
              <Row
                icon={Users}
                label="Notable Figures"
                a={a.freedomFighters.join(', ')}
                b={b.freedomFighters.join(', ')}
              />
            </div>
          </motion.div>
        )}
      </div>
    </Layout>
  );
};

export default CompareCultures;