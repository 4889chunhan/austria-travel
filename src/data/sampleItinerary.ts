import { attractions } from './attractions';
import type { Attraction, DayPlan, TripConfig } from '../types';

/**
 * Pre-built 7/8–7/20 Austria · Bayern · Czech road trip (13 days, 2 travellers,
 * mid-tempo, city × nature). Loaded into the store by the "載入示範行程"
 * button on PlanPage — useful as a working example of what the planner can
 * produce when the data spans multiple countries.
 */

const bySlug = (slug: string): Attraction | undefined =>
  attractions.find((a) => a.slug === slug);

/** Pick attractions by slug; silently skips any that aren't in the dataset. */
const pick = (...slugs: string[]): Attraction[] =>
  slugs.map(bySlug).filter((a): a is Attraction => Boolean(a));

export const SAMPLE_TRIP_START = '2026-07-08';
export const SAMPLE_TRIP_END = '2026-07-20';

/** TripConfig snapshot the sample assumes — applied alongside the itinerary. */
export const sampleTripConfig: Partial<TripConfig> = {
  startDate: SAMPLE_TRIP_START,
  endDate: SAMPLE_TRIP_END,
  days: 13,
  travelers: 2,
  travelerType: 'couple',
  startCity: 'vienna',
  cities: [
    'vienna',
    'durnstein',
    'melk',
    'salzburg',
    'wolfgangsee',
    'hallstatt',
    'konigssee',
    'munich',
    'neuschwanstein',
    'regensburg',
    'prague',
    'cesky-krumlov',
  ],
  budget: 'mid',
  includeAccommodation: false,
  accommodationTags: [],
  categories: ['music', 'architecture', 'scenery', 'history'],
};

export const sampleItinerary: DayPlan[] = [
  // Day 1 · 7/8 — Taipei → Vienna (overnight flight). Stephansdom is the first
  // landmark guests typically see on the arrival-evening walk, so we pin it
  // here as the day's representative spot.
  { day: 1, date: '2026-07-08', city: 'vienna', attractions: pick('stephansdom') },

  // Day 2 · 7/9 — Vienna arrival, old town walk
  {
    day: 2,
    date: '2026-07-09',
    city: 'vienna',
    attractions: pick('stephansdom', 'hofburg-palace', 'wiener-staatsoper'),
  },

  // Day 3 · 7/10 — Vienna: palaces, museums & a concert
  {
    day: 3,
    date: '2026-07-10',
    city: 'vienna',
    attractions: pick(
      'schoenbrunn-palace',
      'kunsthistorisches-museum',
      'wiener-musikverein',
    ),
  },

  // Day 4 · 7/11 — Wachau Valley → Salzburg
  {
    day: 4,
    date: '2026-07-11',
    city: 'salzburg',
    attractions: pick('durnstein-village', 'melk-abbey'),
  },

  // Day 5 · 7/12 — Salzburg old town
  {
    day: 5,
    date: '2026-07-12',
    city: 'salzburg',
    attractions: pick(
      'hohensalzburg-fortress',
      'mozart-geburtshaus',
      'getreidegasse',
    ),
  },

  // Day 6 · 7/13 — Salzkammergut lake day (Hallstatt + Gosau + Wolfgangsee)
  {
    day: 6,
    date: '2026-07-13',
    city: 'hallstatt',
    attractions: pick(
      'hallstatt-village',
      'gosaukamm-gosausee',
      'wolfgangsee-lake',
    ),
  },

  // Day 7 · 7/14 — Königssee, then drive to Munich
  {
    day: 7,
    date: '2026-07-14',
    city: 'munich',
    attractions: pick('konigssee-lake'),
  },

  // Day 8 · 7/15 — Munich
  {
    day: 8,
    date: '2026-07-15',
    city: 'munich',
    attractions: pick(
      'munich-marienplatz',
      'munich-nymphenburg',
      'bmw-welt',
      'hofbrauhaus',
    ),
  },

  // Day 9 · 7/16 — Neuschwanstein, overnight Regensburg
  {
    day: 9,
    date: '2026-07-16',
    city: 'regensburg',
    attractions: pick('neuschwanstein-castle', 'regensburg-altstadt'),
  },

  // Day 10 · 7/17 — Regensburg → Prague, afternoon old-town walk
  {
    day: 10,
    date: '2026-07-17',
    city: 'prague',
    attractions: pick('prague-old-town-square', 'dancing-house'),
  },

  // Day 11 · 7/18 — Prague: castle + Charles Bridge
  {
    day: 11,
    date: '2026-07-18',
    city: 'prague',
    attractions: pick('prague-castle', 'charles-bridge'),
  },

  // Day 12 · 7/19 — Český Krumlov, then back into Austria
  {
    day: 12,
    date: '2026-07-19',
    city: 'vienna',
    attractions: pick('cesky-krumlov-old-town'),
  },

  // Day 13 · 7/20 — Vienna → Taipei (return flight)
  { day: 13, date: '2026-07-20', city: 'vienna', attractions: [] },
];
