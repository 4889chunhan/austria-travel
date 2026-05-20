import {
  Headphones,
  Palette,
  Mountain,
  Building2,
  Coffee,
  TreePine,
  ShoppingBag,
  BookOpen,
  type LucideIcon,
} from 'lucide-react';
import type { AttractionCategory } from '../types';

export type CategoryMeta = {
  id: AttractionCategory;
  icon: LucideIcon;
  zh: string;
  en: string;
  /** Hex color for the marker, filter pill active state, and accent. */
  color: string;
};

/**
 * Single source of truth for category visual identity — colors, icons,
 * bilingual labels. Mirrors the AYANA-style illustrated palette.
 */
export const CATEGORY_META: Record<AttractionCategory, CategoryMeta> = {
  music:        { id: 'music',        icon: Headphones,  zh: '音樂演出',   en: 'Music',        color: '#E8956D' },
  art:          { id: 'art',          icon: Palette,     zh: '藝術博物館', en: 'Art',          color: '#9B7EC8' },
  scenery:      { id: 'scenery',      icon: Mountain,    zh: '自然風景',   en: 'Scenery',      color: '#6BAF7A' },
  architecture: { id: 'architecture', icon: Building2,   zh: '建築',       en: 'Architecture', color: '#C4956A' },
  food:         { id: 'food',         icon: Coffee,      zh: '美食咖啡',   en: 'Food',         color: '#E87D7D' },
  outdoor:      { id: 'outdoor',      icon: TreePine,    zh: '戶外活動',   en: 'Outdoor',      color: '#5B9EC9' },
  shopping:     { id: 'shopping',     icon: ShoppingBag, zh: '購物市集',   en: 'Shopping',     color: '#D4A84B' },
  history:      { id: 'history',      icon: BookOpen,    zh: '歷史文化',   en: 'History',      color: '#8B7355' },
};

export const CATEGORY_ORDER: AttractionCategory[] = [
  'music', 'art', 'scenery', 'architecture',
  'food', 'outdoor', 'shopping', 'history',
];

/** Pick the dominant category for marker visuals when an attraction has multiple. */
export function primaryCategory(cats: AttractionCategory[]): CategoryMeta {
  const first = cats[0];
  return (first && CATEGORY_META[first]) ?? CATEGORY_META.history;
}
