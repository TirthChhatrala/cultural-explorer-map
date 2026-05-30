// Reward & Quiz system utilities — pure client-side persistence via localStorage.
// Includes: streaks, badges, history, leaderboard, coupons, anti-cheat.

import type { PaymentRecord } from '@/components/PaymentModal';

export type Difficulty = 'easy' | 'medium' | 'hard';

export interface QuizAttempt {
  id: string;
  userId: string;
  date: string; // ISO
  difficulty: Difficulty;
  mode: 'standard' | 'daily' | 'festival' | 'bonus';
  score: number;
  total: number;
  pointsEarned: number;
  timeTakenSec: number;
  reward?: string;
}

export interface UserRewardState {
  userId: string;
  totalPoints: number;
  currentStreak: number;
  longestStreak: number;
  lastQuizDate: string | null; // YYYY-MM-DD
  badges: string[];
  coupons: Coupon[];
  milestonesReached: number[];
}

export interface Coupon {
  code: string;
  label: string;
  discountPct: number;
  earnedAt: string;
  used: boolean;
  expiresAt: string;
}

export const MILESTONES = [50, 150, 350, 700, 1500];

export const BADGE_CATALOG: Record<string, { label: string; desc: string; icon: string }> = {
  first_steps: { label: 'First Steps', desc: 'Completed your first quiz', icon: '🌱' },
  streak_3: { label: 'On a Roll', desc: '3-day quiz streak', icon: '🔥' },
  streak_7: { label: 'Week Warrior', desc: '7-day quiz streak', icon: '⚡' },
  perfect_score: { label: 'Flawless', desc: 'Scored 100% on a quiz', icon: '🎯' },
  hard_master: { label: 'Hard Mode Master', desc: 'Cleared a Hard quiz', icon: '💎' },
  daily_devotee: { label: 'Daily Devotee', desc: 'Completed 5 daily quizzes', icon: '📅' },
  festival_fan: { label: 'Festival Fan', desc: 'Completed a festival quiz', icon: '🎉' },
  cultural_expert: { label: 'Cultural Expert', desc: 'Reached 1500 points', icon: '🏆' },
};

const KEY = (userId: string) => `rewards_${userId}`;
const ATTEMPTS_KEY = (userId: string) => `quiz_attempts_${userId}`;
const LEADERBOARD_KEY = 'rewards_leaderboard';
const DAILY_KEY = (userId: string, date: string) => `daily_quiz_${userId}_${date}`;

const todayKey = () => new Date().toISOString().slice(0, 10);

export const hasPaidAccess = (userEmail?: string | null): boolean => {
  if (!userEmail) return false;
  const records: PaymentRecord[] = JSON.parse(localStorage.getItem('paymentRecords') || '[]');
  return records.some(r => r.userId === userEmail && r.status === 'success');
};

export const getRewardState = (userId: string): UserRewardState => {
  const raw = localStorage.getItem(KEY(userId));
  if (raw) return JSON.parse(raw);
  return {
    userId,
    totalPoints: 0,
    currentStreak: 0,
    longestStreak: 0,
    lastQuizDate: null,
    badges: [],
    coupons: [],
    milestonesReached: [],
  };
};

const saveState = (s: UserRewardState) => {
  localStorage.setItem(KEY(s.userId), JSON.stringify(s));
  // Update leaderboard
  const lb: Array<{ userId: string; points: number; badges: number }> =
    JSON.parse(localStorage.getItem(LEADERBOARD_KEY) || '[]');
  const idx = lb.findIndex(e => e.userId === s.userId);
  const entry = { userId: s.userId, points: s.totalPoints, badges: s.badges.length };
  if (idx >= 0) lb[idx] = entry; else lb.push(entry);
  lb.sort((a, b) => b.points - a.points);
  localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(lb));
};

export const getAttempts = (userId: string): QuizAttempt[] => {
  return JSON.parse(localStorage.getItem(ATTEMPTS_KEY(userId)) || '[]');
};

export const getLeaderboard = () => {
  const lb: Array<{ userId: string; points: number; badges: number }> =
    JSON.parse(localStorage.getItem(LEADERBOARD_KEY) || '[]');
  return lb.sort((a, b) => b.points - a.points);
};

export const isDailyDone = (userId: string) => !!localStorage.getItem(DAILY_KEY(userId, todayKey()));
export const markDailyDone = (userId: string) => localStorage.setItem(DAILY_KEY(userId, todayKey()), '1');

export const generateCoupon = (discountPct: number): Coupon => {
  const code = 'ICE-' + Math.random().toString(36).slice(2, 8).toUpperCase();
  const exp = new Date(); exp.setDate(exp.getDate() + 30);
  return {
    code,
    label: `${discountPct}% off your next booking`,
    discountPct,
    earnedAt: new Date().toISOString(),
    used: false,
    expiresAt: exp.toISOString(),
  };
};

export interface SubmitResult {
  state: UserRewardState;
  attempt: QuizAttempt;
  newBadges: string[];
  newMilestone: number | null;
  coupon: Coupon | null;
}

