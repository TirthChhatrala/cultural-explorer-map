import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Sparkles, Gift, SkipForward, Trophy, Clock } from 'lucide-react';
import { QUESTION_BANK, type QuizQ } from '@/data/quizQuestions';

interface DiscountQuizProps {
  destination: string;
  onComplete: (discountPct: number, info: { score: number; total: number; played: boolean }) => void;
  onSkip: () => void;
}

/**
 * Score → discount tiers (max 10%, 10% is extremely rare).
 * Most players land at 1–4%. Honest expectations shown up front.
 */
function computeDiscount(score: number, total: number): number {
  const pct = score / total;
  if (pct < 0.34) return 1;            // tried, encouragement
  if (pct < 0.67) return 2;
  if (pct < 1) {
    // 80%+: base 4, 15% chance of 6
    return Math.random() < 0.15 ? 6 : 4;
  }
  // Perfect score
  const r = Math.random();
  if (r < 0.03) return 10;             // ~3% of perfect scores → ~rare overall
  if (r < 0.25) return 6;
  return 4;
}

function pickDestinationQuestions(destination: string, count = 3): QuizQ[] {
  const dest = destination.toLowerCase();
  // Try to match state/place name in question or fact
  const matched = QUESTION_BANK.filter(q =>
    q.q.toLowerCase().includes(dest) ||
    q.fact.toLowerCase().includes(dest) ||
    q.options.some(o => o.toLowerCase().includes(dest))
  );
  const others = QUESTION_BANK.filter(q => !matched.includes(q));
  const shuffle = <T,>(arr: T[]) => [...arr].sort(() => Math.random() - 0.5);
  const pool = [...shuffle(matched), ...shuffle(others)];
  return pool.slice(0, count);
}

const DiscountQuiz: React.FC<DiscountQuizProps> = ({ destination, onComplete, onSkip }) => {
  const [stage, setStage] = useState<'intro' | 'playing' | 'result'>('intro');
  const questions = useMemo(() => pickDestinationQuestions(destination, 3), [destination]);
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [discount, setDiscount] = useState(0);

  const handleAnswer = (i: number) => {
    if (selected !== null) return;
    setSelected(i);
    const correct = i === questions[idx].answer;
    const newScore = correct ? score + 1 : score;
    if (correct) setScore(newScore);
    setTimeout(() => {
      if (idx + 1 < questions.length) {
        setIdx(idx + 1);
        setSelected(null);
      } else {
        const d = computeDiscount(newScore, questions.length);
        setDiscount(d);
        setStage('result');
      }
    }, 900);
  };

  if (stage === 'intro') {
    return (
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="py-2">
        <div className="text-center mb-4">
          <motion.div
            initial={{ scale: 0 }} animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200 }}
            className="w-16 h-16 mx-auto bg-gradient-to-br from-orange-400 to-pink-500 rounded-full flex items-center justify-center mb-3 shadow-lg">
            <Gift className="w-8 h-8 text-white" />
          </motion.div>
          <h3 className="text-xl font-bold">Win a Checkout Discount</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Answer 3 quick questions about <span className="font-semibold">{destination}</span> to unlock a discount.
          </p>
        </div>

        <div className="bg-muted/60 border rounded-lg p-3 text-xs space-y-2 mb-4">
          <p className="font-medium flex items-center gap-1"><Sparkles className="w-3.5 h-3.5 text-orange-500" /> Realistic rewards (max 10%)</p>
          <ul className="space-y-1 text-muted-foreground pl-1">
            <li>• 1 correct → 1% off</li>
            <li>• 2 correct → 2% off</li>
            <li>• All 3 correct → 4% off (chance to upgrade to 6%)</li>
            <li>• 10% off is extremely rare — only awarded on perfect runs</li>
          </ul>
          <p className="text-[11px] italic text-muted-foreground pt-1">Optional — skip anytime to continue to payment.</p>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" className="flex-1" onClick={onSkip}>
            <SkipForward className="w-4 h-4 mr-1" /> Skip & Pay
          </Button>
          <Button className="flex-1 bg-gradient-to-r from-orange-500 to-pink-500 hover:opacity-90 text-white" onClick={() => setStage('playing')}>
            <Trophy className="w-4 h-4 mr-1" /> Play for Discount
          </Button>
        </div>
      </motion.div>
    );
  }

  if (stage === 'playing') {
    const q = questions[idx];
    return (
      <motion.div key={idx} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="py-2">
        <div className="flex justify-between items-center mb-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> Question {idx + 1}/{questions.length}</span>
          <span>Score: {score}</span>
        </div>
        <div className="h-1.5 w-full bg-muted rounded-full mb-4 overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-orange-400 to-pink-500"
            initial={{ width: 0 }}
            animate={{ width: `${((idx) / questions.length) * 100}%` }}
          />
        </div>
        <h4 className="font-semibold mb-3">{q.q}</h4>
        <div className="space-y-2">
          {q.options.map((opt, i) => {
            const isCorrect = selected !== null && i === q.answer;
            const isWrong = selected === i && i !== q.answer;
            return (
              <button
                key={i}
                onClick={() => handleAnswer(i)}
                disabled={selected !== null}
                className={`w-full text-left px-3 py-2 rounded-lg border text-sm transition-all
                  ${isCorrect ? 'bg-green-100 border-green-500 text-green-800' :
                    isWrong ? 'bg-red-100 border-red-500 text-red-800' :
                    'hover:border-orange-400 hover:bg-orange-50'}
                  disabled:cursor-not-allowed`}
              >
                {opt}
              </button>
            );
          })}
        </div>
        <button onClick={onSkip} className="mt-4 text-xs text-muted-foreground hover:underline w-full text-center">
          Skip quiz and continue to payment
        </button>
      </motion.div>
    );
  }

  // Result
  return (
    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="py-4 text-center">
      <motion.div
        initial={{ rotate: -180, scale: 0 }} animate={{ rotate: 0, scale: 1 }}
        transition={{ type: 'spring', stiffness: 180 }}
        className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-3 shadow-lg
          ${discount >= 6 ? 'bg-gradient-to-br from-yellow-400 to-orange-500' :
            discount >= 4 ? 'bg-gradient-to-br from-orange-400 to-pink-500' :
            'bg-gradient-to-br from-blue-400 to-indigo-500'}`}>
        <Gift className="w-10 h-10 text-white" />
      </motion.div>
      <h3 className="text-2xl font-bold">
        {discount === 10 ? '🎉 Jackpot!' : discount >= 6 ? 'Excellent!' : 'Nice play!'}
      </h3>
      <p className="text-muted-foreground text-sm mb-1">You scored {score}/{questions.length}</p>
      <motion.p
        initial={{ scale: 0.5 }} animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: 'spring' }}
        className="text-4xl font-bold bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent my-2">
        {discount}% OFF
      </motion.p>
      <p className="text-xs text-muted-foreground mb-4">Applied automatically at checkout.</p>
      <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white"
        onClick={() => onComplete(discount, { score, total: questions.length, played: true })}>
        Continue to Payment
      </Button>
    </motion.div>
  );
};

export default DiscountQuiz;