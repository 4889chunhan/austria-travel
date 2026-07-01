/**
 * The confirmed hotels for the 7/8–7/20 trip, transcribed from the printed
 * 住宿資訊 table in the itinerary PDF. Each entry lists the booked room, board,
 * climate control, parking and check-in details; the Stays page renders these
 * with live Booking.com / Hotels.com search links (pre-filled with the stay's
 * dates and 3 guests) so a click lands on the real property.
 */

export interface StayFacility {
  /** Breakfast included. */
  breakfast: boolean;
  /** Climate control note — A/C, fan, or none. */
  climate: { zh: string; en: string };
  /** Parking note — free, paid (with price), or none. */
  parking: { zh: string; en: string };
  /** Front-desk hours, if limited. */
  frontDesk?: { zh: string; en: string };
}

export interface TripStay {
  id: string;
  /** Property name as it appears on the platforms. */
  name: string;
  /** Chinese label from the PDF. */
  nameZh: string;
  /** City slug — resolved to a label via cityDisplay. */
  city: string;
  address: string;
  /** Check-in date (ISO). */
  checkin: string;
  /** Check-out date (ISO). */
  checkout: string;
  /** Number of nights. */
  nights: number;
  /** Booked room type. */
  roomType: { zh: string; en: string };
  facility: StayFacility;
  /** Check-in window, e.g. "15:00–00:00". */
  checkInWindow: string;
  /** Check-out time, e.g. "11:00". */
  checkOutTime: string;
  /** Free-form notes: shuttle, self-check-in, no elevator, etc. */
  notes: { zh: string; en: string }[];
  /** Search term used to build the Booking.com / Hotels.com URL. */
  searchTerm: string;
}

