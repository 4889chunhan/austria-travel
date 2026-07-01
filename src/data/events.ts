/**
 * Curated events, concerts, exhibitions and architecture walks that fall within
 * the 7/8–7/20 trip window across Vienna, Salzburg, Český Krumlov and Prague.
 *
 * `category` groups by theme (music / art / history / architecture); `format`
 * is the kind of thing it is (concert, orchestra, exhibition, expo, walk…).
 * Recurring concerts run most nights in summer — always confirm exact dates and
 * times on the official site before booking.
 */

export type EventCategory = 'music' | 'art' | 'history' | 'architecture';

export type EventFormat =
  | 'concert' // 音樂會
  | 'orchestra' // 交響樂團
  | 'opera' // 歌劇
  | 'church-concert' // 教堂音樂會
  | 'exhibition' // 展覽
  | 'expo' // 博覽會
  | 'walk' // 建築散步路線
  | 'landmark'; // 地標參觀

export interface TravelEvent {
  id: string;
  category: EventCategory;
  format: EventFormat;
  title: { zh: string; en: string };
  venue: { zh: string; en: string };
  /** City slug — see utils/cityDisplay. */
  city: string;
  /** Human-readable schedule within the trip window. */
  when: { zh: string; en: string };
  /** Which trip days this best fits (for cross-referencing the itinerary). */
  tripDays: number[];
  description: { zh: string; en: string };
  priceNote?: { zh: string; en: string };
  url?: string;
  featured?: boolean;
}

/**
 * A single dated performance / exhibition entry shown when an event card is
 * opened. Programmes and prices for July 2026 are indicative — always confirm
 * on the official site (linked from each card).
 */
export interface ProgramItem {
  /** ISO date for a specific show; omit for ongoing exhibitions. */
  date?: string;
  /** Label for open-run items, e.g. "全期間" / "常設展". */
  dateLabel?: { zh: string; en: string };
  time?: string;
  title: { zh: string; en: string };
  /** Ticket price, e.g. "€45 起" / "from €45". */
  price?: { zh: string; en: string };
  note?: { zh: string; en: string };
  soldOut?: boolean;
}

export const FORMAT_LABEL: Record<EventFormat, { zh: string; en: string }> = {
  concert: { zh: '音樂會', en: 'Concert' },
  orchestra: { zh: '交響樂團', en: 'Orchestra' },
  opera: { zh: '歌劇', en: 'Opera' },
  'church-concert': { zh: '教堂音樂會', en: 'Church concert' },
  exhibition: { zh: '展覽', en: 'Exhibition' },
  expo: { zh: '博覽會', en: 'Expo' },
  walk: { zh: '建築散步', en: 'Architecture walk' },
  landmark: { zh: '地標', en: 'Landmark' },
};

export const CATEGORY_LABEL: Record<EventCategory, { zh: string; en: string }> = {
  music: { zh: '音樂', en: 'Music' },
  art: { zh: '藝術', en: 'Art' },
  history: { zh: '歷史', en: 'History' },
  architecture: { zh: '建築', en: 'Architecture' },
};

export const CATEGORY_ORDER: EventCategory[] = [
  'music',
  'art',
  'architecture',
  'history',
];

