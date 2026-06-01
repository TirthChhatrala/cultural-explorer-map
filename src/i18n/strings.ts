// Canonical English UI strings. These are the source for runtime AI translation.
// Keep keys stable; English values are the prompt input.
export const STRINGS = {
  // Header / nav
  'nav.home': 'Home',
  'nav.about': 'About',
  'nav.trip': 'Trip',
  'nav.casino': 'Casino',
  'nav.politicalParties': 'Political Parties',
  'nav.freedomFighters': 'Freedom Fighters',
  'nav.news': 'News',
  'nav.festivals': 'Festivals',
  'nav.compare': 'Compare',
  'nav.booking': 'Booking',
  'nav.payments': 'Payments',
  'nav.quiz': '🎯 Quiz',
  'nav.rewards': '🏆 Rewards',
  'nav.menu': 'Menu',
  'nav.language': 'Language',
  'nav.searchLanguage': 'Search language…',

  // Home hero
  'home.heroTitlePre': 'Explore the Rich',
  'home.heroTitleHighlight': 'Cultural Heritage',
  'home.heroTitlePost': 'of India',
  'home.heroSubtitle':
    'Dive into the diverse traditions, festivals, landmarks, and history of each state in India through our interactive guide.',
  'home.cta.start': 'Start Exploring',
  'home.cta.learn': 'Learn More',
  'home.stats.states': 'States & UTs',
  'home.stats.festivals': 'Festivals',
  'home.stats.languages': 'Languages',

  // Misc
  'common.loading': 'Loading…',
  'common.translating': 'Translating to your language…',
} as const;

export type StringKey = keyof typeof STRINGS;