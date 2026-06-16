import { attractions } from './attractions';
import type { Attraction, DayPlan, TripConfig } from '../types';

/**
 * Pre-built 7/8–7/20 Austria · Czech road trip (13 days, 2 travellers,
 * mid-tempo, city × nature). Loaded into the store by the "載入示範行程"
 * button on PlanPage.
 *
 * ROUTE (clockwise loop, every leg verified ≤ ~4h driving):
 *  - 7/9–7/11  Vienna — public transport only (U-Bahn / tram / bus).
 *  - 7/12      Vienna → Český Krumlov (drive 2h45), overnight in the old town.
 *  - 7/13      Český Krumlov → Prague (drive 2h15), 3 days in Prague.
 *  - 7/16      Prague → Salzburg (drive ~4h08 — the one long transfer; break it
 *              with a Linz lunch stop, or overnight Linz if you want it strict
 *              under 4h).
 *  - 7/17      Salzburg old town + Königssee (35 min south).
 *  - 7/18      Salzburg → Gosau → Hallstatt (drive 1h45), overnight Hallstatt.
 *  - 7/19      Hallstatt → Melk Abbey → Dürnstein (Wachau) → Vienna (drive ~4h00).
 *
 * Driving everywhere except Vienna, which is done entirely on public transport
 * (rental car is picked up on the morning of 7/12 and dropped at VIE on 7/20).
 * Bavaria sights (Munich, Neuschwanstein, etc.) stay in the dataset/map but are
 * intentionally not part of this loop.
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
    'cesky-krumlov',
    'prague',
    'salzburg',
    'konigssee',
    'gosau',
    'hallstatt',
    'melk',
    'durnstein',
  ],
  budget: 'mid',
  includeAccommodation: false,
  accommodationTags: [],
  categories: ['music', 'architecture', 'scenery', 'history'],
};

export const sampleItinerary: DayPlan[] = [
  // Day 1 · 7/8 — Taipei → Vienna (overnight flight, lands the morning of 7/9).
  { day: 1, date: '2026-07-08', city: 'vienna', attractions: [] },

  // Day 2 · 7/9 — Land at VIE in the morning; old-town walk Stephansdom →
  // Graben/Kohlmarkt → Hofburg. City transport: U-Bahn + tram.
  {
    day: 2,
    date: '2026-07-09',
    city: 'vienna',
    attractions: pick('stephansdom', 'graben-kohlmarkt', 'hofburg-palace'),
  },

  // Day 3 · 7/10 — Vienna: Schönbrunn, Kunsthistorisches Museum, opera house &
  // a Musikverein concert.
  {
    day: 3,
    date: '2026-07-10',
    city: 'vienna',
    attractions: pick(
      'schoenbrunn-palace',
      'kunsthistorisches-museum',
      'wiener-staatsoper',
      'wiener-musikverein',
    ),
  },

  // Day 4 · 7/11 — Vienna: Secession, Naschmarkt, café culture. Last day on
  // public transport before picking up the rental car tomorrow.
  {
    day: 4,
    date: '2026-07-11',
    city: 'vienna',
    attractions: pick('secession-building', 'naschmarkt', 'cafe-central'),
  },

  // Day 5 · 7/12 — Pick up the rental car → drive to Český Krumlov (2h45).
  // Afternoon + evening in the fairy-tale old town; overnight there.
  {
    day: 5,
    date: '2026-07-12',
    city: 'cesky-krumlov',
    attractions: pick('cesky-krumlov-old-town'),
  },

  // Day 6 · 7/13 — Český Krumlov → Prague (2h15). Afternoon arrival walk through
  // the Old Town Square and the Art-Nouveau Municipal House.
  {
    day: 6,
    date: '2026-07-13',
    city: 'prague',
    attractions: pick('prague-old-town-square', 'prague-municipal-house'),
  },

  // Day 7 · 7/14 — Prague: castle hill, St. Vitus & Charles Bridge.
  {
    day: 7,
    date: '2026-07-14',
    city: 'prague',
    attractions: pick('prague-castle', 'charles-bridge'),
  },

  // Day 8 · 7/15 — Prague: riverside (Dancing House) + free time in the old town.
  {
    day: 8,
    date: '2026-07-15',
    city: 'prague',
    attractions: pick('dancing-house'),
  },

  // Day 9 · 7/16 — Prague → Salzburg (~4h08, the trip's one long transfer; a
  // Linz lunch stop breaks it nicely). Evening: Salzburg cathedral + Getreidegasse.
  {
    day: 9,
    date: '2026-07-16',
    city: 'salzburg',
    attractions: pick('salzburg-cathedral', 'getreidegasse'),
  },

  // Day 10 · 7/17 — Königssee in the morning (35 min south), then back to
  // Salzburg for the fortress and Mozart's birthplace.
  {
    day: 10,
    date: '2026-07-17',
    city: 'salzburg',
    attractions: pick(
      'konigssee-lake',
      'hohensalzburg-fortress',
      'mozart-geburtshaus',
    ),
  },

  // Day 11 · 7/18 — Salzburg → Gosau (Dachstein wall in afternoon side-light) →
  // Hallstatt (1h45 total). Overnight in Hallstatt.
  {
    day: 11,
    date: '2026-07-18',
    city: 'hallstatt',
    attractions: pick('gosaukamm-gosausee', 'hallstatt-village'),
  },

  // Day 12 · 7/19 — Scenic Wachau return: Hallstatt → Melk Abbey → Dürnstein →
  // Vienna (~4h00 of driving spread across the day). Drop into Vienna for the night.
  {
    day: 12,
    date: '2026-07-19',
    city: 'durnstein',
    attractions: pick('melk-abbey', 'durnstein-village'),
  },

  // Day 13 · 7/20 — Drop the car at VIE, fly back to Taipei.
  { day: 13, date: '2026-07-20', city: 'vienna', attractions: [] },
];
