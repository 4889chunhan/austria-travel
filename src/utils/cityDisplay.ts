/**
 * Single source of truth for city slug → bilingual display label, covering
 * the Austria/Bayern/Czech road-trip footprint. Add a new city here and every
 * label across the app picks it up.
 */
export const CITY_DISPLAY: Record<string, { zh: string; en: string }> = {
  // Austria — original
  vienna: { zh: '維也納', en: 'Vienna' },
  salzburg: { zh: '薩爾斯堡', en: 'Salzburg' },
  hallstatt: { zh: '哈修塔特', en: 'Hallstatt' },
  innsbruck: { zh: '因斯布魯克', en: 'Innsbruck' },
  graz: { zh: '格拉茲', en: 'Graz' },

  // Austria — Wachau & Salzkammergut additions
  durnstein: { zh: '杜恩斯坦', en: 'Dürnstein' },
  melk: { zh: '梅爾克', en: 'Melk' },
  krems: { zh: '克雷姆斯', en: 'Krems' },
  badischl: { zh: '巴特伊舍', en: 'Bad Ischl' },
  wolfgangsee: { zh: '聖沃夫岡湖', en: 'Wolfgangsee' },
  gosau: { zh: '戈紹', en: 'Gosau' },

  // Bayern (Germany)
  konigssee: { zh: '國王湖', en: 'Königssee' },
  munich: { zh: '慕尼黑', en: 'Munich' },
  neuschwanstein: { zh: '新天鵝堡', en: 'Neuschwanstein' },
  regensburg: { zh: '雷根斯堡', en: 'Regensburg' },
  chiemsee: { zh: '基姆湖', en: 'Chiemsee' },
  rosenheim: { zh: '羅森海姆', en: 'Rosenheim' },

  // Czech Republic
  prague: { zh: '布拉格', en: 'Prague' },
  'cesky-krumlov': { zh: '庫倫洛夫', en: 'Český Krumlov' },

  // Austria — Baden bei Wien (Vienna outskirts overnight)
  baden: { zh: '巴登', en: 'Baden bei Wien' },
};

export type Lang = 'zh' | 'en';

/** Bilingual lookup with sensible fallback (returns the raw slug if unknown). */
export function cityLabel(city: string, lang: Lang = 'zh'): string {
  return (CITY_DISPLAY[city] ?? { zh: city, en: city })[lang];
}
