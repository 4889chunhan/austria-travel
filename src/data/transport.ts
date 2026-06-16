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
        duration: '2h 22min',
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

  // -------------------------------------------------------------------------
  // Vienna ↔ Český Krumlov (road-trip leg 1)
  // -------------------------------------------------------------------------
  {
    id: 'vienna-cesky-krumlov',
    from: 'vienna',
    to: 'cesky-krumlov',
    methods: [
      {
        type: 'car',
        operator: 'A22 / S5 / E59',
        duration: '2h 45min',
        price: '205 km · 油費約 €25',
        notes: {
          zh: '⚠️ 奧地利段須購買 Vignette 通行貼。庫倫洛夫老城禁止車輛進入,停在城外 P1/P2 停車場(約 €1/小時),步行 5–10 分鐘入城。',
          en: '⚠️ Austrian-side vignette required. The Český Krumlov old town is car-free — park at the P1/P2 lots outside (≈€1/h) and walk 5–10 min in.',
        },
      },
      {
        type: 'bus',
        operator: 'CK Shuttle / FlixBus',
        duration: '約 3h 00min',
        frequency: '每日數班',
        price: '€15–25',
        notes: {
          zh: '若不自駕,有維也納直達庫倫洛夫的接駁小巴與長途巴士,需提前預約。',
          en: 'If not driving, direct shuttle vans and coaches run Vienna → Český Krumlov — book ahead.',
        },
      },
    ],
  },

  // -------------------------------------------------------------------------
  // Český Krumlov ↔ Prague (road-trip leg 2)
  // -------------------------------------------------------------------------
  {
    id: 'cesky-krumlov-prague',
    from: 'cesky-krumlov',
    to: 'prague',
    methods: [
      {
        type: 'car',
        operator: 'E55 / D3',
        duration: '2h 15min',
        price: '172 km',
        notes: {
          zh: '經 České Budějovice 接 D3 高速公路北上布拉格。捷克高速公路須購買電子通行證(dálniční známka)。',
          en: 'Via České Budějovice onto the D3 motorway north to Prague. A Czech e-vignette (dálniční známka) is required on motorways.',
        },
      },
      {
        type: 'bus',
        operator: 'RegioJet / FlixBus',
        duration: '約 2h 50min',
        frequency: '每 1–2 小時一班',
        price: '€10–15',
        notes: {
          zh: '舒適直達長途巴士,含 Wi-Fi 與飲料,提前訂便宜。',
          en: 'Comfortable direct coaches with Wi-Fi and drinks — cheapest booked ahead.',
        },
      },
    ],
  },

  // -------------------------------------------------------------------------
  // Prague ↔ Salzburg (road-trip leg 3 — the long transfer)
  // -------------------------------------------------------------------------
  {
    id: 'prague-salzburg',
    from: 'prague',
    to: 'salzburg',
    methods: [
      {
        type: 'car',
        operator: 'D3 / A7 / A1（經林茲 Linz）',
        duration: '4h 08min',
        price: '378 km · 油費約 €45',
        notes: {
          zh: '⚠️ 全程最長的一段。建議在林茲(Linz)午餐休息把車程切兩半,過奧地利邊境前先備好 Vignette。',
          en: '⚠️ The trip\'s single longest leg. Break it with a lunch stop in Linz, and have an Austrian vignette ready before the border.',
        },
      },
      {
        type: 'train',
        operator: 'ÖBB / České dráhy（林茲轉乘）',
        duration: '約 5h 30min',
        frequency: '每 2 小時一班',
        price: '€40–70',
        notes: {
          zh: '須在林茲轉車,風景優美但比自駕慢許多。',
          en: 'Change at Linz — scenic but far slower than driving.',
        },
      },
    ],
  },

  // -------------------------------------------------------------------------
  // Salzburg ↔ Königssee (day trip south into Bayern)
  // -------------------------------------------------------------------------
  {
    id: 'salzburg-konigssee',
    from: 'salzburg',
    to: 'konigssee',
    methods: [
      {
        type: 'car',
        operator: 'B160 → Schönau am Königssee',
        duration: '35min',
        price: '35 km',
        notes: {
          zh: '停在 Schönau 湖畔大型停車場(€6/天),再搭電動遊船深入湖區到 St. Bartholomä。',
          en: 'Park at the big Schönau lakeside lot (€6/day), then take the electric boat deep into the lake to St. Bartholomä.',
        },
      },
      {
        type: 'bus',
        operator: 'RVO 840',
        duration: '約 50min',
        frequency: '每小時一班',
        price: '€5–9',
        notes: {
          zh: '從薩爾斯堡中央車站直達 Königssee/Schönau,免去停車。',
          en: 'Direct from Salzburg Hbf to Königssee/Schönau — saves the parking hassle.',
        },
      },
    ],
  },

  // -------------------------------------------------------------------------
  // Salzburg ↔ Gosau (into the Salzkammergut)
  // -------------------------------------------------------------------------
  {
    id: 'salzburg-gosau',
    from: 'salzburg',
    to: 'gosau',
    methods: [
      {
        type: 'car',
        operator: 'B158 阿爾卑斯湖區公路',
        duration: '1h 20min',
        price: '80 km',
        notes: {
          zh: '經 Fuschlsee、Wolfgangsee,沿途湖光山色,是奧地利最美的駕車路線之一。',
          en: 'Past Fuschlsee and Wolfgangsee — one of Austria\'s prettiest drives the whole way.',
        },
      },
      {
        type: 'bus',
        operator: 'Postbus 150 + 542',
        duration: '約 2h 00min',
        frequency: '每 1–2 小時一班',
        notes: {
          zh: '經 Bad Ischl 轉車,班次有限,自駕方便許多。',
          en: 'Via Bad Ischl with a transfer — limited service, so driving is far easier.',
        },
      },
    ],
  },

  // -------------------------------------------------------------------------
  // Gosau ↔ Hallstatt
  // -------------------------------------------------------------------------
  {
    id: 'gosau-hallstatt',
    from: 'gosau',
    to: 'hallstatt',
    methods: [
      {
        type: 'car',
        operator: 'B166',
        duration: '25min',
        price: '18 km',
        notes: {
          zh: '停在 Hallstatt 入口 P1 停車場(€6/天)— 觀光車禁止進村。',
          en: 'Park at the Hallstatt P1 entrance lot (€6/day) — tour vehicles are banned inside the village.',
        },
      },
      {
        type: 'bus',
        operator: 'Postbus 542',
        duration: '約 40min',
        frequency: '每 1–2 小時一班',
        notes: {
          zh: 'Gosau ↔ Hallstatt Lahn 渡輪站,班次配合渡輪時刻。',
          en: 'Gosau ↔ Hallstatt Lahn ferry stop; timed to connect with the lake ferry.',
        },
      },
    ],
  },

  // -------------------------------------------------------------------------
  // Hallstatt ↔ Melk (Salzkammergut → Wachau)
  // -------------------------------------------------------------------------
  {
    id: 'hallstatt-melk',
    from: 'hallstatt',
    to: 'melk',
    methods: [
      {
        type: 'car',
        operator: 'B145 / A1 西部高速公路',
        duration: '2h 15min',
        price: '203 km',
        notes: {
          zh: '離開鹽湖區往瓦豪河谷,接 A1 高速公路東行至梅爾克。',
          en: 'Leaving the Salzkammergut for the Wachau — onto the A1 east toward Melk.',
        },
      },
      {
        type: 'train',
        operator: 'ÖBB（Attnang-Puchheim 轉乘）',
        duration: '約 3h 30min',
        frequency: '每 1–2 小時一班',
        notes: {
          zh: '渡輪出村後在 Attnang-Puchheim 轉 Railjet,自駕單純許多。',
          en: 'Ferry out of the village, then change at Attnang-Puchheim to a Railjet — driving is much simpler.',
        },
      },
    ],
  },

  // -------------------------------------------------------------------------
  // Melk ↔ Dürnstein (along the Wachau valley)
  // -------------------------------------------------------------------------
  {
    id: 'melk-durnstein',
    from: 'melk',
    to: 'durnstein',
    methods: [
      {
        type: 'car',
        operator: 'B3 多瑙河北岸',
        duration: '35min',
        price: '35 km',
        notes: {
          zh: '沿多瑙河北岸 B3 穿過瓦豪葡萄園,沿途杏桃園與河景。',
          en: 'The B3 along the Danube\'s north bank through the Wachau vineyards and apricot orchards.',
        },
      },
      {
        type: 'bus',
        operator: 'DDSG 瓦豪遊船',
        duration: '約 1h 40min',
        price: '€28+',
        notes: {
          zh: '經典玩法是搭 DDSG 多瑙河遊船順流而下(梅爾克 → 杜恩斯坦),雖慢但景色一流。',
          en: 'The classic way is the DDSG Danube cruise downstream (Melk → Dürnstein) — slow but unbeatable scenery.',
        },
      },
    ],
  },

  // -------------------------------------------------------------------------
  // Dürnstein ↔ Vienna (road-trip final leg)
  // -------------------------------------------------------------------------
  {
    id: 'durnstein-vienna',
    from: 'durnstein',
    to: 'vienna',
    methods: [
      {
        type: 'car',
        operator: 'S5 / A22',
        duration: '1h 15min',
        price: '85 km',
        notes: {
          zh: '經 Krems 接高速公路東返維也納,於機場(VIE)還車最順。',
          en: 'Via Krems onto the motorway back to Vienna — drop the rental at the airport (VIE).',
        },
      },
      {
        type: 'train',
        operator: 'ÖBB（Krems 轉乘）',
        duration: '約 1h 40min',
        frequency: '每小時一班',
        notes: {
          zh: '先到 Krems,再搭區間車至維也納 Franz-Josefs-Bahnhof。',
          en: 'Short hop to Krems, then a regional train to Wien Franz-Josefs-Bahnhof.',
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
