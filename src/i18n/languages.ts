export interface Language {
  code: string;       // BCP-47-ish code used in localStorage & for AI prompt
  name: string;       // English name
  native: string;     // Native script
  region: 'india' | 'international';
  rtl?: boolean;
}

// 1 English + 22 official Indian languages (8th Schedule) + 10 popular international.
export const LANGUAGES: Language[] = [
  { code: 'en',     name: 'English',   native: 'English',         region: 'international' },

  // 22 Scheduled Indian languages
  { code: 'hi',     name: 'Hindi',     native: 'हिन्दी',           region: 'india' },
  { code: 'bn',     name: 'Bengali',   native: 'বাংলা',            region: 'india' },
  { code: 'ta',     name: 'Tamil',     native: 'தமிழ்',            region: 'india' },
  { code: 'te',     name: 'Telugu',    native: 'తెలుగు',           region: 'india' },
  { code: 'mr',     name: 'Marathi',   native: 'मराठी',            region: 'india' },
  { code: 'gu',     name: 'Gujarati',  native: 'ગુજરાતી',          region: 'india' },
  { code: 'kn',     name: 'Kannada',   native: 'ಕನ್ನಡ',            region: 'india' },
  { code: 'ml',     name: 'Malayalam', native: 'മലയാളം',           region: 'india' },
  { code: 'pa',     name: 'Punjabi',   native: 'ਪੰਜਾਬੀ',           region: 'india' },
  { code: 'or',     name: 'Odia',      native: 'ଓଡ଼ିଆ',             region: 'india' },
  { code: 'as',     name: 'Assamese',  native: 'অসমীয়া',           region: 'india' },
  { code: 'ur',     name: 'Urdu',      native: 'اردو',             region: 'india', rtl: true },
  { code: 'sa',     name: 'Sanskrit',  native: 'संस्कृतम्',         region: 'india' },
  { code: 'sd',     name: 'Sindhi',    native: 'سنڌي',             region: 'india', rtl: true },
  { code: 'ne',     name: 'Nepali',    native: 'नेपाली',            region: 'india' },
  { code: 'ks',     name: 'Kashmiri',  native: 'कॉशुर',            region: 'india' },
  { code: 'kok',    name: 'Konkani',   native: 'कोंकणी',            region: 'india' },
  { code: 'mai',    name: 'Maithili',  native: 'मैथिली',            region: 'india' },
  { code: 'mni',    name: 'Manipuri',  native: 'ꯃꯩꯇꯩꯂꯣꯟ',           region: 'india' },
  { code: 'sat',    name: 'Santali',   native: 'ᱥᱟᱱᱛᱟᱲᱤ',          region: 'india' },
  { code: 'brx',    name: 'Bodo',      native: 'बड़ो',              region: 'india' },
  { code: 'doi',    name: 'Dogri',     native: 'डोगरी',             region: 'india' },

  // International
  { code: 'es',     name: 'Spanish',   native: 'Español',         region: 'international' },
  { code: 'fr',     name: 'French',    native: 'Français',        region: 'international' },
  { code: 'de',     name: 'German',    native: 'Deutsch',         region: 'international' },
  { code: 'pt',     name: 'Portuguese', native: 'Português',      region: 'international' },
  { code: 'ru',     name: 'Russian',   native: 'Русский',         region: 'international' },
  { code: 'zh',     name: 'Chinese',   native: '中文',             region: 'international' },
  { code: 'ja',     name: 'Japanese',  native: '日本語',            region: 'international' },
  { code: 'ko',     name: 'Korean',    native: '한국어',            region: 'international' },
  { code: 'ar',     name: 'Arabic',    native: 'العربية',          region: 'international', rtl: true },
  { code: 'tr',     name: 'Turkish',   native: 'Türkçe',          region: 'international' },
];

export const getLanguage = (code: string): Language =>
  LANGUAGES.find(l => l.code === code) || LANGUAGES[0];

/** Auto-detect from navigator: matches scheduled list, falls back to English. */
export const detectBrowserLanguage = (): string => {
  if (typeof navigator === 'undefined') return 'en';
  const candidates = [navigator.language, ...(navigator.languages || [])];
  for (const raw of candidates) {
    if (!raw) continue;
    const lower = raw.toLowerCase();
    const base = lower.split('-')[0];
    const hit = LANGUAGES.find(l => l.code === lower || l.code === base);
    if (hit) return hit.code;
  }
  return 'en';
};