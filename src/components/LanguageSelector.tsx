import React, { useMemo, useState } from 'react';
import { Globe, Check, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Popover, PopoverContent, PopoverTrigger,
} from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { useLanguage } from '@/context/LanguageContext';
import { useT } from '@/context/LanguageContext';

const LanguageSelector: React.FC<{ compact?: boolean }> = ({ compact }) => {
  const { lang, setLang, languages, translating } = useLanguage();
  const t = useT();
  const [q, setQ] = useState('');
  const [open, setOpen] = useState(false);

  const current = languages.find(l => l.code === lang)!;
  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return languages;
    return languages.filter(l =>
      l.name.toLowerCase().includes(s) ||
      l.native.toLowerCase().includes(s) ||
      l.code.toLowerCase().includes(s)
    );
  }, [q, languages]);

  const indian = filtered.filter(l => l.region === 'india');
  const intl = filtered.filter(l => l.region === 'international');

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-1 px-2" aria-label={t('nav.language')} data-no-translate translate="no">
          {translating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Globe className="w-4 h-4" />}
          <span className="text-sm font-medium">{current.code.toUpperCase()}</span>
          {!compact && <span className="text-xs text-muted-foreground hidden xl:inline">{current.native}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-72 p-0">
        <div className="p-2 border-b">
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={t('nav.searchLanguage')}
            className="h-8"
          />
        </div>
        <div className="max-h-80 overflow-y-auto py-1">
          {indian.length > 0 && (
            <>
              <div className="px-3 py-1 text-[10px] font-semibold uppercase text-muted-foreground tracking-wider">
                India · भारत
              </div>
              {indian.map(l => (
                <LangRow key={l.code} l={l} active={l.code === lang}
                  onClick={() => { setLang(l.code); setOpen(false); }} />
              ))}
            </>
          )}
          {intl.length > 0 && (
            <>
              <div className="px-3 py-1 mt-1 text-[10px] font-semibold uppercase text-muted-foreground tracking-wider">
                International
              </div>
              {intl.map(l => (
                <LangRow key={l.code} l={l} active={l.code === lang}
                  onClick={() => { setLang(l.code); setOpen(false); }} />
              ))}
            </>
          )}
          {filtered.length === 0 && (
            <div className="p-4 text-sm text-muted-foreground text-center">No language matches</div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};

const LangRow: React.FC<{ l: any; active: boolean; onClick: () => void }> = ({ l, active, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center justify-between px-3 py-2 text-sm hover:bg-accent ${active ? 'bg-accent/50' : ''}`}
  >
    <span className="flex flex-col items-start">
      <span className="font-medium" dir={l.rtl ? 'rtl' : 'ltr'}>{l.native}</span>
      <span className="text-[11px] text-muted-foreground">{l.name}</span>
    </span>
    {active && <Check className="w-4 h-4 text-india-orange" />}
  </button>
);

export default LanguageSelector;