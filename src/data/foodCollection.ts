import type { FoodItem } from '../types';

/**
 * Seed entries for the food collection — the classic Vienna cafés and a few
 * regional must-eats mentioned in the trip notes. Users add their own
 * Instagram posts and web links on top of these; the merged list is persisted
 * in localStorage via the store.
 */
export const seedFoodCollection: FoodItem[] = [
  {
    id: 'seed-cafe-central',
    url: 'https://www.cafecentral.wien/en/',
    title: 'Café Central',
    note: '維也納最著名的咖啡館，托洛斯基與佛洛伊德的愛店。炸牛排與牛肉湯水準極高，建議提前上官網預約。',
    city: 'vienna',
    country: 'austria',
    category: 'cafe',
    source: 'web',
    createdAt: '2026-06-01T00:00:00.000Z',
  },
  {
    id: 'seed-cafe-gerstner',
    url: 'https://www.gerstner-konditorei.at/en',
    title: 'Café Gerstner',
    note: '皇家御用糕點店，就在歌劇院正對面。蛋糕與巧克力層次豐富、甜度適中，適合亞洲口味。',
    city: 'vienna',
    country: 'austria',
    category: 'dessert',
    source: 'web',
    createdAt: '2026-06-01T00:00:00.000Z',
  },
  {
    id: 'seed-cafe-museum',
    url: 'https://www.cafemuseum.at/en/',
    title: 'Café Museum',
    note: '奧托·瓦格納設計的現代主義咖啡館，座位寬敞、菜單標示清晰。米朗琪咖啡與蘋果派應有盡有。',
    city: 'vienna',
    country: 'austria',
    category: 'cafe',
    source: 'web',
    createdAt: '2026-06-01T00:00:00.000Z',
  },
  {
    id: 'seed-salzburger-nockerl',
    url: 'https://en.wikipedia.org/wiki/Salzburger_Nockerl',
    title: 'Salzburger Nockerl',
    note: '薩爾斯堡的招牌甜點：三座山峰狀的舒芙蕾，象徵城市周邊的山丘，趁熱吃。',
    city: 'salzburg',
    country: 'austria',
    category: 'dessert',
    source: 'web',
    createdAt: '2026-06-01T00:00:00.000Z',
  },
  {
    id: 'seed-prague-knuckle',
    url: 'https://umedvidku.cz/en/',
    title: 'Pečené koleno · 烤豬腳',
    note: '布拉格經典烤豬腳，配上黑啤酒。U Medvídků 是老字號啤酒餐廳，份量十足。',
    city: 'prague',
    country: 'czech',
    category: 'restaurant',
    source: 'web',
    createdAt: '2026-06-01T00:00:00.000Z',
  },
];
