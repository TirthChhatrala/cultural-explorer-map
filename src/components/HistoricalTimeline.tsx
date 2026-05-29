import React from 'react';
import { motion } from 'framer-motion';
import { Scroll } from 'lucide-react';

const TIMELINE: Record<string, { year: string; title: string; desc: string }[]> = {
  default: [
    { year: '~3300 BCE', title: 'Indus Valley Civilization', desc: 'One of the world\'s earliest urban cultures flourished across the region.' },
    { year: '321 BCE', title: 'Maurya Empire', desc: 'Chandragupta Maurya unifies much of the subcontinent.' },
    { year: '1526', title: 'Mughal Era Begins', desc: 'Babur establishes the Mughal dynasty in northern India.' },
    { year: '1858', title: 'British Raj', desc: 'India comes under direct British Crown rule.' },
    { year: '1947', title: 'Independence', desc: 'India gains independence on 15 August 1947.' },
    { year: '1950', title: 'Republic', desc: 'India adopts its constitution and becomes a republic on 26 January.' },
  ],
};

interface Props {
  stateName: string;
}

const HistoricalTimeline: React.FC<Props> = ({ stateName }) => {
  const events = TIMELINE.default;
  return (
    <section className="mt-16">
      <div className="flex items-center gap-2 text-india-orange mb-2">
        <Scroll className="w-5 h-5" />
        <span className="text-sm uppercase tracking-widest font-medium">Historical Timeline</span>
      </div>
      <h2 className="text-2xl md:text-3xl font-display font-bold mb-8">
        Key moments shaping {stateName} and India
      </h2>
      <div className="relative">
        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-india-orange via-rose-500 to-india-orange/30" />
        <div className="space-y-6">
          {events.map((e, i) => (
            <motion.div
              key={e.year}
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07 }}
              className="relative pl-12"
            >
              <div className="absolute left-2 top-2 w-5 h-5 rounded-full bg-white border-4 border-india-orange shadow" />
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 border border-border">
                <p className="text-xs font-bold text-india-orange tracking-wider">{e.year}</p>
                <p className="font-display font-semibold text-lg mt-1">{e.title}</p>
                <p className="text-sm text-muted-foreground mt-1">{e.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HistoricalTimeline;