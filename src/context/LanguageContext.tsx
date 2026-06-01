import React, { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { LANGUAGES, detectBrowserLanguage, getLanguage } from '@/i18n/languages';
import { STRINGS } from '@/i18n/strings';

type Dict = Record<string, string>;

interface LanguageCtx {
  lang: string;
  setLang: (code: string) => void;
  /** Translate by key (preferred) or arbitrary English text. */
  t: (keyOrText: string, fallback?: string) => string;
  /** Async translate arbitrary dynamic text (cached). */
  tDynamic: (text: string) => Promise<string>;
  translating: boolean;
  languages: typeof LANGUAGES;
}

const Ctx = createContext<LanguageCtx | null>(null);

const STORAGE_KEY = 'ice.lang';
const cacheKey = (lang: string) => `ice.i18n.${lang}`;

const loadCache = (lang: string): Dict => {
  try { return JSON.parse(localStorage.getItem(cacheKey(lang)) || '{}'); }
  catch { return {}; }
};
const saveCache = (lang: string, dict: Dict) => {
  try { localStorage.setItem(cacheKey(lang), JSON.stringify(dict)); } catch {}
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLangState] = useState<string>(() => {
    if (typeof window === 'undefined') return 'en';
    return localStorage.getItem(STORAGE_KEY) || detectBrowserLanguage();
  });
  const [dict, setDict] = useState<Dict>(() => (lang === 'en' ? {} : loadCache(lang)));
  const [translating, setTranslating] = useState(false);

  // Apply <html lang> + dir on every change
  useEffect(() => {
    const meta = getLanguage(lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = meta.rtl ? 'rtl' : 'ltr';
  }, [lang]);

  // When language changes, ensure all canonical UI strings are translated and cached.
  useEffect(() => {
    if (lang === 'en') { setDict({}); return; }

    const cached = loadCache(lang);
    const entries = Object.entries(STRINGS) as [string, string][];
    const missing = entries.filter(([k]) => !(k in cached));
    setDict(cached);

    if (missing.length === 0) return;

    const meta = getLanguage(lang);
    let cancelled = false;
    setTranslating(true);

    (async () => {
      try {
        const items = missing.map(([k, text]) => ({ key: k, text }));
        const { data, error } = await supabase.functions.invoke('translate', {
          body: { items, targetLanguage: meta.name, targetCode: meta.code },
        });
        if (cancelled || error || !data?.translations) {
          setTranslating(false);
          return;
        }
        const merged: Dict = { ...cached, ...data.translations };
        saveCache(lang, merged);
        setDict(merged);
      } catch (e) {
        console.warn('[i18n] translation failed', e);
      } finally {
        if (!cancelled) setTranslating(false);
      }
    })();

    return () => { cancelled = true; };
  }, [lang]);

  const setLang = useCallback((code: string) => {
    localStorage.setItem(STORAGE_KEY, code);
    setLangState(code);
  }, []);

  const t = useCallback((keyOrText: string, fallback?: string) => {
    if (lang === 'en') {
      return (STRINGS as Record<string, string>)[keyOrText] ?? fallback ?? keyOrText;
    }
    if (keyOrText in dict) return dict[keyOrText];
    // Fallback: English source string, then the key itself
    return (STRINGS as Record<string, string>)[keyOrText] ?? fallback ?? keyOrText;
  }, [lang, dict]);

  const tDynamic = useCallback(async (text: string): Promise<string> => {
    if (lang === 'en' || !text) return text;
    const cached = loadCache(lang);
    const k = `dyn:${text}`;
    if (cached[k]) return cached[k];
    try {
      const meta = getLanguage(lang);
      const { data, error } = await supabase.functions.invoke('translate', {
        body: { items: [{ key: k, text }], targetLanguage: meta.name, targetCode: meta.code },
      });
      if (error || !data?.translations?.[k]) return text;
      const merged = { ...cached, ...data.translations };
      saveCache(lang, merged);
      setDict(d => ({ ...d, ...data.translations }));
      return data.translations[k];
    } catch {
      return text;
    }
  }, [lang]);

  const value = useMemo<LanguageCtx>(() => ({
    lang, setLang, t, tDynamic, translating, languages: LANGUAGES,
  }), [lang, setLang, t, tDynamic, translating]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
};

export const useLanguage = () => {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
};

/** Shorthand hook for translating UI keys. */
export const useT = () => useLanguage().t;