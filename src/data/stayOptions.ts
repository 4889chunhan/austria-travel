/**
 * Per-night accommodation options for the 7/8–7/20 sample itinerary.
 *
 * The point of this dataset is to fix the broken "no info" booking links: every
 * option here is rendered as a LIVE search URL on Booking.com / Airbnb
 * (pre-filled with the night's dates and 3 guests), so a click always lands on
 * real, currently-bookable results rather than a guessed property page that 404s.
 *
 * Each night is anchored to that day's LAST attraction; the five options sit
 * within ~20 min drive of it. Property names are real, recognisable stays in
 * the area — prices are indicative per-night for 3 people and should be
 * confirmed on the platform.
 */

export type StayPlatform = 'booking' | 'airbnb';
export type StayType =
  | 'hotel'
  | 'boutique'
  | 'guesthouse'
  | 'hostel'
  | 'apartment';

export interface StayOption {
  platform: StayPlatform;
  /** Real property name (Booking) or apartment descriptor (Airbnb). */
  name: string;
  type: StayType;
  /** Indicative price per night for 3 guests, EUR. */
  priceEUR: string;
  /** Location / distance note relative to the night's anchor. */
  note: { zh: string; en: string };
  /**
   * Search term that opens the right results: a property name for Booking,
   * or an area/neighbourhood query for Airbnb.
   */
  searchTerm: string;
}

export interface StayNight {
  /** Check-in date (the night itself), ISO. */
  date: string;
  /** Check-out (next morning), ISO. */
  checkout: string;
  /** City slug — resolved to a label via cityDisplay. */
  city: string;
  /** That day's last attraction — the search anchor. */
  anchor: { zh: string; en: string };
  /** Extra planning guidance for the night. */
  note?: { zh: string; en: string };
  options: StayOption[];
}

