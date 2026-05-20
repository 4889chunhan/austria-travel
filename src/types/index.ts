export interface Attraction {
  id: string;
  slug: string;
  city: 'vienna' | 'salzburg' | 'hallstatt' | 'graz' | 'innsbruck';
  name: { zh: string; en: string; de: string };
  tagline: { zh: string; en: string };
  description: { zh: string; en: string };
  category: AttractionCategory[];
  coordinates: { lat: number; lng: number };
  address: string;
  website: string;
  openingHours?: { zh: string; en: string };
  price?: { zh: string; en: string };
  tips?: { zh: string; en: string };
  imageUrl: string;
  languageCards: LanguageCard[];
}

export type AttractionCategory =
  | 'music'
  | 'art'
  | 'scenery'
  | 'architecture'
  | 'food'
  | 'outdoor'
  | 'shopping'
  | 'history';

export interface LanguageCard {
  id: string;
  situation: { zh: string; en: string };
  german: string;
  pronunciation: string;
  chinese: string;
  english: string;
  note?: { zh: string; en: string };
}

export interface TransportRoute {
  id: string;
  from: string;
  to: string;
  methods: TransportMethod[];
}

export interface TransportMethod {
  type: 'train' | 'bus' | 'car';
  duration: string;
  frequency?: string;
  price?: string;
  /** Operator / line name shown in the badge — ÖBB Railjet, FlixBus, etc. */
  operator?: string;
  notes?: { zh: string; en: string };
}

export interface TripConfig {
  days: number;
  travelers: number;
  categories: AttractionCategory[];
  startCity: 'vienna' | 'salzburg';
}

export interface DayPlan {
  day: number;
  date?: string;
  city: string;
  attractions: Attraction[];
  transport?: TransportRoute[];
}
