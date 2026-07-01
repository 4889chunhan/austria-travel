import { attractions } from './attractions';
import type { Attraction, DayPlan, TripConfig } from '../types';

/**
 * Final 7/8–7/20 Austria · Germany · Czech road trip (13 days, 2–3 travellers,
 * mid-tempo, city × nature). Mirrors the printed 德奧捷 13 天行程 PDF.
 * Loaded into the store by the "載入示範行程" button on PlanPage.
 *
 * ROUTE (counter-clockwise loop, self-drive from 7/11):
 *  - 7/9–7/10  Vienna — public transport only (U-Bahn / tram / bus).
 *  - 7/11      Vienna → Wachau (Dürnstein + Melk Abbey) → Hallstatt/Altaussee.
 *              Pick up the rental car this morning; driving starts here.
 *  - 7/12      Hallstatt · Gosau · Wolfgangsee → Salzburg (overnight Salzburg).
 *  - 7/13      Salzburg + Königssee day trip into Bavaria.
 *  - 7/14      Salzburg old town → drive to Český Krumlov (overnight CK).
 *  - 7/15      Český Krumlov → Prague (3 nights in Prague).
 *  - 7/16      Bohemian Switzerland NP day trip from Prague.
 *  - 7/17      Prague — castle hill, Charles Bridge, Old Town.
 *  - 7/18      Prague → Vienna (drop the car at VIE airport), overnight Vienna.
 *  - 7/19      Vienna free day before flying home.
 *
 * Vienna is done entirely on public transport; the rental car is collected on
 * the morning of 7/11 and returned at VIE on 7/18. Bavaria sights beyond
 * Königssee (Munich, Neuschwanstein, etc.) stay in the dataset/map but are not
 * part of this loop.
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
  travelers: 3,
  travelerType: 'group',
  startCity: 'vienna',
  cities: [
    'vienna',
    'durnstein',
    'melk',
    'hallstatt',
    'gosau',
    'wolfgangsee',
    'salzburg',
    'konigssee',
    'cesky-krumlov',
    'prague',
  ],
  budget: 'mid',
  includeAccommodation: false,
  accommodationTags: [],
  categories: ['music', 'architecture', 'scenery', 'history'],
};

export const sampleItinerary: DayPlan[] = [
  // Day 1 · 7/8 — Taipei → Vienna (overnight flight, lands the morning of 7/9).
  {
    day: 1,
    date: '2026-07-08',
    city: 'vienna',
    title: { zh: '台北 → 維也納', en: 'Taipei → Vienna' },
    summary: {
      zh: '夜間班機出發，機上休息，隔天早晨抵達維也納。',
      en: 'Depart on the overnight flight; rest on board and land in Vienna the next morning.',
    },
    overnight: { zh: '機上過夜', en: 'Overnight flight' },
    attractions: [],
  },

  // Day 2 · 7/9 — Land at VIE; old-town walk Stephansdom → Graben/Kohlmarkt →
  // Hofburg. City transport: U-Bahn + tram. Evening concert optional.
  {
    day: 2,
    date: '2026-07-09',
    city: 'vienna',
    title: { zh: '抵達維也納 · 舊城漫步', en: 'Arrive Vienna · Old-Town Walk' },
    summary: {
      zh: '抵達、飯店寄放行李後步行舊城：聖史蒂芬大教堂 → Graben → 霍夫堡外觀。晚上可安排音樂會或老城晚餐。',
      en: 'Drop bags, then walk the old town — Stephansdom, Graben, and the Hofburg façade. Optional evening concert or old-town dinner.',
    },
    driveNote: { zh: '維也納市內：U-Bahn／電車（不開車）', en: 'Vienna by U-Bahn / tram — no car yet' },
    overnight: { zh: '維也納 · Cocoon Stadthalle 精品飯店', en: 'Vienna · Cocoon Stadthalle boutique hotel' },
    attractions: pick('stephansdom', 'graben-kohlmarkt', 'hofburg-palace'),
  },

  // Day 3 · 7/10 — Vienna: Schönbrunn, Kunsthistorisches Museum, opera house &
  // a Musikverein Golden-Hall concert.
  {
    day: 3,
    date: '2026-07-10',
    city: 'vienna',
    title: { zh: '維也納 · 美泉宮與金色大廳', en: 'Vienna · Schönbrunn & the Golden Hall' },
    summary: {
      zh: '上午美泉宮，下午藝術史博物館，晚上金色大廳／國家歌劇院音樂會。建議購買維也納通行證或自選景點通票。',
      en: 'Schönbrunn in the morning, Kunsthistorisches Museum in the afternoon, and a Golden-Hall or opera concert at night. A Vienna PASS / Flexi Pass pays off today.',
    },
    driveNote: { zh: '維也納市內：U-Bahn／電車（不開車）', en: 'Vienna by U-Bahn / tram — no car yet' },
    overnight: { zh: '維也納 · Cocoon Stadthalle 精品飯店', en: 'Vienna · Cocoon Stadthalle boutique hotel' },
    attractions: pick(
      'schoenbrunn-palace',
      'kunsthistorisches-museum',
      'wiener-staatsoper',
      'wiener-musikverein',
    ),
  },

  // Day 4 · 7/11 — Pick up the car → Wachau valley (Dürnstein + Melk Abbey) →
  // drive to Altaussee / Hallstatt (JUFA). Driving starts today.
  {
    day: 4,
    date: '2026-07-11',
    city: 'melk',
    title: { zh: '維也納 → 瓦豪河谷 → 哈修塔特', en: 'Vienna → Wachau → Hallstatt' },
    summary: {
      zh: '取車後出發：上午多瑙河谷小鎮杜恩斯坦，下午梅爾克修道院（奧地利代表性巴洛克建築），傍晚續往阿爾陶塞／哈修塔特。',
      en: 'Collect the car and drive the Danube valley: Dürnstein in the morning, Melk Abbey (a Baroque icon) in the afternoon, then on toward Altaussee / Hallstatt.',
    },
    driveNote: {
      zh: '維也納→杜恩斯坦 ~1h07 · 杜恩斯坦→梅爾克 ~35min · 梅爾克→阿爾陶塞 ~2h25',
      en: 'Vienna→Dürnstein ~1h07 · Dürnstein→Melk ~35min · Melk→Altaussee ~2h25',
    },
    overnight: { zh: '阿爾陶塞 · JUFA 阿爾陶塞飯店', en: 'Altaussee · JUFA Altaussee' },
    attractions: pick('durnstein-village', 'melk-abbey'),
  },

  // Day 5 · 7/12 — Hallstatt, Gosau (Dachstein wall) & Wolfgangsee → Salzburg.
  {
    day: 5,
    date: '2026-07-12',
    city: 'hallstatt',
    title: { zh: '哈修塔特 · 戈紹 · 聖沃夫岡湖 → 薩爾斯堡', en: 'Hallstatt · Gosau · Wolfgangsee → Salzburg' },
    summary: {
      zh: '哈修塔特湖畔步道與纜車或遊船，戈紹卡姆眺望達赫斯坦山群，再到聖沃夫岡湖，傍晚抵達薩爾斯堡。',
      en: 'Hallstatt lakeside walk plus cable car or boat, the Dachstein wall from Gosau, then Wolfgangsee before arriving in Salzburg for the night.',
    },
    driveNote: {
      zh: '阿爾陶塞→哈修塔特 ~28min · 哈修塔特→戈紹 ~16min · 戈紹→聖沃夫岡湖 ~43min · →薩爾斯堡 ~37min',
      en: 'Altaussee→Hallstatt ~28min · →Gosau ~16min · →Wolfgangsee ~43min · →Salzburg ~37min',
    },
    overnight: { zh: '薩爾斯堡 · 麥克斯 70 號飯店（有空調）', en: 'Salzburg · Hotel Maxglaner Hauptstraße 70 (A/C)' },
    attractions: pick('hallstatt-village', 'gosaukamm-gosausee', 'wolfgangsee-lake'),
  },

  // Day 6 · 7/13 — Salzburg + Königssee day trip into Bavaria.
  {
    day: 6,
    date: '2026-07-13',
    city: 'salzburg',
    title: { zh: '薩爾斯堡 · 國王湖一日遊', en: 'Salzburg · Königssee Day Trip' },
    summary: {
      zh: '上午前往德國國王湖搭船，下午回薩爾斯堡登要塞（必去）或參觀莫札特故居，晚上老城用餐。',
      en: 'Morning boat on Bavaria’s Königssee, then back to Salzburg for the fortress (a must) or Mozart’s birthplace, and dinner in the old town.',
    },
    driveNote: { zh: '薩爾斯堡→國王湖 ~40min（往返）', en: 'Salzburg→Königssee ~40min each way' },
    overnight: { zh: '薩爾斯堡 · 麥克斯 70 號飯店（有空調）', en: 'Salzburg · Hotel Maxglaner Hauptstraße 70 (A/C)' },
    attractions: pick('konigssee-lake', 'hohensalzburg-fortress', 'mozart-geburtshaus'),
  },

  // Day 7 · 7/14 — Salzburg old town in the morning → drive to Český Krumlov.
  {
    day: 7,
    date: '2026-07-14',
    city: 'cesky-krumlov',
    title: { zh: '薩爾斯堡 → 庫倫洛夫', en: 'Salzburg → Český Krumlov' },
    summary: {
      zh: '上午逛薩爾斯堡老城與主教座堂（必去），之後跨境開往捷克童話小鎮庫倫洛夫，傍晚入住舊城。',
      en: 'Salzburg old town and cathedral in the morning, then cross into Czechia to the fairy-tale town of Český Krumlov for the night.',
    },
    driveNote: { zh: '薩爾斯堡→庫倫洛夫 ~2h40（跨越奧捷邊境）', en: 'Salzburg→Český Krumlov ~2h40 (AT→CZ border)' },
    overnight: { zh: '庫倫洛夫 · 克魯姆洛夫斯卡博達飯店', en: 'Český Krumlov · Hotel Krumlovská Bárka' },
    attractions: pick('salzburg-cathedral', 'getreidegasse', 'cesky-krumlov-old-town'),
  },

  // Day 8 · 7/15 — Český Krumlov → Prague; afternoon Old Town + Art-Nouveau walk.
  {
    day: 8,
    date: '2026-07-15',
    city: 'prague',
    title: { zh: '庫倫洛夫 → 布拉格 · 舊城與新藝術', en: 'Český Krumlov → Prague · Old Town & Art Nouveau' },
    summary: {
      zh: '開往布拉格，下午散步舊城廣場、火藥塔、市民會館（新藝術風格）、瓦茨拉夫廣場與跳舞的房子。',
      en: 'Drive to Prague, then an afternoon walk: Old Town Square, Powder Tower, the Art-Nouveau Municipal House, Wenceslas Square and the Dancing House.',
    },
    driveNote: { zh: '庫倫洛夫→布拉格 ~2h', en: 'Český Krumlov→Prague ~2h' },
    overnight: { zh: '布拉格 · Numa Flow 飯店', en: 'Prague · Numa Flow' },
    attractions: pick('prague-old-town-square', 'prague-municipal-house', 'dancing-house'),
  },

  // Day 9 · 7/16 — Bohemian Switzerland NP day trip (Pravčická brána + Kamenice
  // gorge). No mapped attraction — described in the day summary.
  {
    day: 9,
    date: '2026-07-16',
    city: 'prague',
    title: { zh: '波希米亞瑞士國家公園', en: 'Bohemian Switzerland National Park' },
    summary: {
      zh: '從布拉格出發（約 2 小時），走最經典的 Pravčická brána 拱門與 Kamenice 峽谷遊船大環線步道 — 全歐洲最大的天然砂岩拱門與幽深原始河谷。',
      en: 'A day trip north of Prague (~2h) for the classic loop — the Pravčická brána sandstone arch (Europe’s largest) and a punt through the Kamenice gorge.',
    },
    driveNote: { zh: '布拉格→國家公園 ~2h（往返）', en: 'Prague→national park ~2h each way' },
    overnight: { zh: '布拉格 · Numa Flow 飯店', en: 'Prague · Numa Flow' },
    attractions: [],
  },

  // Day 10 · 7/17 — Prague: castle hill, St. Vitus, Charles Bridge, Old Town.
  {
    day: 10,
    date: '2026-07-17',
    city: 'prague',
    title: { zh: '布拉格 · 城堡與查理大橋', en: 'Prague · Castle & Charles Bridge' },
    summary: {
      zh: '上午布拉格城堡與聖維特主教座堂，下坡經小城區到查理大橋、舊城廣場，晚上欣賞伏爾塔瓦河夜景。',
      en: 'Prague Castle and St. Vitus in the morning, downhill through Malá Strana to Charles Bridge and the Old Town Square, ending with the Vltava river at night.',
    },
    driveNote: { zh: '布拉格市內：步行＋路面電車（車停飯店／停車場）', en: 'Prague on foot + tram — leave the car parked' },
    overnight: { zh: '布拉格 · Numa Flow 飯店', en: 'Prague · Numa Flow' },
    attractions: pick('prague-castle', 'charles-bridge', 'prague-old-town-square'),
  },

  // Day 11 · 7/18 — Prague → Vienna; drop the car at VIE airport, overnight Vienna.
  {
    day: 11,
    date: '2026-07-18',
    city: 'vienna',
    title: { zh: '布拉格 → 維也納（還車）', en: 'Prague → Vienna (drop the car)' },
    summary: {
      zh: '上午 8 點自布拉格出發，直接到維也納國際機場還車（加滿油 Full-to-Full），再進市區入住。',
      en: 'Leave Prague around 8am, return the car full-to-full at Vienna airport, then head into the city to check in.',
    },
    driveNote: { zh: '布拉格→維也納機場 ~3h57', en: 'Prague→Vienna airport ~3h57' },
    overnight: { zh: '維也納 · myNext 魯迪飯店', en: 'Vienna · myNext Rudi' },
    attractions: [],
  },

  // Day 12 · 7/19 — Vienna free day (cafés, shopping, any missed sights).
  {
    day: 12,
    date: '2026-07-19',
    city: 'vienna',
    title: { zh: '維也納 · 自由活動', en: 'Vienna · Free Day' },
    summary: {
      zh: '最後一整天留給維也納：分離派會館、納許市場與經典咖啡館，或補齊前幾天錯過的景點。',
      en: 'A full day back in Vienna — the Secession, Naschmarkt and classic cafés, or catch anything you missed earlier.',
    },
    driveNote: { zh: '維也納市內：U-Bahn／電車', en: 'Vienna by U-Bahn / tram' },
    overnight: { zh: '維也納 · myNext 魯迪飯店', en: 'Vienna · myNext Rudi' },
    attractions: pick('secession-building', 'naschmarkt', 'cafe-central'),
  },

  // Day 13 · 7/20 — Vienna → Taipei (train to VIE, fly home).
  {
    day: 13,
    date: '2026-07-20',
    city: 'vienna',
    title: { zh: '維也納 → 台北', en: 'Vienna → Taipei' },
    summary: {
      zh: '搭高速火車（RJ，Wien Hbf → 機場約 15 分鐘）前往維也納機場，搭機返台。',
      en: 'Take the Railjet from Wien Hbf to the airport (~15 min) and fly home to Taipei.',
    },
    overnight: { zh: '返程航班', en: 'Return flight' },
    attractions: [],
  },
];
