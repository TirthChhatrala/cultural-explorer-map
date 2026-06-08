import React from 'react';
import { motion } from 'framer-motion';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Award, MapPin, Calendar, Sparkles } from 'lucide-react';

const FighterModal = ({ isOpen, onClose, fighter }) => {
  if (!fighter) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-2xl p-0 overflow-hidden border-0 shadow-2xl rounded-2xl max-h-[90vh] overflow-y-auto">
        {/* Hero with image */}
        <div className="relative h-72">
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent z-10" />
          {fighter.image ? (
            <img src={fighter.image} alt={fighter.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-india-orange via-orange-500 to-amber-500" />
          )}
          <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-india-orange text-white rounded-full text-xs font-semibold shadow-lg">
                <MapPin className="w-3 h-3" /> {fighter.state}
              </span>
              {fighter.lifespan && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-white/90 text-gray-900 rounded-full text-xs font-semibold shadow-lg">
                  <Calendar className="w-3 h-3" /> {fighter.lifespan}
                </span>
              )}
            </div>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-white drop-shadow-lg">
              {fighter.name}
            </h2>
          </div>
        </div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 space-y-6"
        >
          {fighter.biography && (
            <section>
              <h3 className="flex items-center gap-2 text-lg font-display font-semibold mb-2">
                <Sparkles className="w-4 h-4 text-india-orange" /> Biography
              </h3>
              <p className="text-muted-foreground leading-relaxed">{fighter.biography}</p>
            </section>
          )}

          {fighter.contributions?.length > 0 && (
            <section className="bg-india-orange/5 border border-india-orange/20 rounded-xl p-4">
              <h3 className="flex items-center gap-2 text-lg font-display font-semibold mb-3">
                <Award className="w-4 h-4 text-india-orange" /> Key Contributions
              </h3>
              <ul className="space-y-2">
                {fighter.contributions.map((c, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-india-orange shrink-0" />
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {fighter.legacy && (
            <section>
              <h3 className="text-lg font-display font-semibold mb-2">Legacy</h3>
              <p className="text-muted-foreground leading-relaxed">{fighter.legacy}</p>
            </section>
          )}
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};

export default FighterModal;
