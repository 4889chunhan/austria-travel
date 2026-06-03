import type { SeasonalTip } from '../types';

/**
 * Seasonal travel intelligence per city. The `SeasonalTip` interface itself has
 * no `city` field (kept pure), so tips are keyed by city here; the seasonal
 * utils filter this map against the trip's selected cities.
 *
 * `icon` values are lucide component names, resolved at render time via
 * `resolveSeasonalIcon` in src/utils/seasonalUtils.ts.
 */
export const seasonalTipsByCity: Record<string, SeasonalTip[]> = {
  // ===========================================================================
  // VIENNA · 維也納
  // ===========================================================================
  vienna: [
    {
      months: [12],
      type: 'event',
      icon: 'TreePine',
      title: { zh: '維也納聖誕市集', en: 'Vienna Christmas Markets' },
      description: {
        zh: 'Christkindlmarkt am Rathausplatz 等 5 個市集同時開放，建議平日前往。',
        en: 'Five markets including the Christkindlmarkt at Rathausplatz run at once — go on a weekday.',
      },
    },
    {
      months: [12, 1],
      type: 'event',
      icon: 'Music',
      title: { zh: '維也納新年音樂會', en: "Vienna New Year's Concert" },
      description: {
        zh: '奧地利廣播公司全國直播，Musikverein 門票需提前 1–2 年抽籤。',
        en: 'Broadcast nationwide; Musikverein tickets are balloted 1–2 years ahead.',
      },
    },
    {
      months: [1, 2, 3],
      type: 'event',
      icon: 'Sparkles',
      title: { zh: '維也納舞球季', en: 'Vienna Ball Season' },
      description: {
        zh: '超過 450 場舞會，包含 2 月的 Opernball，正裝必備。',
        en: 'Over 450 balls including February’s Opernball — formal dress required.',
      },
    },
    {
      months: [6, 7, 8],
      type: 'peak',
      icon: 'Users',
      title: { zh: '觀光旺季', en: 'Peak Tourist Season' },
      description: {
        zh: '博物館排隊可達 45 分鐘，建議網路預訂門票並於早上 9 點前入場。',
        en: 'Museum queues hit 45 min — book online and arrive before 9am.',
      },
    },
    {
      months: [7, 8],
      type: 'event',
      icon: 'Music',
      title: { zh: '市政廳廣場音樂電影節', en: 'Rathausplatz Film Festival' },
      description: {
        zh: '6 月底至 9 月初，每晚於市政廳前廣場露天播放世界級歌劇、芭蕾與交響樂電影，現場數十家國際美食攤位 — 免費入場。',
        en: 'Late June to early September: every evening the Rathausplatz hosts a free open-air screen of world-class opera, ballet and symphony films, with dozens of international food stalls.',
      },
    },
    {
      months: [10, 11],
      type: 'tip',
      icon: 'Leaf',
      title: { zh: '黃金秋季', en: 'Golden Autumn' },
      description: {
        zh: '人潮較少、氣候舒適、博物館特展豐富，強烈推薦。',
        en: 'Fewer crowds, pleasant weather and rich special exhibitions — highly recommended.',
      },
    },
  ],

  // ===========================================================================
  // SALZBURG · 薩爾斯堡
  // ===========================================================================
  salzburg: [
    {
      months: [7, 8],
      type: 'event',
      icon: 'Music',
      title: { zh: '薩爾斯堡音樂節', en: 'Salzburg Festival' },
      description: {
        zh: '全球頂級古典音樂節，住宿價格上漲約 3 倍，需提前 6 個月訂房。',
        en: 'World-class classical festival; lodging roughly triples — book 6 months ahead.',
      },
    },
    {
      months: [1],
      type: 'event',
      icon: 'Music',
      title: { zh: '莫扎特誕辰週', en: 'Mozart Week' },
      description: {
        zh: '1 月 27 日當週全城音樂活動，免費音樂會眾多。',
        en: 'Around Jan 27, citywide concerts with many free performances.',
      },
    },
    {
      months: [12],
      type: 'event',
      icon: 'TreePine',
      title: { zh: '聖誕市集', en: 'Christmas Market' },
      description: {
        zh: '米拉貝爾廣場市集，比維也納更具古典氛圍。',
        en: 'The Mirabell Square market feels more classical than Vienna’s.',
      },
    },
  ],

  // ===========================================================================
  // HALLSTATT · 哈修塔特
  // ===========================================================================
  hallstatt: [
    {
      months: [6, 7, 8, 9],
      type: 'warning',
      icon: 'AlertTriangle',
      title: { zh: '極度旺季警告', en: 'Extreme Crowding Warning' },
      description: {
        zh: '每日遊客超過 10,000 人（全村僅 750 人），建議平日早上 8 點前或下午 4 點後抵達，停車位難求。',
        en: 'Over 10,000 visitors daily (village pop. 750) — arrive before 8am or after 4pm; parking is scarce.',
      },
    },
    {
      months: [12, 1, 2],
      type: 'tip',
      icon: 'Snowflake',
      title: { zh: '冬季秘境', en: 'Winter Hideaway' },
      description: {
        zh: '積雪的哈修塔特如明信片，遊客稀少，但需留意湖面渡輪班次減少。',
        en: 'Snow-covered and postcard-perfect with few visitors, but ferry service is reduced.',
      },
    },
    {
      months: [4, 5],
      type: 'tip',
      icon: 'Flower',
      title: { zh: '春季最佳時機', en: 'Best in Spring' },
      description: {
        zh: '花卉盛開、遊客尚未湧入，強烈推薦。',
        en: 'Flowers bloom before the crowds arrive — highly recommended.',
      },
    },
  ],

  // ===========================================================================
  // MUNICH · 慕尼黑
  // ===========================================================================
  munich: [
    {
      months: [7],
      type: 'event',
      icon: 'Music',
      title: { zh: '慕尼黑夏季歌劇節', en: 'Münchner Opernfestspiele' },
      description: {
        zh: '整個 7 月慕尼黑國家劇院（Nationaltheater）上演頂級歌劇與芭蕾，極具歐洲貴族氣息，是啤酒屋之外的另一個夜間選擇。',
        en: 'Throughout July the Nationaltheater stages top-tier opera and ballet — a refined alternative to the beer halls for evenings in Munich.',
      },
    },
  ],

  // ===========================================================================
  // INNSBRUCK · 因斯布魯克
  // ===========================================================================
  innsbruck: [
    {
      months: [12, 1, 2, 3],
      type: 'event',
      icon: 'Snowflake',
      title: { zh: '滑雪季', en: 'Ski Season' },
      description: {
        zh: 'Nordkette 滑雪場開放，市區 20 分鐘即可抵達雪場。',
        en: 'The Nordkette slopes open — reachable from the city in 20 minutes.',
      },
    },
    {
      months: [1],
      type: 'event',
      icon: 'Trophy',
      title: { zh: 'FIS 世界盃滑雪賽', en: 'FIS Ski World Cup' },
      description: {
        zh: 'Bergisel 跳台滑雪賽事，門票需提前購買。',
        en: 'Ski-jumping at Bergisel — buy tickets in advance.',
      },
    },
  ],
};