export const travelEvents: TravelEvent[] = [
  // ===========================================================================
  // MUSIC · 音樂
  // ===========================================================================
  {
    id: 'musikverein-golden-hall',
    category: 'music',
    format: 'orchestra',
    title: { zh: '金色大廳 · 維也納莫札特樂團', en: 'Golden Hall · Wiener Mozart Orchester' },
    venue: { zh: '維也納音樂之友協會（金色大廳）', en: 'Musikverein — Golden Hall' },
    city: 'vienna',
    when: { zh: '每晚約 20:15 開演', en: 'Most evenings, ~20:15' },
    tripDays: [2, 3, 12],
    description: {
      zh: '每年元旦新年音樂會的黃金宮殿，以完美建築音效聞名世界。樂手身著 18 世紀宮廷古裝與假髮，演奏《小夜曲》《藍色多瑙河》等名曲。',
      en: 'The gilded hall of the New Year’s Concert, famed for its acoustics. Musicians in 18th-century court dress play Eine kleine Nachtmusik, The Blue Danube and more.',
    },
    priceNote: { zh: '共 5 個票價區；兒童（6–14 歲）約半價。旺季常滿，建議提早訂。', en: 'Five price categories; children (6–14) about half price. Sells out in summer — book ahead.' },
    url: 'https://musikverein.at/en/spielplan',
    featured: true,
  },
  {
    id: 'kursalon-strauss',
    category: 'music',
    format: 'concert',
    title: { zh: '庫爾沙龍 · 史特勞斯與莫札特', en: 'Kursalon · Strauss & Mozart' },
    venue: { zh: '庫爾沙龍音樂廳（市立公園旁）', en: 'Kursalon Vienna (by the Stadtpark)' },
    city: 'vienna',
    when: { zh: '多數夜晚 20:15；可選晚餐＋音樂會套票', en: 'Most nights 20:15; dinner + concert packages' },
    tripDays: [2, 3, 12],
    description: {
      zh: '圓舞曲之王約翰·史特勞斯親自指揮過的歷史建築，沙龍樂團演出歡樂輕鬆，穿插歌劇聲樂與芭蕾舞，對不常聽古典樂的人也毫不沉悶。',
      en: 'The hall where Johann Strauss himself conducted. A light, joyful salon programme with opera singers and ballet interludes — easy even for classical newcomers.',
    },
    url: 'https://www.soundofvienna.at/',
    featured: true,
  },
  {
    id: 'karlskirche-four-seasons',
    category: 'music',
    format: 'church-concert',
    title: { zh: '卡爾教堂 · 韋瓦第《四季》', en: 'Karlskirche · Vivaldi’s Four Seasons' },
    venue: { zh: '聖查爾斯教堂（卡爾教堂）', en: 'Karlskirche (St. Charles’ Church)' },
    city: 'vienna',
    when: { zh: '晚間場約 75 分鐘', en: 'Evening; runs ~75 min' },
    tripDays: [3],
    description: {
      zh: '在華麗的巴洛克圓頂下，樂團以古樂器演奏韋瓦第《四季》小提琴協奏曲，利用教堂天然迴音，氣氛浪漫至極。最適合安排在藝術史博物館之後的傍晚。',
      en: 'Under a vast Baroque dome, a period-instrument ensemble plays Vivaldi’s Four Seasons — the church’s natural reverb makes it wonderfully atmospheric.',
    },
    url: 'https://vivaldi-vienna.com/en/concerts/',
    featured: true,
  },
  {
    id: 'staatsoper',
    category: 'music',
    format: 'opera',
    title: { zh: '維也納國家歌劇院', en: 'Vienna State Opera' },
    venue: { zh: '維也納國家歌劇院', en: 'Wiener Staatsoper' },
    city: 'vienna',
    when: { zh: '夏季演出與導覽（依檔期）', en: 'Summer performances & tours (varies)' },
    tripDays: [2, 3],
    description: {
      zh: '世界頂級歌劇殿堂。即使當晚沒有演出，白天的建築導覽也很值得，可一窺後台與觀眾席的帝國氣派。',
      en: 'One of the world’s great opera houses. Even without a performance, the daytime backstage tour is worth it for its imperial grandeur.',
    },
    url: 'https://www.wiener-staatsoper.at/en/calendar/2026/september/',
  },
  {
    id: 'estates-theatre-prague',
    category: 'music',
    format: 'opera',
    title: { zh: '布拉格城邦劇院 · 莫札特', en: 'Estates Theatre · Mozart' },
    venue: { zh: '城邦劇院（Stavovské divadlo）', en: 'Estates Theatre' },
    city: 'prague',
    when: { zh: '依檔期演出', en: 'Scheduled performances' },
    tripDays: [8, 10],
    description: {
      zh: '莫札特《唐·喬望尼》1787 年在此首演的新古典劇院，是布拉格音樂史上的聖地，也是電影《阿瑪迪斯》的取景地。',
      en: 'The Neoclassical theatre where Mozart premiered Don Giovanni in 1787 — a shrine of Prague’s music history and a set from the film Amadeus.',
    },
    url: 'https://www.narodni-divadlo.cz/en',
  },

  // ===========================================================================
  // ART · 藝術（展覽 / 博覽會）
  // ===========================================================================
  {
    id: 'kunsthistorisches',
    category: 'art',
    format: 'exhibition',
    title: { zh: '藝術史博物館', en: 'Kunsthistorisches Museum' },
    venue: { zh: '維也納藝術史博物館', en: 'Kunsthistorisches Museum Wien' },
    city: 'vienna',
    when: { zh: '7/10（週五）下午安排', en: 'Fri 7/10, afternoon slot' },
    tripDays: [3],
    description: {
      zh: '哈布斯堡皇室的收藏殿堂：布勒哲爾、維梅爾、拉斐爾、卡拉瓦喬齊聚。建築本身即是一件帝國歷史主義傑作。',
      en: 'The Habsburgs’ treasure house — Bruegel, Vermeer, Raphael and Caravaggio under a palatial historicist roof that is a masterpiece in its own right.',
    },
    url: 'https://www.khm.at/en/',
  },
  {
    id: 'belvedere-klimt',
    category: 'art',
    format: 'exhibition',
    title: { zh: '美景宮 · 克林姆《吻》', en: 'Belvedere · Klimt’s The Kiss' },
    venue: { zh: '美景宮（上宮）', en: 'Upper Belvedere' },
    city: 'vienna',
    when: { zh: '全期間開放', en: 'Open throughout the trip' },
    tripDays: [2, 3, 12],
    description: {
      zh: '巴洛克宮殿內收藏了克林姆《吻》與《茱蒂絲》等分離派金色巨作，是維也納 1900 年藝術的代表收藏。',
      en: 'A Baroque palace holding Klimt’s golden The Kiss and Judith — the definitive collection of Vienna 1900 art.',
    },
    url: 'https://www.belvedere.at/en',
  },
  {
    id: 'albertina',
    category: 'art',
    format: 'exhibition',
    title: { zh: '阿爾貝蒂娜博物館', en: 'Albertina Museum' },
    venue: { zh: '阿爾貝蒂娜博物館', en: 'Albertina' },
    city: 'vienna',
    when: { zh: '全期間；夏季特展', en: 'Open throughout; summer shows' },
    tripDays: [2, 3, 12],
    description: {
      zh: '從莫內、竇加到畢卡索的現代經典，加上杜勒素描收藏與華麗的哈布斯堡居室，特展檔期豐富。',
      en: 'Monet, Degas and Picasso alongside Dürer drawings and opulent Habsburg state rooms, with a strong rotation of special exhibitions.',
    },
    url: 'https://www.albertina.at/en/',
  },
  {
    id: 'secession-frieze',
    category: 'art',
    format: 'exhibition',
    title: { zh: '分離派會館 · 貝多芬飾帶', en: 'Secession · Beethoven Frieze' },
    venue: { zh: '分離派會館', en: 'Secession Building' },
    city: 'vienna',
    when: { zh: '全期間開放', en: 'Open throughout the trip' },
    tripDays: [12],
    description: {
      zh: '金色月桂葉圓頂下的白色殿堂，地下室常設克林姆的《貝多芬飾帶》—— 維也納分離派的宣言之作。',
      en: 'Beneath its golden laurel dome sits Klimt’s Beethoven Frieze — the manifesto piece of the Vienna Secession.',
    },
    url: 'https://www.secession.at/en/',
  },

  // ===========================================================================
  // ARCHITECTURE · 建築（散步路線 / 地標）
  // ===========================================================================
  {
    id: 'vienna-architecture-walk',
    category: 'architecture',
    format: 'walk',
    title: { zh: '維也納建築時間旅行', en: 'Vienna Architecture Time-Travel Walk' },
    venue: { zh: '聖史蒂芬廣場 → 環城大道 → 分離派', en: 'Stephansplatz → Ringstrasse → Secession' },
    city: 'vienna',
    when: { zh: '約 4–5 公里，平坦好走', en: '~4–5 km, flat and easy' },
    tripDays: [2],
    description: {
      zh: '由中世紀走到現代：聖史蒂芬主教座堂 → Graben → Kohlmarkt → 霍夫堡 → 環城大道（歌劇院、國會、市政廳）→ 分離派會館。',
      en: 'From medieval to modern: Stephansdom → Graben → Kohlmarkt → Hofburg → the Ringstrasse (Opera, Parliament, City Hall) → the Secession.',
    },
  },
  {
    id: 'melk-abbey',
    category: 'architecture',
    format: 'landmark',
    title: { zh: '梅爾克修道院', en: 'Melk Abbey' },
    venue: { zh: '梅爾克修道院（瓦豪河谷）', en: 'Stift Melk (Wachau)' },
    city: 'melk',
    when: { zh: '7/11（週六）下午', en: 'Sat 7/11, afternoon' },
    tripDays: [4],
    description: {
      zh: '奧地利最具代表性的巴洛克建築之一，金碧輝煌的圖書館與教堂高踞多瑙河畔的岩丘之上。',
      en: 'One of Austria’s definitive Baroque buildings — a golden library and church perched on a bluff above the Danube.',
    },
    url: 'https://www.stiftmelk.at/en/',
  },
  {
    id: 'prague-artnouveau-walk',
    category: 'architecture',
    format: 'walk',
    title: { zh: '布拉格 · 新藝術舊城散步', en: 'Prague · Old Town & Art-Nouveau Walk' },
    venue: { zh: '舊城廣場 → 市民會館 → 跳舞的房子', en: 'Old Town Sq → Municipal House → Dancing House' },
    city: 'prague',
    when: { zh: '7/15（週三）下午', en: 'Wed 7/15, afternoon' },
    tripDays: [8],
    description: {
      zh: '中世紀走到新藝術：舊城廣場、火藥塔、市民會館（曲線與植物紋樣的 Art Nouveau）、瓦茨拉夫廣場、國家劇院、跳舞的房子。',
      en: 'Medieval to Art Nouveau: Old Town Square, the Powder Tower, the flowing Municipal House, Wenceslas Square, the National Theatre and the Dancing House.',
    },
    url: 'https://www.obecnidum.cz/en/',
  },
  {
    id: 'prague-castle-baroque-walk',
    category: 'architecture',
    format: 'walk',
    title: { zh: '城堡與小城區巴洛克散步', en: 'Castle & Malá Strana Baroque Walk' },
    venue: { zh: '布拉格城堡 → 小城區 → 查理大橋', en: 'Prague Castle → Malá Strana → Charles Bridge' },
    city: 'prague',
    when: { zh: '7/17（週五）', en: 'Fri 7/17' },
    tripDays: [10],
    description: {
      zh: '哥德巔峰的聖維特主教座堂、巴洛克博物館般的小城區與聖尼古拉教堂、立體派的黑色聖母之家，最後走上查理大橋。抬頭看屋頂線條最有收穫。',
      en: 'Gothic St. Vitus, the Baroque wonderland of Malá Strana and St. Nicholas, the Cubist House of the Black Madonna, ending on Charles Bridge. Look up at the rooflines.',
    },
    url: 'https://www.hrad.cz/en',
  },
  {
    id: 'cesky-krumlov-oldtown',
    category: 'architecture',
    format: 'landmark',
    title: { zh: '庫倫洛夫舊城與城堡', en: 'Český Krumlov Old Town & Castle' },
    venue: { zh: '庫倫洛夫歷史古城', en: 'Český Krumlov historic centre' },
    city: 'cesky-krumlov',
    when: { zh: '7/14（週二）傍晚起', en: 'From the evening of Tue 7/14' },
    tripDays: [7],
    description: {
      zh: 'UNESCO 世界遺產小鎮，伏爾塔瓦河環抱的哥德—文藝復興—巴洛克層疊街廓，登上彩繪塔可俯瞰整片紅瓦屋頂。',
      en: 'A UNESCO town wrapped in a bend of the Vltava — Gothic, Renaissance and Baroque layered together, with a painted tower over a sea of red roofs.',
    },
  },

  // ===========================================================================
  // HISTORY · 歷史
  // ===========================================================================
  {
    id: 'schoenbrunn',
    category: 'history',
    format: 'landmark',
    title: { zh: '美泉宮', en: 'Schönbrunn Palace' },
    venue: { zh: '美泉宮（哈布斯堡夏宮）', en: 'Schönbrunn Palace' },
    city: 'vienna',
    when: { zh: '7/10（週五）上午', en: 'Fri 7/10, morning' },
    tripDays: [3],
    description: {
      zh: '哈布斯堡王朝的夏宮，1441 個房間、法式花園與 Gloriette 觀景亭，是茜茜公主與瑪麗亞·特蕾莎的舞台。早上 9 點前人最少。',
      en: 'The Habsburg summer palace — 1,441 rooms, formal gardens and the Gloriette. The stage of Empress Sisi and Maria Theresa. Quietest before 9am.',
    },
    url: 'https://www.schoenbrunn.at/en/',
  },
  {
    id: 'prague-astronomical-clock',
    category: 'history',
    format: 'landmark',
    title: { zh: '布拉格天文鐘', en: 'Prague Astronomical Clock' },
    venue: { zh: '舊城廣場 · 天文鐘', en: 'Old Town Square · Orloj' },
    city: 'prague',
    when: { zh: '每個整點的「使徒行列」', en: 'The Apostles parade on the hour' },
    tripDays: [8, 10],
    description: {
      zh: '1410 年啟用、全世界仍在運轉最古老的天文鐘。整點時十二使徒行列與骷髏敲鐘。此處扒手極多，後背包請往前背。',
      en: 'Installed in 1410 and the oldest still working — on the hour the Twelve Apostles parade as Death tolls the bell. Watch for pickpockets here.',
    },
  },
  {
    id: 'hofburg-sisi',
    category: 'history',
    format: 'landmark',
    title: { zh: '霍夫堡 · 茜茜博物館', en: 'Hofburg · Sisi Museum' },
    venue: { zh: '霍夫堡皇宮', en: 'Hofburg Palace' },
    city: 'vienna',
    when: { zh: '7/9（週四）舊城散步途中', en: 'On the Thu 7/9 old-town walk' },
    tripDays: [2],
    description: {
      zh: '哈布斯堡六百年的權力中樞與冬宮，內含茜茜博物館、皇家寓所與銀器陳列館，是維也納帝國氣息最濃的一隅。',
      en: 'Six centuries of Habsburg power and the winter residence — the Sisi Museum, Imperial Apartments and Silver Collection, Vienna at its most imperial.',
    },
    url: 'https://www.hofburg-wien.at/en/',
  },
];

