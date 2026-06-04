import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useToast } from '../hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Sparkles, Wand2, MapPin, Clock, Users, Wallet, Plane, Train, Car, Bus,
  Hotel, Utensils, Compass, Save, Share2, Download, RefreshCw, Edit3, X, Plus, LogIn, Lightbulb, Calendar, Route,
} from 'lucide-react';
import IndiaMapSVG from '@/components/IndiaMapSVG';
import ShareModal from '@/components/ShareModal';
import { useLanguage } from '@/context/LanguageContext';

interface Day {
  day: number;
  date?: string | null;
  location: string;
  travelFrom?: string | null;
  travelTime?: string | null;
  transport?: string | null;
  morning: string;
  afternoon: string;
  evening: string;
  attractions: string[];
  food: string[];
  accommodation: { name: string; type: string; estimatedCost: number };
  dailyCost: number;
  tips: string[];
}

interface Itinerary {
  title: string;
  summary: string;
  totalEstimatedCost: number;
  currency: string;
  states: string[];
  days: Day[];
  budgetBreakdown: { accommodation: number; transport: number; food: number; activities: number; misc: number };
  recommendations: {
    food: string[]; culturalExperiences: string[]; mustVisit: string[];
    nearbyAttractions: string[]; budgetTips: string[]; importantNotes: string[];
  };
}

const PREFERENCE_OPTIONS = [
  'Cultural & Heritage', 'Adventure', 'Spiritual', 'Beaches', 'Hill Stations',
  'Wildlife', 'Food & Cuisine', 'Photography', 'Shopping', 'Relaxation',
];

const TRANSPORT_OPTIONS = [
  { id: 'flight', label: 'Flight', icon: Plane },
  { id: 'train', label: 'Train', icon: Train },
  { id: 'car', label: 'Car/Cab', icon: Car },
  { id: 'bus', label: 'Bus', icon: Bus },
  { id: 'mixed', label: 'Mixed', icon: Route },
];

const STORAGE_KEY = 'ai-itineraries';

type Currency = 'INR' | 'USD';
const FX_CACHE_KEY = 'fx-usd-inr';
const FX_TTL_MS = 1000 * 60 * 60 * 6; // 6h

