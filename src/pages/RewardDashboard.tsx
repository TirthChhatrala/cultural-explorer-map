import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Trophy, Flame, Gift, Medal, Sparkles, Crown, Calendar, History, Lock, Copy, PartyPopper, Share2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ShareModal from '@/components/ShareModal';
import { shareAchievement } from '@/lib/share';
import type { ShareData } from '@/components/ShareModal';
import {
  getRewardState, getAttempts, getLeaderboard, BADGE_CATALOG, MILESTONES,
  hasPaidAccess, getActiveFestival, canSpinToday, spinWheel,
} from '@/lib/rewards';

const RewardDashboard: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const userId = user?.email || '';
  const paid = isAuthenticated && hasPaidAccess(user?.email);

  const [, force] = useState(0);
  const refresh = () => force(n => n + 1);

  const [shareOpen, setShareOpen] = useState(false);
  const [shareData, setShareData] = useState<ShareData>({ title: '', description: '', url: '' });

  const state = useMemo(() => userId ? getRewardState(userId) : null, [userId]);
  const attempts = useMemo(() => userId ? getAttempts(userId) : [], [userId]);
  const leaderboard = useMemo(() => getLeaderboard(), []);
  const festival = useMemo(() => getActiveFestival(), []);

  const [spinning, setSpinning] = useState(false);
  const [spinResult, setSpinResult] = useState<{ label: string; code?: string } | null>(null);
  const [festivalCountdown, setFestivalCountdown] = useState('');

  useEffect(() => {
    if (!festival) return;
    const tick = () => {
      const target = new Date(); target.setDate(target.getDate() + festival.daysUntil); target.setHours(0, 0, 0, 0);
      const diff = target.getTime() - Date.now();
      if (diff <= 0) { setFestivalCountdown('Today!'); return; }
      const d = Math.floor(diff / 86400000);
      const h = Math.floor((diff % 86400000) / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setFestivalCountdown(`${d}d ${h}h ${m}m ${s}s`);
    };
    tick();
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
  }, [festival]);

  if (!isAuthenticated) {
    return (
      <Layout>
        <div className="max-w-xl mx-auto text-center py-20">
          <Lock className="w-12 h-12 mx-auto text-india-orange mb-4" />
          <h1 className="text-3xl font-display font-bold mb-3">Sign in required</h1>
          <Button onClick={() => navigate('/login')} className="bg-india-orange hover:bg-india-orange/90">Log in</Button>
        </div>
      </Layout>
    );
  }

  if (!paid || !state) {
    return (
      <Layout>
        <div className="max-w-xl mx-auto text-center py-20">
          <Lock className="w-12 h-12 mx-auto text-india-orange mb-4" />
          <h1 className="text-3xl font-display font-bold mb-3">Rewards Locked</h1>
          <p className="text-muted-foreground mb-6">Complete a successful booking to unlock rewards.</p>
          <Button onClick={() => navigate('/trips')} className="bg-india-orange hover:bg-india-orange/90">Browse Trips</Button>
        </div>
      </Layout>
    );
  }

  const nextMilestone = MILESTONES.find(m => state.totalPoints < m) || MILESTONES[MILESTONES.length - 1];
  const prevMilestone = [...MILESTONES].reverse().find(m => state.totalPoints >= m) || 0;
  const milestonePct = nextMilestone === prevMilestone
    ? 100
    : ((state.totalPoints - prevMilestone) / (nextMilestone - prevMilestone)) * 100;

  const rank = leaderboard.findIndex(e => e.userId === userId) + 1;

  const doSpin = () => {
    if (!canSpinToday(userId)) {
      toast({ title: 'Already spun today', description: 'Come back tomorrow!', variant: 'destructive' });
      return;
    }
    setSpinning(true);
    setTimeout(() => {
      const result = spinWheel(userId);
      setSpinResult({ label: result.label, code: result.coupon?.code });
      setSpinning(false);
      refresh();
    }, 2200);
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast({ title: 'Coupon copied!', description: code });
  };

  const isCulturalExpert = state.badges.includes('cultural_expert');

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Hero */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden bg-gradient-to-br from-india-orange via-rose-500 to-purple-600 text-white rounded-3xl p-8 mb-8 shadow-2xl">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
          <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-1 opacity-90">
                <Trophy className="w-4 h-4" /><span className="text-sm uppercase tracking-widest">Reward Dashboard</span>
              </div>
              <h1 className="text-4xl font-display font-bold">Welcome, {user?.name}</h1>
              {isCulturalExpert && (
                <Badge className="mt-2 bg-yellow-400 text-amber-900 hover:bg-yellow-400">
                  <Crown className="w-3 h-3 mr-1" /> Cultural Expert
                </Badge>
              )}
            </div>
            <div className="flex flex-col items-end gap-3">
              <button
                onClick={() => {
                  setShareData(shareAchievement(
                    isCulturalExpert ? 'Cultural Expert' : 'Reward Dashboard',
                    state?.totalPoints || 0,
                    state?.currentStreak || 0
                  ));
                  setShareOpen(true);
                }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white rounded-full text-sm font-medium transition-colors"
              >
                <Share2 className="w-4 h-4" /> Share
              </button>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <Stat label="Points" value={state.totalPoints} />
                <Stat label="Streak" value={`${state.currentStreak}🔥`} />
                <Stat label="Badges" value={state.badges.length} />
                <Stat label="Rank" value={rank > 0 ? `#${rank}` : '—'} />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Festival banner */}
        {festival && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="bg-gradient-to-r from-amber-500 to-rose-500 text-white rounded-2xl p-5 mb-6 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <PartyPopper className="w-6 h-6" />
              <div>
                <p className="font-bold">{festival.name} Special Quiz</p>
                <p className="text-sm opacity-90">Earn +30 bonus points • Countdown: {festivalCountdown}</p>
              </div>
            </div>
            <Button asChild variant="secondary"><Link to="/cultural-quiz">Play Now</Link></Button>
          </motion.div>
        )}

        {/* Milestone progress */}
        <Card className="mb-6">
          <CardHeader><CardTitle className="text-lg flex items-center gap-2"><Sparkles className="w-5 h-5 text-india-orange" /> Progress to next milestone</CardTitle></CardHeader>
          <CardContent>
            <div className="flex items-end justify-between mb-2 text-sm">
              <span>{state.totalPoints} pts</span>
              <span className="text-muted-foreground">{nextMilestone} pts</span>
            </div>
            <Progress value={milestonePct} className="h-3" />
            <div className="flex flex-wrap gap-2 mt-3">
              {MILESTONES.map(m => (
                <Badge key={m} variant={state.milestonesReached.includes(m) ? 'default' : 'outline'}
                  className={state.milestonesReached.includes(m) ? 'bg-india-orange' : ''}>
                  {state.milestonesReached.includes(m) ? '✓ ' : ''}{m}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Spin the wheel */}
        <Card className="mb-6">
          <CardHeader><CardTitle className="text-lg flex items-center gap-2"><Gift className="w-5 h-5 text-india-orange" /> Daily Spin the Wheel</CardTitle></CardHeader>
          <CardContent className="text-center">
            <motion.div animate={spinning ? { rotate: 1440 } : { rotate: 0 }} transition={{ duration: 2 }}
              className="w-32 h-32 mx-auto rounded-full border-8 border-india-orange bg-gradient-conic from-india-orange via-rose-500 to-purple-500 flex items-center justify-center mb-4"
              style={{ background: 'conic-gradient(from 0deg, #ff8800, #ec4899, #a855f7, #f59e0b, #ff8800)' }}>
              <Sparkles className="w-10 h-10 text-white" />
            </motion.div>
            {spinResult ? (
              <div className="bg-india-orange/10 rounded-xl p-4 mb-3">
                <p className="font-bold text-lg text-india-orange">{spinResult.label}</p>
                {spinResult.code && (
                  <button onClick={() => copyCode(spinResult.code!)} className="mt-2 font-mono text-sm bg-india-orange text-white px-3 py-1 rounded inline-flex items-center gap-1">
                    {spinResult.code} <Copy className="w-3 h-3" />
                  </button>
                )}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground mb-3">Win bonus points or surprise discount coupons.</p>
            )}
            <Button onClick={doSpin} disabled={spinning || !canSpinToday(userId)} className="bg-india-orange hover:bg-india-orange/90">
              {spinning ? 'Spinning…' : canSpinToday(userId) ? 'Spin Now' : 'Already Spun Today'}
            </Button>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="badges">
          <TabsList className="grid grid-cols-4 w-full">
            <TabsTrigger value="badges"><Medal className="w-4 h-4 mr-1" />Badges</TabsTrigger>
            <TabsTrigger value="coupons"><Gift className="w-4 h-4 mr-1" />Coupons</TabsTrigger>
            <TabsTrigger value="leaderboard"><Trophy className="w-4 h-4 mr-1" />Leaderboard</TabsTrigger>
            <TabsTrigger value="history"><History className="w-4 h-4 mr-1" />History</TabsTrigger>
          </TabsList>

          <TabsContent value="badges" className="mt-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {Object.entries(BADGE_CATALOG).map(([id, b]) => {
                const earned = state.badges.includes(id);
                return (
                  <motion.div key={id} whileHover={{ scale: earned ? 1.05 : 1 }}>
                    <Card className={earned ? 'border-india-orange/50 bg-india-orange/5' : 'opacity-50'}>
                      <CardContent className="pt-5 text-center">
                        <div className="text-4xl mb-2">{b.icon}</div>
                        <p className="font-semibold text-sm">{b.label}</p>
                        <p className="text-xs text-muted-foreground mt-1">{b.desc}</p>
                        {!earned && <Lock className="w-3 h-3 mx-auto mt-2 text-muted-foreground" />}
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="coupons" className="mt-4">
            {state.coupons.length === 0 ? (
              <p className="text-center text-muted-foreground py-10">No coupons yet — play more quizzes to win!</p>
            ) : (
              <div className="space-y-3">
                {state.coupons.map(c => (
                  <Card key={c.code}>
                    <CardContent className="pt-5 flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <p className="font-bold text-india-orange text-lg">{c.label}</p>
                        <p className="text-xs text-muted-foreground">Expires {new Date(c.expiresAt).toLocaleDateString()}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {c.used && <Badge variant="secondary">Used</Badge>}
                        <button onClick={() => copyCode(c.code)} className="font-mono text-sm bg-india-orange/10 text-india-orange px-3 py-1.5 rounded inline-flex items-center gap-1 hover:bg-india-orange hover:text-white transition">
                          {c.code} <Copy className="w-3 h-3" />
                        </button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="leaderboard" className="mt-4">
            <Card>
              <CardContent className="pt-5">
                {leaderboard.length === 0 ? (
                  <p className="text-center text-muted-foreground py-6">Leaderboard is empty.</p>
                ) : (
                  <ol className="space-y-2">
                    {leaderboard.slice(0, 10).map((e, idx) => (
                      <li key={e.userId}
                        className={`flex items-center justify-between p-3 rounded-lg ${
                          e.userId === userId ? 'bg-india-orange/10 border border-india-orange/40' : 'bg-muted/30'
                        }`}>
                        <span className="flex items-center gap-3">
                          <span className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                            idx === 0 ? 'bg-yellow-400 text-amber-900'
                              : idx === 1 ? 'bg-gray-300 text-gray-800'
                              : idx === 2 ? 'bg-amber-600 text-white'
                              : 'bg-muted text-foreground'
                          }`}>{idx + 1}</span>
                          <span className="font-medium truncate max-w-[200px]">{e.userId}{e.userId === userId && ' (you)'}</span>
                        </span>
                        <span className="flex items-center gap-3 text-sm">
                          <span className="text-muted-foreground">{e.badges} 🏅</span>
                          <span className="font-bold text-india-orange">{e.points} pts</span>
                        </span>
                      </li>
                    ))}
                  </ol>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history" className="mt-4">
            {attempts.length === 0 ? (
              <p className="text-center text-muted-foreground py-10">No quiz history yet.</p>
            ) : (
              <div className="space-y-2">
                {attempts.map(a => (
                  <Card key={a.id}>
                    <CardContent className="pt-4 pb-4 flex items-center justify-between flex-wrap gap-2">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="outline" className="capitalize">{a.difficulty}</Badge>
                          <Badge variant="outline" className="capitalize">{a.mode}</Badge>
                          {a.reward && <Badge className="bg-green-600">🎁 {a.reward}</Badge>}
                        </div>
                        <p className="text-xs text-muted-foreground">{new Date(a.date).toLocaleString()}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">{a.score}/{a.total}</p>
                        <p className="text-sm text-india-orange">+{a.pointsEarned} pts</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>

        <ShareModal open={shareOpen} onClose={() => setShareOpen(false)} data={shareData} />
      </div>
    </Layout>
  );
};

const Stat: React.FC<{ label: string; value: React.ReactNode }> = ({ label, value }) => (
  <div className="bg-white/15 backdrop-blur-sm rounded-xl px-4 py-3">
    <p className="text-xs opacity-80 uppercase tracking-wide">{label}</p>
    <p className="text-2xl font-bold">{value}</p>
  </div>
);

export default RewardDashboard;