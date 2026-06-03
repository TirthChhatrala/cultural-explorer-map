import React from 'react';
// Social sharing utilities
import type { ShareData } from '@/components/ShareModal';

export interface ShareableItem {
  type: 'trip' | 'state' | 'quiz' | 'achievement' | 'experience';
  title: string;
  description: string;
  image?: string;
  path?: string;
  meta?: Record<string, string | number>;
}

export function buildShareData(item: ShareableItem): ShareData {
  const baseUrl = typeof window !== 'undefined'
    ? `${window.location.origin}`
    : 'https://indianculturalexplorer.com';

  let url = baseUrl;
  if (item.path) url = `${baseUrl}${item.path}`;

  let description = item.description;

  // Append meta info for richer previews
  if (item.meta) {
    const metaParts = Object.entries(item.meta)
      .map(([k, v]) => `${k}: ${v}`)
      .join(' · ');
    if (metaParts) description += ` \n${metaParts}`;
  }

  return {
    title: item.title,
    description,
    url,
    image: item.image,
  };
}

export function shareTrip(trip: {
  title: string;
  description: string;
  image: string;
  id: string;
  price?: number;
  duration?: number;
  rating?: number;
}): ShareData {
  return buildShareData({
    type: 'trip',
    title: `Check out this trip: ${trip.title}`,
    description: trip.description,
    image: trip.image,
    path: `/trips/${trip.id}`,
    meta: {
      ...(trip.price && { Price: `₹${trip.price.toLocaleString()}` }),
      ...(trip.duration && { Duration: `${trip.duration} days` }),
      ...(trip.rating && { Rating: `⭐ ${trip.rating}` }),
    },
  });
}

export function shareState(state: {
  name: string;
  description: string;
  image: string;
  id: string;
  capital?: string;
  famousFor?: string;
}): ShareData {
  return buildShareData({
    type: 'state',
    title: `Discover ${state.name}, India`,
    description: state.description,
    image: state.image,
    path: `/states/${state.id}`,
    meta: {
      ...(state.capital && { Capital: state.capital }),
      ...(state.famousFor && { 'Famous For': state.famousFor }),
    },
  });
}

export function shareQuizResult(score: number, total: number, points: number, badges: string[]): ShareData {
  return buildShareData({
    type: 'quiz',
    title: `I scored ${score}/${total} on the Indian Cultural Quiz! 🎯`,
    description: `Test your India IQ and earn rewards on Indian Cultural Explorer. I earned ${points} points${badges.length > 0 ? ` and unlocked ${badges.join(', ')}` : ''}!`,
    path: '/cultural-quiz',
    meta: { Score: `${score}/${total}`, Points: points },
  });
}

export function shareAchievement(badgeName: string, totalPoints: number, streak: number): ShareData {
  return buildShareData({
    type: 'achievement',
    title: `I earned the "${badgeName}" badge on Indian Cultural Explorer! 🏆`,
    description: `Join me on Indian Cultural Explorer to discover India's rich heritage, play quizzes, and win rewards!`,
    path: '/rewards',
    meta: {
      'Total Points': totalPoints,
      ...(streak > 0 && { Streak: `${streak} days 🔥` }),
    },
  });
}

export function shareExperience(title: string, description: string, image?: string): ShareData {
  return buildShareData({
    type: 'experience',
    title,
    description,
    image,
  });
}

// Convenience hook-style helper for components
export function useShare() {
  const [open, setOpen] = React.useState(false);
  const [data, setData] = React.useState<ShareData>({ title: '', description: '', url: '' });

  const share = (item: ShareableItem | ShareData) => {
    if ('type' in item) {
      setData(buildShareData(item));
    } else {
      setData(item);
    }
    setOpen(true);
  };

  const close = () => setOpen(false);

  return { open, data, share, close };
}
