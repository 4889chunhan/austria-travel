import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import i18n from '../i18n';
import type {
  Attraction,
  AttractionCategory,
  DayPlan,
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
  hoveredAttraction: string | null;
  setHoveredAttraction: (id: string | null) => void;

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
}

// All cities the app knows about, in a sensible default travel order.
const ALL_CITIES: Attraction['city'][] = [
  'vienna',
  'salzburg',
  'hallstatt',
  'innsbruck',
  'graz',
];

/** City sequence with `startCity` pulled to the front. */
function getCityOrder(startCity: TripConfig['startCity']): Attraction['city'][] {
  return [startCity, ...ALL_CITIES.filter((c) => c !== startCity)];
}

const DEFAULT_TRIP_CONFIG: TripConfig = {
  days: 5,
  travelers: 2,
  categories: [],
  startCity: 'vienna',
};

const initialLang: 'zh' | 'en' = i18n.language?.startsWith('zh') ? 'zh' : 'en';

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
      setSelectedAttraction: (a) => set({ selectedAttraction: a }),
      hoveredAttraction: null,
      setHoveredAttraction: (id) => set({ hoveredAttraction: id }),

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
        const cityOrder = getCityOrder(tripConfig.startCity);

        // 1. Filter by active categories (empty selection = no filter).
        const filtered =
          activeCategories.length === 0
            ? allAttractions
            : allAttractions.filter((a) =>
                a.category.some((c) => activeCategories.includes(c)),
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
    }),
    {
      name: 'austria-reise-store',
      // Only persist user data — not ephemeral UI state or derived itinerary.
      // Language is also excluded; i18next's own languageDetector handles that.
      partialize: (state) => ({
        savedAttractions: state.savedAttractions,
        tripConfig: state.tripConfig,
        activeCategories: state.activeCategories,
      }),
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
