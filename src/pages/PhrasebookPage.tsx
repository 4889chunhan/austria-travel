import { useMemo, useState } from 'react';
import {
  BedDouble,
  Coffee,
  Landmark,
  Pill,
  Search,
  ShoppingBag,
  ShoppingCart,
  Siren,
  Train,
  Utensils,
  type LucideIcon,
} from 'lucide-react';
import { universalLanguageCards } from '../data/universalLanguageCards';
import { attractions } from '../data/attractions';
import { LanguageCard } from '../components/LanguageCard';
import { cn } from '../utils/cn';
import type { LanguageCard as LanguageCardType, LanguageCardScenario } from '../types';

/* ---------------------------------------------------------------------------
   Card pool — universal cards + every attraction-tied card (景點相關).
   --------------------------------------------------------------------------- */

const ATTRACTION_CARDS: LanguageCardType[] = attractions.flatMap((a) =>
  a.languageCards.map((c) => ({ ...c, scenario: c.scenario ?? 'attraction' })),
);

const ALL_CARDS: LanguageCardType[] = [
  ...universalLanguageCards,
  ...ATTRACTION_CARDS,
];

type TabId = Extract<
  LanguageCardScenario,
  | 'restaurant'
  | 'cafe'
  | 'supermarket'
  | 'pharmacy'
  | 'transport'
  | 'hotel'
  | 'shopping'
  | 'emergency'
  | 'attraction'
>;

const TABS: { id: TabId; icon: LucideIcon; label: string }[] = [
  { id: 'restaurant', icon: Utensils, label: '餐廳' },
  { id: 'cafe', icon: Coffee, label: '咖啡館' },
  { id: 'supermarket', icon: ShoppingCart, label: '超市' },
  { id: 'pharmacy', icon: Pill, label: '藥局' },
  { id: 'transport', icon: Train, label: '交通' },
  { id: 'hotel', icon: BedDouble, label: '住宿' },
  { id: 'shopping', icon: ShoppingBag, label: '購物市集' },
  { id: 'emergency', icon: Siren, label: '緊急' },
  { id: 'attraction', icon: Landmark, label: '景點相關' },
];

const DIFFICULTY_RANK: Record<NonNullable<LanguageCardType['difficulty']>, number> = {
  easy: 0,
  medium: 1,
  hard: 2,
};

/** Sort: emergency-scenario cards first, then easy → hard. Stable otherwise. */
function sortCards(cards: LanguageCardType[]): LanguageCardType[] {
  return [...cards].sort((a, b) => {
    const ae = a.scenario === 'emergency' ? 0 : 1;
    const be = b.scenario === 'emergency' ? 0 : 1;
    if (ae !== be) return ae - be;
    return (
      DIFFICULTY_RANK[a.difficulty ?? 'medium'] -
      DIFFICULTY_RANK[b.difficulty ?? 'medium']
    );
  });
}

export function PhrasebookPage() {
  const [activeTab, setActiveTab] = useState<TabId>('restaurant');
  const [query, setQuery] = useState('');

  const trimmed = query.trim().toLowerCase();

  const cards = useMemo(() => {
    if (trimmed) {
      // Search runs across the whole pool (german / chinese / english /
      // situation / pronunciation), ignoring the active tab.
      const hits = ALL_CARDS.filter((c) =>
        [
          c.german,
          c.chinese,
          c.english,
          c.pronunciation,
          c.situation.zh,
          c.situation.en,
        ]
          .join('\n')
          .toLowerCase()
          .includes(trimmed),
      );
      return sortCards(hits);
    }
    const inTab = ALL_CARDS.filter(
      (c) => (c.scenario ?? 'attraction') === activeTab,
    );
    return sortCards(inTab);
  }, [trimmed, activeTab]);

  const jumpToEmergency = () => {
    setQuery('');
    setActiveTab('emergency');
    document
      .getElementById('phrasebook-top')
      ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div id="phrasebook-top" className="min-h-[calc(100vh-64px)] bg-cream">
      <div className="mx-auto max-w-[1200px] px-6 py-12 sm:py-16">
        {/* Header */}
        <header className="mb-8">
          <p className="eyebrow mb-3">Survival German · Österreich</p>
          <h1 className="font-serif text-[40px] italic leading-none text-ink sm:text-[48px]">
            Phrasebook
          </h1>
          <p className="mt-2 font-chinese text-[16px] text-ink-muted">
            語言寶典 · 旅途上的實用德語小卡
          </p>
        </header>

        {/* Scenario tabs */}
        <div className="scrollbar-hidden -mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const active = !trimmed && tab.id === activeTab;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  setQuery('');
                  setActiveTab(tab.id);
                }}
                aria-pressed={active}
                aria-label={tab.label}
                className={cn(
                  // Mobile: 44×44 icon-only pills. Tablet+: icon + label.
                  'flex h-11 w-11 shrink-0 items-center justify-center gap-1.5 rounded-pill font-chinese text-[13px] transition-colors lg:h-auto lg:w-auto lg:px-4 lg:py-2',
                  active
                    ? 'bg-lime font-medium text-lime-deep'
                    : 'text-ink-muted hover:text-ink',
                )}
                style={active ? undefined : { border: '1px solid var(--color-border-med)' }}
              >
                <Icon size={16} strokeWidth={2.2} />
                <span className="hidden lg:inline">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Search */}
        <div className="mt-4">
          <label
            className="flex items-center gap-2 rounded-pill px-4 py-2.5"
            style={{
              background: 'var(--color-card)',
              border: '0.5px solid var(--color-border)',
            }}
          >
            <Search size={15} className="shrink-0 text-ink-faint" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="搜尋德文、中文、或情境…"
              className="min-w-0 flex-1 bg-transparent font-mono text-[13px] text-ink outline-none placeholder:text-ink-faint"
            />
          </label>
          {trimmed && (
            <p className="mt-2 font-mono text-[11px] uppercase tracking-editorial text-ink-faint">
              {cards.length} 個結果 · 「{query.trim()}」
            </p>
          )}
        </div>

        {/* Card grid */}
        {cards.length === 0 ? (
          <div className="card mt-10 text-center">
            <p className="font-chinese text-[14px] text-ink-muted">
              找不到符合的卡片 — 換個關鍵字或選擇其他情境。
            </p>
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {cards.map((card) => (
              <div key={card.id} className="flex justify-center">
                <LanguageCard card={card} />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* SOS — mobile only, jumps straight to the emergency tab */}
      <button
        type="button"
        onClick={jumpToEmergency}
        aria-label="跳至緊急用語"
        className="focus-coral fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-pill font-mono text-[13px] font-bold text-white shadow-float transition-transform active:scale-95 md:hidden"
        style={{ background: '#E0625D', letterSpacing: '0.08em' }}
      >
        SOS
      </button>
    </div>
  );
}