const AITripPlanner: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  const { theme } = useTheme();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { lang } = useLanguage();

  const [destinations, setDestinations] = useState<string[]>(['']);
  const [duration, setDuration] = useState(5);
  const [travelers, setTravelers] = useState(2);
  const [budget, setBudget] = useState(50000);
  const [preferences, setPreferences] = useState<string[]>(['Cultural & Heritage']);
  const [transport, setTransport] = useState('mixed');
  const [pace, setPace] = useState<'relaxed' | 'balanced' | 'packed'>('balanced');
  const [notes, setNotes] = useState('');

  const [loading, setLoading] = useState(false);
  const [itinerary, setItinerary] = useState<Itinerary | null>(null);
  const [editing, setEditing] = useState<number | null>(null);
  const [shareOpen, setShareOpen] = useState(false);
  const [currency, setCurrency] = useState<Currency>('INR');
  const [usdToInr, setUsdToInr] = useState<number>(83);
  const [fxUpdatedAt, setFxUpdatedAt] = useState<string | null>(null);

  // Load FX rate (USD -> INR) with cache + fallback
  React.useEffect(() => {
    const cached = (() => {
      try { return JSON.parse(localStorage.getItem(FX_CACHE_KEY) || 'null'); } catch { return null; }
    })();
    if (cached && Date.now() - cached.ts < FX_TTL_MS && cached.rate) {
      setUsdToInr(cached.rate);
      setFxUpdatedAt(new Date(cached.ts).toLocaleString());
      return;
    }
    (async () => {
      try {
        const r = await fetch('https://open.er-api.com/v6/latest/USD');
        const j = await r.json();
        const rate = j?.rates?.INR;
        if (rate && typeof rate === 'number') {
          setUsdToInr(rate);
          const ts = Date.now();
          setFxUpdatedAt(new Date(ts).toLocaleString());
          localStorage.setItem(FX_CACHE_KEY, JSON.stringify({ rate, ts }));
        }
      } catch {
        // keep fallback rate
      }
    })();
  }, []);

  // Format any INR amount into the active currency
  const fmt = (inrAmount?: number) => {
    if (inrAmount == null || isNaN(Number(inrAmount))) return '—';
    const n = Number(inrAmount);
    if (currency === 'INR') return `₹${Math.round(n).toLocaleString('en-IN')}`;
    const usd = n / usdToInr;
    return `$${usd.toLocaleString('en-US', { maximumFractionDigits: usd < 100 ? 2 : 0 })}`;
  };

  if (!isAuthenticated) {
    return (
      <Layout>
        <div className="max-w-2xl mx-auto px-4 py-24 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="inline-flex p-5 rounded-2xl bg-india-orange/10 mb-6">
              <Sparkles className="w-12 h-12 text-india-orange" />
            </div>
            <h1 className="text-3xl md:text-4xl font-display font-bold mb-3">
              AI Trip Planner
            </h1>
            <p className="text-muted-foreground mb-8">
              Sign in to unlock AI-powered, personalized travel plans across India.
            </p>
            <div className="flex justify-center gap-3">
              <Button onClick={() => navigate('/login')} className="bg-india-orange hover:bg-india-orange/90">
                <LogIn className="w-4 h-4 mr-2" /> Sign in
              </Button>
              <Button variant="outline" onClick={() => navigate('/signup')}>Create account</Button>
            </div>
          </motion.div>
        </div>
      </Layout>
    );
  }

  const togglePref = (p: string) => {
    setPreferences((prev) => prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p]);
  };

  const updateDestination = (i: number, val: string) => {
    setDestinations((prev) => prev.map((d, idx) => idx === i ? val : d));
  };
  const addDestination = () => setDestinations((p) => [...p, '']);
  const removeDestination = (i: number) => setDestinations((p) => p.filter((_, idx) => idx !== i));

  const generate = async () => {
    const dests = destinations.map(d => d.trim()).filter(Boolean);
    if (dests.length === 0) {
      toast({ title: 'Add a destination', description: 'Please enter at least one destination.', variant: 'destructive' });
      return;
    }
    setLoading(true);
    setItinerary(null);
    try {
      const { data, error } = await supabase.functions.invoke('ai-trip-planner', {
        body: {
          destinations: dests,
          duration,
          travelers,
          budget,
          currency: 'INR',
          preferences,
          transport,
          pace,
          language: lang,
          notes,
        },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      setItinerary(data.itinerary as Itinerary);
      toast({ title: 'Your itinerary is ready!', description: 'Scroll down to view your personalized plan.' });
    } catch (e: any) {
      toast({ title: 'Could not generate plan', description: e?.message ?? 'Please try again.', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const saveItinerary = () => {
    if (!itinerary) return;
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    stored.unshift({ id: Date.now(), email: user?.email, savedAt: new Date().toISOString(), itinerary });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stored.slice(0, 50)));
    toast({ title: 'Saved', description: 'Itinerary saved locally.' });
  };

  const exportItinerary = () => {
    if (!itinerary) return;
    const blob = new Blob([JSON.stringify(itinerary, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${itinerary.title.replace(/\s+/g, '_')}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const updateDay = (idx: number, patch: Partial<Day>) => {
    if (!itinerary) return;
    setItinerary({ ...itinerary, days: itinerary.days.map((d, i) => i === idx ? { ...d, ...patch } : d) });
  };

  const shareData = useMemo(() => itinerary ? {
    title: itinerary.title,
    description: itinerary.summary,
    url: typeof window !== 'undefined' ? window.location.href : '',
  } : null, [itinerary]);

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 py-10">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <span className="inline-flex items-center gap-2 px-3 py-1 bg-india-orange/10 text-india-orange rounded-full text-sm font-medium mb-4">
            <Sparkles className="w-4 h-4" /> AI Powered
          </span>
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-3">
            AI <span className="text-india-orange">Trip Planner</span>
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Tell us where, when, and how — get a complete India itinerary with routes, stays, food, and budget in seconds.
          </p>
        </motion.div>

        {/* Form */}
        <Card className="mb-10 border-2 border-india-orange/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wand2 className="w-5 h-5 text-india-orange" /> Plan your trip
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Destinations */}
            <div>
              <label className="text-sm font-medium mb-2 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-india-orange" /> Destinations
              </label>
              <div className="space-y-2">
                {destinations.map((d, i) => (
                  <div key={i} className="flex gap-2">
                    <Input
                      placeholder={`e.g. ${i === 0 ? 'Jaipur, Rajasthan' : 'Agra'}`}
                      value={d}
                      onChange={(e) => updateDestination(i, e.target.value)}
                    />
                    {destinations.length > 1 && (
                      <Button variant="ghost" size="icon" onClick={() => removeDestination(i)}>
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button variant="outline" size="sm" onClick={addDestination}>
                  <Plus className="w-4 h-4 mr-1" /> Add another destination
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-india-orange" /> Duration (days)
                </label>
                <Input type="number" min={1} max={30} value={duration} onChange={(e) => setDuration(Number(e.target.value))} />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 flex items-center gap-2">
                  <Users className="w-4 h-4 text-india-orange" /> Travelers
                </label>
                <Input type="number" min={1} max={20} value={travelers} onChange={(e) => setTravelers(Number(e.target.value))} />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 flex items-center gap-2">
                  <Wallet className="w-4 h-4 text-india-orange" /> Total budget (₹)
                </label>
                <Input type="number" min={1000} step={1000} value={budget} onChange={(e) => setBudget(Number(e.target.value))} />
                <p className="text-xs text-muted-foreground mt-1">
                  ≈ ${(budget / usdToInr).toLocaleString('en-US', { maximumFractionDigits: 0 })} USD
                </p>
              </div>
            </div>

            {/* Transport */}
            <div>
              <label className="text-sm font-medium mb-2 block">Transportation mode</label>
              <div className="flex flex-wrap gap-2">
                {TRANSPORT_OPTIONS.map((opt) => {
                  const Icon = opt.icon;
                  const active = transport === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setTransport(opt.id)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all ${
                        active
                          ? 'bg-india-orange text-white border-india-orange'
                          : `${theme === 'dark' ? 'bg-gray-800 border-gray-700 hover:bg-gray-700' : 'bg-white border-gray-200 hover:bg-gray-50'}`
                      }`}
                    >
                      <Icon className="w-4 h-4" /> {opt.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Preferences */}
            <div>
              <label className="text-sm font-medium mb-2 block">Travel preferences</label>
              <div className="flex flex-wrap gap-2">
                {PREFERENCE_OPTIONS.map((p) => {
                  const active = preferences.includes(p);
                  return (
                    <button
                      key={p}
                      type="button"
                      onClick={() => togglePref(p)}
                      className={`px-3 py-1.5 rounded-full text-sm border transition-all ${
                        active
                          ? 'bg-india-orange/10 border-india-orange text-india-orange font-medium'
                          : `${theme === 'dark' ? 'border-gray-700 hover:border-gray-500' : 'border-gray-200 hover:border-gray-400'}`
                      }`}
                    >
                      {p}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Pace */}
            <div>
              <label className="text-sm font-medium mb-2 block">Travel pace</label>
              <div className="flex gap-2">
                {(['relaxed', 'balanced', 'packed'] as const).map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPace(p)}
                    className={`px-4 py-2 rounded-lg text-sm capitalize border transition-all ${
                      pace === p
                        ? 'bg-india-orange text-white border-india-orange'
                        : `${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Special requests (optional)</label>
              <Textarea
                placeholder="Vegetarian food, no early morning starts, must visit Taj Mahal, anniversary trip..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
              />
            </div>

            <Button
              onClick={generate}
              disabled={loading}
              size="lg"
              className="w-full bg-india-orange hover:bg-india-orange/90 text-white"
            >
              {loading ? (
                <><RefreshCw className="w-5 h-5 mr-2 animate-spin" /> Crafting your itinerary...</>
              ) : (
                <><Sparkles className="w-5 h-5 mr-2" /> Generate AI Itinerary</>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Loading skeleton */}
        {loading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className={`h-32 rounded-xl animate-pulse ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'}`} />
            ))}
          </motion.div>
        )}

        {/* Result */}
        <AnimatePresence>
          {itinerary && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-8"
            >
              {/* Summary */}
              <Card className="overflow-hidden">
                <div className="bg-gradient-to-r from-india-orange to-amber-500 p-6 text-white">
                  <h2 className="text-2xl md:text-3xl font-display font-bold mb-2">{itinerary.title}</h2>
                  <p className="opacity-90">{itinerary.summary}</p>
                  <div className="flex flex-wrap gap-3 mt-4">
                    <Badge className="bg-white/20 text-white border-0">{itinerary.days.length} days</Badge>
                    <Badge className="bg-white/20 text-white border-0">{travelers} travelers</Badge>
                    <Badge className="bg-white/20 text-white border-0">
                      {fmt(itinerary.totalEstimatedCost)} estimated
                    </Badge>
                    {itinerary.states?.slice(0, 4).map(s => (
                      <Badge key={s} className="bg-white/20 text-white border-0">{s}</Badge>
                    ))}
                  </div>
                </div>
                <CardContent className="p-4 flex flex-wrap items-center gap-2">
                  {/* Currency switcher */}
                  <div className="flex items-center gap-1 bg-muted rounded-lg p-1 mr-auto" data-no-translate translate="no">
                    {(['INR', 'USD'] as const).map((c) => (
                      <button
                        key={c}
                        onClick={() => setCurrency(c)}
                        className={`px-3 py-1 rounded-md text-xs font-semibold transition-colors ${
                          currency === c ? 'bg-india-orange text-white' : 'text-muted-foreground hover:text-foreground'
                        }`}
                      >
                        {c === 'INR' ? '₹ INR' : '$ USD'}
                      </button>
                    ))}
                    <span className="text-[10px] text-muted-foreground px-2 hidden sm:inline">
                      1 USD ≈ ₹{usdToInr.toFixed(2)}
                    </span>
                  </div>
                  <Button size="sm" variant="outline" onClick={generate}>
                    <RefreshCw className="w-4 h-4 mr-1" /> Regenerate
                  </Button>
                  <Button size="sm" variant="outline" onClick={saveItinerary}>
                    <Save className="w-4 h-4 mr-1" /> Save
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => setShareOpen(true)}>
                    <Share2 className="w-4 h-4 mr-1" /> Share
                  </Button>
                  <Button size="sm" variant="outline" onClick={exportItinerary}>
                    <Download className="w-4 h-4 mr-1" /> Export
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => window.print()}>
                    Print
                  </Button>
                </CardContent>
              </Card>

              <Tabs defaultValue="schedule" className="w-full">
                <TabsList className="grid grid-cols-4 max-w-2xl">
                  <TabsTrigger value="schedule"><Calendar className="w-4 h-4 mr-1" />Schedule</TabsTrigger>
                  <TabsTrigger value="table">Day Table</TabsTrigger>
                  <TabsTrigger value="map"><MapPin className="w-4 h-4 mr-1" />Map</TabsTrigger>
                  <TabsTrigger value="tips"><Lightbulb className="w-4 h-4 mr-1" />Tips</TabsTrigger>
                </TabsList>

                {/* Schedule cards */}
                <TabsContent value="schedule" className="space-y-4 mt-6">
                  {itinerary.days.map((d, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                    >
                      <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-full bg-india-orange text-white flex items-center justify-center font-bold">
                              {d.day}
                            </div>
                            <div>
                              <CardTitle className="text-lg">Day {d.day} — {d.location}</CardTitle>
                              {d.travelFrom && (
                                <p className="text-xs text-muted-foreground flex items-center gap-1">
                                  <Route className="w-3 h-3" /> {d.travelFrom} → {d.location} · {d.travelTime} · {d.transport}
                                </p>
                              )}
                            </div>
                          </div>
                          <Button variant="ghost" size="sm" onClick={() => setEditing(editing === idx ? null : idx)}>
                            <Edit3 className="w-4 h-4" />
                          </Button>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          {editing === idx ? (
                            <div className="space-y-2">
                              <Textarea value={d.morning} onChange={(e) => updateDay(idx, { morning: e.target.value })} placeholder="Morning" />
                              <Textarea value={d.afternoon} onChange={(e) => updateDay(idx, { afternoon: e.target.value })} placeholder="Afternoon" />
                              <Textarea value={d.evening} onChange={(e) => updateDay(idx, { evening: e.target.value })} placeholder="Evening" />
                            </div>
                          ) : (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                              <div><strong className="text-india-orange">Morning:</strong> {d.morning}</div>
                              <div><strong className="text-india-orange">Afternoon:</strong> {d.afternoon}</div>
                              <div><strong className="text-india-orange">Evening:</strong> {d.evening}</div>
                            </div>
                          )}
                          <div className="flex flex-wrap gap-2 pt-2 border-t">
                            {d.attractions?.map((a, i) => (
                              <Badge key={i} variant="secondary"><Compass className="w-3 h-3 mr-1" />{a}</Badge>
                            ))}
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                            <div className="flex items-start gap-2">
                              <Hotel className="w-4 h-4 text-india-orange mt-0.5" />
                              <div>
                                <p className="font-medium">{d.accommodation?.name}</p>
                                <p className="text-xs text-muted-foreground">{d.accommodation?.type} · {fmt(d.accommodation?.estimatedCost)}</p>
                              </div>
                            </div>
                            <div className="flex items-start gap-2">
                              <Utensils className="w-4 h-4 text-india-orange mt-0.5" />
                              <div>
                                <p className="font-medium">Try locally</p>
                                <p className="text-xs text-muted-foreground">{d.food?.join(', ')}</p>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center justify-between pt-2 border-t">
                            <span className="text-sm text-muted-foreground">Day budget</span>
                            <span className="font-semibold text-india-orange">{fmt(d.dailyCost)}</span>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </TabsContent>

                {/* Table */}
                <TabsContent value="table" className="mt-6">
                  <Card>
                    <CardContent className="p-0 overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead className={theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'}>
                          <tr>
                            <th className="text-left p-3">Day</th>
                            <th className="text-left p-3">Location</th>
                            <th className="text-left p-3">Travel</th>
                            <th className="text-left p-3">Activities</th>
                            <th className="text-left p-3">Stay</th>
                            <th className="text-right p-3">Budget</th>
                          </tr>
                        </thead>
                        <tbody>
                          {itinerary.days.map((d) => (
                            <tr key={d.day} className="border-t">
                              <td className="p-3 font-medium">Day {d.day}</td>
                              <td className="p-3">{d.location}</td>
                              <td className="p-3 text-xs text-muted-foreground">
                                {d.travelFrom ? `${d.travelFrom} → ${d.location}` : '—'}
                                {d.travelTime && <div>{d.travelTime} · {d.transport}</div>}
                              </td>
                              <td className="p-3 text-xs">{d.attractions?.join(', ')}</td>
                              <td className="p-3 text-xs">{d.accommodation?.name}</td>
                              <td className="p-3 text-right font-medium text-india-orange">{fmt(d.dailyCost)}</td>
                            </tr>
                          ))}
                        </tbody>
                        <tfoot>
                          <tr className={`border-t-2 ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'}`}>
                            <td colSpan={5} className="p-3 font-semibold text-right">Total</td>
                            <td className="p-3 text-right font-bold text-india-orange">{fmt(itinerary.totalEstimatedCost)}</td>
                          </tr>
                        </tfoot>
                      </table>
                    </CardContent>
                  </Card>

                  {/* Budget breakdown */}
                  <Card className="mt-4">
                    <CardHeader><CardTitle className="text-lg">Budget breakdown</CardTitle></CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                        {Object.entries(itinerary.budgetBreakdown || {}).map(([k, v]) => (
                          <div key={k} className={`p-3 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'}`}>
                            <p className="text-xs text-muted-foreground capitalize">{k}</p>
                            <p className="font-semibold text-india-orange">{fmt(Number(v))}</p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Map */}
                <TabsContent value="map" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-india-orange" /> Your route across India
                      </CardTitle>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {itinerary.states?.map((s, i) => (
                          <Badge key={s} className="bg-india-orange/10 text-india-orange border-india-orange/30">
                            {i + 1}. {s}
                          </Badge>
                        ))}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="w-full h-[600px] rounded-xl overflow-hidden border border-border">
                        <IndiaMapSVG />
                      </div>
                      {fxUpdatedAt && currency === 'USD' && (
                        <p className="text-xs text-muted-foreground mt-2">FX rate updated {fxUpdatedAt}</p>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Recommendations */}
                <TabsContent value="tips" className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                  {([
                    ['Local Food', itinerary.recommendations?.food, Utensils],
                    ['Cultural Experiences', itinerary.recommendations?.culturalExperiences, Sparkles],
                    ['Must Visit', itinerary.recommendations?.mustVisit, MapPin],
                    ['Nearby Attractions', itinerary.recommendations?.nearbyAttractions, Compass],
                    ['Budget Tips', itinerary.recommendations?.budgetTips, Wallet],
                    ['Important Notes', itinerary.recommendations?.importantNotes, Lightbulb],
                  ] as const).map(([title, items, Icon]) => (
                    <Card key={title}>
                      <CardHeader>
                        <CardTitle className="text-base flex items-center gap-2">
                          <Icon className="w-4 h-4 text-india-orange" /> {title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2 text-sm">
                          {(items || []).map((item, i) => (
                            <li key={i} className="flex gap-2">
                              <span className="text-india-orange">•</span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  ))}
                </TabsContent>
              </Tabs>
            </motion.div>
          )}
        </AnimatePresence>

        {shareData && (
          <ShareModal open={shareOpen} onClose={() => setShareOpen(false)} data={shareData} />
        )}
      </div>
    </Layout>
  );
};

export default AITripPlanner;