export const submitAttempt = (
  userId: string,
  data: {
    difficulty: Difficulty;
    mode: QuizAttempt['mode'];
    score: number;
    total: number;
    timeTakenSec: number;
    bonusPoints?: number;
  }
): SubmitResult => {
  const state = getRewardState(userId);
  const today = todayKey();
  const yesterday = (() => { const d = new Date(); d.setDate(d.getDate() - 1); return d.toISOString().slice(0, 10); })();

  const diffMultiplier = data.difficulty === 'easy' ? 1 : data.difficulty === 'medium' ? 1.5 : 2;
  const basePoints = Math.round(data.score * 10 * diffMultiplier);
  const modeBonus = data.mode === 'daily' ? 20 : data.mode === 'festival' ? 30 : 0;
  const streakBonus = state.currentStreak >= 2 ? state.currentStreak * 5 : 0;
  const pointsEarned = basePoints + modeBonus + streakBonus + (data.bonusPoints || 0);

  // Streak logic
  if (state.lastQuizDate === today) {
    // already counted today
  } else if (state.lastQuizDate === yesterday) {
    state.currentStreak += 1;
  } else {
    state.currentStreak = 1;
  }
  state.longestStreak = Math.max(state.longestStreak, state.currentStreak);
  state.lastQuizDate = today;
  state.totalPoints += pointsEarned;

  const attempt: QuizAttempt = {
    id: `att_${Date.now()}`,
    userId,
    date: new Date().toISOString(),
    difficulty: data.difficulty,
    mode: data.mode,
    score: data.score,
    total: data.total,
    pointsEarned,
    timeTakenSec: data.timeTakenSec,
  };

  // Badges
  const newBadges: string[] = [];
  const add = (b: string) => { if (!state.badges.includes(b)) { state.badges.push(b); newBadges.push(b); } };
  add('first_steps');
  if (state.currentStreak >= 3) add('streak_3');
  if (state.currentStreak >= 7) add('streak_7');
  if (data.score === data.total && data.total > 0) add('perfect_score');
  if (data.difficulty === 'hard' && data.score >= Math.ceil(data.total * 0.7)) add('hard_master');
  if (data.mode === 'festival') add('festival_fan');
  const dailyCount = getAttempts(userId).filter(a => a.mode === 'daily').length + (data.mode === 'daily' ? 1 : 0);
  if (dailyCount >= 5) add('daily_devotee');
  if (state.totalPoints >= 1500) add('cultural_expert');

  // Milestones
  let newMilestone: number | null = null;
  for (const m of MILESTONES) {
    if (state.totalPoints >= m && !state.milestonesReached.includes(m)) {
      state.milestonesReached.push(m);
      newMilestone = m;
    }
  }

  // Coupon — perfect score or milestone
  let coupon: Coupon | null = null;
  if (data.score === data.total && data.total > 0) {
    coupon = generateCoupon(10);
    state.coupons.push(coupon);
    attempt.reward = coupon.code;
  } else if (newMilestone) {
    const pct = newMilestone >= 1500 ? 25 : newMilestone >= 700 ? 20 : newMilestone >= 350 ? 15 : 10;
    coupon = generateCoupon(pct);
    state.coupons.push(coupon);
    attempt.reward = coupon.code;
  }

  // Persist
  const attempts = getAttempts(userId);
  attempts.unshift(attempt);
  localStorage.setItem(ATTEMPTS_KEY(userId), JSON.stringify(attempts.slice(0, 100)));
  saveState(state);

  if (data.mode === 'daily') markDailyDone(userId);

  return { state, attempt, newBadges, newMilestone, coupon };
};

// Spin the wheel — random surprise reward (one per day)
const SPIN_KEY = (userId: string, date: string) => `spin_${userId}_${date}`;
export const canSpinToday = (userId: string) => !localStorage.getItem(SPIN_KEY(userId, todayKey()));
export const spinWheel = (userId: string): { label: string; coupon?: Coupon; points?: number } => {
  const prizes = [
    { label: '5% Off Coupon', discountPct: 5 },
    { label: '10% Off Coupon', discountPct: 10 },
    { label: '+25 Bonus Points', points: 25 },
    { label: '+50 Bonus Points', points: 50 },
    { label: '15% Off Coupon', discountPct: 15 },
    { label: '+100 Bonus Points', points: 100 },
  ];
  const prize = prizes[Math.floor(Math.random() * prizes.length)];
  localStorage.setItem(SPIN_KEY(userId, todayKey()), '1');
  const state = getRewardState(userId);
  let coupon: Coupon | undefined;
  if ('discountPct' in prize && prize.discountPct) {
    coupon = generateCoupon(prize.discountPct);
    state.coupons.push(coupon);
  }
  if ('points' in prize && prize.points) {
    state.totalPoints += prize.points;
  }
  saveState(state);
  return { label: prize.label, coupon, points: (prize as any).points };
};

// Active festival window — naive: any festival within 7 days returns its name
const FESTIVALS = [
  { name: 'Diwali', month: 10, day: 31 },
  { name: 'Holi', month: 2, day: 14 },
  { name: 'Pongal', month: 0, day: 15 },
  { name: 'Eid', month: 3, day: 10 },
  { name: 'Independence Day', month: 7, day: 15 },
  { name: 'Republic Day', month: 0, day: 26 },
];
export const getActiveFestival = (): { name: string; daysUntil: number } | null => {
  const now = new Date();
  for (const f of FESTIVALS) {
    let d = new Date(now.getFullYear(), f.month, f.day);
    if (d < now) d = new Date(now.getFullYear() + 1, f.month, f.day);
    const days = Math.ceil((d.getTime() - now.getTime()) / 86400000);
    if (days <= 7) return { name: f.name, daysUntil: days };
  }
  return null;
};