export const tripStays: TripStay[] = [
  // ===== 7/9–7/11 · Vienna =================================================
  {
    id: 'cocoon-stadthalle',
    name: 'Cocoon Vienna – Boutique Hotel Stadthalle',
    nameZh: '維也納 Stadthalle 精品飯店 by Cocoon',
    city: 'vienna',
    address: 'Hackengasse 20, 1150 Wien, Austria',
    checkin: '2026-07-09',
    checkout: '2026-07-11',
    nights: 2,
    roomType: { zh: '舒適三人房 · 花園景觀', en: 'Comfort Triple Room · garden view' },
    facility: {
      breakfast: false,
      climate: { zh: '風扇（無空調）', en: 'Fan (no A/C)' },
      parking: { zh: '不提供停車', en: 'No parking' },
      frontDesk: { zh: '24 小時櫃台服務', en: '24-hour front desk' },
    },
    checkInWindow: '15:00–00:00',
    checkOutTime: '11:00',
    notes: [
      { zh: '提供行李寄放服務。', en: 'Luggage storage available.' },
      {
        zh: '機場接駁每輛車 EUR 48（單程，3 座）；需在抵達前 48 小時聯絡住宿安排。',
        en: 'Airport shuttle €48 per car (one-way, 3 seats); arrange with the hotel 48h before arrival.',
      },
    ],
    searchTerm: 'Cocoon Vienna Boutique Hotel Stadthalle',
  },

  // ===== 7/11 · Altaussee (near Hallstatt) =================================
  {
    id: 'jufa-altaussee',
    name: 'JUFA Hotel Altaussee',
    nameZh: 'JUFA 阿爾陶塞飯店',
    city: 'altaussee',
    address: 'Lichtersberg 67, 8992 Altaussee, Styria, Austria',
    checkin: '2026-07-11',
    checkout: '2026-07-12',
    nights: 1,
    roomType: { zh: '家庭房（3 人）', en: 'Family Room (3 guests)' },
    facility: {
      breakfast: true,
      climate: { zh: '無空調', en: 'No A/C' },
      parking: { zh: '免費停車', en: 'Free parking' },
      frontDesk: { zh: '櫃台服務 07:30–22:00', en: 'Front desk 07:30–22:00' },
    },
    checkInWindow: '16:00–22:00',
    checkOutTime: '11:00',
    notes: [
      {
        zh: '距哈修塔特約 28 分鐘車程；含早餐、免費停車，適合自駕。',
        en: '~28 min drive from Hallstatt; breakfast and free parking make it easy for the road trip.',
      },
    ],
    searchTerm: 'JUFA Hotel Altaussee',
  },

  // ===== 7/12–7/14 · Salzburg =============================================
  {
    id: 'max-70-salzburg',
    name: 'Hotel Maxglaner Hauptstraße 70 (Max 70)',
    nameZh: '麥克斯 70 號飯店',
    city: 'salzburg',
    address: 'Maxglaner Hauptstraße 70, 5020 Salzburg, Austria',
    checkin: '2026-07-12',
    checkout: '2026-07-14',
    nights: 2,
    roomType: { zh: '三人房', en: 'Triple Room' },
    facility: {
      breakfast: true,
      climate: { zh: '有空調', en: 'Air conditioning' },
      parking: { zh: '自助停車 EUR 16／晚', en: 'Self parking €16/night' },
      frontDesk: { zh: '櫃台服務 07:00–22:30', en: 'Front desk 07:00–22:30' },
    },
    checkInWindow: '15:00–22:30',
    checkOutTime: '10:30',
    notes: [
      { zh: '含早餐、有空調；距舊城約 10 分鐘車程。', en: 'Breakfast and A/C; ~10 min from the old town.' },
    ],
    searchTerm: 'Hotel Max 70 Salzburg Maxglaner Hauptstrasse',
  },

  // ===== 7/14 · Český Krumlov =============================================
  {
    id: 'krumlovska-barka',
    name: 'Hotel Krumlovská Bárka',
    nameZh: '克魯姆洛夫斯卡博達飯店',
    city: 'cesky-krumlov',
    address: 'Široká 74, Vnitřní Město, 38101 Český Krumlov, Czechia',
    checkin: '2026-07-14',
    checkout: '2026-07-15',
    nights: 1,
    roomType: { zh: '三人房', en: 'Triple Room' },
    facility: {
      breakfast: true,
      climate: { zh: '無空調', en: 'No A/C' },
      parking: { zh: '自助停車 EUR 10／晚（需提前預約）', en: 'Self parking €10/night (reserve ahead)' },
      frontDesk: { zh: '櫃台服務 09:30–19:00', en: 'Front desk 09:30–19:00' },
    },
    checkInWindow: '15:00–19:00',
    checkOutTime: '10:30',
    notes: [
      {
        zh: '請事先聯絡住宿安排入住；若 19:00 後抵達務必先通知（聯絡方式見預訂確認信）。',
        en: 'Contact the hotel in advance to arrange check-in; notify them if arriving after 19:00 (see your booking email).',
      },
      {
        zh: '須事先預留住宿附設停車位。換匯推薦城堡區入口 Latrán 街的 N°59（0% 手續費）。',
        en: 'Reserve the on-site parking ahead. For cash, the N°59 exchange on Latrán (0% commission) is the local pick.',
      },
    ],
    searchTerm: 'Hotel Krumlovska Barka Cesky Krumlov',
  },

  // ===== 7/15–7/18 · Prague ===============================================
  {
    id: 'numa-flow-prague',
    name: 'numa | Flow Apartments',
    nameZh: '布拉格 Numa Flow 飯店',
    city: 'prague',
    address: 'Dittrichova 20, 12000 Praha 2, Czechia',
    checkin: '2026-07-15',
    checkout: '2026-07-18',
    nights: 3,
    roomType: { zh: '三人公寓式房型', en: 'Apartment-style room (3 guests)' },
    facility: {
      breakfast: false,
      climate: { zh: '無空調', en: 'No A/C' },
      parking: {
        zh: '住宿外 450 公尺內付費停車 CZK 809／天（需提前預約）',
        en: 'Paid parking within 450 m, CZK 809/day (reserve ahead)',
      },
      frontDesk: { zh: '無櫃台 · 線上自助入住', en: 'No front desk · online self check-in' },
    },
    checkInWindow: '15:00–任何時間 / any time',
    checkOutTime: '11:00',
    notes: [
      {
        zh: '無櫃台：須在抵達前透過安全連結完成線上註冊，並提供政府核發的相片證件。',
        en: 'No reception: complete online registration before arrival and provide a government photo ID.',
      },
      {
        zh: '抵達前 24 小時內會收到入住指示與門禁密碼，可經私人通道進入。',
        en: 'Check-in instructions and a door code arrive within 24h of arrival; enter via the private access.',
      },
    ],
    searchTerm: 'numa Flow Prague Dittrichova',
  },

  // ===== 7/18–7/20 · Vienna ===============================================
  {
    id: 'mynext-rudi',
    name: 'myNext – Rudi',
    nameZh: 'myNext 魯迪飯店',
    city: 'vienna',
    address: 'Schelleingasse 36, 1040 Wien, Austria',
    checkin: '2026-07-18',
    checkout: '2026-07-20',
    nights: 2,
    roomType: { zh: '三人房', en: 'Triple Room' },
    facility: {
      breakfast: true,
      climate: { zh: '無空調', en: 'No A/C' },
      parking: { zh: '不提供停車', en: 'No parking' },
    },
    checkInWindow: '15:00–05:30',
    checkOutTime: '11:00',
    notes: [
      { zh: '此住宿沒有電梯。', en: 'No elevator at this property.' },
      {
        zh: '機場接駁每輛車 EUR 42（單程）。',
        en: 'Airport shuttle €42 per car (one-way).',
      },
    ],
    searchTerm: 'myNext Rudi Vienna Schelleingasse',
  },
];
