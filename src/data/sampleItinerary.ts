import { attractions } from './attractions';
import type { Attraction, DayPlan, TripConfig } from '../types';

/**
 * Pre-built 7/8–7/20 Austria · Bayern · Czech road trip (13 days, 2 travellers,
 * mid-tempo, city × nature). Loaded into the store by the "載入示範行程"
 * button on PlanPage.
 *
 * OPTIMIZATIONS applied (from the 2026 trip notes):
 *  - Day 4: pick up the rental car at Vienna Airport (VIE) rather than the
 *    city centre — fewer one-way streets, straight onto the A1 toward Wachau.
 *  - Day 6: morning Hallstatt (front light, before the crowds) → afternoon
 *    Gosau (the Dachstein wall sits in glorious afternoon side-light).
 *  - Day 9: skip Regensburg today — drive Munich → Neuschwanstein, then east
 *    along the Alpine Road to overnight at Chiemsee (visit Herrenchiemsee).
 *    Day 10 then takes Regensburg as a lunch stop on the way to Prague.
 *  - Day 12: overnight in Baden bei Wien (or near VIE airport) so Day 13's
 *    car drop-off and flight are stress-free.
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
    'hallstatt',
    'gosau',
    'konigssee',
    'chiemsee',
    'munich',
    'neuschwanstein',
    'regensburg',
    'prague',
    'cesky-krumlov',
    'baden',
  ],
  budget: 'mid',
  includeAccommodation: false,
  accommodationTags: [],
  categories: ['music', 'architecture', 'scenery', 'history'],
};

export const sampleItinerary: DayPlan[] = [
  // Day 1 · 7/8 — Taipei → Vienna (overnight flight). Stephansdom is the first
  // landmark guests typically see on the arrival-evening walk.
  { day: 1, date: '2026-07-08', city: 'vienna', attractions: pick('stephansdom') },

  // Day 2 · 7/9 — Vienna arrival, old-town walk through Graben to Hofburg.
  {
    day: 2,
    date: '2026-07-09',
    city: 'vienna',
    attractions: pick(
      'stephansdom',
      'graben-kohlmarkt',
      'hofburg-palace',
      'wiener-staatsoper',
    ),
  },

  // Day 3 · 7/10 — Vienna: palaces, museums & a Musikverein concert.
  {
    day: 3,
    date: '2026-07-10',
    city: 'vienna',
    attractions: pick(
      'schoenbrunn-palace',
      'kunsthistorisches-museum',
      'wiener-musikverein',
      'secession-building',
    ),
  },

  // Day 4 · 7/11 — Pick up the rental at VIE → Wachau Valley → Salzburg.
  {
    day: 4,
    date: '2026-07-11',
    city: 'salzburg',
    attractions: pick('durnstein-village', 'melk-abbey'),
  },

  // Day 5 · 7/12 — Salzburg old town, cathedral, fortress.
  {
    day: 5,
    date: '2026-07-12',
    city: 'salzburg',
    attractions: pick(
      'salzburg-cathedral',
      'hohensalzburg-fortress',
      'mozart-geburtshaus',
      'getreidegasse',
    ),
  },

  // Day 6 · 7/13 — Hallstatt morning (golden front-light) → Gosau afternoon
  // (Dachstein wall in magic side-light). Wolfgangsee dropped for a calmer day.
  {
    day: 6,
    date: '2026-07-13',
    city: 'hallstatt',
    attractions: pick('hallstatt-village', 'gosaukamm-gosausee'),
  },

  // Day 7 · 7/14 — Königssee morning, then drive to Munich.
  {
    day: 7,
    date: '2026-07-14',
    city: 'munich',
    attractions: pick('konigssee-lake'),
  },

  // Day 8 · 7/15 — Munich: Marienplatz, Alter Peter tower, Residenz, BMW Welt,
  // Hofbräuhaus.
  {
    day: 8,
    date: '2026-07-15',
    city: 'munich',
    attractions: pick(
      'munich-marienplatz',
      'munich-st-peter',
      'munich-residenz',
      'bmw-welt',
      'hofbrauhaus',
    ),
  },

  // Day 9 · 7/16 — Neuschwanstein, then east along the Alpine Road to overnight
  // at Chiemsee (visit Herrenchiemsee — the "Bavarian Versailles" — by boat).
  {
    day: 9,
    date: '2026-07-16',
    city: 'chiemsee',
    attractions: pick('neuschwanstein-castle', 'herrenchiemsee'),
  },

  // Day 10 · 7/17 — Chiemsee → Regensburg (lunch + the stone bridge + cathedral)
  // → Prague. Afternoon arrival walk through the Art-Nouveau old town.
  {
    day: 10,
    date: '2026-07-17',
    city: 'prague',
    attractions: pick(
      'regensburg-altstadt',
      'prague-old-town-square',
      'prague-municipal-house',
      'dancing-house',
    ),
  },

  // Day 11 · 7/18 — Prague: castle + St. Vitus + Charles Bridge.
  {
    day: 11,
    date: '2026-07-18',
    city: 'prague',
    attractions: pick('prague-castle', 'charles-bridge'),
  },

  // Day 12 · 7/19 — Český Krumlov, then overnight in Baden bei Wien so the
  // Day 13 airport drop-off + tax refund + flight are stress-free.
  {
    day: 12,
    date: '2026-07-19',
    city: 'baden',
    attractions: pick('cesky-krumlov-old-town'),
  },

  // Day 13 · 7/20 — Drop the car at VIE, fly back to Taipei.
  { day: 13, date: '2026-07-20', city: 'vienna', attractions: [] },
];
