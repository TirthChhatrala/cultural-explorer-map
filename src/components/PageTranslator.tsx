import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useLanguage } from '@/context/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { getLanguage } from '@/i18n/languages';

/**
 * Project-wide auto-translator.
 * Walks all visible text nodes on the page, batches them, sends them to the
 * `translate` edge function, and replaces the text content in place.
 *
 * - Skips when language is English.
 * - Caches translations in localStorage (per language).
 * - Re-runs on route change and on DOM mutations (debounced).
 * - Skip an element (and its subtree) by adding `data-no-translate` or
 *   `translate="no"` attributes.
 */

const SKIP_TAGS = new Set([
  'SCRIPT', 'STYLE', 'NOSCRIPT', 'CODE', 'PRE', 'TEXTAREA',
  'INPUT', 'SVG', 'PATH', 'CANVAS', 'IFRAME',
]);

const cacheKey = (lang: string) => `ice.i18n.${lang}`;
const loadCache = (lang: string): Record<string, string> => {
  try { return JSON.parse(localStorage.getItem(cacheKey(lang)) || '{}'); }
  catch { return {}; }
};
const saveCache = (lang: string, dict: Record<string, string>) => {
  try { localStorage.setItem(cacheKey(lang), JSON.stringify(dict)); } catch {}
};

const isTranslatable = (s: string) => {
  const t = s.trim();
  if (t.length < 2 || t.length > 400) return false;
  // skip pure numbers, prices, symbols
  if (/^[\d\s.,%₹$€£\-+/:()]+$/.test(t)) return false;
  // need at least one letter
  if (!/[A-Za-z]/.test(t)) return false;
  return true;
};

const shouldSkipElement = (el: Element | null): boolean => {
  let cur: Element | null = el;
  while (cur) {
    if (SKIP_TAGS.has(cur.tagName)) return true;
    if (cur.hasAttribute('data-no-translate')) return true;
    if (cur.getAttribute('translate') === 'no') return true;
    if (cur.getAttribute('contenteditable') === 'true') return true;
    cur = cur.parentElement;
  }
  return false;
};

interface NodeRef { node: Text; original: string }

const collectTextNodes = (root: Node): NodeRef[] => {
  const results: NodeRef[] = [];
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode: (n: Node) => {
      const txt = n.nodeValue || '';
      if (!isTranslatable(txt)) return NodeFilter.FILTER_REJECT;
      if (shouldSkipElement((n as Text).parentElement)) return NodeFilter.FILTER_REJECT;
      return NodeFilter.FILTER_ACCEPT;
    },
  });
  let cur: Node | null;
  // eslint-disable-next-line no-cond-assign
  while ((cur = walker.nextNode())) {
    const tn = cur as Text;
    results.push({ node: tn, original: tn.nodeValue || '' });
  }
  return results;
};

const PageTranslator: React.FC = () => {
  const { lang } = useLanguage();
  const location = useLocation();
  const runRef = useRef<Promise<void> | null>(null);
  const debounceRef = useRef<number | null>(null);

  useEffect(() => {
    if (lang === 'en') return;

    const meta = getLanguage(lang);
    let cancelled = false;

    const translatePage = async () => {
      // Serialize runs so concurrent triggers don't stomp each other.
      if (runRef.current) await runRef.current;
      if (cancelled || lang === 'en') return;

      const work = (async () => {
        const nodes = collectTextNodes(document.body);
        if (!nodes.length) return;

        const cache = loadCache(lang);
        const uniqueMap = new Map<string, NodeRef[]>();
        for (const ref of nodes) {
          const key = ref.original.trim();
          if (!uniqueMap.has(key)) uniqueMap.set(key, []);
          uniqueMap.get(key)!.push(ref);
        }

        // Apply cached translations immediately.
        const missing: string[] = [];
        for (const [text, refs] of uniqueMap) {
          const k = `auto:${text}`;
          if (cache[k]) {
            for (const r of refs) {
              if (r.node.nodeValue && r.node.nodeValue.trim() === text) {
                r.node.nodeValue = r.node.nodeValue.replace(text, cache[k]);
              }
            }
          } else {
            missing.push(text);
          }
        }

        if (!missing.length) return;

        // Batch the missing strings (chunks of 40).
        const chunks: string[][] = [];
        for (let i = 0; i < missing.length; i += 40) chunks.push(missing.slice(i, i + 40));

        for (const chunk of chunks) {
          if (cancelled) return;
          const items = chunk.map((text, idx) => ({ key: `auto:${text}::${idx}`, text }));
          try {
            const { data, error } = await supabase.functions.invoke('translate', {
              body: { items, targetLanguage: meta.name, targetCode: meta.code },
            });
            if (error || !data?.translations) continue;
            const updates: Record<string, string> = {};
            for (const it of items) {
              const translated = data.translations[it.key];
              if (!translated || translated === it.text) continue;
              updates[`auto:${it.text}`] = translated;
              const refs = uniqueMap.get(it.text) || [];
              for (const r of refs) {
                if (r.node.nodeValue && r.node.nodeValue.includes(it.text)) {
                  r.node.nodeValue = r.node.nodeValue.replace(it.text, translated);
                }
              }
            }
            const merged = { ...loadCache(lang), ...updates };
            saveCache(lang, merged);
          } catch (e) {
            // network/credit errors are silent — UI strings still work via context
            console.warn('[PageTranslator] batch failed', e);
          }
        }
      })();

      runRef.current = work;
      await work;
      runRef.current = null;
    };

    const schedule = () => {
      if (debounceRef.current) window.clearTimeout(debounceRef.current);
      debounceRef.current = window.setTimeout(() => { void translatePage(); }, 400);
    };

    // Initial run for this route / language.
    schedule();

    // Re-run on DOM mutations (new content appearing).
    const obs = new MutationObserver((mutations) => {
      for (const m of mutations) {
        if (m.type === 'childList' && m.addedNodes.length) {
          schedule();
          return;
        }
        if (m.type === 'characterData') {
          schedule();
          return;
        }
      }
    });
    obs.observe(document.body, { childList: true, subtree: true, characterData: true });

    return () => {
      cancelled = true;
      obs.disconnect();
      if (debounceRef.current) window.clearTimeout(debounceRef.current);
    };
  }, [lang, location.pathname]);

  return null;
};

export default PageTranslator;