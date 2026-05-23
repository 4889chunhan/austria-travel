/* ===========================================================================
   Core attraction model
   =========================================================================== */

export interface Attraction {
  id: string;
  slug: string;
  city: 'vienna' | 'salzburg' | 'hallstatt' | 'graz' | 'innsbruck';
  name: { zh: string; en: string; de: string };
  tagline: { zh: string; en: string };
  description: { zh: string; en: string };
  category: AttractionCategory[];
  coordinates: { lat: number; lng: number };
  address: string;
  website: string;
  openingHours?: { zh: string; en: string };
  price?: { zh: string; en: string };
  tips?: { zh: string; en: string };
  imageUrl: string;
  languageCards: LanguageCard[];

  // ---- Extended ticketing / planning metadata ----------------------------
  ticketPrice?: {
    adult: { EUR: number; note?: { zh: string; en: string } };
    child?: { EUR: number };
    senior?: { EUR: number };
    freeEntry?: boolean;
    bookingUrl?: string;
  };
  seasonalTips?: SeasonalTip[];
  accessibility?: {
    wheelchairAccessible: boolean;
    strollerFriendly: boolean;
    audioGuide: boolean;
  };
}

export type AttractionCategory =
  | 'music'
  | 'art'
  | 'scenery'
  | 'architecture'
  | 'food'
  | 'outdoor'
  | 'shopping'
  | 'history';

/* ===========================================================================
   Seasonal tips
   =========================================================================== */

export interface SeasonalTip {
  /** Month numbers this tip applies to. e.g. [12, 1, 2] = Dec/Jan/Feb. */
  months: number[];
  type: 'peak' | 'event' | 'warning' | 'tip';
  title: { zh: string; en: string };
  description: { zh: string; en: string };
  /** lucide icon name, resolved at render time. */
  icon: string;
}

/* ===========================================================================
   Accommodation
   =========================================================================== */

export interface Accommodation {
  id: string;
  slug: string;
  city: string;
  name: { zh: string; en: string; de: string };
  type: 'hotel' | 'hostel' | 'apartment' | 'boutique' | 'resort';
  stars?: 1 | 2 | 3 | 4 | 5;
  /** Base price; converted to TWD at display time. */
  pricePerNight: { EUR: number };
  coordinates: { lat: number; lng: number };
  address: string;
  website: string;
  description: { zh: string; en: string };
  amenities: string[];
  imageUrl: string;
  /** booking.com / hotels.com deep link. */
  bookingUrl: string;
  /** Attraction slugs within walking distance. */
  nearbyAttractions: string[];
  tags: ('budget' | 'design' | 'family' | 'romantic' | 'business' | 'central')[];
}

/* ===========================================================================
   Language cards
   =========================================================================== */

export type LanguageCardScenario =
  | 'attraction' // 景點相關（原有）
  | 'restaurant' // 餐廳點餐
  | 'cafe' // 咖啡館
  | 'supermarket' // 超市
  | 'pharmacy' // 藥局
  | 'transport' // 交通（火車/巴士/計程車）
  | 'hotel' // 住宿 check-in/out
  | 'emergency' // 緊急求助
  | 'shopping' // 購物殺價/詢問
  | 'general'; // 通用問候/感謝

export interface LanguageCard {
  id: string;
  /**
   * Scenario grouping. Optional for now so the existing attraction-tied card
   * dataset stays valid; populate when scenario filtering ships. Treat a
   * missing value as 'attraction'.
   */
  scenario?: LanguageCardScenario;
  situation: { zh: string; en: string };
  german: string;
  pronunciation: string;
  chinese: string;
  english: string;
  note?: { zh: string; en: string };
  /**
   * Difficulty for SRS-style ordering. Optional pending data migration;
   * treat a missing value as 'medium'.
   */
  difficulty?: 'easy' | 'medium' | 'hard';
  /** True = a universal phrase not tied to a specific attraction. */
  isUniversal?: boolean;
}

/* ===========================================================================
   Transport
   =========================================================================== */

export interface TransportRoute {
  id: string;
  from: string;
  to: string;
  methods: TransportMethod[];
}

export interface TransportMethod {
  type: 'train' | 'bus' | 'car';
  duration: string;
  frequency?: string;
  price?: string;
  /** Operator / line name shown in the badge — ÖBB Railjet, FlixBus, etc. */
  operator?: string;
  notes?: { zh: string; en: string };
}

/* ===========================================================================
   Trip configuration
   =========================================================================== */

export interface TripConfig {
  // Dates
  startDate: string | null; // ISO 'YYYY-MM-DD'
  endDate: string | null;
  days: number; // computed from dates, or set manually

  // People
  travelers: number;
  travelerType: 'solo' | 'couple' | 'family' | 'group';

  // Trip shape
  startCity: string;
  cities: string[]; // multi-city selection

  // Preferences
  categories: AttractionCategory[];
  budget: 'budget' | 'mid' | 'luxury' | null;
  totalBudget?: number; // EUR, optional manual input

  // Accommodation
  includeAccommodation: boolean;
  accommodationTags: Accommodation['tags']; // flat list of preferred tags
}

/* ===========================================================================
   Budget
   =========================================================================== */

export interface BudgetSummary {
  totalEUR: number;
  totalTWD: number;
  breakdown: {
    transport: number; // EUR
    accommodation: number; // EUR
    attractions: number; // EUR (ticket prices)
    food: number; // EUR (estimated)
    buffer: number; // EUR (10% contingency)
  };
  exchangeRate: number; // live EUR→TWD rate
  lastUpdated: string; // ISO timestamp
}

/* ===========================================================================
   Day plan + collaborative itinerary
   =========================================================================== */

export interface DayPlan {
  day: number;
  date?: string;
  city: string;
  attractions: Attraction[];
  transport?: TransportRoute[];

  // ---- Extended ----------------------------------------------------------
  accommodation?: Accommodation; // recommended stay for this night
  budget?: {
    transport: number; // EUR for today's transport
    tickets: number; // EUR for today's attractions
    food: number; // EUR estimated
  };
  seasonalEvents?: SeasonalTip[]; // events happening this day
}

export interface CollaborativeItinerary {
  id: string; // nanoid — used as the share URL token
  createdAt: string;
  expiresAt: string; // 30 days from creation
  tripConfig: TripConfig;
  itinerary: DayPlan[];
  votes: {
    attractionId: string;
    votes: { up: number; down: number };
    voterIds: string[]; // anonymous session IDs
  }[];
  chatHistory: ChatMessage[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  /** Present when the assistant modified the itinerary. */
  itineraryPatch?: Partial<DayPlan[]>;
  /** Human-readable summary of an applied patch, e.g. "已加入霍夫堡宮". */
  patchNote?: string;
}
