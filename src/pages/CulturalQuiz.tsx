import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Layout from '../components/Layout';
import { Trophy, RotateCcw, CheckCircle2, XCircle, Brain } from 'lucide-react';

interface Q {
  q: string;
  options: string[];
  answer: number;
  fact: string;
}

const QUESTIONS: Q[] = [
  {
    q: 'Which state is famous for the Backwaters and houseboat tours?',
    options: ['Tamil Nadu', 'Kerala', 'Goa', 'Karnataka'],
    answer: 1,
    fact: 'Kerala\'s 900+ km of interconnected lagoons and canals are a UNESCO-recognised ecosystem.',
  },
  {
    q: 'The Taj Mahal is located in which Indian state?',
    options: ['Rajasthan', 'Madhya Pradesh', 'Uttar Pradesh', 'Delhi'],
    answer: 2,
    fact: 'Built between 1632 and 1653 in Agra by Shah Jahan in memory of Mumtaz Mahal.',
  },
  {
    q: 'Pongal is the harvest festival primarily celebrated in:',
    options: ['Tamil Nadu', 'Punjab', 'West Bengal', 'Assam'],
    answer: 0,
    fact: 'Pongal is a four-day Tamil festival thanking the Sun for a bountiful harvest.',
  },
  {
    q: 'Which mountain range runs along India\'s northern border?',
    options: ['Western Ghats', 'Aravalli', 'Vindhya', 'Himalayas'],
    answer: 3,
    fact: 'The Himalayas span 2,400 km and include the world\'s highest peaks.',
  },
  {
    q: 'Which classical dance form originated in Andhra Pradesh?',
    options: ['Kathak', 'Bharatanatyam', 'Kuchipudi', 'Odissi'],
    answer: 2,
    fact: 'Kuchipudi is named after the village of Kuchipudi in Andhra Pradesh.',
  },
  {
    q: 'How many officially recognised languages are in the Indian Constitution?',
    options: ['14', '18', '22', '28'],
    answer: 2,
    fact: 'The 8th Schedule of the Constitution lists 22 scheduled languages.',
  },
];

const CulturalQuiz: React.FC = () => {
  const [i, setI] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [done, setDone] = useState(false);

  const choose = (idx: number) => {
    if (selected !== null) return;
    setSelected(idx);
    if (idx === QUESTIONS[i].answer) setScore(s => s + 1);
  };

  const next = () => {
    if (i + 1 >= QUESTIONS.length) {
      setDone(true);
    } else {
      setI(n => n + 1);
      setSelected(null);
    }
  };

  const restart = () => {
    setI(0);
    setScore(0);
    setSelected(null);
    setDone(false);
  };

  const q = QUESTIONS[i];
  const correct = selected === q?.answer;

  return (
    <Layout>
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 text-india-orange mb-2">
            <Brain className="w-5 h-5" />
            <span className="text-sm uppercase tracking-widest font-medium">Cultural Quiz</span>
          </div>
          <h1 className="text-4xl font-display font-bold mb-3">Test Your India IQ</h1>
          <p className="text-muted-foreground">Six quick questions about India's culture, geography & history.</p>
        </div>

        {!done ? (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-border"
          >
            <div className="flex justify-between items-center mb-6">
              <span className="text-sm text-muted-foreground">Question {i + 1} / {QUESTIONS.length}</span>
              <span className="text-sm font-medium text-india-orange">Score: {score}</span>
            </div>
            <div className="w-full h-2 rounded-full bg-secondary/40 mb-6 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-india-orange to-rose-500 transition-all"
                style={{ width: `${((i + 1) / QUESTIONS.length) * 100}%` }}
              />
            </div>

            <h2 className="text-xl font-display font-semibold mb-6">{q.q}</h2>
            <div className="space-y-3">
              {q.options.map((opt, idx) => {
                const isAns = idx === q.answer;
                const isSel = idx === selected;
                const reveal = selected !== null;
                return (
                  <button
                    key={idx}
                    onClick={() => choose(idx)}
                    disabled={reveal}
                    className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                      reveal && isAns
                        ? 'border-green-500 bg-green-50 dark:bg-green-950/20'
                        : reveal && isSel && !isAns
                        ? 'border-red-500 bg-red-50 dark:bg-red-950/20'
                        : 'border-border hover:border-india-orange hover:bg-india-orange/5'
                    }`}
                  >
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
              {selected !== null && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-6"
                >
                  <div className={`p-4 rounded-xl text-sm ${correct ? 'bg-green-100 dark:bg-green-950/30' : 'bg-amber-100 dark:bg-amber-950/30'}`}>
                    <p className="font-semibold mb-1">{correct ? 'Correct!' : 'Good try!'}</p>
                    <p>{q.fact}</p>
                  </div>
                  <button
                    onClick={next}
                    className="mt-4 w-full bg-india-orange hover:bg-india-orange/90 text-white font-semibold py-3 rounded-xl transition"
                  >
                    {i + 1 >= QUESTIONS.length ? 'See Results' : 'Next Question'}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gradient-to-br from-india-orange to-rose-600 text-white rounded-2xl p-10 text-center shadow-2xl"
          >
            <Trophy className="w-16 h-16 mx-auto mb-4" />
            <h2 className="text-3xl font-display font-bold mb-2">Quiz Complete!</h2>
            <p className="text-5xl font-bold my-4">{score} / {QUESTIONS.length}</p>
            <p className="opacity-90 mb-6">
              {score === QUESTIONS.length
                ? 'Outstanding! You\'re an India expert.'
                : score >= QUESTIONS.length / 2
                ? 'Great job! You know your culture well.'
                : 'Keep exploring — every state has more to teach!'}
            </p>
            <button
              onClick={restart}
              className="inline-flex items-center gap-2 bg-white text-india-orange font-semibold px-6 py-3 rounded-full hover:bg-white/90 transition"
            >
              <RotateCcw className="w-4 h-4" /> Play Again
            </button>
          </motion.div>
        )}
      </div>
    </Layout>
  );
};

export default CulturalQuiz;