import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { nanoid } from 'nanoid';
import i18n from '../i18n';
import { attractions as ALL_ATTRACTIONS } from '../data/attractions';
import { accommodations as ALL_ACCOMMODATIONS } from '../data/accommodations';
import { seedFoodCollection } from '../data/foodCollection';
import type {
  Accommodation,
  Attraction,
  AttractionCategory,
  BudgetSummary,
  ChatMessage,
  CollaborativeItinerary,
  DayPlan,
  FoodItem,
  SeasonalTip,
  TripConfig,
} from '../types';

interface AppStore {
  // ---- Trip configuration --------------------------------------------------
  tripConfig: TripConfig;
  setTripConfig: (config: Partial<TripConfig>) => void;

  // ---- UI state ------------------------------------------------------------
  lang: 'zh' | 'en';
  setLang: (lang: 'zh' | 'en') => void;

  // ---- Map state -----------------------------------------------------------
  selectedAttraction: Attraction | null;
  setSelectedAttraction: (a: Attraction | null) => void;
  /** Accommodation selected on the map — shown in the sidebar detail slot. */
  selectedAccommodation: Accommodation | null;
  setSelectedAccommodation: (a: Accommodation | null) => void;
  /** Whether accommodation pins are shown on the map. */
  showAccommodations: boolean;
  toggleShowAccommodations: () => void;
  hoveredAttraction: string | null;
  setHoveredAttraction: (id: string | null) => void;
  /** Whether the floating language-cards panel is open over the map. */
  languageCardsOpen: boolean;
  setLanguageCardsOpen: (open: boolean) => void;

  // ---- Saved attractions ---------------------------------------------------
  savedAttractions: string[];
  toggleSaved: (id: string) => void;

  // ---- Generated itinerary -------------------------------------------------
  itinerary: DayPlan[];
  generateItinerary: (attractions: Attraction[]) => void;

  // ---- Filters -------------------------------------------------------------
  activeCategories: AttractionCategory[];
  toggleCategory: (cat: AttractionCategory) => void;
  clearCategories: () => void;

  // ---- Exchange rate (budget calculator) -----------------------------------
  exchangeRate: number; // EUR → TWD, default 34.5
  exchangeRateUpdatedAt: string | null;
  fetchExchangeRate: () => Promise<void>;

  // ---- Accommodation -------------------------------------------------------
  accommodations: Accommodation[];
  savedAccommodations: string[];
  toggleSavedAccommodation: (id: string) => void;
  /** Assign a stay to the nearest matching day's night recommendation. */
  assignAccommodationToDay: (acc: Accommodation) => void;

  // ---- Collaborative session -----------------------------------------------
  collaborativeId: string | null;
  collaborativeData: CollaborativeItinerary | null;
  generateShareLink: () => string;
  loadFromShareLink: (id: string) => Promise<void>;
  submitVote: (attractionId: string, vote: 'up' | 'down') => void;
  getVoterSessionId: () => string;

  // ---- Budget --------------------------------------------------------------
  budgetSummary: BudgetSummary | null;
  computeBudget: () => void;

  // ---- AI chatbot ----------------------------------------------------------
  chatHistory: ChatMessage[];
  chatLoading: boolean;
  sendChatMessage: (message: string) => Promise<void>;
  clearChat: () => void;

  // ---- Seasonal tips -------------------------------------------------------
  getSeasonalTipsForDate: (attractionId: string) => SeasonalTip[];

  // ---- Food collection -----------------------------------------------------
  foodCollection: FoodItem[];
  addFoodItem: (item: Omit<FoodItem, 'id' | 'source' | 'createdAt'>) => void;
  removeFoodItem: (id: string) => void;
}

/** Derive the reference source from a URL host. */
function detectFoodSource(url: string): FoodItem['source'] {
  return /instagram\.com/i.test(url) ? 'instagram' : 'web';
}

