import {
  AlertTriangle,
  Flower,
  Leaf,
  Music,
  Snowflake,
  Sparkles,
  TreePine,
  Trophy,
  Users,
  type LucideIcon,
} from 'lucide-react';
import { seasonalTipsByCity } from '../data/seasonalTips';
import type { SeasonalTip, TripConfig } from '../types';

/** Severity order — most urgent first (used for sorting). */
const SEVERITY: Record<SeasonalTip['type'], number> = {
  warning: 0,
  event: 1,
  peak: 2,
  tip: 3,
};

/** Left-border / accent color per tip type. */
export const SEASONAL_TYPE_COLOR: Record<SeasonalTip['type'], string> = {
  warning: '#E87D7D', // coral
  event: '#6BAF7A', // green
  peak: '#D4A84B', // amber
  tip: '#5B9EC9', // sky
};

const ICONS: Record<string, LucideIcon> = {
  AlertTriangle,
  Flower,
  Leaf,
  Music,
  Snowflake,
  Sparkles,
  TreePine,
  Trophy,
  Users,
};

/** Resolve a SeasonalTip.icon name to a lucide component (Sparkles fallback). */
export function resolveSeasonalIcon(name: string): LucideIcon {
  return ICONS[name] ?? Sparkles;
}

const bySeverity = (a: SeasonalTip, b: SeasonalTip) =>
  SEVERITY[a.type] - SEVERITY[b.type];

/** Parse a `YYYY-MM-DD` string into parts (UTC-safe, no timezone drift). */
function parseYMD(iso: string): { year: number; month: number; day: number } | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso);
  if (!m) return null;
  return { year: Number(m[1]), month: Number(m[2]), day: Number(m[3]) };
}

/** Add `days` to an ISO date, returning a new ISO `YYYY-MM-DD` string. */
export function addDaysISO(startISO: string, days: number): string {
  const p = parseYMD(startISO);
  if (!p) return startISO;
  const d = new Date(Date.UTC(p.year, p.month - 1, p.day));
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

/** Month (1–12) for an ISO date string, or 0 if unparseable. */
function monthOf(iso: string): number {
  const p = parseYMD(iso);
  return p ? p.month : 0;
}

/** Every calendar month (1–12) touched by an inclusive [start, end] range. */
function monthsInRange(startISO: string, endISO: string): number[] {
  const s = parseYMD(startISO);
  if (!s) return [];
  const e = parseYMD(endISO) ?? s;
  const end =
    e.year < s.year || (e.year === s.year && e.month < s.month) ? s : e;

  const months = new Set<number>();
  let year = s.year;
  let month = s.month;
  while (year < end.year || (year === end.year && month <= end.month)) {
    months.add(month);
    month += 1;
    if (month > 12) {
      month = 1;
      year += 1;
    }
  }
  return [...months];
}

/**
 * Seasonal tips relevant to a trip: tips for any selected city whose months
 * overlap the trip's date range, deduplicated and sorted by severity.
 */
export function getSeasonalTipsForTrip(tripConfig: TripConfig): SeasonalTip[] {
  const { startDate, endDate, cities } = tripConfig;
  if (!startDate || cities.length === 0) return [];

  const months = monthsInRange(startDate, endDate ?? startDate);
  if (months.length === 0) return [];

  const out: SeasonalTip[] = [];
  const seen = new Set<string>();
  for (const city of cities) {
    for (const tip of seasonalTipsByCity[city] ?? []) {
      if (!tip.months.some((m) => months.includes(m))) continue;
      const key = `${city}:${tip.title.zh}`;
      if (seen.has(key)) continue;
      seen.add(key);
      out.push(tip);
    }
  }
  return out.sort(bySeverity);
}

/** Seasonal tips for a specific date + city, sorted by severity. */
export function getSeasonalTipsForDay(date: string, city: string): SeasonalTip[] {
  const month = monthOf(date);
  if (month === 0) return [];
  return (seasonalTipsByCity[city] ?? [])
    .filter((tip) => tip.months.includes(month))
    .sort(bySeverity);
}
