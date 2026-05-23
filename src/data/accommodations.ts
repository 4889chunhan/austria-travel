import type { Accommodation } from '../types';

/**
 * Seed accommodation dataset — 16 stays across Vienna, Salzburg, Hallstatt,
 * Graz, and Innsbruck.
 *
 * NOTES
 * - `imageUrl` values follow the Unsplash CDN pattern but the photo IDs are
 *   placeholders pending curation — verify each resolves before production.
 * - `bookingUrl` values are best-effort booking.com deep links; confirm each
 *   property's canonical slug before relying on it.
 * - The `tags` union (see the Accommodation interface) has no `luxury` value,
 *   so the luxury tier is expressed through `type: 'hotel'` + `stars: 5` + a
 *   high `pricePerNight`, not a tag.
 * - `coordinates` are real-world GPS for each property's street address.
 */
export const accommodations: Accommodation[] = [
  // ===========================================================================
  // VIENNA · 維也納  (1 hostel · 2 boutique · 2 luxury)
  // ===========================================================================
  {
    id: 'vienna-wombats',
    slug: 'wombats-city-hostel-vienna',
    city: 'vienna',
    name: {
      zh: 'Wombat\'s 城市青年旅舍',
      en: 'Wombat\'s City Hostel Vienna',
      de: 'Wombat\'s City Hostel Wien',
    },
    type: 'hostel',
    pricePerNight: { EUR: 28 },
    coordinates: { lat: 48.1962, lng: 16.3637 },
    address: 'Rechte Wienzeile 35, 1040 Wien',
    website: 'https://www.wombats-hostels.com/vienna/',
    description: {
      zh: '緊鄰納許市場的人氣青年旅舍，氣氛活潑、交誼廳熱鬧，是背包客結識旅伴的首選。房型從宿舍床位到雙人房都有，地鐵步行可達。',
      en: 'A lively backpacker favourite steps from the Naschmarkt, with a buzzing common room and bar. Dorm beds through to private doubles, with the U-Bahn a short walk away.',
    },
    amenities: ['wifi', 'bar', 'breakfast', 'ac'],
    imageUrl:
      'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=1600&q=80&auto=format&fit=crop',
    bookingUrl: 'https://www.booking.com/hotel/at/wombat-s-vienna.html',
    nearbyAttractions: ['naschmarkt', 'stephansdom'],
    tags: ['budget', 'central'],
  },
  {
    id: 'vienna-25hours',
    slug: '25hours-hotel-museumsquartier',
    city: 'vienna',
    name: {
      zh: '25hours 博物館區飯店',
      en: '25hours Hotel beim MuseumsQuartier',
      de: '25hours Hotel beim MuseumsQuartier',
    },
    type: 'boutique',
    stars: 4,
    pricePerNight: { EUR: 180 },
    coordinates: { lat: 48.2047, lng: 16.3556 },
    address: 'Lerchenfelder Straße 1-3, 1070 Wien',
    website: 'https://www.25hours-hotels.com/en/hotels/vienna/museumsquartier',
    description: {
      zh: '以馬戲團為靈感的設計飯店，色彩繽紛、細節俏皮。頂樓酒吧 Dachboden 可俯瞰維也納天際線，緊鄰博物館區與第七區的咖啡小店。',
      en: 'A circus-themed design hotel full of playful colour and detail. Its rooftop bar Dachboden overlooks the skyline, right beside the MuseumsQuartier and the cafés of the 7th district.',
    },
    amenities: ['wifi', 'bar', 'restaurant', 'gym', 'breakfast'],
    imageUrl:
      'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=1600&q=80&auto=format&fit=crop',
    bookingUrl:
      'https://www.booking.com/hotel/at/25hours-wien-beim-museumsquartier.html',
    nearbyAttractions: ['kunsthistorisches-museum', 'naschmarkt'],
    tags: ['design', 'central'],
  },
  {
    id: 'vienna-sacher',
    slug: 'hotel-sacher-wien',
    city: 'vienna',
    name: {
      zh: '薩赫飯店',
      en: 'Hotel Sacher Wien',
      de: 'Hotel Sacher Wien',
    },
    type: 'hotel',
    stars: 5,
    pricePerNight: { EUR: 550 },
    coordinates: { lat: 48.2040, lng: 16.369 },
    address: 'Philharmoniker Straße 4, 1010 Wien',
    website: 'https://www.sacher.com/en/hotel-sacher-vienna/',
    description: {
      zh: '1876 年開業的傳奇五星飯店，正對國家歌劇院，也是原版薩赫蛋糕的誕生地。紅絲絨、古董與帝國時代的氣派，是維也納奢華的代名詞。',
      en: 'A legendary five-star institution opposite the State Opera and birthplace of the original Sachertorte. Red velvet, antiques, and imperial grandeur make it the byword for Viennese luxury.',
    },
    amenities: ['wifi', 'spa', 'restaurant', 'bar', 'concierge', 'breakfast'],
    imageUrl:
      'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=1600&q=80&auto=format&fit=crop',
    bookingUrl: 'https://www.booking.com/hotel/at/sacher.html',
    nearbyAttractions: ['wiener-staatsoper', 'stephansdom', 'hofburg-palace'],
    tags: ['romantic', 'central'],
  },
  {
    id: 'vienna-stadthalle',
    slug: 'boutique-hotel-stadthalle',
    city: 'vienna',
    name: {
      zh: '城市廳精品飯店',
      en: 'Boutique Hotel Stadthalle',
      de: 'Boutique Hotel Stadthalle',
    },
    type: 'boutique',
    stars: 3,
    pricePerNight: { EUR: 95 },
    coordinates: { lat: 48.1969, lng: 16.338 },
    address: 'Hackengasse 20, 1150 Wien',
    website: 'https://www.hotelstadthalle.at/en/',
    description: {
      zh: '全球第一家零能耗都市飯店，擁有薰衣草花園與蘋果樹中庭。舒適親民、生態友善，適合預算有度卻講究品味的家庭與旅人。',
      en: 'The world\'s first urban hotel with a zero-energy balance, complete with a lavender garden and apple-tree courtyard. Cosy, affordable and eco-minded — ideal for style-conscious families on a budget.',
    },
    amenities: ['wifi', 'breakfast', 'parking', 'pets'],
    imageUrl:
      'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=1600&q=80&auto=format&fit=crop',
    bookingUrl: 'https://www.booking.com/hotel/at/stadthalle.html',
    nearbyAttractions: ['naschmarkt'],
    tags: ['design', 'family'],
  },
  {
    id: 'vienna-doco',
    slug: 'do-co-hotel-vienna',
    city: 'vienna',
    name: {
      zh: 'DO & CO 飯店',
      en: 'DO & CO Hotel Vienna',
      de: 'DO & CO Hotel Wien',
    },
    type: 'hotel',
    stars: 5,
    pricePerNight: { EUR: 420 },
    coordinates: { lat: 48.208, lng: 16.3725 },
    address: 'Stephansplatz 12, 1010 Wien',
    website: 'https://www.doco.com/en/hotel',
    description: {
      zh: '位於哈斯之家、正對聖史蒂芬大教堂的當代五星飯店。落地玻璃、義式設計與頂樓餐廳的絕佳視野，是商務與都會旅人的首選。',
      en: 'A contemporary five-star inside the Haas Haus facing St. Stephen\'s Cathedral. Floor-to-ceiling glass, Italian design and a rooftop restaurant with unbeatable views — a favourite for business and city travellers.',
    },
    amenities: ['wifi', 'restaurant', 'bar', 'concierge', 'ac', 'gym'],
    imageUrl:
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1600&q=80&auto=format&fit=crop',
    bookingUrl: 'https://www.booking.com/hotel/at/do-co.html',
    nearbyAttractions: ['stephansdom', 'hofburg-palace'],
    tags: ['business', 'central'],
  },

  // ===========================================================================
  // SALZBURG · 薩爾斯堡  (1 budget · 2 mid/boutique · 1 luxury)
  // ===========================================================================
  {
    id: 'salzburg-yoho',
    slug: 'yoho-international-youth-hostel',
    city: 'salzburg',
    name: {
      zh: 'YOHO 國際青年旅舍',
      en: 'YOHO International Youth Hostel',
      de: 'YOHO International Youth Hostel',
    },
    type: 'hostel',
    pricePerNight: { EUR: 22 },
    coordinates: { lat: 47.8095, lng: 13.0455 },
    address: 'Paracelsusstraße 9, 5020 Salzburg',
    website: 'https://www.yoho.at/en/',
    description: {
      zh: '薩爾斯堡最受歡迎的青年旅舍，每天放映《真善美》電影。氣氛友善、價格實惠，步行即達舊城與火車站，是省錢旅人的據點。',
      en: 'Salzburg\'s most popular hostel, screening The Sound of Music daily. Friendly, affordable and within walking distance of both the old town and the station — a hub for budget travellers.',
    },
    amenities: ['wifi', 'bar', 'breakfast'],
    imageUrl:
      'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1600&q=80&auto=format&fit=crop',
    bookingUrl: 'https://www.booking.com/hotel/at/yoho-international-youth.html',
    nearbyAttractions: ['mirabell-palace'],
    tags: ['budget'],
  },
  {
    id: 'salzburg-goldener-hirsch',
    slug: 'hotel-goldener-hirsch',
    city: 'salzburg',
    name: {
      zh: '金鹿飯店',
      en: 'Hotel Goldener Hirsch',
      de: 'Hotel Goldener Hirsch',
    },
    type: 'hotel',
    stars: 5,
    pricePerNight: { EUR: 380 },
    coordinates: { lat: 47.8003, lng: 13.043 },
    address: 'Getreidegasse 37, 5020 Salzburg',
    website:
      'https://www.marriott.com/hotels/travel/szglc-hotel-goldener-hirsch/',
    description: {
      zh: '坐落於著名糧食胡同、擁有逾 600 年歷史的五星名宿。手工鄉村家具與貴族氣派並存，是體驗薩爾斯堡傳統奢華的不二之選。',
      en: 'A five-star landmark on the famous Getreidegasse with over 600 years of history. Hand-crafted rustic furniture meets aristocratic grandeur — the definitive taste of traditional Salzburg luxury.',
    },
    amenities: ['wifi', 'restaurant', 'bar', 'concierge', 'breakfast'],
    imageUrl:
      'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1600&q=80&auto=format&fit=crop',
    bookingUrl:
      'https://www.booking.com/hotel/at/goldener-hirsch-a-luxury-collection.html',
    nearbyAttractions: ['getreidegasse', 'mozart-geburtshaus'],
    tags: ['romantic', 'central'],
  },
  {
    id: 'salzburg-blaue-gans',
    slug: 'arthotel-blaue-gans',
    city: 'salzburg',
    name: {
      zh: '藍鵝藝術飯店',
      en: 'Arthotel Blaue Gans',
      de: 'Arthotel Blaue Gans',
    },
    type: 'boutique',
    stars: 4,
    pricePerNight: { EUR: 145 },
    coordinates: { lat: 47.8001, lng: 13.0425 },
    address: 'Getreidegasse 41-43, 5020 Salzburg',
    website: 'https://www.blauegans.at/en/',
    description: {
      zh: '舊城最古老的旅店之一，已有 660 年歷史，如今化身當代藝術飯店。走廊與房間陳列當代藝術作品，傳統石牆與現代設計巧妙交融。',
      en: 'One of the old town\'s oldest inns at 660 years, reborn as a contemporary art hotel. Modern artworks line the corridors and rooms, blending historic stone walls with clean modern design.',
    },
    amenities: ['wifi', 'restaurant', 'bar', 'breakfast'],
    imageUrl:
      'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=1600&q=80&auto=format&fit=crop',
    bookingUrl: 'https://www.booking.com/hotel/at/arthotel-blaue-gans.html',
    nearbyAttractions: ['getreidegasse', 'mozart-geburtshaus'],
    tags: ['design', 'central'],
  },
  {
    id: 'salzburg-stein',
    slug: 'hotel-stein',
    city: 'salzburg',
    name: {
      zh: 'Stein 飯店',
      en: 'Hotel Stein',
      de: 'Hotel Stein',
    },
    type: 'boutique',
    stars: 4,
    pricePerNight: { EUR: 165 },
    coordinates: { lat: 47.8013, lng: 13.0455 },
    address: 'Giselakai 3-5, 5020 Salzburg',
    website: 'https://www.hotelstein.at/en/',
    description: {
      zh: '薩爾察赫河畔的設計飯店，頂樓酒吧 Stein Terrasse 擁有舊城與要塞的全景。精緻摩登的房間與絕佳地段，浪漫氣氛十足。',
      en: 'A design hotel on the Salzach riverbank whose rooftop Stein Terrasse offers panoramas of the old town and fortress. Refined modern rooms and a prime location make for a romantic stay.',
    },
    amenities: ['wifi', 'bar', 'breakfast', 'ac'],
    imageUrl:
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1600&q=80&auto=format&fit=crop',
    bookingUrl: 'https://www.booking.com/hotel/at/stein.html',
    nearbyAttractions: ['getreidegasse', 'hohensalzburg-fortress'],
    tags: ['design', 'romantic'],
  },

  // ===========================================================================
  // HALLSTATT · 哈修塔特  (mid-range, limited options)
  // ===========================================================================
  {
    id: 'hallstatt-sarstein',
    slug: 'pension-sarstein',
    city: 'hallstatt',
    name: {
      zh: 'Sarstein 湖畔民宿',
      en: 'Pension Sarstein',
      de: 'Pension Sarstein',
    },
    type: 'hotel',
    stars: 3,
    pricePerNight: { EUR: 120 },
    coordinates: { lat: 47.565, lng: 13.647 },
    address: 'Gosaumühlstraße 83, 4830 Hallstatt',
    website: 'https://www.pension-sarstein.at.tt/',
    description: {
      zh: '家族經營的湖畔民宿，擁有私人小碼頭與花園，房間陽台直望哈修塔特湖。樸實溫馨、價格合理，是欣賞晨霧湖景的絕佳位置。',
      en: 'A family-run lakeside guesthouse with a private jetty and garden, rooms opening to balconies over Lake Hallstatt. Homely, well-priced, and perfectly placed for misty-morning lake views.',
    },
    amenities: ['wifi', 'breakfast', 'parking', 'lakeview'],
    imageUrl:
      'https://images.unsplash.com/photo-1601000937962-1bd9a1f7a9f7?w=1600&q=80&auto=format&fit=crop',
    bookingUrl: 'https://www.booking.com/hotel/at/pension-sarstein.html',
    nearbyAttractions: ['hallstatt-village'],
    tags: ['romantic', 'family'],
  },
  {
    id: 'hallstatt-heritage',
    slug: 'heritage-hotel-hallstatt',
    city: 'hallstatt',
    name: {
      zh: '哈修塔特傳承飯店',
      en: 'Heritage Hotel Hallstatt',
      de: 'Heritage Hotel Hallstatt',
    },
    type: 'boutique',
    stars: 4,
    pricePerNight: { EUR: 210 },
    coordinates: { lat: 47.5615, lng: 13.6493 },
    address: 'Landungsplatz 102, 4830 Hallstatt',
    website: 'https://www.heritagehotel.at/en/',
    description: {
      zh: '由三棟歷史建築組成的精品飯店，就在渡輪碼頭與市集廣場旁。古典外觀搭配現代客房，部分房型擁有湖景，是小鎮中最具質感的選擇。',
      en: 'A boutique hotel set across three historic buildings beside the ferry pier and market square. Classical façades meet modern rooms, several with lake views — the most refined option in the village.',
    },
    amenities: ['wifi', 'restaurant', 'breakfast', 'lakeview', 'bar'],
    imageUrl:
      'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=1600&q=80&auto=format&fit=crop',
    bookingUrl: 'https://www.booking.com/hotel/at/heritage-hallstatt.html',
    nearbyAttractions: ['hallstatt-village', 'salzwelten-hallstatt'],
    tags: ['romantic', 'design'],
  },
  {
    id: 'hallstatt-gruner-baum',
    slug: 'seehotel-gruner-baum',
    city: 'hallstatt',
    name: {
      zh: '綠樹湖濱飯店',
      en: 'Seehotel Grüner Baum',
      de: 'Seehotel Grüner Baum',
    },
    type: 'hotel',
    stars: 4,
    pricePerNight: { EUR: 175 },
    coordinates: { lat: 47.5618, lng: 13.649 },
    address: 'Marktplatz 104, 4830 Hallstatt',
    website: 'https://www.gruenerbaum.cc/en/',
    description: {
      zh: '直接坐落於市集廣場、緊鄰湖畔的歷史飯店，茜茜公主曾下榻於此。露臺餐廳臨水而設，天鵝在窗前悠游，適合家庭與情侶。',
      en: 'A historic hotel right on the market square at the water\'s edge, where Empress Sisi once stayed. Its terrace restaurant sits over the lake with swans gliding past — lovely for families and couples alike.',
    },
    amenities: ['wifi', 'restaurant', 'breakfast', 'lakeview', 'parking'],
    imageUrl:
      'https://images.unsplash.com/photo-1455587734955-081b22074882?w=1600&q=80&auto=format&fit=crop',
    bookingUrl: 'https://www.booking.com/hotel/at/seehotel-gruner-baum.html',
    nearbyAttractions: ['hallstatt-village'],
    tags: ['family', 'central'],
  },

  // ===========================================================================
  // GRAZ · 格拉茲  (1 mid · 1 boutique)
  // ===========================================================================
  {
    id: 'graz-daniel',
    slug: 'hotel-daniel-graz',
    city: 'graz',
    name: {
      zh: 'Daniel 設計飯店',
      en: 'Hotel Daniel Graz',
      de: 'Hotel Daniel Graz',
    },
    type: 'hotel',
    stars: 4,
    pricePerNight: { EUR: 110 },
    coordinates: { lat: 47.0728, lng: 15.416 },
    address: 'Europaplatz 1, 8020 Graz',
    website: 'https://www.hoteldaniel.com/en/graz/',
    description: {
      zh: '主打「smart luxury」的極簡設計飯店，正對火車站、交通便利。摩登簡約的房間、屋頂酒吧與出租 Vespa，深受年輕旅人喜愛。',
      en: 'A minimalist "smart luxury" design hotel directly opposite the train station. Clean modern rooms, a rooftop bar and rental Vespas make it a hit with younger travellers.',
    },
    amenities: ['wifi', 'bar', 'breakfast', 'parking'],
    imageUrl:
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=1600&q=80&auto=format&fit=crop',
    bookingUrl: 'https://www.booking.com/hotel/at/daniel-graz.html',
    nearbyAttractions: [],
    tags: ['design', 'central'],
  },
  {
    id: 'graz-wiesler',
    slug: 'hotel-wiesler',
    city: 'graz',
    name: {
      zh: 'Wiesler 精品飯店',
      en: 'Hotel Wiesler',
      de: 'Hotel Wiesler',
    },
    type: 'boutique',
    stars: 4,
    pricePerNight: { EUR: 140 },
    coordinates: { lat: 47.0705, lng: 15.433 },
    address: 'Grieskai 4-8, 8020 Graz',
    website: 'https://www.hotelwiesler.com/en/',
    description: {
      zh: '穆爾河畔的新藝術風格地標飯店，融合復古工業與當代藝術。大廳的金箔馬賽克、黑膠唱片與獨立咖啡館，散發濃厚波希米亞氣息。',
      en: 'An Art Nouveau landmark on the Mur riverbank blending vintage-industrial style with contemporary art. Gold-leaf mosaics, vinyl records and an indie café give it a bohemian soul.',
    },
    amenities: ['wifi', 'restaurant', 'bar', 'breakfast'],
    imageUrl:
      'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=1600&q=80&auto=format&fit=crop',
    bookingUrl: 'https://www.booking.com/hotel/at/wiesler.html',
    nearbyAttractions: [],
    tags: ['design', 'romantic'],
  },

  // ===========================================================================
  // INNSBRUCK · 因斯布魯克  (1 mid · 1 boutique)
  // ===========================================================================
  {
    id: 'innsbruck-central',
    slug: 'hotel-innsbruck',
    city: 'innsbruck',
    name: {
      zh: '因斯布魯克中央飯店',
      en: 'Hotel Innsbruck',
      de: 'Hotel Innsbruck',
    },
    type: 'hotel',
    stars: 4,
    pricePerNight: { EUR: 130 },
    coordinates: { lat: 47.267, lng: 11.3915 },
    address: 'Innrain 3, 6020 Innsbruck',
    website: 'https://www.hotelinnsbruck.com/en/',
    description: {
      zh: '坐落於因河畔、緊鄰舊城黃金屋頂的家族飯店。寬敞房間、室內泳池與 spa，部分房型可眺望北山山脈，適合全家入住。',
      en: 'A family-run hotel on the river Inn beside the old town\'s Golden Roof. Spacious rooms, an indoor pool and spa, and mountain views from some rooms make it great for families.',
    },
    amenities: ['wifi', 'pool', 'spa', 'restaurant', 'breakfast', 'parking'],
    imageUrl:
      'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=1600&q=80&auto=format&fit=crop',
    bookingUrl: 'https://www.booking.com/hotel/at/innsbruck.html',
    nearbyAttractions: [],
    tags: ['family', 'central'],
  },
  {
    id: 'innsbruck-nala',
    slug: 'nala-individuellhotel',
    city: 'innsbruck',
    name: {
      zh: 'Nala 個性精品飯店',
      en: 'Nala Individuellhotel',
      de: 'Nala Individuellhotel',
    },
    type: 'boutique',
    stars: 4,
    pricePerNight: { EUR: 115 },
    coordinates: { lat: 47.262, lng: 11.392 },
    address: 'Müllerstraße 15, 6020 Innsbruck',
    website: 'https://www.nala-hotel.at/en/',
    description: {
      zh: '每間客房皆由不同設計師打造、風格獨一無二的精品飯店。庭院花園、有機早餐與繽紛色彩，洋溢年輕活力與創意巧思。',
      en: 'A boutique hotel where every room is individually styled by a different designer. A courtyard garden, organic breakfast and bursts of colour give it a youthful, creative energy.',
    },
    amenities: ['wifi', 'breakfast', 'parking', 'ac'],
    imageUrl:
      'https://images.unsplash.com/photo-1605346434674-a440ca4dc4c0?w=1600&q=80&auto=format&fit=crop',
    bookingUrl: 'https://www.booking.com/hotel/at/nala-individuellhotel.html',
    nearbyAttractions: [],
    tags: ['design', 'romantic'],
  },
];