// All cities the app knows about, in a sensible default travel order
// (Austria → Bayern → Czech, mirroring the cross-border road-trip flow).
const ALL_CITIES: string[] = [
  'vienna',
  'durnstein',
  'melk',
  'salzburg',
  'wolfgangsee',
  'gosau',
  'hallstatt',
  'konigssee',
  'munich',
  'neuschwanstein',
  'regensburg',
  'prague',
  'cesky-krumlov',
  'innsbruck',
  'graz',
];

/** City sequence with `startCity` pulled to the front. */
function getCityOrder(startCity: string): string[] {
  return [startCity, ...ALL_CITIES.filter((c) => c !== startCity)];
}

const DEFAULT_TRIP_CONFIG: TripConfig = {
  startDate: null,
  endDate: null,
  days: 5,
  travelers: 2,
  travelerType: 'couple',
  startCity: 'vienna',
  cities: ['vienna'],
  categories: [],
  budget: null,
  includeAccommodation: false,
  accommodationTags: [],
};

const initialLang: 'zh' | 'en' = i18n.language?.startsWith('zh') ? 'zh' : 'en';

const EXCHANGE_CACHE_KEY = 'reise_exchange_rate';
const VOTER_ID_KEY = 'reise_voter_id';
const FOUR_HOURS_MS = 4 * 60 * 60 * 1000;
const DEFAULT_EXCHANGE_RATE = 34.5;

function readCachedExchangeRate(): { rate: number; updatedAt: string | null } {
  try {
    const raw = localStorage.getItem(EXCHANGE_CACHE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as { rate?: number; updatedAt?: string };
      if (typeof parsed.rate === 'number') {
        return { rate: parsed.rate, updatedAt: parsed.updatedAt ?? null };
      }
    }
  } catch {
    /* ignore corrupt cache */
  }
  return { rate: DEFAULT_EXCHANGE_RATE, updatedAt: null };
}

// Unicode-safe base64url. Plain btoa() throws on the Chinese text inside an
// itinerary, so we round-trip through encode/decodeURIComponent. Used for
// collaborative share tokens.
function encodeCollab(data: CollaborativeItinerary): string {
  const json = JSON.stringify(data);
  const b64 = btoa(
    encodeURIComponent(json).replace(/%([0-9A-F]{2})/g, (_, h: string) =>
      String.fromCharCode(parseInt(h, 16)),
    ),
  );
  return b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function decodeCollab(token: string): CollaborativeItinerary {
  const b64 = token.replace(/-/g, '+').replace(/_/g, '/');
  const json = decodeURIComponent(
    Array.prototype.map
      .call(
        atob(b64),
        (c: string) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2),
      )
      .join(''),
  );
  return JSON.parse(json) as CollaborativeItinerary;
}

/* ---------------------------------------------------------------------------
   AI chatbot helpers
   --------------------------------------------------------------------------- */

type ItineraryPatch = {
  day: number;
  action: 'add' | 'remove' | 'replace';
  attractionSlug: string;
};

type ChatProxyResponse = {
  reply?: string;
  completion?: string;
  // Anthropic raw shape: content is an array of text blocks.
  content?: string | { type?: string; text?: string }[];
};

/** Pull plain reply text out of whatever shape the proxy returns. */
function extractReplyText(data: ChatProxyResponse): string {
  if (typeof data.reply === 'string') return data.reply;
  if (typeof data.completion === 'string') return data.completion;
  if (typeof data.content === 'string') return data.content;
  if (Array.isArray(data.content)) {
    return data.content
      .map((b) => (typeof b?.text === 'string' ? b.text : ''))
      .join('')
      .trim();
  }
  return '';
}

/** Compact day shape for the system prompt — slugs only, no nested card data. */
function summarizeDay(d: DayPlan) {
  return { day: d.day, city: d.city, attractions: d.attractions.map((a) => a.slug) };
}