/* ===========================================================================
   Programmes · what's on during the 7/8–7/20 window (indicative)
   Keyed by event id. Concert dates/prices for summer tourist concerts are
   representative — confirm exact casts and seats on the official site.
   =========================================================================== */

export const eventPrograms: Record<string, ProgramItem[]> = {
  // Wiener Mozart Orchester plays the Golden Hall almost nightly through July —
  // period costume, Mozart & Strauss favourites, 20:15. Five price categories.
  'musikverein-golden-hall': [
    { date: '2026-07-08', time: '20:15', title: { zh: '維也納莫札特樂團 · 莫札特與史特勞斯', en: 'Wiener Mozart Orchester · Mozart & Strauss' }, price: { zh: '€58 / €73 / €93 / €112 / €135', en: '€58 / €73 / €93 / €112 / €135' } },
    { date: '2026-07-09', time: '20:15', title: { zh: '維也納莫札特樂團 · 莫札特與史特勞斯', en: 'Wiener Mozart Orchester · Mozart & Strauss' }, price: { zh: '€58 / €73 / €93 / €112 / €135', en: '€58 / €73 / €93 / €112 / €135' } },
    { date: '2026-07-10', time: '20:15', title: { zh: '維也納莫札特樂團 · 莫札特與史特勞斯', en: 'Wiener Mozart Orchester · Mozart & Strauss' }, price: { zh: '€58 / €73 / €93 / €112 / €135', en: '€58 / €73 / €93 / €112 / €135' } },
    { date: '2026-07-11', time: '20:15', title: { zh: '維也納莫札特樂團 · 莫札特與史特勞斯', en: 'Wiener Mozart Orchester · Mozart & Strauss' }, price: { zh: '€58 / €73 / €93 / €112 / €135', en: '€58 / €73 / €93 / €112 / €135' } },
    { date: '2026-07-12', time: '20:15', title: { zh: '維也納莫札特樂團 · 莫札特與史特勞斯', en: 'Wiener Mozart Orchester · Mozart & Strauss' }, price: { zh: '€58 / €73 / €93 / €112 / €135', en: '€58 / €73 / €93 / €112 / €135' } },
    { date: '2026-07-13', time: '20:15', title: { zh: '維也納莫札特樂團 · 莫札特與史特勞斯', en: 'Wiener Mozart Orchester · Mozart & Strauss' }, price: { zh: '€58 / €73 / €93 / €112 / €135', en: '€58 / €73 / €93 / €112 / €135' } },
    { date: '2026-07-14', time: '20:15', title: { zh: '維也納莫札特樂團 · 莫札特與史特勞斯', en: 'Wiener Mozart Orchester · Mozart & Strauss' }, price: { zh: '€58 / €73 / €93 / €112 / €135', en: '€58 / €73 / €93 / €112 / €135' } },
    { date: '2026-07-15', time: '20:15', title: { zh: '維也納莫札特樂團 · 莫札特與史特勞斯', en: 'Wiener Mozart Orchester · Mozart & Strauss' }, price: { zh: '€58 / €73 / €93 / €112 / €135', en: '€58 / €73 / €93 / €112 / €135' } },
    { date: '2026-07-16', time: '20:15', title: { zh: '維也納莫札特樂團 · 莫札特與史特勞斯', en: 'Wiener Mozart Orchester · Mozart & Strauss' }, price: { zh: '€58 / €73 / €93 / €112 / €135', en: '€58 / €73 / €93 / €112 / €135' } },
    { date: '2026-07-17', time: '20:15', title: { zh: '維也納莫札特樂團 · 莫札特與史特勞斯', en: 'Wiener Mozart Orchester · Mozart & Strauss' }, price: { zh: '€58 / €73 / €93 / €112 / €135', en: '€58 / €73 / €93 / €112 / €135' } },
    { date: '2026-07-18', time: '20:15', title: { zh: '維也納莫札特樂團 · 莫札特與史特勞斯', en: 'Wiener Mozart Orchester · Mozart & Strauss' }, price: { zh: '€58 / €73 / €93 / €112 / €135', en: '€58 / €73 / €93 / €112 / €135' } },
    { date: '2026-07-19', time: '20:15', title: { zh: '維也納莫札特樂團 · 莫札特與史特勞斯', en: 'Wiener Mozart Orchester · Mozart & Strauss' }, price: { zh: '€58 / €73 / €93 / €112 / €135', en: '€58 / €73 / €93 / €112 / €135' } },
    { date: '2026-07-20', time: '20:15', title: { zh: '維也納莫札特樂團 · 莫札特與史特勞斯', en: 'Wiener Mozart Orchester · Mozart & Strauss' }, price: { zh: '€58 / €73 / €93 / €112 / €135', en: '€58 / €73 / €93 / €112 / €135' } },
  ],
  'kursalon-strauss': [
    {
      date: '2026-07-09',
      time: '20:15',
      title: { zh: '史特勞斯與莫札特音樂會＋歌劇聲樂／芭蕾', en: 'Strauss & Mozart concert with opera & ballet' },
      price: { zh: '€45 / €56 / €68（VIP €99）', en: '€45 / €56 / €68 (VIP €99)' },
    },
    {
      date: '2026-07-12',
      time: '20:15',
      title: { zh: '圓舞曲之夜', en: 'Evening of Waltzes' },
      price: { zh: '€45 / €56 / €68（VIP €99）', en: '€45 / €56 / €68 (VIP €99)' },
    },
    {
      date: '2026-07-19',
      time: '20:15',
      title: { zh: '維也納沙龍音樂會', en: 'Vienna Salon Concert' },
      price: { zh: '€45 / €56 / €68（VIP €99）', en: '€45 / €56 / €68 (VIP €99)' },
    },
    {
      dateLabel: { zh: '晚餐＋音樂會套票', en: 'Dinner + concert package' },
      time: '18:30',
      title: { zh: '富麗堂皇餐廳奧地利晚宴後入座聆聽', en: 'Austrian dinner in the grand hall, then the concert' },
      price: { zh: '€109 起', en: 'from €109' },
    },
  ],
  'karlskirche-four-seasons': [
    {
      date: '2026-07-10',
      time: '20:30',
      title: { zh: '韋瓦第《四季》· 古樂器演出', en: 'Vivaldi’s Four Seasons · period instruments' },
      price: { zh: '€29 / €42 / €55 / €65', en: '€29 / €42 / €55 / €65' },
    },
    {
      date: '2026-07-13',
      time: '20:30',
      title: { zh: '韋瓦第《四季》＋巴哈選粹', en: 'Four Seasons + Bach selections' },
      price: { zh: '€29 / €42 / €55 / €65', en: '€29 / €42 / €55 / €65' },
    },
    {
      date: '2026-07-16',
      time: '20:30',
      title: { zh: '韋瓦第《四季》· 燭光場', en: 'Four Seasons · candlelight' },
      price: { zh: '€29 / €42 / €55 / €65', en: '€29 / €42 / €55 / €65' },
    },
  ],
  staatsoper: [
    {
      dateLabel: { zh: '7 月夏季休演', en: 'July summer break' },
      title: { zh: '無正式演出，僅開放導覽（新樂季 9 月開始）', en: 'No performances; guided tours only (new season from September)' },
      note: { zh: '完整檔期見官方 9 月起的行事曆連結。', en: 'See the official calendar (from September) via the card link.' },
    },
    {
      dateLabel: { zh: '每日導覽', en: 'Daily guided tours' },
      time: '13:00 / 14:00 / 15:00',
      title: { zh: '歌劇院建築導覽（約 40 分鐘）', en: 'Opera-house guided tour (~40 min)' },
      price: { zh: '成人 €13', en: 'Adults €13' },
    },
  ],
  'estates-theatre-prague': [
    {
      date: '2026-07-15',
      time: '19:00',
      title: { zh: '莫札特《唐·喬望尼》（城邦劇院首演地）', en: 'Mozart · Don Giovanni (premiered here)' },
      price: { zh: 'CZK 300–1390（約 €12–56）', en: 'CZK 300–1,390 (~€12–56)' },
    },
    {
      date: '2026-07-17',
      time: '19:00',
      title: { zh: '莫札特《費加洛的婚禮》', en: 'Mozart · The Marriage of Figaro' },
      price: { zh: 'CZK 300–1390（約 €12–56）', en: 'CZK 300–1,390 (~€12–56)' },
    },
    {
      dateLabel: { zh: '完整檔期', en: 'Full programme' },
      title: { zh: '國家劇院四場館節目（歌劇、芭蕾、戲劇）', en: 'National Theatre’s four venues (opera, ballet, drama)' },
      note: { zh: '夏季檔期較少，請以官網 programme 為準。', en: 'Sparser in summer — check the official programme.' },
    },
  ],
  kunsthistorisches: [
    {
      dateLabel: { zh: '常設 · 每日（週一休，夏季照常）', en: 'Permanent · daily (Mon closed; open in summer)' },
      title: { zh: '繪畫館 · 珍寶館 · 埃及與古物收藏', en: 'Picture Gallery · Kunstkammer · Egyptian & Antiquities' },
      price: { zh: '成人 €21；19 歲以下免費', en: 'Adults €21; under 19 free' },
    },
    {
      dateLabel: { zh: '特展（詳見官網 exhibitions）', en: 'Special exhibition (see khm.at)' },
      title: { zh: '年度特展輪替展出', en: 'Rotating annual special exhibition' },
      price: { zh: '含於門票', en: 'Included in admission' },
    },
    {
      dateLabel: { zh: '聯票', en: 'Combined ticket' },
      title: { zh: '＋帝國珍寶館（Kaiserliche Schatzkammer）', en: '+ Imperial Treasury (Schatzkammer)' },
      price: { zh: '成人 €28', en: 'Adults €28' },
    },
  ],
  'belvedere-klimt': [
    {
      dateLabel: { zh: '常設展 · 全期間', en: 'Permanent · throughout' },
      title: { zh: '克林姆《吻》《茱蒂絲》· 維也納 1900', en: 'Klimt’s The Kiss & Judith · Vienna 1900' },
      price: { zh: '上宮 成人 €17.10（線上）', en: 'Upper Belvedere adults €17.10 (online)' },
    },
    {
      dateLabel: { zh: '7/8–7/20', en: '7/8–7/20' },
      title: { zh: '巴洛克典藏與臨時特展', en: 'Baroque collection & rotating shows' },
      price: { zh: '上下宮聯票 €26 起', en: 'Upper + Lower combo from €26' },
    },
  ],
  albertina: [
    {
      dateLabel: { zh: '常設 · 每日 10:00–18:00', en: 'Permanent · daily 10:00–18:00' },
      title: { zh: '莫內到畢卡索（Batliner 收藏）＋哈布斯堡居室', en: 'Monet to Picasso (Batliner Collection) + Habsburg State Rooms' },
      price: { zh: '成人 €19.90；19 歲以下免費', en: 'Adults €19.90; under 19 free' },
    },
    {
      dateLabel: { zh: '特展（詳見官網 exhibitions）', en: 'Special exhibitions (see albertina.at)' },
      title: { zh: '大師素描、攝影與現代藝術特展', en: 'Master drawings, photography & modern-art shows' },
      price: { zh: '含於門票', en: 'Included in admission' },
    },
    {
      dateLabel: { zh: 'Albertina modern', en: 'Albertina modern' },
      title: { zh: '第二館：戰後與當代藝術', en: 'Second venue: post-war & contemporary art' },
      price: { zh: '單館 €16.90；兩館聯票 €26.90', en: 'Single €16.90; both venues €26.90' },
    },
  ],
  'secession-frieze': [
    {
      dateLabel: { zh: '常設 · 全期間', en: 'Permanent · throughout' },
      title: { zh: '克林姆《貝多芬飾帶》', en: 'Klimt’s Beethoven Frieze' },
      price: { zh: '成人 €12', en: 'Adults €12' },
    },
    {
      dateLabel: { zh: '7/8–7/20', en: '7/8–7/20' },
      title: { zh: '當代藝術特展（定期更換）', en: 'Contemporary exhibitions (changing)' },
      price: { zh: '含於門票', en: 'Included in admission' },
    },
  ],
  'vienna-architecture-walk': [
    {
      dateLabel: { zh: '自由行走 · 全期間', en: 'Self-guided · anytime' },
      title: { zh: '聖史蒂芬 → Graben → 霍夫堡 → 環城大道 → 分離派', en: 'Stephansdom → Graben → Hofburg → Ringstrasse → Secession' },
      price: { zh: '免費（分離派入內 €12）', en: 'Free (Secession entry €12)' },
      note: { zh: '約 4–5 公里，2–3 小時', en: '~4–5 km, 2–3 hours' },
    },
  ],
  'melk-abbey': [
    {
      dateLabel: { zh: '每日 09:00–17:30', en: 'Daily 09:00–17:30' },
      title: { zh: '修道院教堂與巴洛克圖書館', en: 'Abbey church & Baroque library' },
      price: { zh: '成人 €13.50（含花園 €15.50）', en: 'Adults €13.50 (with garden €15.50)' },
    },
  ],
  'prague-artnouveau-walk': [
    {
      dateLabel: { zh: '自由行走 · 全期間', en: 'Self-guided · anytime' },
      title: { zh: '舊城廣場 → 火藥塔 → 市民會館 → 跳舞的房子', en: 'Old Town Sq → Powder Tower → Municipal House → Dancing House' },
      price: { zh: '免費；市民會館導覽 CZK 290', en: 'Free; Municipal House tour CZK 290' },
    },
    {
      dateLabel: { zh: '慕夏博物館', en: 'Mucha Museum' },
      title: { zh: '阿爾豐斯·慕夏新藝術作品', en: 'Alphonse Mucha Art-Nouveau works' },
      price: { zh: 'CZK 300（約 €12）', en: 'CZK 300 (~€12)' },
    },
  ],
  'prague-castle-baroque-walk': [
    {
      dateLabel: { zh: '每日 09:00–17:00', en: 'Daily 09:00–17:00' },
      title: { zh: '布拉格城堡循環票（舊皇宮＋聖維特＋黃金巷）', en: 'Prague Castle circuit (Old Palace + St. Vitus + Golden Lane)' },
      price: { zh: 'CZK 450（約 €18）', en: 'CZK 450 (~€18)' },
    },
    {
      dateLabel: { zh: '小城區', en: 'Malá Strana' },
      title: { zh: '聖尼古拉教堂（巴洛克穹頂）', en: 'St. Nicholas Church (Baroque dome)' },
      price: { zh: 'CZK 150（約 €6）', en: 'CZK 150 (~€6)' },
    },
  ],
  'cesky-krumlov-oldtown': [
    {
      dateLabel: { zh: '古城 · 自由參觀', en: 'Old town · free to explore' },
      title: { zh: '舊城散步與伏爾塔瓦河河灣', en: 'Old-town walk & the Vltava bend' },
      price: { zh: '免費', en: 'Free' },
    },
    {
      dateLabel: { zh: '城堡', en: 'Castle' },
      title: { zh: '彩繪塔登頂與城堡導覽', en: 'Painted Tower climb & castle tour' },
      price: { zh: '塔樓 CZK 180；導覽 CZK 240', en: 'Tower CZK 180; tour CZK 240' },
    },
  ],
  schoenbrunn: [
    {
      dateLabel: { zh: '每日 · 建議早上 9 點前', en: 'Daily · before 9am is best' },
      title: { zh: 'Grand Tour（40 廳，含語音導覽）', en: 'Grand Tour (40 rooms, with audio guide)' },
      price: { zh: '成人 €32；6–18 歲 €24', en: 'Adults €32; ages 6–18 €24' },
    },
    {
      dateLabel: { zh: '較短路線', en: 'Shorter route' },
      title: { zh: 'Imperial Tour（22 廳）', en: 'Imperial Tour (22 rooms)' },
      price: { zh: '成人 €28', en: 'Adults €28' },
    },
    {
      dateLabel: { zh: '套票', en: 'Combined pass' },
      title: { zh: 'Classic Pass（Grand Tour＋花園景點＋Gloriette）', en: 'Classic Pass (Grand Tour + garden sights + Gloriette)' },
      price: { zh: '成人 €42', en: 'Adults €42' },
    },
    {
      dateLabel: { zh: '花園', en: 'Gardens' },
      title: { zh: '法式花園（免費）與 Gloriette 觀景亭', en: 'Formal gardens (free) & the Gloriette' },
      price: { zh: '花園免費；Gloriette €7.50', en: 'Gardens free; Gloriette €7.50' },
    },
  ],
  'prague-astronomical-clock': [
    {
      dateLabel: { zh: '每個整點 09:00–23:00', en: 'On the hour, 09:00–23:00' },
      title: { zh: '「使徒行列」報時秀', en: 'The Walk of the Apostles' },
      price: { zh: '觀看免費', en: 'Free to watch' },
    },
    {
      dateLabel: { zh: '舊市政廳塔', en: 'Old Town Hall Tower' },
      title: { zh: '登塔俯瞰舊城廣場', en: 'Climb the tower over Old Town Square' },
      price: { zh: 'CZK 300（約 €12）', en: 'CZK 300 (~€12)' },
    },
  ],
  'hofburg-sisi': [
    {
      dateLabel: { zh: '每日 09:00–17:30（7–8 月至 18:00）', en: 'Daily 09:00–17:30 (Jul–Aug to 18:00)' },
      title: { zh: '茜茜博物館＋皇家寓所＋銀器陳列館（含語音導覽）', en: 'Sisi Museum + Imperial Apartments + Silver Collection (audio guide)' },
      price: { zh: '成人 €19.50；6–18 歲 €11.50', en: 'Adults €19.50; ages 6–18 €11.50' },
    },
    {
      dateLabel: { zh: 'Sisi Ticket 三館聯票', en: 'Sisi Ticket (3 sites)' },
      title: { zh: '＋美泉宮 Grand Tour ＋帝國家具博物館（免排隊）', en: '+ Schönbrunn Grand Tour + Imperial Furniture Collection (skip the line)' },
      price: { zh: '成人 €49.50', en: 'Adults €49.50' },
    },
  ],
};

