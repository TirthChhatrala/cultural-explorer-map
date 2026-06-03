import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Trophy, RotateCcw, CheckCircle2, XCircle, Brain, Lock, Timer, Flame, Sparkles, Gift, Calendar, PartyPopper, ShieldAlert, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import ShareModal from '@/components/ShareModal';
import { shareQuizResult } from '@/lib/share';
import type { ShareData } from '@/components/ShareModal';
import {
  Difficulty, getRewardState, submitAttempt, hasPaidAccess, isDailyDone,
  getActiveFestival, BADGE_CATALOG,
} from '@/lib/rewards';
import { pickQuestions, BONUS_QUESTIONS, QuizQ } from '@/data/quizQuestions';

type Mode = 'standard' | 'daily' | 'festival';

const TIME_PER_Q: Record<Difficulty, number> = { easy: 20, medium: 15, hard: 12 };

const CulturalQuiz: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const paid = isAuthenticated && hasPaidAccess(user?.email);
  const userId = user?.email || '';

  // Setup screen state
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const [mode, setMode] = useState<Mode>('standard');
  const [started, setStarted] = useState(false);

  // Quiz runtime state
  const [questions, setQuestions] = useState<QuizQ[]>([]);
  const [i, setI] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [bonusUsed, setBonusUsed] = useState(false);
  const [bonusActive, setBonusActive] = useState(false);
  const [bonusEarned, setBonusEarned] = useState(0);
  const [done, setDone] = useState(false);
  const [result, setResult] = useState<ReturnType<typeof submitAttempt> | null>(null);
  const [cheatCount, setCheatCount] = useState(0);
  const [shareOpen, setShareOpen] = useState(false);
  const [shareData, setShareData] = useState<ShareData>({ title: '', description: '', url: '' });
  const startTimeRef = useRef<number>(0);

  const festival = useMemo(() => getActiveFestival(), []);
  const state = useMemo(() => userId ? getRewardState(userId) : null, [userId, done]);

  // Anti-cheat: tab visibility
  useEffect(() => {
    if (!started || done) return;
    const onVis = () => {
      if (document.hidden) {
        setCheatCount(c => {
          const n = c + 1;
          toast({ title: 'Stay focused!', description: `Tab switch detected (${n}). Penalty applied.`, variant: 'destructive' });
          return n;
        });
      }
    };
    document.addEventListener('visibilitychange', onVis);
    return () => document.removeEventListener('visibilitychange', onVis);
  }, [started, done, toast]);

  // Per-question timer
  useEffect(() => {
    if (!started || done || selected !== null) return;
    if (secondsLeft <= 0) { handleTimeout(); return; }
    const t = setTimeout(() => setSecondsLeft(s => s - 1), 1000);
    return () => clearTimeout(t);
  }, [secondsLeft, selected, started, done]);

  const start = () => {
    if (mode === 'daily' && isDailyDone(userId)) {
      toast({ title: 'Daily quiz complete', description: "Come back tomorrow for a new daily challenge.", variant: 'destructive' });
      return;
    }
    const seed = mode === 'daily'
      ? parseInt(new Date().toISOString().slice(0, 10).replace(/-/g, ''), 10)
      : undefined;
    const qs = pickQuestions(difficulty, 6, seed);
    setQuestions(qs);
    setI(0); setScore(0); setSelected(null); setDone(false); setResult(null);
    setBonusUsed(false); setBonusActive(false); setBonusEarned(0); setCheatCount(0);
    setSecondsLeft(TIME_PER_Q[difficulty]);
    startTimeRef.current = Date.now();
    setStarted(true);
  };

  const handleTimeout = () => {
    setSelected(-1); // marks unanswered
  };

  const choose = (idx: number) => {
    if (selected !== null) return;
    setSelected(idx);
    const q = bonusActive ? BONUS_QUESTIONS[0] : questions[i];
    if (idx === q.answer) {
      if (bonusActive) setBonusEarned(b => b + 25);
      else setScore(s => s + 1);
    }
  };

  const next = () => {
    if (bonusActive) {
      setBonusActive(false);
      finish();
      return;
    }
    if (i + 1 >= questions.length) {
      // Offer bonus question if eligible (>= 50% correct)
      if (!bonusUsed && score >= Math.ceil(questions.length / 2)) {
        setBonusUsed(true);
        setBonusActive(true);
        setSelected(null);
        setSecondsLeft(15);
        return;
      }
      finish();
    } else {
      setI(n => n + 1);
      setSelected(null);
      setSecondsLeft(TIME_PER_Q[difficulty]);
    }
  };

  const finish = () => {
    const timeTaken = Math.round((Date.now() - startTimeRef.current) / 1000);
    const penalty = cheatCount * 10;
    const res = submitAttempt(userId, {
      difficulty,
      mode,
      score,
      total: questions.length,
      timeTakenSec: timeTaken,
      bonusPoints: Math.max(0, bonusEarned - penalty),
    });
    setResult(res);
    setDone(true);
    setStarted(false);
  };

  // ---------- Render gates ----------

  if (!isAuthenticated) {
    return (
      <Layout>
        <div className="max-w-xl mx-auto text-center py-20">
          <Lock className="w-12 h-12 mx-auto text-india-orange mb-4" />
          <h1 className="text-3xl font-display font-bold mb-3">Sign in to play</h1>
          <p className="text-muted-foreground mb-6">The Reward Quiz is available to logged-in members.</p>
          <Button onClick={() => navigate('/login')} className="bg-india-orange hover:bg-india-orange/90">Log in</Button>
        </div>
      </Layout>
    );
  }

  if (!paid) {
    return (
      <Layout>
        <div className="max-w-xl mx-auto text-center py-20">
          <ShieldAlert className="w-12 h-12 mx-auto text-india-orange mb-4" />
          <h1 className="text-3xl font-display font-bold mb-3">Quiz Access Locked</h1>
          <p className="text-muted-foreground mb-6">
            Complete any successful booking or purchase to unlock the Reward Quiz, earn points,
            unlock badges and win discount coupons.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Button onClick={() => navigate('/trips')} className="bg-india-orange hover:bg-india-orange/90">Browse Trips</Button>
            <Button onClick={() => navigate('/hotels')} variant="outline">Book a Hotel</Button>
          </div>
        </div>
      </Layout>
    );
  }

  // ---------- Setup screen ----------

  if (!started && !done) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 text-india-orange mb-2">
              <Brain className="w-5 h-5" />
              <span className="text-sm uppercase tracking-widest font-medium">Reward Quiz</span>
            </div>
            <h1 className="text-4xl font-display font-bold mb-2">Test Your India IQ</h1>
            <p className="text-muted-foreground">Pick a mode and difficulty. Earn points, badges and coupons.</p>
          </div>

          {state && (
            <Card className="mb-6">
              <CardContent className="pt-6 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div><p className="text-xs text-muted-foreground">Points</p><p className="text-2xl font-bold text-india-orange">{state.totalPoints}</p></div>
                <div><p className="text-xs text-muted-foreground">Streak</p><p className="text-2xl font-bold flex items-center justify-center gap-1"><Flame className="w-5 h-5 text-orange-500" />{state.currentStreak}</p></div>
                <div><p className="text-xs text-muted-foreground">Badges</p><p className="text-2xl font-bold">{state.badges.length}</p></div>
                <div><p className="text-xs text-muted-foreground">Coupons</p><p className="text-2xl font-bold text-green-600">{state.coupons.filter(c => !c.used).length}</p></div>
              </CardContent>
            </Card>
          )}

          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <ModeCard active={mode === 'standard'} onClick={() => setMode('standard')}
              icon={<Brain className="w-6 h-6" />} title="Standard" desc="Classic quiz, earn points." />
            <ModeCard active={mode === 'daily'} onClick={() => setMode('daily')}
              icon={<Calendar className="w-6 h-6" />} title="Daily Challenge"
              desc={isDailyDone(userId) ? 'Done — back tomorrow!' : '+20 bonus points'}
              disabled={isDailyDone(userId)} />
            <ModeCard active={mode === 'festival'} onClick={() => festival && setMode('festival')}
              icon={<PartyPopper className="w-6 h-6" />}
              title={festival ? `${festival.name} Special` : 'Festival Special'}
              desc={festival ? `+30 pts • ${festival.daysUntil}d to go` : 'No festival nearby'}
              disabled={!festival} />
          </div>

          <div className="mb-8">
            <p className="text-sm font-medium mb-2">Difficulty</p>
            <div className="grid grid-cols-3 gap-3">
              {(['easy', 'medium', 'hard'] as Difficulty[]).map(d => (
                <button key={d} onClick={() => setDifficulty(d)}
                  className={`p-3 rounded-xl border-2 capitalize font-medium transition ${
                    difficulty === d
                      ? 'border-india-orange bg-india-orange/10 text-india-orange'
                      : 'border-border hover:border-india-orange/50'
                  }`}>
                  {d} <span className="text-xs opacity-70">({d === 'easy' ? '1x' : d === 'medium' ? '1.5x' : '2x'})</span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button onClick={start} size="lg" className="bg-india-orange hover:bg-india-orange/90 flex-1">
              <Sparkles className="w-4 h-4 mr-2" /> Start Quiz
            </Button>
            <Button asChild variant="outline" size="lg" className="flex-1">
              <Link to="/rewards"><Trophy className="w-4 h-4 mr-2" /> View Rewards Dashboard</Link>
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  // ---------- Quiz runtime ----------

  if (started && !done) {
    const q = bonusActive ? BONUS_QUESTIONS[0] : questions[i];
    const reveal = selected !== null;
    const correct = selected === q.answer;
    const total = questions.length;
    const progress = bonusActive ? 100 : ((i + (reveal ? 1 : 0)) / total) * 100;
    const timePct = (secondsLeft / (bonusActive ? 15 : TIME_PER_Q[difficulty])) * 100;

    return (
      <Layout>
        <div className="max-w-3xl mx-auto px-4 py-8">
          <div className="flex flex-wrap items-center justify-between mb-4 gap-2">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="capitalize">{difficulty}</Badge>
              <Badge variant="outline" className="capitalize">{mode}</Badge>
              {bonusActive && <Badge className="bg-amber-500"><Sparkles className="w-3 h-3 mr-1" />Bonus +25</Badge>}
            </div>
            <div className="flex items-center gap-3 text-sm">
              <span className="text-muted-foreground">{bonusActive ? 'Bonus' : `Q ${i + 1}/${total}`}</span>
              <span className="font-medium text-india-orange">Score: {score}</span>
            </div>
          </div>

          <Progress value={progress} className="mb-3" />

          <div className="flex items-center gap-2 mb-6 text-sm">
            <Timer className={`w-4 h-4 ${secondsLeft <= 5 ? 'text-red-500 animate-pulse' : 'text-muted-foreground'}`} />
            <div className="flex-1 h-1.5 bg-secondary/40 rounded-full overflow-hidden">
              <div className={`h-full transition-all ${secondsLeft <= 5 ? 'bg-red-500' : 'bg-india-orange'}`} style={{ width: `${timePct}%` }} />
            </div>
            <span className={secondsLeft <= 5 ? 'text-red-500 font-semibold' : 'text-muted-foreground'}>{secondsLeft}s</span>
          </div>

          <motion.div key={bonusActive ? 'bonus' : i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 md:p-8 border border-border">
            <h2 className="text-xl font-display font-semibold mb-6">{q.q}</h2>
            <div className="space-y-3">
              {q.options.map((opt, idx) => {
                const isAns = idx === q.answer;
                const isSel = idx === selected;
                return (
                  <button key={idx} onClick={() => choose(idx)} disabled={reveal}
                    className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                      reveal && isAns ? 'border-green-500 bg-green-50 dark:bg-green-950/20'
                        : reveal && isSel && !isAns ? 'border-red-500 bg-red-50 dark:bg-red-950/20'
                        : 'border-border hover:border-india-orange hover:bg-india-orange/5'
                    }`}>
                    <div className="flex items-center justify-between">
                      <span>{opt}</span>
                      {reveal && isAns && <CheckCircle2 className="w-5 h-5 text-green-500" />}
                      {reveal && isSel && !isAns && <XCircle className="w-5 h-5 text-red-500" />}
                    </div>
                  </button>
                );
              })}
            </div>

            <AnimatePresence>
              {reveal && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-6">
                  <div className={`p-4 rounded-xl text-sm ${
                    selected === -1 ? 'bg-red-100 dark:bg-red-950/30'
                      : correct ? 'bg-green-100 dark:bg-green-950/30'
                      : 'bg-amber-100 dark:bg-amber-950/30'
                  }`}>
                    <p className="font-semibold mb-1">
                      {selected === -1 ? "Time's up!" : correct ? 'Correct!' : 'Good try!'}
                    </p>
                    <p>{q.fact}</p>
                  </div>
                  <Button onClick={next} className="mt-4 w-full bg-india-orange hover:bg-india-orange/90">
                    {bonusActive ? 'Finish Quiz' : (i + 1 >= total ? 'See Results' : 'Next Question')}
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {cheatCount > 0 && (
            <p className="text-xs text-red-500 text-center mt-3">⚠️ {cheatCount} tab switch{cheatCount > 1 ? 'es' : ''} detected — {cheatCount * 10} point penalty</p>
          )}
        </div>
      </Layout>
    );
  }

  // ---------- Results screen ----------

  return (
    <Layout>
      <div className="max-w-2xl mx-auto px-4 py-10">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
          className="bg-gradient-to-br from-india-orange to-rose-600 text-white rounded-2xl p-10 text-center shadow-2xl">
          <motion.div initial={{ scale: 0, rotate: -180 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', delay: 0.2 }}>
            <Trophy className="w-20 h-20 mx-auto mb-4" />
          </motion.div>
          <h2 className="text-3xl font-display font-bold mb-2">Quiz Complete!</h2>
          <p className="text-5xl font-bold my-4">{result?.attempt.score} / {result?.attempt.total}</p>
          <div className="grid grid-cols-3 gap-3 my-6 text-sm">
            <div className="bg-white/10 rounded-xl p-3"><p className="opacity-80">Points</p><p className="text-xl font-bold">+{result?.attempt.pointsEarned}</p></div>
            <div className="bg-white/10 rounded-xl p-3"><p className="opacity-80">Streak</p><p className="text-xl font-bold">{result?.state.currentStreak}🔥</p></div>
            <div className="bg-white/10 rounded-xl p-3"><p className="opacity-80">Total</p><p className="text-xl font-bold">{result?.state.totalPoints}</p></div>
          </div>

          <AnimatePresence>
            {result?.coupon && (
              <motion.div initial={{ opacity: 0, y: 20, scale: 0.8 }} animate={{ opacity: 1, y: 0, scale: 1 }}
                className="bg-white text-india-orange rounded-xl p-5 my-4">
                <Gift className="w-8 h-8 mx-auto mb-2" />
                <p className="font-bold text-lg">{result.coupon.label}</p>
                <p className="font-mono text-sm mt-1 bg-india-orange/10 inline-block px-3 py-1 rounded">{result.coupon.code}</p>
              </motion.div>
            )}
          </AnimatePresence>

          {result && result.newBadges.length > 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="my-4">
              <p className="text-sm opacity-90 mb-2">New badges unlocked!</p>
              <div className="flex flex-wrap gap-2 justify-center">
                {result.newBadges.map(b => (
                  <span key={b} className="bg-white/20 rounded-full px-3 py-1 text-sm">
                    {BADGE_CATALOG[b]?.icon} {BADGE_CATALOG[b]?.label}
                  </span>
                ))}
              </div>
            </motion.div>
          )}

          <div className="flex flex-col sm:flex-row gap-3 mt-6">
            <Button onClick={() => { setDone(false); setResult(null); }} variant="secondary" className="flex-1">
              <RotateCcw className="w-4 h-4 mr-2" /> Play Again
            </Button>
            <Button asChild className="flex-1 bg-white text-india-orange hover:bg-white/90">
              <Link to="/rewards"><Trophy className="w-4 h-4 mr-2" /> Rewards Dashboard</Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
};

const ModeCard: React.FC<{ active: boolean; onClick: () => void; icon: React.ReactNode; title: string; desc: string; disabled?: boolean }> =
  ({ active, onClick, icon, title, desc, disabled }) => (
    <button onClick={onClick} disabled={disabled}
      className={`text-left p-4 rounded-xl border-2 transition ${
        disabled ? 'opacity-50 cursor-not-allowed border-border'
          : active ? 'border-india-orange bg-india-orange/10' : 'border-border hover:border-india-orange/50'
      }`}>
      <div className="flex items-center gap-2 mb-1 text-india-orange">{icon}<span className="font-semibold text-foreground">{title}</span></div>
      <p className="text-xs text-muted-foreground">{desc}</p>
    </button>
  );

export default CulturalQuiz;