function buildSystemPrompt(tripConfig: TripConfig, itinerary: DayPlan[]): string {
  return `你是 REISE 的奧地利旅遊 AI 助手，專門幫助台灣旅客規劃奧地利行程。

你的能力：
1. 根據使用者需求修改行程（新增/移除/替換景點）
2. 提供奧地利旅遊建議（最佳季節、交通、文化禮儀）
3. 推薦景點和住宿
4. 回答奧地利相關問題

目前的行程設定：
- 旅行天數：${tripConfig.days}天
- 旅行城市：${tripConfig.cities.join(', ')}
- 出發日期：${tripConfig.startDate ?? '未設定'}
- 旅行類型：${tripConfig.travelerType}
- 選擇的興趣：${tripConfig.categories.join(', ') || '未指定'}
- 預算等級：${tripConfig.budget ?? '未設定'}

目前的行程：
${JSON.stringify(itinerary.map(summarizeDay), null, 2)}

可用的景點清單（slug列表，詳細資料在資料庫中）：
${ALL_ATTRACTIONS.map((a) => a.slug + ': ' + a.name.zh).join('\n')}

可用的住宿清單：
${ALL_ACCOMMODATIONS.map((a) => a.slug + ': ' + a.name.zh + ' (€' + a.pricePerNight.EUR + '/晚)').join('\n')}

回覆規則：
- 用繁體中文回覆
- 回覆要簡短（100字以內），像朋友建議一樣自然
- 如果修改了行程，在回覆末尾加上 JSON patch：
  [ITINERARY_PATCH]{ ... }[/ITINERARY_PATCH]
  JSON格式：{ day: number, action: 'add'|'remove'|'replace', attractionSlug: string }
- 不要重複列出整個行程，只說你改了什麼
- 如果問題不相關或太難回答，誠實說你不確定`;
}

/** Extract any [ITINERARY_PATCH]…[/ITINERARY_PATCH] blocks; strip them from text. */
function extractItineraryPatches(text: string): {
  cleanText: string;
  patches: ItineraryPatch[];
} {
  const patches: ItineraryPatch[] = [];
  const re = /\[ITINERARY_PATCH\]([\s\S]*?)\[\/ITINERARY_PATCH\]/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text)) !== null) {
    try {
      const parsed = JSON.parse(m[1]!.trim()) as unknown;
      const arr = Array.isArray(parsed) ? parsed : [parsed];
      for (const p of arr as ItineraryPatch[]) {
        if (
          p &&
          typeof p.attractionSlug === 'string' &&
          typeof p.day === 'number' &&
          (p.action === 'add' || p.action === 'remove' || p.action === 'replace')
        ) {
          patches.push(p);
        }
      }
    } catch {
      /* invalid JSON in a patch block — skip it, keep the rest of the reply */
    }
  }
  return { cleanText: text.replace(re, '').trim(), patches };
}

/** Apply patches to a cloned itinerary; return it plus human-readable notes. */
function applyItineraryPatches(
  itinerary: DayPlan[],
  patches: ItineraryPatch[],
): { itinerary: DayPlan[]; notes: string[] } {
  if (patches.length === 0) return { itinerary, notes: [] };
  const next = itinerary.map((d) => ({ ...d, attractions: [...d.attractions] }));
  const notes: string[] = [];

  for (const p of patches) {
    const attraction = ALL_ATTRACTIONS.find((a) => a.slug === p.attractionSlug);
    if (!attraction || next.length === 0) continue;
    const name = attraction.name.zh;
    const idx = Math.min(Math.max(0, p.day - 1), next.length - 1);

    if (p.action === 'remove') {
      let removed = false;
      for (const d of next) {
        if (d.attractions.some((a) => a.slug === p.attractionSlug)) {
          d.attractions = d.attractions.filter((a) => a.slug !== p.attractionSlug);
          removed = true;
          break;
        }
      }
      if (removed) notes.push(`已移除${name}`);
    } else {
      const day = next[idx]!;
      if (!day.attractions.some((a) => a.slug === p.attractionSlug)) {
        day.attractions.push(attraction);
        // "replace" keeps the day from growing unbounded.
        if (p.action === 'replace' && day.attractions.length > 4) {
          day.attractions.shift();
        }
      }
      notes.push(p.action === 'replace' ? `已替換為${name}` : `已加入${name}`);
    }
  }
  return { itinerary: next, notes };
}

