import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Sparkles, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

type Msg = { role: 'user' | 'assistant'; content: string };

const STARTERS = [
  'Plan a 5-day Kerala backwater trip',
  'Best festivals to visit in November',
  'What to eat in Rajasthan?',
  'Compare Goa vs Andaman beaches',
];

const AITravelAssistant: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([
    {
      role: 'assistant',
      content:
        "Namaste! 🙏 I'm **Bharat Buddy**, your AI travel companion for India. Ask me about states, festivals, food, or trip ideas!",
    },
  ]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, loading]);

  const send = async (text: string) => {
    const q = text.trim();
    if (!q || loading) return;
    const next: Msg[] = [...messages, { role: 'user', content: q }];
    setMessages(next);
    setInput('');
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('travel-assistant', {
        body: { messages: next.filter(m => m.role !== 'assistant' || messages.indexOf(m) > 0) },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      setMessages(prev => [...prev, { role: 'assistant', content: data.content }]);
    } catch (e: any) {
      toast({
        title: 'Assistant unavailable',
        description: e?.message || 'Please try again in a moment.',
        variant: 'destructive',
      });
      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: '_Sorry, I had trouble answering that. Please try again._' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Minimal markdown: bold + bullets + line breaks
  const renderContent = (text: string) => {
    const lines = text.split('\n');
    return lines.map((l, i) => {
      const bulleted = l.match(/^\s*[-*]\s+(.*)$/);
      const content = (bulleted ? bulleted[1] : l).replace(
        /\*\*(.+?)\*\*/g,
        '<strong>$1</strong>',
      );
      if (bulleted) {
        return (
          <li key={i} className="ml-4 list-disc" dangerouslySetInnerHTML={{ __html: content }} />
        );
      }
      return (
        <p key={i} className="mb-1" dangerouslySetInnerHTML={{ __html: content }} />
      );
    });
  };

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setOpen(o => !o)}
        className="fixed bottom-6 right-6 z-40 h-14 w-14 rounded-full bg-gradient-to-br from-india-orange to-rose-600 text-white shadow-xl flex items-center justify-center"
        aria-label="Open AI travel assistant"
      >
        {open ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ duration: 0.25 }}
            className="fixed bottom-24 right-6 z-40 w-[92vw] max-w-md h-[70vh] max-h-[600px] bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-border flex flex-col overflow-hidden"
          >
            <div className="bg-gradient-to-r from-india-orange to-rose-600 text-white p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <p className="font-display font-semibold">Bharat Buddy</p>
                <p className="text-xs opacity-90">AI Travel & Culture Assistant</p>
              </div>
            </div>

            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3 bg-secondary/5">
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`max-w-[85%] rounded-2xl px-4 py-2 text-sm ${
                    m.role === 'user'
                      ? 'ml-auto bg-india-orange text-white rounded-br-sm'
                      : 'bg-white dark:bg-gray-800 border border-border rounded-bl-sm'
                  }`}
                >
                  {renderContent(m.content)}
                </div>
              ))}
              {loading && (
                <div className="bg-white dark:bg-gray-800 border border-border rounded-2xl rounded-bl-sm px-4 py-2 text-sm max-w-[85%] flex items-center gap-2 text-muted-foreground">
                  <Loader2 className="w-4 h-4 animate-spin" /> Thinking…
                </div>
              )}
              {messages.length === 1 && !loading && (
                <div className="pt-2">
                  <p className="text-xs text-muted-foreground mb-2">Try asking:</p>
                  <div className="flex flex-wrap gap-2">
                    {STARTERS.map(s => (
                      <button
                        key={s}
                        onClick={() => send(s)}
                        className="text-xs px-3 py-1.5 rounded-full bg-india-orange/10 text-india-orange hover:bg-india-orange/20 transition"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <form
              onSubmit={e => {
                e.preventDefault();
                send(input);
              }}
              className="p-3 border-t border-border bg-white dark:bg-gray-900 flex gap-2"
            >
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Ask about Indian travel or culture…"
                className="flex-1 px-3 py-2 rounded-full border border-border bg-secondary/10 text-sm focus:outline-none focus:ring-2 focus:ring-india-orange/40"
                disabled={loading}
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="h-10 w-10 rounded-full bg-india-orange text-white flex items-center justify-center disabled:opacity-40"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AITravelAssistant;