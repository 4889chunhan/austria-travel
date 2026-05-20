import type { TransportRoute } from '../types';

/**
 * Inter-city transport routes across Austria (plus one cross-border Bratislava
 * day-trip). Routes are bidirectional — `findRoute('vienna', 'salzburg')` and
 * `findRoute('salzburg', 'vienna')` return the same record. Methods are
 * ordered by recommendation (primary mode first).
 *
 * Durations, prices, and frequencies are illustrative — they reflect typical
 * ÖBB / Postbus / FlixBus schedules at time of writing but are not booked
 * data. Verify before relying on them in production.
 */
export const transportRoutes: TransportRoute[] = [
  // -------------------------------------------------------------------------
  // Vienna ↔ Salzburg
  // -------------------------------------------------------------------------
  {
    id: 'vienna-salzburg',
    from: 'vienna',
    to: 'salzburg',
    methods: [
      {
        type: 'train',
        operator: 'ÖBB Railjet',
        duration: '2h 30min',
        frequency: '每 30 分鐘一班',
        price: '€30–50',
        notes: {
          zh: '從維也納中央車站(Wien Hbf)直達薩爾斯堡中央車站。提前一週訂票最便宜。',
          en: 'Direct Wien Hbf → Salzburg Hbf. Book a week ahead for the cheapest fares.',
        },
      },
      {
        type: 'car',
        operator: 'A1 西部高速公路',
        duration: '3h 00min',
        price: '油費約 €40',
        notes: {
          zh: '⚠️ 奧地利高速公路須購買通行貼(Vignette),10 天票 €12.40,可於邊境加油站購買。',
          en: '⚠️ Vignette toll sticker required on Austrian motorways — 10-day pass €12.40, sold at border gas stations.',
        },
      },
    ],
  },

  // -------------------------------------------------------------------------
  // Vienna ↔ Hallstatt
  // -------------------------------------------------------------------------
  {
    id: 'vienna-hallstatt',
    from: 'vienna',
    to: 'hallstatt',
    methods: [
      {
        type: 'train',
        operator: 'ÖBB',
        duration: '3h 30min',
        frequency: '每 1–2 小時一班',
        price: '€40–60',
        notes: {
          zh: '經 Attnang-Puchheim 轉乘 Salzkammergut 區間車。沿途湖光山色,值得保持車窗清潔。抵達 Hallstatt 站須轉搭渡輪過湖到老城。',
          en: 'Change at Attnang-Puchheim to the Salzkammergut regional line — windows worth keeping clear. Final leg is a short ferry across the lake.',
        },
      },
      {
        type: 'car',
        operator: 'A1 + B145',
        duration: '3h 45min',
        notes: {
          zh: '⚠️ 須購買 Vignette。停車於 Hallstatt 入口 P1 停車場(€6/天)— 觀光巴士禁止進村,小型車有限名額,夏季常滿。',
          en: '⚠️ Vignette required. Park at the P1 lot at the village entrance (€6/day) — tour buses are banned inside, and small-car spaces fill up fast in summer.',
        },
      },
    ],
  },

  // -------------------------------------------------------------------------
  // Salzburg ↔ Hallstatt
  // -------------------------------------------------------------------------
  {
    id: 'salzburg-hallstatt',
    from: 'salzburg',
    to: 'hallstatt',
    methods: [
      {
        type: 'train',
        operator: 'ÖBB + Hallstatt Schifffahrt',
        duration: '1h 45min',
        frequency: '每 2 小時一班',
        price: '€20–30',
        notes: {
          zh: '火車從薩爾斯堡到 Hallstatt 站,出站即接渡輪過湖到老城。火車與渡輪時刻通常配合。',
          en: 'Train from Salzburg to Hallstatt station, then the lake ferry across to the old town. Schedules are coordinated.',
        },
      },
      {
        type: 'bus',
        operator: 'Postbus 150 + 542',
        duration: '1h 30min',
        frequency: '每 1–2 小時一班',
        price: '€12',
        notes: {
          zh: '從薩爾斯堡中央車站搭 Postbus 150 到 Bad Ischl,轉 542 路到哈修塔特村口。比火車便宜,但要轉車。',
          en: 'Postbus 150 from Salzburg Hbf to Bad Ischl, then bus 542 onward to Hallstatt village. Cheaper than the train but requires a transfer.',
        },
      },
      {
        type: 'car',
        operator: 'B158 阿爾卑斯公路',
        duration: '1h 15min',
        notes: {
          zh: '經 Fuschlsee、Wolfgangsee、St. Wolfgang,沿途湖泊與山景接連不斷 — 奧地利最美的駕車路線之一。',
          en: 'Past Fuschlsee, Wolfgangsee, and St. Wolfgang — one of Austria\'s most scenic drives, with lakes and alpine peaks the whole way.',
        },
      },
    ],
  },

  // -------------------------------------------------------------------------
  // Vienna ↔ Graz
  // -------------------------------------------------------------------------
  {
    id: 'vienna-graz',
    from: 'vienna',
    to: 'graz',
    methods: [
      {
        type: 'train',
        operator: 'ÖBB Railjet',
        duration: '2h 40min',
        frequency: '每小時一班',
        price: '€25–45',
        notes: {
          zh: '直達車經 Semmering 半石腰鐵路(UNESCO 世界遺產),沿途隧道與高架橋風光獨特。',
          en: 'Direct via the Semmering railway — a UNESCO World Heritage line of dramatic viaducts and tunnels.',
        },
      },
    ],
  },

  // -------------------------------------------------------------------------
  // Vienna ↔ Innsbruck
  // -------------------------------------------------------------------------
  {
    id: 'vienna-innsbruck',
    from: 'vienna',
    to: 'innsbruck',
    methods: [
      {
        type: 'train',
        operator: 'ÖBB Railjet',
        duration: '4h 00min',
        frequency: '每 1–2 小時一班',
        price: '€40–80',
        notes: {
          zh: '經薩爾斯堡繼續直達 Innsbruck,西行段穿越 Arlberg 山口,冬季可賞雪景。建議靠右坐(往西行進方向),南面阿爾卑斯山景較壯麗。',
          en: 'Via Salzburg, continuing direct to Innsbruck. The westbound leg crosses the Arlberg pass — striking in winter. Sit on the right (south) for the best alpine views.',
        },
      },
    ],
  },

  // -------------------------------------------------------------------------
  // Vienna ↔ Bratislava (cross-border bonus)
  // -------------------------------------------------------------------------
  {
    id: 'vienna-bratislava',
    from: 'vienna',
    to: 'bratislava',
    methods: [
      {
        type: 'bus',
        operator: 'FlixBus',
        duration: '1h 00min',
        frequency: '每小時一班',
        price: '€5–10',
        notes: {
          zh: '從 Wien Erdberg 巴士總站直達 Bratislava。歐盟內部無邊境檢查,但護照仍建議備查。',
          en: 'From Wien Erdberg bus terminal direct to Bratislava. No EU border checks, but carry your passport.',
        },
      },
      {
        type: 'train',
        operator: 'ÖBB / ZSSK',
        duration: '1h 10min',
        frequency: '每小時一班',
        price: '€16 來回',
        notes: {
          zh: 'EUregio 票包來回,當天往返最划算。',
          en: 'The EUregio ticket bundles round-trip — best value for a same-day return.',
        },
      },
    ],
  },
];