const initialExchange = readCachedExchangeRate();

export const useStore = create<AppStore>()(
  persist(
    (set, get) => ({
      // Trip configuration
      tripConfig: DEFAULT_TRIP_CONFIG,
      setTripConfig: (config) =>
        set((state) => ({ tripConfig: { ...state.tripConfig, ...config } })),

      // UI: language (kept in sync with i18n — see subscription below)
      lang: initialLang,
      setLang: (lang) => {
        if (get().lang === lang) return;
        set({ lang });
        const target = lang === 'zh' ? 'zh-TW' : 'en';
        if (i18n.language !== target) {
          void i18n.changeLanguage(target);
        }
      },

      // Map interaction
      selectedAttraction: null,
      // Selecting (or clearing) an attraction closes the language-cards panel
      // so it never lingers showing a previous attraction's cards, and clears
      // any selected accommodation so the sidebar shows one detail at a time.
      setSelectedAttraction: (a) =>
        set({
          selectedAttraction: a,
          selectedAccommodation: null,
          languageCardsOpen: false,
        }),
      selectedAccommodation: null,
      setSelectedAccommodation: (a) =>
        set({
          selectedAccommodation: a,
          selectedAttraction: null,
          languageCardsOpen: false,
        }),
      showAccommodations: false,
      toggleShowAccommodations: () =>
        set((state) => ({ showAccommodations: !state.showAccommodations })),
      hoveredAttraction: null,
      setHoveredAttraction: (id) => set({ hoveredAttraction: id }),
      languageCardsOpen: false,
      setLanguageCardsOpen: (open) => set({ languageCardsOpen: open }),

      // Saved attractions
      savedAttractions: [],
      toggleSaved: (id) =>
        set((state) => ({
          savedAttractions: state.savedAttractions.includes(id)
            ? state.savedAttractions.filter((s) => s !== id)
            : [...state.savedAttractions, id],
        })),

      // Itinerary
      itinerary: [],
      generateItinerary: (allAttractions) => {
        const { tripConfig, activeCategories } = get();
        const days = Math.max(1, tripConfig.days);

        // City scope: honor the multi-city selection (in the user's chosen
        // order). Fall back to the legacy single startCity when none are set.
        const selectedCities =
          tripConfig.cities.length > 0
            ? tripConfig.cities
            : [tripConfig.startCity];
        const cityOrder: string[] = [
          ...selectedCities,
          ...getCityOrder(tripConfig.startCity).filter(
            (c) => !selectedCities.includes(c),
          ),
        ];

        // 1. Filter by active categories (empty selection = no filter)…
        const byCategory =
          activeCategories.length === 0
            ? allAttractions
            : allAttractions.filter((a) =>
                a.category.some((c) => activeCategories.includes(c)),
              );

        // …then restrict to the selected cities so unpicked cities never leak in.
        const filtered = byCategory.filter((a) =>
          selectedCities.includes(a.city),
        );

        // 2. Sort by city travel order so the same city stays together.
        const sorted = [...filtered].sort(
          (a, b) => cityOrder.indexOf(a.city) - cityOrder.indexOf(b.city),
        );

        // 3. Distribute evenly across days, capped at MAX_PER_DAY.
        const MAX_PER_DAY = 4;
        const perDay = Math.min(
          MAX_PER_DAY,
          Math.max(1, Math.ceil(sorted.length / days)),
        );
        const capped = sorted.slice(0, perDay * days);

        // 4. Build one DayPlan per day. City = the most-represented city in
        //    that day's slice, falling back to the ordered city sequence.
        const itinerary: DayPlan[] = Array.from({ length: days }, (_, i) => {
          const slice = capped.slice(i * perDay, (i + 1) * perDay);

          const counts = slice.reduce<Record<string, number>>((acc, a) => {
            acc[a.city] = (acc[a.city] ?? 0) + 1;
            return acc;
          }, {});
          const dominantCity =
            Object.entries(counts).sort(([, x], [, y]) => y - x)[0]?.[0] ??
            cityOrder[Math.min(i, cityOrder.length - 1)] ??
            tripConfig.startCity;

          return {
            day: i + 1,
            city: dominantCity,
            attractions: slice,
          };
        });

        set({ itinerary });
      },

      // Category filters
      activeCategories: [],
      toggleCategory: (cat) =>
        set((state) => ({
          activeCategories: state.activeCategories.includes(cat)
            ? state.activeCategories.filter((c) => c !== cat)
            : [...state.activeCategories, cat],
        })),
      clearCategories: () => set({ activeCategories: [] }),

      // ---- Exchange rate -----------------------------------------------------
      exchangeRate: initialExchange.rate,
      exchangeRateUpdatedAt: initialExchange.updatedAt,
      fetchExchangeRate: async () => {
        // Use a cached rate if it's under 4 hours old.
        const cached = readCachedExchangeRate();
        if (
          cached.updatedAt &&
          Date.now() - new Date(cached.updatedAt).getTime() < FOUR_HOURS_MS
        ) {
          set({
            exchangeRate: cached.rate,
            exchangeRateUpdatedAt: cached.updatedAt,
          });
          return;
        }
        try {
          const res = await fetch(
            'https://api.frankfurter.app/latest?from=EUR&to=TWD',
          );
          const data = (await res.json()) as { rates?: { TWD?: number } };
          const rate = data.rates?.TWD;
          if (typeof rate === 'number') {
            const updatedAt = new Date().toISOString();
            set({ exchangeRate: rate, exchangeRateUpdatedAt: updatedAt });
            try {
              localStorage.setItem(
                EXCHANGE_CACHE_KEY,
                JSON.stringify({ rate, updatedAt }),
              );
            } catch {
              /* ignore quota */
            }
            return;
          }
          throw new Error('Missing TWD rate');
        } catch {
          set({ exchangeRate: DEFAULT_EXCHANGE_RATE });
        }
      },

      // ---- Accommodation -----------------------------------------------------
      accommodations: ALL_ACCOMMODATIONS,
      savedAccommodations: [],
      toggleSavedAccommodation: (id) =>
        set((state) => ({
          savedAccommodations: state.savedAccommodations.includes(id)
            ? state.savedAccommodations.filter((s) => s !== id)
            : [...state.savedAccommodations, id],
        })),
      assignAccommodationToDay: (acc) => {
        set((state) => {
          const savedAccommodations = state.savedAccommodations.includes(acc.id)
            ? state.savedAccommodations
            : [...state.savedAccommodations, acc.id];

          // No itinerary yet — just remember the stay for later.
          if (state.itinerary.length === 0) return { savedAccommodations };

          // Assign to the first day in the matching city, else the first day.
          let target = state.itinerary.findIndex((d) => d.city === acc.city);
          if (target === -1) target = 0;
          const itinerary = state.itinerary.map((d, i) =>
            i === target ? { ...d, accommodation: acc } : d,
          );
          return {
            savedAccommodations,
            itinerary,
            tripConfig: { ...state.tripConfig, includeAccommodation: true },
          };
        });
        // A stay now has a price — refresh the budget summary.
        get().computeBudget();
      },

      // ---- Collaborative session --------------------------------------------
      collaborativeId: null,
      collaborativeData: null,
      getVoterSessionId: () => {
        try {
          const existing = localStorage.getItem(VOTER_ID_KEY);
          if (existing) return existing;
          const id =
            typeof crypto !== 'undefined' && crypto.randomUUID
              ? crypto.randomUUID()
              : `v_${Math.random().toString(36).slice(2)}${Date.now().toString(36)}`;
          localStorage.setItem(VOTER_ID_KEY, id);
          return id;
        } catch {
          return `v_${Math.random().toString(36).slice(2)}`;
        }
      },
      generateShareLink: () => {
        const { tripConfig, itinerary, chatHistory } = get();
        const id = nanoid(12);
        const createdAt = new Date();
        const expiresAt = new Date(
          createdAt.getTime() + 30 * 24 * 60 * 60 * 1000,
        );
        const data: CollaborativeItinerary = {
          id,
          createdAt: createdAt.toISOString(),
          expiresAt: expiresAt.toISOString(),
          tripConfig,
          itinerary,
          votes: [],
          chatHistory,
        };
        try {
          localStorage.setItem(`reise_collab_${id}`, encodeCollab(data));
        } catch {
          /* ignore quota */
        }
        set({ collaborativeId: id, collaborativeData: data });
        return `${window.location.origin}/collab/${id}`;
      },
      loadFromShareLink: async (id) => {
        let token: string | null = null;
        try {
          token = localStorage.getItem(`reise_collab_${id}`);
        } catch {
          /* ignore */
        }
        if (!token) {
          try {
            token = sessionStorage.getItem(`reise_collab_${id}`);
          } catch {
            /* ignore */
          }
        }
        // Phase 3: swap the storage lookup above for a Supabase realtime fetch.
        if (!token) return;
        try {
          const data = decodeCollab(token);
          // Non-destructive: only populate the collaborative slice. The shared
          // trip is read from `collaborativeData` by the collab view, so we
          // leave the visitor's own tripConfig / itinerary / chatHistory intact.
          set({ collaborativeId: id, collaborativeData: data });
        } catch {
          /* invalid token — ignore */
        }
      },
      submitVote: (attractionId, vote) => {
        const { collaborativeData, collaborativeId, getVoterSessionId } = get();
        if (!collaborativeData) return;
        const voterId = getVoterSessionId();

        // Clone votes so we never mutate state in place.
        const votes = collaborativeData.votes.map((v) => ({
          attractionId: v.attractionId,
          votes: { ...v.votes },
          voterIds: [...v.voterIds],
        }));
        let entry = votes.find((v) => v.attractionId === attractionId);
        if (!entry) {
          entry = { attractionId, votes: { up: 0, down: 0 }, voterIds: [] };
          votes.push(entry);
        }
        if (entry.voterIds.includes(voterId)) return; // prevent double voting
        entry.votes[vote] += 1;
        entry.voterIds.push(voterId);

        const updated: CollaborativeItinerary = { ...collaborativeData, votes };
        set({ collaborativeData: updated });
        if (collaborativeId) {
          try {
            localStorage.setItem(
              `reise_collab_${collaborativeId}`,
              encodeCollab(updated),
            );
          } catch {
            /* ignore */
          }
        }
      },

      // ---- Budget ------------------------------------------------------------
      budgetSummary: null,
      computeBudget: () => {
        const { itinerary, tripConfig, exchangeRate } = get();
        const days = Math.max(1, tripConfig.days);
        const travelers = Math.max(1, tripConfig.travelers);

        // Attractions: sum adult ticket prices where structured data exists.
        let attractions = 0;
        for (const day of itinerary) {
          for (const a of day.attractions) {
            attractions += a.ticketPrice?.adult.EUR ?? 0;
          }
        }

        // Accommodation: sum each night's stay where present.
        let accommodation = 0;
        for (const day of itinerary) {
          accommodation += day.accommodation?.pricePerNight.EUR ?? 0;
        }

        // Transport: prefer per-day budgets; otherwise estimate inter-city
        // hops (€35 train) and same-city local travel (€6).
        let transport = 0;
        for (let i = 0; i < itinerary.length; i++) {
          const day = itinerary[i]!;
          if (day.budget?.transport != null) {
            transport += day.budget.transport;
          } else if (i > 0 && itinerary[i - 1]!.city !== day.city) {
            transport += 35;
          } else if (i > 0) {
            transport += 6;
          }
        }

        // Food: travelers × days × €35/person/day (mid estimate).
        const food = travelers * days * 35;

        const subtotal = transport + accommodation + attractions + food;
        const buffer = subtotal * 0.1;
        const totalEUR = subtotal + buffer;

        set({
          budgetSummary: {
            totalEUR: Math.round(totalEUR),
            totalTWD: Math.round(totalEUR * exchangeRate),
            breakdown: {
              transport: Math.round(transport),
              accommodation: Math.round(accommodation),
              attractions: Math.round(attractions),
              food: Math.round(food),
              buffer: Math.round(buffer),
            },
            exchangeRate,
            lastUpdated: new Date().toISOString(),
          },
        });
      },

      // ---- AI chatbot --------------------------------------------------------
      chatHistory: [],
      chatLoading: false,
      sendChatMessage: async (message) => {
        const trimmed = message.trim();
        if (!trimmed) return;

        // Session cap — 20 user turns, then ask the user to refresh.
        const userTurns = get().chatHistory.filter(
          (m) => m.role === 'user',
        ).length;
        if (userTurns >= 20) {
          set((state) => ({
            chatHistory: [
              ...state.chatHistory,
              {
                id: nanoid(8),
                role: 'assistant',
                content: '已達對話上限，請重新整理頁面。',
                timestamp: new Date().toISOString(),
              },
            ],
          }));
          return;
        }

        // Snapshot history BEFORE the new turn for the API payload.
        const priorHistory = get().chatHistory;
        const userMsg: ChatMessage = {
          id: nanoid(8),
          role: 'user',
          content: trimmed,
          timestamp: new Date().toISOString(),
        };
        set({ chatHistory: [...priorHistory, userMsg], chatLoading: true });

        try {
          // SECURITY: never call the Claude API directly from the browser — the
          // key would be exposed to anyone with devtools. We build the system
          // prompt here (it only contains app data, no secrets) and POST it to
          // VITE_CHAT_ENDPOINT, a backend proxy that holds the key and forwards
          // the request to Claude.
          const endpoint = import.meta.env.VITE_CHAT_ENDPOINT;
          let rawReply = '';

          if (endpoint) {
            const { tripConfig, itinerary } = get();
            const res = await fetch(endpoint, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                model: 'claude-sonnet-4-20250514',
                max_tokens: 400,
                system: buildSystemPrompt(tripConfig, itinerary),
                messages: [
                  ...priorHistory.map((m) => ({
                    role: m.role,
                    content: m.content,
                  })),
                  { role: 'user', content: trimmed },
                ],
              }),
            });
            if (!res.ok) throw new Error(`Chat proxy error ${res.status}`);
            rawReply = extractReplyText((await res.json()) as ChatProxyResponse);
          } else {
            rawReply =
              'AI 助理尚未連線。請設定後端代理 VITE_CHAT_ENDPOINT（由後端保管 API 金鑰）即可啟用對話。';
          }

          // Parse + apply any itinerary patch, then show the cleaned text.
          const { cleanText, patches } = extractItineraryPatches(rawReply);
          const { itinerary: patched, notes } = applyItineraryPatches(
            get().itinerary,
            patches,
          );
          const patchNote = notes.length > 0 ? notes.join('、') : undefined;

          const assistantMsg: ChatMessage = {
            id: nanoid(8),
            role: 'assistant',
            content: cleanText || '（沒有收到回覆）',
            timestamp: new Date().toISOString(),
            patchNote,
          };
          set((state) => ({
            chatHistory: [...state.chatHistory, assistantMsg],
            chatLoading: false,
            ...(notes.length > 0 ? { itinerary: patched } : {}),
          }));

          if (notes.length > 0) get().computeBudget();
        } catch {
          set((state) => ({
            chatHistory: [
              ...state.chatHistory,
              {
                id: nanoid(8),
                role: 'assistant',
                content: 'AI 暫時無法使用，請稍後再試。',
                timestamp: new Date().toISOString(),
              },
            ],
            chatLoading: false,
          }));
        }
      },
      clearChat: () => set({ chatHistory: [] }),

      // ---- Seasonal tips -----------------------------------------------------
      getSeasonalTipsForDate: (attractionId) => {
        const attraction = ALL_ATTRACTIONS.find((a) => a.id === attractionId);
        if (!attraction?.seasonalTips?.length) return [];
        const { tripConfig } = get();
        const month = tripConfig.startDate
          ? new Date(tripConfig.startDate).getMonth() + 1
          : new Date().getMonth() + 1;
        return attraction.seasonalTips.filter((tip) =>
          tip.months.includes(month),
        );
      },

      // ---- Food collection ---------------------------------------------------
      foodCollection: seedFoodCollection,
      addFoodItem: (item) =>
        set((state) => ({
          foodCollection: [
            {
              ...item,
              id: nanoid(10),
              source: detectFoodSource(item.url),
              createdAt: new Date().toISOString(),
            },
            ...state.foodCollection,
          ],
        })),
      removeFoodItem: (id) =>
        set((state) => ({
          foodCollection: state.foodCollection.filter((f) => f.id !== id),
        })),
    }),
    {
      name: 'austria-reise-store',
      // Only persist user data — not ephemeral UI state.
      // Language is also excluded; i18next's own languageDetector handles that.
      partialize: (state) => ({
        savedAttractions: state.savedAttractions,
        savedAccommodations: state.savedAccommodations,
        tripConfig: state.tripConfig,
        activeCategories: state.activeCategories,
        itinerary: state.itinerary,
        foodCollection: state.foodCollection,
      }),
      // Backward-compatible hydration: older persisted snapshots may miss
      // newer TripConfig keys (e.g. `cities`), which would crash /plan.
      merge: (persistedState, currentState) => {
        const persisted = (persistedState as Partial<AppStore>) ?? {};
        const current = currentState as AppStore;
        const persistedTrip = (persisted.tripConfig ?? {}) as Partial<TripConfig>;
        const mergedTrip: TripConfig = {
          ...DEFAULT_TRIP_CONFIG,
          ...persistedTrip,
          // Keep invariants even if legacy data is malformed.
          cities:
            Array.isArray(persistedTrip.cities) && persistedTrip.cities.length > 0
              ? persistedTrip.cities
              : [persistedTrip.startCity ?? DEFAULT_TRIP_CONFIG.startCity],
          accommodationTags: Array.isArray(persistedTrip.accommodationTags)
            ? persistedTrip.accommodationTags
            : [],
        };

        return {
          ...current,
          ...persisted,
          tripConfig: mergedTrip,
          savedAttractions: Array.isArray(persisted.savedAttractions)
            ? persisted.savedAttractions
            : current.savedAttractions,
          savedAccommodations: Array.isArray(persisted.savedAccommodations)
            ? persisted.savedAccommodations
            : current.savedAccommodations,
          activeCategories: Array.isArray(persisted.activeCategories)
            ? persisted.activeCategories
            : current.activeCategories,
          itinerary: Array.isArray(persisted.itinerary)
            ? persisted.itinerary
            : current.itinerary,
          foodCollection: Array.isArray(persisted.foodCollection)
            ? persisted.foodCollection
            : current.foodCollection,
        };
      },
    },
  ),
);

// Keep store.lang in sync when i18n changes from any source (the existing
// LanguageSwitch component still calls i18n.changeLanguage directly).
i18n.on('languageChanged', (lng: string) => {
  const next: 'zh' | 'en' = lng.startsWith('zh') ? 'zh' : 'en';
  if (useStore.getState().lang !== next) {
    useStore.setState({ lang: next });
  }
});