export const stayNights: StayNight[] = [
  // ===== 7/9 · Vienna — anchor: Hofburg (Innere Stadt) =======================
  {
    date: '2026-07-09',
    checkout: '2026-07-10',
    city: 'vienna',
    anchor: { zh: '霍夫堡皇宮', en: 'Hofburg Palace' },
    options: [
      {
        platform: 'booking',
        name: 'Hotel Am Stephansplatz',
        type: 'hotel',
        priceEUR: '€260–320',
        note: { zh: '正對聖史蒂芬大教堂，步行 5 分鐘到霍夫堡。', en: 'Facing the cathedral, 5 min walk to the Hofburg.' },
        searchTerm: 'Hotel Am Stephansplatz, Vienna',
      },
      {
        platform: 'booking',
        name: 'Hotel König von Ungarn',
        type: 'boutique',
        priceEUR: '€240–300',
        note: { zh: '大教堂後方的歷史庭院飯店，鬧中取靜。', en: 'Historic courtyard hotel just behind the cathedral.' },
        searchTerm: 'Hotel Koenig von Ungarn, Vienna',
      },
      {
        platform: 'booking',
        name: 'Pension Nossek',
        type: 'guesthouse',
        priceEUR: '€170–210',
        note: { zh: '格拉本大街上的家庭式旅店，位置無敵。', en: 'Family-run guesthouse right on the Graben.' },
        searchTerm: 'Pension Nossek, Vienna',
      },
      {
        platform: 'airbnb',
        name: '內城區整套三人公寓',
        type: 'apartment',
        priceEUR: '€180–240',
        note: { zh: '1010 內城區，走路即達霍夫堡與國家圖書館。', en: 'Innere Stadt (1010), walk to the Hofburg.' },
        searchTerm: 'Innere Stadt, Vienna',
      },
      {
        platform: 'airbnb',
        name: '霍夫堡旁老公寓',
        type: 'apartment',
        priceEUR: '€200–260',
        note: { zh: '帝國風老公寓，三人一室含小廚房。', en: 'Period apartment for 3 with a kitchenette.' },
        searchTerm: 'Hofburg, Vienna',
      },
    ],
  },

  // ===== 7/10 · Vienna — anchor: Musikverein (Karlsplatz) ====================
  {
    date: '2026-07-10',
    checkout: '2026-07-11',
    city: 'vienna',
    anchor: { zh: '維也納音樂協會 (金色大廳)', en: 'Musikverein' },
    options: [
      {
        platform: 'booking',
        name: 'Hotel Sacher Wien',
        type: 'hotel',
        priceEUR: '€600+',
        note: { zh: '傳奇五星，正對歌劇院、音樂廳旁。', en: 'Legendary five-star opposite the opera.' },
        searchTerm: 'Hotel Sacher Wien',
      },
      {
        platform: 'booking',
        name: 'The Guesthouse Vienna',
        type: 'boutique',
        priceEUR: '€260–330',
        note: { zh: '阿爾貝蒂娜美術館旁的設計精品飯店。', en: 'Design boutique by the Albertina.' },
        searchTerm: 'The Guesthouse Vienna',
      },
      {
        platform: 'booking',
        name: 'Motel One Wien-Staatsoper',
        type: 'hotel',
        priceEUR: '€150–190',
        note: { zh: '歌劇院旁的高 CP 值設計連鎖，三人房需早訂。', en: 'Great-value design chain by the opera; book the triple early.' },
        searchTerm: 'Motel One Wien-Staatsoper',
      },
      {
        platform: 'airbnb',
        name: '卡爾廣場旁公寓',
        type: 'apartment',
        priceEUR: '€190–250',
        note: { zh: '近 Karlsplatz 地鐵樞紐，去哪都方便。', en: 'By the Karlsplatz U-Bahn hub.' },
        searchTerm: 'Karlsplatz, Vienna',
      },
      {
        platform: 'airbnb',
        name: '納許市場旁 loft',
        type: 'apartment',
        priceEUR: '€200–270',
        note: { zh: '緊鄰納許市場，早晨逛市集吃早餐。', en: 'Next to the Naschmarkt for morning market breakfasts.' },
        searchTerm: 'Naschmarkt, Vienna',
      },
    ],
  },

  // ===== 7/11 · Vienna — anchor: Café Central (Schottentor) ==================
  {
    date: '2026-07-11',
    checkout: '2026-07-12',
    city: 'vienna',
    anchor: { zh: '中央咖啡館', en: 'Café Central' },
    note: {
      zh: '隔天一早取車自駕前往庫倫洛夫，建議選有停車場或周邊車位的住宿。',
      en: 'You pick up the rental car here tomorrow — pick a stay with parking nearby.',
    },
    options: [
      {
        platform: 'booking',
        name: 'Grand Ferdinand Hotel',
        type: 'hotel',
        priceEUR: '€280–350',
        note: { zh: '環城大道上的優雅五星，頂樓泳池。', en: 'Elegant five-star on the Ringstrasse with a rooftop pool.' },
        searchTerm: 'Grand Ferdinand Hotel, Vienna',
      },
      {
        platform: 'booking',
        name: 'Hotel Capricorno',
        type: 'hotel',
        priceEUR: '€200–250',
        note: { zh: '近 Schwedenplatz，運河與舊城之間。', en: 'By Schwedenplatz, between the canal and old town.' },
        searchTerm: 'Hotel Capricorno, Vienna',
      },
      {
        platform: 'booking',
        name: 'Boutique Hotel Stadthalle',
        type: 'boutique',
        priceEUR: '€150–190',
        note: { zh: '生態設計飯店，有自家停車場、適合取車前一晚。', en: 'Eco design hotel with its own car park — handy before pickup.' },
        searchTerm: 'Boutique Hotel Stadthalle, Vienna',
      },
      {
        platform: 'airbnb',
        name: 'Schottentor 旁公寓',
        type: 'apartment',
        priceEUR: '€180–240',
        note: { zh: '近中央咖啡館與大學區，安靜。', en: 'Quiet, by Café Central and the university quarter.' },
        searchTerm: 'Schottentor, Vienna',
      },
      {
        platform: 'airbnb',
        name: '環城大道三人公寓',
        type: 'apartment',
        priceEUR: '€210–280',
        note: { zh: '附近有路邊/車庫停車，方便隔日上路。', en: 'Garage parking nearby for the next-day drive.' },
        searchTerm: 'Ringstrasse, Vienna',
      },
    ],
  },

  // ===== 7/12 · Český Krumlov — anchor: old town ============================
  {
    date: '2026-07-12',
    checkout: '2026-07-13',
    city: 'cesky-krumlov',
    anchor: { zh: '庫倫洛夫舊城', en: 'Český Krumlov old town' },
    note: {
      zh: '老城禁行車輛，住宿多需停在城外停車場再步行入內。',
      en: 'The old town is car-free — most stays mean parking outside and walking in.',
    },
    options: [
      {
        platform: 'booking',
        name: 'Hotel Růže',
        type: 'hotel',
        priceEUR: '€150–200',
        note: { zh: '文藝復興耶穌會學院改建的五星名宿。', en: 'Five-star in a Renaissance former Jesuit college.' },
        searchTerm: 'Hotel Ruze, Cesky Krumlov',
      },
      {
        platform: 'booking',
        name: 'Hotel Dvořák Český Krumlov',
        type: 'hotel',
        priceEUR: '€120–160',
        note: { zh: '伏爾塔瓦河畔，房間望城堡。', en: 'On the Vltava riverbank with castle views.' },
        searchTerm: 'Hotel Dvorak, Cesky Krumlov',
      },
      {
        platform: 'booking',
        name: 'Pension Gardena',
        type: 'guesthouse',
        priceEUR: '€90–120',
        note: { zh: '溫馨家庭民宿，含早餐、價格實惠。', en: 'Cosy family pension with breakfast, good value.' },
        searchTerm: 'Pension Gardena, Cesky Krumlov',
      },
      {
        platform: 'airbnb',
        name: '河畔老城整套公寓',
        type: 'apartment',
        priceEUR: '€110–150',
        note: { zh: '老城石屋整套公寓，三人剛好。', en: 'Whole stone-house apartment, fits 3.' },
        searchTerm: 'Cesky Krumlov, Czechia',
      },
      {
        platform: 'airbnb',
        name: '城堡景觀公寓',
        type: 'apartment',
        priceEUR: '€120–170',
        note: { zh: '陽台正對城堡塔樓，夜景一流。', en: 'Balcony facing the castle tower — great at night.' },
        searchTerm: 'Cesky Krumlov castle view apartment',
      },
    ],
  },

  // ===== 7/13 · Prague — anchor: Municipal House (Old Town) ==================
  {
    date: '2026-07-13',
    checkout: '2026-07-14',
    city: 'prague',
    anchor: { zh: '市民會館', en: 'Municipal House' },
    options: [
      {
        platform: 'booking',
        name: 'Hotel Paris Prague',
        type: 'hotel',
        priceEUR: '€280–360',
        note: { zh: '市民會館旁的新藝術風五星地標。', en: 'Art-Nouveau five-star landmark beside the Municipal House.' },
        searchTerm: 'Hotel Paris Prague',
      },
      {
        platform: 'booking',
        name: 'Grand Hotel Bohemia',
        type: 'hotel',
        priceEUR: '€220–300',
        note: { zh: '舊城廣場後方的巴洛克五星。', en: 'Baroque five-star just behind Old Town Square.' },
        searchTerm: 'Grand Hotel Bohemia, Prague',
      },
      {
        platform: 'booking',
        name: 'Hotel Josef',
        type: 'boutique',
        priceEUR: '€180–240',
        note: { zh: '猶太區的極簡設計飯店，步行到舊城廣場。', en: 'Minimalist design hotel in Josefov, walk to the square.' },
        searchTerm: 'Hotel Josef, Prague',
      },
      {
        platform: 'airbnb',
        name: '舊城廣場旁公寓',
        type: 'apartment',
        priceEUR: '€150–210',
        note: { zh: '老城核心整套公寓，逛街最便利。', en: 'Whole apartment in the Old Town core.' },
        searchTerm: 'Old Town, Prague',
      },
      {
        platform: 'airbnb',
        name: 'Josefov 三人公寓',
        type: 'apartment',
        priceEUR: '€160–220',
        note: { zh: '猶太區安靜整套公寓，含小廚房。', en: 'Quiet whole apartment in Josefov with a kitchen.' },
        searchTerm: 'Josefov, Prague',
      },
    ],
  },

  // ===== 7/14 · Prague — anchor: Charles Bridge (Malá Strana) ================
  {
    date: '2026-07-14',
    checkout: '2026-07-15',
    city: 'prague',
    anchor: { zh: '查理大橋', en: 'Charles Bridge' },
    options: [
      {
        platform: 'booking',
        name: 'Aria Hotel Prague',
        type: 'hotel',
        priceEUR: '€300–400',
        note: { zh: '小區音樂主題五星，頂樓露台望城堡。', en: 'Music-themed five-star in Malá Strana with a castle-view terrace.' },
        searchTerm: 'Aria Hotel Prague',
      },
      {
        platform: 'booking',
        name: 'Hotel U Zlaté studně',
        type: 'boutique',
        priceEUR: '€260–340',
        note: { zh: '「金井」精品飯店，城堡山腳下的祕境。', en: 'The "Golden Well" boutique tucked below the castle.' },
        searchTerm: 'Hotel U Zlate studne, Prague',
      },
      {
        platform: 'booking',
        name: 'Charles Bridge Economic Hostel',
        type: 'hostel',
        priceEUR: '€90–130',
        note: { zh: '橋邊高 CP 值，三人家庭房需早訂。', en: 'Great value by the bridge; book the family room early.' },
        searchTerm: 'Charles Bridge Economic Hostel, Prague',
      },
      {
        platform: 'airbnb',
        name: '小區(Malá Strana)公寓',
        type: 'apartment',
        priceEUR: '€170–240',
        note: { zh: '巴洛克小巷裡的整套公寓，氣氛絕佳。', en: 'Whole apartment in baroque Malá Strana lanes.' },
        searchTerm: 'Mala Strana, Prague',
      },
      {
        platform: 'airbnb',
        name: '查理大橋旁閣樓',
        type: 'apartment',
        priceEUR: '€190–260',
        note: { zh: '河景閣樓，三人含早餐廚房。', en: 'River-view loft for 3 with a kitchen.' },
        searchTerm: 'Charles Bridge, Prague',
      },
    ],
  },

  // ===== 7/15 · Prague — anchor: Dancing House (Nové Město) ==================
  {
    date: '2026-07-15',
    checkout: '2026-07-16',
    city: 'prague',
    anchor: { zh: '跳舞的房子', en: 'Dancing House' },
    options: [
      {
        platform: 'booking',
        name: 'Dancing House Hotel',
        type: 'boutique',
        priceEUR: '€180–240',
        note: { zh: '就在跳舞的房子裡，頂樓酒吧河景。', en: 'Inside the Dancing House itself, rooftop river bar.' },
        searchTerm: 'Dancing House Hotel, Prague',
      },
      {
        platform: 'booking',
        name: 'NH Prague City',
        type: 'hotel',
        priceEUR: '€150–200',
        note: { zh: '河對岸現代飯店，纜車直上城堡區。', en: 'Modern hotel across the river with a funicular up to the castle side.' },
        searchTerm: 'NH Prague City',
      },
      {
        platform: 'booking',
        name: 'Hotel Jungmann',
        type: 'boutique',
        priceEUR: '€160–210',
        note: { zh: '瓦茨拉夫廣場旁，購物與美食都近。', en: 'By Wenceslas Square, near shops and food.' },
        searchTerm: 'Hotel Jungmann, Prague',
      },
      {
        platform: 'airbnb',
        name: '新城區河景公寓',
        type: 'apartment',
        priceEUR: '€150–210',
        note: { zh: '伏爾塔瓦河畔整套公寓，安靜。', en: 'Quiet whole apartment by the Vltava.' },
        searchTerm: 'Nove Mesto, Prague',
      },
      {
        platform: 'airbnb',
        name: '近共和國廣場公寓',
        type: 'apartment',
        priceEUR: '€160–220',
        note: { zh: '近 Náměstí Republiky，地鐵方便。', en: 'By Náměstí Republiky with easy metro access.' },
        searchTerm: 'Namesti Republiky, Prague',
      },
    ],
  },

  // ===== 7/16 · Salzburg — anchor: Getreidegasse (Altstadt) ==================
  {
    date: '2026-07-16',
    checkout: '2026-07-17',
    city: 'salzburg',
    anchor: { zh: '糧食胡同', en: 'Getreidegasse' },
    options: [
      {
        platform: 'booking',
        name: 'Hotel Goldener Hirsch',
        type: 'hotel',
        priceEUR: '€380+',
        note: { zh: '糧食胡同上 600 年歷史的五星名宿。', en: '600-year-old five-star right on the Getreidegasse.' },
        searchTerm: 'Hotel Goldener Hirsch, Salzburg',
      },
      {
        platform: 'booking',
        name: 'Arthotel Blaue Gans',
        type: 'boutique',
        priceEUR: '€170–230',
        note: { zh: '舊城最古老旅店改建的當代藝術飯店。', en: 'Contemporary art hotel in the old town\'s oldest inn.' },
        searchTerm: 'Arthotel Blaue Gans, Salzburg',
      },
      {
        platform: 'booking',
        name: 'Star Inn Hotel Salzburg Zentrum',
        type: 'hotel',
        priceEUR: '€130–170',
        note: { zh: '車站與舊城之間的高 CP 值選擇。', en: 'Good value between the station and old town.' },
        searchTerm: 'Star Inn Hotel Salzburg Zentrum',
      },
      {
        platform: 'airbnb',
        name: '舊城整套三人公寓',
        type: 'apartment',
        priceEUR: '€160–220',
        note: { zh: '老城石屋公寓，步行到莫札特故居。', en: 'Old-town apartment, walk to Mozart\'s house.' },
        searchTerm: 'Altstadt, Salzburg',
      },
      {
        platform: 'airbnb',
        name: '米拉貝爾花園旁公寓',
        type: 'apartment',
        priceEUR: '€170–230',
        note: { zh: '河對岸安靜公寓，過橋即達舊城。', en: 'Quiet apartment across the river from the old town.' },
        searchTerm: 'Mirabell, Salzburg',
      },
    ],
  },

  // ===== 7/17 · Salzburg — anchor: Mozart's birthplace ======================
  {
    date: '2026-07-17',
    checkout: '2026-07-18',
    city: 'salzburg',
    anchor: { zh: '莫札特出生地', en: "Mozart's Birthplace" },
    options: [
      {
        platform: 'booking',
        name: 'Hotel Stein',
        type: 'boutique',
        priceEUR: '€190–250',
        note: { zh: '河畔設計飯店，頂樓露台舊城全景。', en: 'Riverfront design hotel with an old-town panorama terrace.' },
        searchTerm: 'Hotel Stein, Salzburg',
      },
      {
        platform: 'booking',
        name: 'Altstadt Hotel Wolf-Dietrich',
        type: 'hotel',
        priceEUR: '€160–210',
        note: { zh: 'Linzergasse 上的家庭飯店，有小泳池。', en: 'Family hotel on Linzergasse with a small pool.' },
        searchTerm: 'Altstadt Hotel Wolf-Dietrich, Salzburg',
      },
      {
        platform: 'booking',
        name: 'Hotel Elefant',
        type: 'hotel',
        priceEUR: '€170–220',
        note: { zh: '糧食胡同巷內的歷史飯店，安靜。', en: 'Historic, quiet hotel in an alley off Getreidegasse.' },
        searchTerm: 'Hotel Elefant, Salzburg',
      },
      {
        platform: 'airbnb',
        name: '薩爾察赫河畔公寓',
        type: 'apartment',
        priceEUR: '€170–230',
        note: { zh: '河景整套公寓，三人含廚房。', en: 'River-view whole apartment for 3 with a kitchen.' },
        searchTerm: 'Salzach riverside, Salzburg',
      },
      {
        platform: 'airbnb',
        name: 'Linzergasse 公寓',
        type: 'apartment',
        priceEUR: '€160–220',
        note: { zh: '新城購物街旁，餐廳林立。', en: 'By the Linzergasse shopping street, lots of restaurants.' },
        searchTerm: 'Linzergasse, Salzburg',
      },
    ],
  },

  // ===== 7/18 · Hallstatt — anchor: Hallstatt village =======================
  {
    date: '2026-07-18',
    checkout: '2026-07-19',
    city: 'hallstatt',
    anchor: { zh: '哈修塔特村', en: 'Hallstatt village' },
    note: {
      zh: '哈修塔特住宿極少、常數月前訂滿 — 請盡早預訂；訂不到可選鄰村 Obertraun 或 Bad Goisern（車程 10–15 分鐘）。',
      en: 'Hallstatt has very few rooms and books out months ahead — reserve early; nearby Obertraun or Bad Goisern (10–15 min) are good overflow.',
    },
    options: [
      {
        platform: 'booking',
        name: 'Heritage Hotel Hallstatt',
        type: 'boutique',
        priceEUR: '€230–300',
        note: { zh: '碼頭與市集廣場旁三棟歷史建築，部分湖景。', en: 'Three historic buildings by the pier; some lake views.' },
        searchTerm: 'Heritage Hotel Hallstatt',
      },
      {
        platform: 'booking',
        name: 'Seehotel Grüner Baum',
        type: 'hotel',
        priceEUR: '€190–250',
        note: { zh: '市集廣場臨湖飯店，露臺正對湖面。', en: 'Lakefront hotel on the market square with a water terrace.' },
        searchTerm: 'Seehotel Gruner Baum, Hallstatt',
      },
      {
        platform: 'booking',
        name: 'Bräugasthof Hallstatt',
        type: 'guesthouse',
        priceEUR: '€140–180',
        note: { zh: '湖畔老客棧，房間樸實、餐廳道地。', en: 'Lakeside old inn, simple rooms and a hearty restaurant.' },
        searchTerm: 'Braugasthof Hallstatt',
      },
      {
        platform: 'airbnb',
        name: '湖景整套公寓',
        type: 'apartment',
        priceEUR: '€180–260',
        note: { zh: '村內湖景公寓數量稀少，務必早訂。', en: 'In-village lake-view apartments are scarce — book very early.' },
        searchTerm: 'Hallstatt, Austria',
      },
      {
        platform: 'airbnb',
        name: 'Obertraun 湖邊公寓',
        type: 'apartment',
        priceEUR: '€140–200',
        note: { zh: '對岸 Obertraun，車程 10 分鐘、選擇較多。', en: 'Across the lake in Obertraun, 10 min, more availability.' },
        searchTerm: 'Obertraun, Austria',
      },
    ],
  },

  // ===== 7/19 · Wachau / Vienna — anchor: Dürnstein ==========================
  {
    date: '2026-07-19',
    checkout: '2026-07-20',
    city: 'durnstein',
    anchor: { zh: '杜恩斯坦', en: 'Dürnstein' },
    note: {
      zh: '杜恩斯坦距維也納機場約 1h15。若隔日(7/20)航班較早，建議改住維也納機場(VIE)周邊以免趕車（最後一項即為機場選項）。',
      en: 'Dürnstein is ~1h15 from VIE. If your 7/20 flight is early, overnight near the airport instead (last option below).',
    },
    options: [
      {
        platform: 'booking',
        name: 'Hotel Schloss Dürnstein',
        type: 'hotel',
        priceEUR: '€220–290',
        note: { zh: '多瑙河畔城堡飯店，瓦豪河谷景觀一流。', en: 'Castle hotel on the Danube with superb Wachau views.' },
        searchTerm: 'Hotel Schloss Durnstein',
      },
      {
        platform: 'booking',
        name: 'Hotel Richard Löwenherz',
        type: 'hotel',
        priceEUR: '€170–230',
        note: { zh: '杜恩斯坦村內河畔飯店，有花園泳池。', en: 'Riverside hotel in the village with a garden pool.' },
        searchTerm: 'Hotel Richard Lowenherz, Durnstein',
      },
      {
        platform: 'booking',
        name: 'Steigenberger Hotel & Spa Krems',
        type: 'hotel',
        priceEUR: '€160–210',
        note: { zh: '克雷姆斯現代飯店，車程 10 分鐘、設施完善。', en: 'Modern hotel in Krems, 10 min, full facilities.' },
        searchTerm: 'Steigenberger Hotel Krems',
      },
      {
        platform: 'airbnb',
        name: '瓦豪葡萄園公寓',
        type: 'apartment',
        priceEUR: '€140–200',
        note: { zh: '葡萄園間整套公寓，安靜含廚房。', en: 'Whole apartment among the vineyards, quiet, with a kitchen.' },
        searchTerm: 'Wachau, Durnstein',
      },
      {
        platform: 'booking',
        name: 'Moxy / NH Vienna Airport',
        type: 'hotel',
        priceEUR: '€120–160',
        note: { zh: '機場選項：步行可達航廈，適合早班機。', en: 'Airport option: walk to the terminal — best for an early flight.' },
        searchTerm: 'Vienna Airport hotel',
      },
    ],
  },
];