/* ---------------------------------------------------------------------------
   Within-city transport
   --------------------------------------------------------------------------- */

export interface CityTransport {
  city: string;
  system: { zh: string; en: string };
  tip: { zh: string; en: string };
}

export const cityTransport: CityTransport[] = [
  {
    city: 'vienna',
    system: {
      zh: 'U-Bahn(地鐵)5 條線 + Tram(路面電車)+ 巴士',
      en: 'U-Bahn (metro, 5 lines) + tram + bus',
    },
    tip: {
      zh: '推薦購買 48 小時通票(€14.10)或 72 小時(€17.10),可無限搭乘所有公共運輸。Vienna PASS 含主要景點門票。',
      en: 'Get the 48-hour pass (€14.10) or 72-hour (€17.10) for unlimited rides on all public transport. The Vienna PASS bundles attraction admissions.',
    },
  },
  {
    city: 'salzburg',
    system: {
      zh: '老城步行可達 + Obus(無軌電車)往市區外',
      en: 'Old town is walkable; Obus (trolleybus) reaches outer districts',
    },
    tip: {
      zh: '老城精華景點皆在步行範圍。Salzburg Card(24h €30)含所有公共運輸與主要景點門票,城堡纜車也包含。',
      en: 'All main old-town sights are walkable. The Salzburg Card (24h €30) bundles public transport, attractions, and the fortress funicular.',
    },
  },
  {
    city: 'hallstatt',
    system: {
      zh: '渡輪(從火車站過湖)+ 村內步行',
      en: 'Ferry across the lake from the station, then walking inside the village',
    },
    tip: {
      zh: 'Hallstatt Lahn 渡輪碼頭是抵達點。村內全步行,Markt 廣場到任何景點 5 分鐘內。鹽礦須搭 Salzbergbahn 纜車上山。',
      en: 'Hallstatt Lahn ferry terminal is the gateway. Everything inside the village is within 5 min of Markt square. The salt mine needs the Salzbergbahn funicular.',
    },
  },
  {
    city: 'innsbruck',
    system: {
      zh: '舊城步行 + Nordkettenbahn 纜車上山',
      en: 'Walking in the old town + Nordkettenbahn cable car to the summit',
    },
    tip: {
      zh: 'Innsbruck Card(24h €53)含纜車與所有主要景點 — 想上山的話幾乎一定要買。',
      en: 'The Innsbruck Card (24h €53) includes the cable car and all major attractions — practically essential if you plan to go up the mountain.',
    },
  },
  {
    city: 'graz',
    system: {
      zh: '路面電車(7 條線)+ 步行',
      en: 'Tram (7 lines) + walking',
    },
    tip: {
      zh: '老城列為 UNESCO 世界遺產,中央廣場到 Schlossberg 城堡山步行 15 分鐘,或搭電梯。',
      en: 'The UNESCO-listed old town is walkable; 15 min from Hauptplatz up to the Schlossberg (or take the elevator).',
    },
  },
];

/* ---------------------------------------------------------------------------
   Lookup helpers
   --------------------------------------------------------------------------- */

/**
 * Find a route between two cities (bidirectional — order doesn't matter).
 * Returns `undefined` for in-city pairs or routes not in the dataset.
 */
export function findRoute(
  from: string,
  to: string,
): TransportRoute | undefined {
  return transportRoutes.find(
    (r) =>
      (r.from === from && r.to === to) || (r.from === to && r.to === from),
  );
}

export function getCityTransport(city: string): CityTransport | undefined {
  return cityTransport.find((c) => c.city === city);
}
