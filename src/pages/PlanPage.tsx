import { useEffect, useState, type CSSProperties } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowDown,
  ArrowUpRight,
  BedDouble,
  Bus,
  Calendar,
  Car,
  Castle,
  Check,
  ChevronDown,
  ChevronUp,
  Church,
  Compass,
  Copy,
  Droplets,
  Footprints,
  Grape,
  Landmark,
  Languages,
  Link2,
  Minus,
  Mountain,
  Music,
  Plus,
  QrCode,
  Snowflake,
  Star,
  ThumbsDown,
  ThumbsUp,
  Train,
  X,
  type LucideIcon,
} from 'lucide-react';
import { QRCodeCanvas } from 'qrcode.react';
import { useStore } from '../store';
import { attractions } from '../data/attractions';
import { sampleItinerary, sampleTripConfig } from '../data/sampleItinerary';
import { CATEGORY_META, CATEGORY_ORDER, primaryCategory } from '../utils/categoryColors';
import { useLocalizedField } from '../hooks/useLocalizedField';
import { LanguageCard } from '../components/LanguageCard';
import { PlanChatbot } from '../components/PlanChatbot';
import { BudgetCalculator } from '../components/BudgetCalculator';
import { cn } from '../utils/cn';
import {
  addDaysISO,
  getSeasonalTipsForDay,
  getSeasonalTipsForTrip,
  resolveSeasonalIcon,
  SEASONAL_TYPE_COLOR,
} from '../utils/seasonalUtils';
import { CITY_DISPLAY } from '../utils/cityDisplay';
import type {
  Attraction,
  AttractionCategory,
  DayPlan,
  SeasonalTip,
  TripConfig,
} from '../types';

/* ===========================================================================
   Static option tables
   =========================================================================== */

type AccTag = 'design' | 'budget' | 'family' | 'romantic';

const CITY_OPTIONS: {
  id: string;
  zh: string;
  en: string;
  icon: LucideIcon;
}[] = [
  // Austria
  { id: 'vienna', zh: '維也納', en: 'Vienna', icon: Landmark },
  { id: 'durnstein', zh: '杜恩斯坦', en: 'Dürnstein', icon: Castle },
  { id: 'melk', zh: '梅爾克', en: 'Melk', icon: Church },
  { id: 'salzburg', zh: '薩爾斯堡', en: 'Salzburg', icon: Music },
  { id: 'wolfgangsee', zh: '聖沃夫岡湖', en: 'Wolfgangsee', icon: Droplets },
  { id: 'hallstatt', zh: '哈修塔特', en: 'Hallstatt', icon: Mountain },
  { id: 'innsbruck', zh: '因斯布魯克', en: 'Innsbruck', icon: Snowflake },
  { id: 'graz', zh: '格拉茲', en: 'Graz', icon: Castle },
  // Bayern (Germany)
  { id: 'konigssee', zh: '國王湖', en: 'Königssee', icon: Mountain },
  { id: 'munich', zh: '慕尼黑', en: 'Munich', icon: Landmark },
  { id: 'neuschwanstein', zh: '新天鵝堡', en: 'Neuschwanstein', icon: Castle },
  { id: 'regensburg', zh: '雷根斯堡', en: 'Regensburg', icon: Castle },
  // Czech Republic
  { id: 'prague', zh: '布拉格', en: 'Prague', icon: Castle },
  { id: 'cesky-krumlov', zh: '庫倫洛夫', en: 'Český Krumlov', icon: Castle },
  // Extras
  { id: 'krems', zh: '克雷姆斯', en: 'Krems', icon: Grape },
  { id: 'badischl', zh: '巴特伊舍', en: 'Bad Ischl', icon: Droplets },
];

const TRAVELER_TYPES: { id: TripConfig['travelerType']; label: string }[] = [
  { id: 'solo', label: '獨旅' },
  { id: 'couple', label: '情侶' },
  { id: 'family', label: '家庭' },
  { id: 'group', label: '朋友' },
];

const BUDGET_OPTIONS: {
  id: NonNullable<TripConfig['budget']>;
  zh: string;
  euro: string;
}[] = [
  { id: 'budget', zh: '省錢旅遊', euro: '€€' },
  { id: 'mid', zh: '中等消費', euro: '€€€' },
  { id: 'luxury', zh: '奢華享受', euro: '€€€€' },
];

const ACCOMMODATION_TAGS: { id: AccTag; label: string }[] = [
  { id: 'design', label: '精品設計' },
  { id: 'budget', label: '背包客棧' },
  { id: 'family', label: '家庭友善' },
  { id: 'romantic', label: '浪漫情調' },
];

/* ===========================================================================
   Helpers
   =========================================================================== */

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function diffDays(start: string, end: string): number {
  const a = new Date(start).getTime();
  const b = new Date(end).getTime();
  if (Number.isNaN(a) || Number.isNaN(b) || b < a) return 0;
  return Math.round((b - a) / 86_400_000) + 1;
}

function formatTWD(n: number): string {
  return `NT$ ${Math.round(n).toLocaleString('en-US')}`;
}

function cityLabel(city: string): { zh: string; en: string } {
  return CITY_DISPLAY[city] ?? { zh: city, en: city };
}

/** Per-day EUR estimate, mirroring the store's budget heuristics. */
function dayBudgetEUR(
  day: DayPlan,
  prev: DayPlan | undefined,
  travelers: number,
): { transport: number; tickets: number; food: number } {
  let tickets = 0;
  for (const a of day.attractions) tickets += a.ticketPrice?.adult.EUR ?? 0;
  const transport = prev ? (prev.city !== day.city ? 35 : 6) : 6;
  const food = Math.max(1, travelers) * 35;
  return { transport, tickets, food };
}

/* ===========================================================================
   Page
   =========================================================================== */

export function PlanPage() {
  const fetchExchangeRate = useStore((s) => s.fetchExchangeRate);
  const itinerary = useStore((s) => s.itinerary);
  const exchangeRate = useStore((s) => s.exchangeRate);
  const computeBudget = useStore((s) => s.computeBudget);

  // Refresh the EUR→TWD rate on mount (cached for 4h inside the store).
  useEffect(() => {
    void fetchExchangeRate();
  }, [fetchExchangeRate]);

  // Keep the budget summary in sync with the live itinerary / rate.
  useEffect(() => {
    if (itinerary.length > 0) computeBudget();
  }, [itinerary, exchangeRate, computeBudget]);

  const scrollToPreview = () => {
    document
      .getElementById('itinerary-preview')
      ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="flex flex-col md:h-full md:flex-row md:overflow-hidden">
      <LeftPanel />
      <RightPanel />

      {/* Mobile-only jump-to-itinerary pill */}
      <button
        type="button"
        onClick={scrollToPreview}
        className="btn-primary fixed bottom-5 left-1/2 z-40 -translate-x-1/2 shadow-float md:hidden"
      >
        查看行程
        <ArrowDown size={14} />
      </button>
    </div>
  );
}

/* ===========================================================================
   LEFT PANEL
   =========================================================================== */

function LeftPanel() {
  const navigate = useNavigate();
  const tripConfig = useStore((s) => s.tripConfig);
  const setTripConfig = useStore((s) => s.setTripConfig);
  const generateItinerary = useStore((s) => s.generateItinerary);
  const computeBudget = useStore((s) => s.computeBudget);

  const handleGenerate = () => {
    const cities =
      tripConfig.cities.length > 0 ? tripConfig.cities : [tripConfig.startCity];
    setTripConfig({ startCity: cities[0]! });
    generateItinerary(attractions);
    computeBudget();
  };

  const loadSampleTrip = () => {
    setTripConfig(sampleTripConfig);
    useStore.setState({ itinerary: sampleItinerary });
    computeBudget();
  };

  return (
    <aside
      className="flex w-full shrink-0 flex-col md:h-full md:w-[420px] md:overflow-y-auto"
      style={{
        background: 'var(--color-cream)',
        borderRight: '0.5px solid var(--color-border)',
      }}
    >
      <div className="flex flex-col gap-10 px-6 py-6">
        <HeaderSection />
        <DateSection tripConfig={tripConfig} setTripConfig={setTripConfig} />
        <CitySection tripConfig={tripConfig} setTripConfig={setTripConfig} />
        <TravelersSection tripConfig={tripConfig} setTripConfig={setTripConfig} />
        <InterestsSection />
        <BudgetSection tripConfig={tripConfig} setTripConfig={setTripConfig} />
        <AccommodationSection
          tripConfig={tripConfig}
          setTripConfig={setTripConfig}
        />
        <ChatbotSection />
      </div>

      {/* Generate button — pinned to the bottom of the scrolling panel on
          desktop; flows inline on mobile (the floating pill handles jump-to). */}
      <div
        className="mt-auto px-6 py-4 md:sticky md:bottom-0"
        style={{
          background: 'var(--color-cream)',
          borderTop: '0.5px solid var(--color-border)',
        }}
      >
        <button
          type="button"
          onClick={handleGenerate}
          className="btn-primary w-full justify-center"
          style={{ height: 52, fontSize: 16 }}
        >
          產生行程
          <ArrowUpRight size={18} />
        </button>
        <button
          type="button"
          onClick={() => navigate('/map')}
          className="mt-2 w-full text-center font-mono text-[11px] uppercase tracking-editorial text-ink-faint transition-colors hover:text-ink"
        >
          或在地圖上探索景點 →
        </button>
        <button
          type="button"
          onClick={loadSampleTrip}
          className="mt-1 w-full text-center font-chinese text-[11px] text-ink-faint transition-colors hover:text-lime-deep"
        >
          載入示範行程 · 7/8–7/20 奧地利・德國・捷克 →
        </button>
      </div>
    </aside>
  );
}

/* ---- Section A — header ---------------------------------------------------- */

function HeaderSection() {
  return (
    <header>
      <h1 className="font-serif text-[32px] italic leading-tight text-ink">
        Plan Your Trip
      </h1>
      <p className="mt-1 font-chinese text-[14px] text-ink-muted">
        規劃你的奧地利之旅
      </p>
    </header>
  );
}

/* ---- Section labels -------------------------------------------------------- */

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mb-3 font-chinese text-[14px] font-medium text-ink">
      {children}
    </h2>
  );
}

/* ---- Section B — dates ----------------------------------------------------- */

function DateSection({
  tripConfig,
  setTripConfig,
}: {
  tripConfig: TripConfig;
  setTripConfig: (c: Partial<TripConfig>) => void;
}) {
  const onStart = (value: string) => {
    const startDate = value || null;
    const days =
      startDate && tripConfig.endDate
        ? diffDays(startDate, tripConfig.endDate)
        : tripConfig.days;
    setTripConfig({ startDate, days: days > 0 ? days : tripConfig.days });
  };
  const onEnd = (value: string) => {
    const endDate = value || null;
    const days =
      tripConfig.startDate && endDate
        ? diffDays(tripConfig.startDate, endDate)
        : tripConfig.days;
    setTripConfig({ endDate, days: days > 0 ? days : tripConfig.days });
  };

  const computed =
    tripConfig.startDate && tripConfig.endDate
      ? diffDays(tripConfig.startDate, tripConfig.endDate)
      : 0;

  const tips = getSeasonalTipsForTrip(tripConfig);
  const [showAll, setShowAll] = useState(false);
  const visibleTips = showAll ? tips : tips.slice(0, 3);

  return (
    <section>
      <SectionLabel>旅行日期</SectionLabel>
      <div className="grid grid-cols-2 gap-2">
        <DateField
          label="出發日期"
          value={tripConfig.startDate ?? ''}
          onChange={onStart}
        />
        <DateField
          label="返回日期"
          value={tripConfig.endDate ?? ''}
          min={tripConfig.startDate ?? undefined}
          onChange={onEnd}
        />
      </div>
      {computed > 0 && (
        <span className="mt-3 inline-flex items-center gap-1.5 rounded-pill bg-lime px-3 py-1 font-mono text-[11px] uppercase tracking-editorial text-lime-deep">
          <Calendar size={12} strokeWidth={2.2} />共 {computed} 天
        </span>
      )}

      {tips.length > 0 && (
        <div className="mt-3 flex flex-col gap-2">
          {visibleTips.map((tip) => (
            <SeasonalChip key={tip.title.zh} tip={tip} />
          ))}
          {tips.length > 3 && (
            <button
              type="button"
              onClick={() => setShowAll((v) => !v)}
              className="self-start font-mono text-[11px] uppercase tracking-editorial text-ink-faint transition-colors hover:text-ink"
            >
              {showAll ? '收起' : `展開全部提示（${tips.length}）`}
            </button>
          )}
        </div>
      )}
    </section>
  );
}

/** Seasonal tip chip — left-panel, colored left border by tip type. */
function SeasonalChip({ tip }: { tip: SeasonalTip }) {
  const localized = useLocalizedField();
  const Icon = resolveSeasonalIcon(tip.icon);
  const color = SEASONAL_TYPE_COLOR[tip.type];
  return (
    <div className="card" style={{ padding: '10px 12px', borderLeft: `4px solid ${color}` }}>
      <div className="flex items-start gap-2">
        <Icon size={15} strokeWidth={2} style={{ color, marginTop: 1, flexShrink: 0 }} />
        <div className="min-w-0">
          <p className="font-chinese text-[13px] font-medium leading-snug text-ink">
            {localized(tip.title)}
          </p>
          <p className="truncate font-chinese text-[12px] text-ink-muted">
            {localized(tip.description)}
          </p>
        </div>
      </div>
    </div>
  );
}

function DateField({
  label,
  value,
  min,
  onChange,
}: {
  label: string;
  value: string;
  min?: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="flex flex-col gap-1">
      <span className="font-mono text-[10px] uppercase tracking-editorial text-ink-faint">
        {label}
      </span>
      <input
        type="date"
        value={value}
        min={min}
        onChange={(e) => onChange(e.target.value)}
        className="font-mono text-[13px] text-ink outline-none"
        style={{
          border: '0.5px solid var(--color-border)',
          borderRadius: 'var(--radius-md)',
          background: 'var(--color-card)',
          padding: '10px 12px',
        }}
      />
    </label>
  );
}

/* ---- Section C — cities ---------------------------------------------------- */

function CitySection({
  tripConfig,
  setTripConfig,
}: {
  tripConfig: TripConfig;
  setTripConfig: (c: Partial<TripConfig>) => void;
}) {
  const selected = tripConfig.cities;

  const toggleCity = (id: string) => {
    const next = selected.includes(id)
      ? selected.filter((c) => c !== id)
      : [...selected, id];
    setTripConfig({ cities: next });
  };

  const move = (index: number, dir: -1 | 1) => {
    const next = [...selected];
    const target = index + dir;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target]!, next[index]!];
    setTripConfig({ cities: next });
  };

  return (
    <section>
      <SectionLabel>選擇城市</SectionLabel>
      <p className="-mt-2 mb-3 font-mono text-[11px] text-ink-faint">
        可多選，依序加入行程
      </p>

      <div className="grid grid-cols-2 gap-2">
        {CITY_OPTIONS.map((city) => {
          const isSelected = selected.includes(city.id);
          const order = selected.indexOf(city.id) + 1;
          const Icon = city.icon;
          return (
            <button
              key={city.id}
              type="button"
              onClick={() => toggleCity(city.id)}
              aria-pressed={isSelected}
              className={cn(
                'card card-hover relative flex items-center gap-2.5 text-left transition-colors',
                isSelected && 'border-transparent bg-lime',
              )}
              style={{ padding: '12px 14px' }}
            >
              <Icon
                size={22}
                strokeWidth={1.6}
                className={isSelected ? 'text-lime-deep' : 'text-ink-muted'}
              />
              <span className="min-w-0">
                <span
                  className={cn(
                    'block truncate font-chinese text-[14px] font-medium leading-tight',
                    isSelected ? 'text-lime-deep' : 'text-ink',
                  )}
                >
                  {city.zh}
                </span>
                <span
                  className={cn(
                    'block truncate font-mono text-[10px] uppercase tracking-editorial',
                    isSelected ? 'text-lime-dark' : 'text-ink-faint',
                  )}
                >
                  {city.en}
                </span>
              </span>
              {isSelected && (
                <span
                  className="absolute right-1.5 top-1.5 flex h-4 w-4 items-center justify-center rounded-pill bg-lime-deep font-mono text-[9px] text-lime"
                  aria-hidden
                >
                  {order}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Reorder list */}
      {selected.length > 1 && (
        <div className="mt-3 flex flex-col gap-1.5">
          <p className="font-mono text-[10px] uppercase tracking-editorial text-ink-faint">
            行程順序
          </p>
          {selected.map((id, i) => (
            <div
              key={id}
              className="flex items-center justify-between gap-2 rounded px-3 py-2"
              style={{
                background: 'var(--color-card)',
                border: '0.5px solid var(--color-border)',
              }}
            >
              <span className="flex items-center gap-2 font-chinese text-[13px] text-ink">
                <span className="font-mono text-[11px] text-ink-faint">
                  {String(i + 1).padStart(2, '0')}
                </span>
                {cityLabel(id).zh}
              </span>
              <span className="flex items-center gap-1">
                <ReorderButton
                  ariaLabel="上移"
                  disabled={i === 0}
                  onClick={() => move(i, -1)}
                >
                  <ChevronUp size={14} />
                </ReorderButton>
                <ReorderButton
                  ariaLabel="下移"
                  disabled={i === selected.length - 1}
                  onClick={() => move(i, 1)}
                >
                  <ChevronDown size={14} />
                </ReorderButton>
              </span>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

function ReorderButton({
  ariaLabel,
  disabled,
  onClick,
  children,
}: {
  ariaLabel: string;
  disabled: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={ariaLabel}
      disabled={disabled}
      onClick={onClick}
      className="flex h-6 w-6 items-center justify-center rounded-pill text-ink-muted transition hover:bg-lime hover:text-lime-deep disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-ink-muted"
    >
      {children}
    </button>
  );
}

/* ---- Section D — travelers ------------------------------------------------- */

function TravelersSection({
  tripConfig,
  setTripConfig,
}: {
  tripConfig: TripConfig;
  setTripConfig: (c: Partial<TripConfig>) => void;
}) {
  const setTravelers = (n: number) =>
    setTripConfig({ travelers: clamp(n, 1, 10) });

  return (
    <section>
      <SectionLabel>旅伴</SectionLabel>
      <div className="flex flex-wrap items-center gap-3">
        <span className="inline-flex items-center gap-1.5 rounded-pill bg-cream px-3 py-1.5 font-mono text-[11px] uppercase tracking-editorial text-ink-muted" style={{ border: '0.5px solid var(--color-border)' }}>
          <Calendar size={12} />
          {tripConfig.days} 天
        </span>

        <div
          className="flex items-center gap-2 rounded-pill px-2 py-1"
          style={{ background: 'var(--color-card)', border: '0.5px solid var(--color-border)' }}
        >
          <StepButton
            ariaLabel="減少人數"
            disabled={tripConfig.travelers <= 1}
            onClick={() => setTravelers(tripConfig.travelers - 1)}
          >
            <Minus size={13} />
          </StepButton>
          <span className="min-w-[3.5rem] text-center font-chinese text-[13px] text-ink">
            {tripConfig.travelers} 人
          </span>
          <StepButton
            ariaLabel="增加人數"
            disabled={tripConfig.travelers >= 10}
            onClick={() => setTravelers(tripConfig.travelers + 1)}
          >
            <Plus size={13} />
          </StepButton>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {TRAVELER_TYPES.map((tt) => {
          const active = tripConfig.travelerType === tt.id;
          return (
            <button
              key={tt.id}
              type="button"
              onClick={() => setTripConfig({ travelerType: tt.id })}
              className={cn(
                'rounded-pill px-4 py-1.5 font-chinese text-[13px] transition-colors',
                active ? 'bg-lime font-medium text-lime-deep' : 'text-ink-muted hover:text-ink',
              )}
              style={active ? undefined : { border: '0.5px solid var(--color-border-med)' }}
            >
              {tt.label}
            </button>
          );
        })}
      </div>
    </section>
  );
}

function StepButton({
  ariaLabel,
  disabled,
  onClick,
  children,
}: {
  ariaLabel: string;
  disabled: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={ariaLabel}
      disabled={disabled}
      onClick={onClick}
      className="flex h-7 w-7 items-center justify-center rounded-pill bg-lime text-lime-deep transition hover:bg-[#C2DAAC] active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-lime"
    >
      {children}
    </button>
  );
}

/* ---- Section E — interests ------------------------------------------------- */

function InterestsSection() {
  const activeCategories = useStore((s) => s.activeCategories);
  const toggleCategory = useStore((s) => s.toggleCategory);

  return (
    <section>
      <SectionLabel>旅行偏好</SectionLabel>
      <div className="grid grid-cols-4 gap-2">
        {CATEGORY_ORDER.map((id: AttractionCategory) => {
          const meta = CATEGORY_META[id];
          const Icon = meta.icon;
          const active = activeCategories.includes(id);
          return (
            <button
              key={id}
              type="button"
              onClick={() => toggleCategory(id)}
              aria-pressed={active}
              title={meta.zh}
              className={cn(
                'card flex flex-col items-center justify-center gap-1 transition-all duration-200',
                active && 'border-transparent bg-lime scale-[1.04]',
              )}
              style={{ padding: '8px 4px', minHeight: 56 }}
            >
              <Icon
                size={18}
                strokeWidth={1.8}
                className={active ? 'text-lime-deep' : 'text-ink-muted'}
              />
              <span
                className={cn(
                  'font-chinese text-[10px] font-medium leading-none',
                  active ? 'text-lime-deep' : 'text-ink-muted',
                )}
              >
                {meta.zh}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}

/* ---- Section F — budget ---------------------------------------------------- */

function BudgetSection({
  tripConfig,
  setTripConfig,
}: {
  tripConfig: TripConfig;
  setTripConfig: (c: Partial<TripConfig>) => void;
}) {
  const exchangeRate = useStore((s) => s.exchangeRate);
  const twd = tripConfig.totalBudget
    ? Math.round(tripConfig.totalBudget * exchangeRate)
    : 0;

  return (
    <section>
      <SectionLabel>預算範圍</SectionLabel>
      <div className="flex flex-wrap gap-2">
        {BUDGET_OPTIONS.map((b) => {
          const active = tripConfig.budget === b.id;
          return (
            <button
              key={b.id}
              type="button"
              onClick={() => setTripConfig({ budget: active ? null : b.id })}
              className={cn(
                'flex items-center gap-1.5 rounded-pill px-3.5 py-1.5 font-chinese text-[13px] transition-colors',
                active ? 'bg-lime font-medium text-lime-deep' : 'text-ink-muted hover:text-ink',
              )}
              style={active ? undefined : { border: '0.5px solid var(--color-border-med)' }}
            >
              {b.zh}
              <span className="font-mono text-[12px] opacity-70">{b.euro}</span>
            </button>
          );
        })}
      </div>

      <div className="mt-3">
        <label className="flex items-center gap-2 rounded px-3 py-2.5" style={{ background: 'var(--color-card)', border: '0.5px solid var(--color-border)' }}>
          <span className="font-mono text-[13px] text-ink-muted">€</span>
          <input
            type="number"
            min={0}
            inputMode="numeric"
            placeholder="輸入總預算"
            value={tripConfig.totalBudget ?? ''}
            onChange={(e) =>
              setTripConfig({
                totalBudget: e.target.value ? Number(e.target.value) : undefined,
              })
            }
            className="min-w-0 flex-1 bg-transparent font-mono text-[13px] text-ink outline-none placeholder:text-ink-faint"
          />
          {twd > 0 && (
            <span className="shrink-0 font-mono text-[12px] text-ink-faint">
              ≈ {formatTWD(twd)}
            </span>
          )}
        </label>
      </div>
    </section>
  );
}

/* ---- Section G — accommodation --------------------------------------------- */

function AccommodationSection({
  tripConfig,
  setTripConfig,
}: {
  tripConfig: TripConfig;
  setTripConfig: (c: Partial<TripConfig>) => void;
}) {
  const on = tripConfig.includeAccommodation;
  const tags = tripConfig.accommodationTags;

  const toggleTag = (id: AccTag) => {
    const next = tags.includes(id)
      ? tags.filter((t) => t !== id)
      : [...tags, id];
    setTripConfig({ accommodationTags: next });
  };

  return (
    <section>
      <div className="flex items-center justify-between">
        <SectionLabel>包含住宿推薦</SectionLabel>
        <button
          type="button"
          role="switch"
          aria-checked={on}
          onClick={() => setTripConfig({ includeAccommodation: !on })}
          className="relative inline-flex h-6 w-11 items-center rounded-pill transition-colors"
          style={{ background: on ? 'var(--color-sage)' : 'var(--color-border-med)' }}
        >
          <span
            className="inline-block h-5 w-5 rounded-pill bg-white shadow-card transition-transform"
            style={{ transform: on ? 'translateX(22px)' : 'translateX(2px)' }}
          />
        </button>
      </div>

      {on && (
        <div className="flex flex-wrap gap-2">
          {ACCOMMODATION_TAGS.map((tag) => {
            const active = tags.includes(tag.id);
            return (
              <button
                key={tag.id}
                type="button"
                onClick={() => toggleTag(tag.id)}
                className={cn(
                  'rounded-pill px-3.5 py-1.5 font-chinese text-[13px] transition-colors',
                  active ? 'bg-lime font-medium text-lime-deep' : 'text-ink-muted hover:text-ink',
                )}
                style={active ? undefined : { border: '0.5px solid var(--color-border-med)' }}
              >
                {tag.label}
              </button>
            );
          })}
        </div>
      )}
    </section>
  );
}

/* ---- Section H — chatbot --------------------------------------------------- */

function ChatbotSection() {
  return (
    <section>
      <div className="mb-4 flex items-center gap-3">
        <span className="h-px flex-1" style={{ background: 'var(--color-border)' }} />
        <span className="font-chinese text-[12px] text-ink-faint">
          或者，直接告訴我你的需求
        </span>
        <span className="h-px flex-1" style={{ background: 'var(--color-border)' }} />
      </div>
      <PlanChatbot />
    </section>
  );
}

/* ===========================================================================
   RIGHT PANEL
   =========================================================================== */

function RightPanel() {
  const itinerary = useStore((s) => s.itinerary);
  const [selectedDay, setSelectedDay] = useState(0);

  useEffect(() => {
    if (selectedDay >= itinerary.length) setSelectedDay(0);
  }, [itinerary.length, selectedDay]);

  const day = itinerary[selectedDay] ?? itinerary[0];
  const prevDay = selectedDay > 0 ? itinerary[selectedDay - 1] : undefined;

  return (
    <div
      id="itinerary-preview"
      className="flex-1 md:h-full md:overflow-y-auto"
      style={{ background: 'var(--color-card)' }}
    >
      {itinerary.length === 0 ? (
        <EmptyPreview />
      ) : (
        <div className="flex flex-col gap-5 px-6 py-6">
          <BudgetCalculator />
          <ShareBar />
          <DayTabs
            days={itinerary}
            selected={selectedDay}
            onSelect={setSelectedDay}
          />
          {day && <DailyView day={day} prevDay={prevDay} />}
        </div>
      )}
    </div>
  );
};

/* ---- Empty state ----------------------------------------------------------- */

function EmptyPreview() {
  return (
    <div className="relative flex h-full min-h-[420px] flex-col items-center justify-center px-6 text-center">
      <span
        aria-hidden
        className="pointer-events-none absolute select-none font-serif"
        style={{ fontSize: 120, lineHeight: 1, opacity: 0.05, color: 'var(--color-ink)' }}
      >
        ✈
      </span>
      <p className="relative font-chinese text-[16px] text-ink-muted">
        填寫左側設定，立即預覽行程
      </p>
      <div className="relative mt-5 flex flex-wrap justify-center gap-2">
        {['🗺 互動地圖', '💬 語言小卡', '💰 預算試算'].map((p) => (
          <span
            key={p}
            className="rounded-pill px-3 py-1.5 font-chinese text-[12px] text-ink-muted"
            style={{ border: '0.5px solid var(--color-border-med)' }}
          >
            {p}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ---- Share bar ------------------------------------------------------------- */

function ShareBar() {
  const generateShareLink = useStore((s) => s.generateShareLink);
  const [open, setOpen] = useState(false);
  const [link, setLink] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [toast, setToast] = useState(false);

  // Step 1: generate the link, step 2: reveal the share popover.
  const openShare = () => {
    setLink((prev) => prev ?? generateShareLink());
    setOpen(true);
  };

  const copy = () => {
    if (!link) return;
    void navigator.clipboard?.writeText(link);
    setCopied(true);
    setToast(true);
    window.setTimeout(() => setCopied(false), 2000);
    window.setTimeout(() => setToast(false), 3000);
  };

  return (
    <div className="relative flex flex-wrap items-center gap-3">
      <span className="font-mono text-[11px] uppercase tracking-editorial text-ink-faint">
        分享此行程
      </span>
      <button
        type="button"
        onClick={openShare}
        className="btn-secondary"
        style={{ padding: '6px 14px', fontSize: 12 }}
      >
        <Link2 size={13} />
        複製連結 🔗
      </button>

      {/* Floating share popover */}
      {open && link && (
        <div
          className="float-card absolute z-50"
          style={{ top: 'calc(100% + 8px)', left: 0, width: 300 }}
        >
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="關閉"
            className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-pill text-ink-muted transition hover:bg-cream hover:text-ink"
          >
            <X size={15} />
          </button>

          <h3 className="mb-2 font-serif text-[20px] italic text-ink">
            分享此行程
          </h3>

          <input
            type="text"
            readOnly
            value={link}
            onFocus={(e) => e.currentTarget.select()}
            className="w-full bg-cream font-mono text-[11px] text-ink-muted outline-none"
            style={{
              border: '0.5px solid var(--color-border)',
              borderRadius: 'var(--radius-md)',
              padding: '8px 10px',
            }}
          />

          <div className="mt-2 flex gap-2">
            <button
              type="button"
              onClick={copy}
              className="btn-primary flex-1 justify-center"
              style={{ padding: '7px 12px', fontSize: 12 }}
            >
              {copied ? <Check size={13} /> : <Copy size={13} />}
              {copied ? '已複製 ✓' : '複製'}
            </button>
            <button
              type="button"
              onClick={() => setShowQR((v) => !v)}
              className="btn-secondary"
              style={{ padding: '7px 12px', fontSize: 12 }}
            >
              <QrCode size={13} />
              {showQR ? '隱藏 QR' : '分享 QR Code'}
            </button>
          </div>

          {showQR && (
            <div className="mt-3 flex justify-center">
              <div
                className="bg-white p-2.5"
                style={{ borderRadius: 'var(--radius-md)', border: '0.5px solid var(--color-border)' }}
              >
                <QRCodeCanvas value={link} size={160} fgColor="#1A1A1A" bgColor="#FFFFFF" />
              </div>
            </div>
          )}

          <div className="mt-3 flex items-center gap-2">
            <span className="h-px flex-1" style={{ background: 'var(--color-border)' }} />
          </div>
          <p className="mt-2 text-center font-chinese text-[12px] text-ink-muted">
            同行者可以對景點投票 🗳
          </p>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div
          role="status"
          aria-live="polite"
          className="toast-in fixed bottom-6 left-1/2 z-[60] -translate-x-1/2 rounded-pill px-4 py-2 font-chinese text-[13px] font-medium text-lime-deep shadow-float"
          style={{ background: 'var(--color-lime)' }}
        >
          分享連結已複製 ✓
        </div>
      )}
    </div>
  );
}

/* ---- Day tabs -------------------------------------------------------------- */

function DayTabs({
  days,
  selected,
  onSelect,
}: {
  days: DayPlan[];
  selected: number;
  onSelect: (i: number) => void;
}) {
  const startDate = useStore((s) => s.tripConfig.startDate);

  return (
    <div
      className="scrollbar-hidden flex gap-1 overflow-x-auto p-1.5"
      style={{
        background: 'var(--color-cream)',
        border: '0.5px solid var(--color-border)',
        borderRadius: 'var(--radius-pill)',
      }}
    >
      {days.map((day, i) => {
        const date = startDate ? addDaysISO(startDate, day.day - 1) : null;
        const topTip = date ? getSeasonalTipsForDay(date, day.city)[0] : undefined;
        return (
          <button
            key={day.day}
            type="button"
            onClick={() => onSelect(i)}
            className={cn(
              'shrink-0 whitespace-nowrap rounded-pill px-4 py-2 font-chinese text-[13px] transition-colors',
              selected === i ? 'bg-lime font-medium text-lime-deep' : 'text-ink-muted hover:text-ink',
            )}
          >
            Day {day.day} · {cityLabel(day.city).zh}
            {topTip && (
              <span
                aria-hidden
                className="ml-1.5 inline-block rounded-pill align-middle"
                style={{ width: 6, height: 6, background: SEASONAL_TYPE_COLOR[topTip.type] }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}

/* ---- Daily view ------------------------------------------------------------ */

function DailyView({ day, prevDay }: { day: DayPlan; prevDay?: DayPlan }) {
  const travelers = useStore((s) => s.tripConfig.travelers);
  const includeAccommodation = useStore((s) => s.tripConfig.includeAccommodation);
  const exchangeRate = useStore((s) => s.exchangeRate);
  const startDate = useStore((s) => s.tripConfig.startDate);

  const date = startDate ? addDaysISO(startDate, day.day - 1) : null;
  const events = date ? getSeasonalTipsForDay(date, day.city) : [];
  const eur = dayBudgetEUR(day, prevDay, travelers);
  const dayTotalTWD =
    (eur.transport + eur.tickets + eur.food) * exchangeRate;

  return (
    <section className="flex flex-col gap-4">
      {events.map((tip, i) => (
        <div
          key={tip.title.zh}
          className="tip-slide-down"
          style={{ ['--index' as string]: i } as CSSProperties}
        >
          <SeasonalBanner tip={tip} />
        </div>
      ))}

      {day.attractions.length === 0 ? (
        <div className="card text-center">
          <p className="font-chinese text-[14px] text-ink-muted">
            這天還沒有安排景點 — 試試多選一個城市、放寬偏好或增加天數。
          </p>
        </div>
      ) : (
        <ol className="flex flex-col">
          {day.attractions.map((a, i) => (
            <li
              key={a.id}
              className="stagger-item"
              style={{ ['--index' as string]: i } as CSSProperties}
            >
              <AttractionRow attraction={a} />
              {i < day.attractions.length - 1 && (
                <TransportConnector from={a} to={day.attractions[i + 1]!} />
              )}
            </li>
          ))}
        </ol>
      )}

      {includeAccommodation && <AccommodationCard day={day} />}

      {/* Daily budget row */}
      <div
        className="flex flex-wrap items-center justify-between gap-2 rounded px-4 py-2.5"
        style={{ background: 'var(--color-cream)' }}
      >
        <span className="font-mono text-[12px] text-ink">
          今日費用預估: {formatTWD(dayTotalTWD)}
        </span>
        <span className="font-mono text-[11px] text-ink-faint">
          交通 {formatTWD(eur.transport * exchangeRate)} · 票價{' '}
          {formatTWD(eur.tickets * exchangeRate)} · 餐飲{' '}
          {formatTWD(eur.food * exchangeRate)}
        </span>
      </div>
    </section>
  );
}

/** Seasonal event banner — right-panel day view, lime-green left border. */
function SeasonalBanner({ tip }: { tip: SeasonalTip }) {
  const localized = useLocalizedField();
  const Icon = resolveSeasonalIcon(tip.icon);
  return (
    <div
      className="card flex items-start gap-2.5"
      style={{ borderLeft: '4px solid var(--color-lime-deep)', padding: '12px 16px' }}
    >
      <Icon size={16} strokeWidth={2} className="mt-0.5 shrink-0 text-lime-deep" />
      <div>
        <p className="font-chinese text-[14px] font-medium text-ink">
          {localized(tip.title)}
        </p>
        <p className="mt-0.5 font-chinese text-[12px] leading-relaxed text-ink-muted">
          {localized(tip.description)}
        </p>
      </div>
    </div>
  );
}

/* ---- Attraction row -------------------------------------------------------- */

function AttractionRow({ attraction }: { attraction: Attraction }) {
  const navigate = useNavigate();
  const localized = useLocalizedField();
  const exchangeRate = useStore((s) => s.exchangeRate);
  const collaborativeData = useStore((s) => s.collaborativeData);
  const setSelectedAttraction = useStore((s) => s.setSelectedAttraction);
  const [showCards, setShowCards] = useState(false);

  // The itinerary may hold frozen Attraction references from when the trip was
  // generated (especially the sample itinerary, picked at module-load time).
  // Re-resolve by slug each render so edits to attractions.ts (e.g. updated
  // imageUrl) flow through to the PlanPage thumbnail in real time.
  const live = attractions.find((a) => a.slug === attraction.slug) ?? attraction;

  const meta = primaryCategory(live.category);
  const city = cityLabel(live.city);
  const ticket = live.ticketPrice;

  const goToMap = () => {
    setSelectedAttraction(live);
    navigate('/map');
  };

  return (
    <article className="card card-hover overflow-hidden" style={{ padding: 0 }}>
      <div className="flex gap-0">
        <div className="relative shrink-0 overflow-hidden" style={{ width: 110 }}>
          <img
            src={live.imageUrl}
            alt={localized(live.name)}
            loading="lazy"
            className="h-full w-full object-cover"
            style={{ borderRadius: 0 }}
          />
        </div>

        <div className="min-w-0 flex-1 px-4 py-3">
          <div className="mb-1 flex flex-wrap items-center gap-2">
            <span
              className="rounded-pill px-2 py-0.5 font-mono uppercase tracking-editorial"
              style={{ background: 'var(--color-lime)', color: 'var(--color-lime-deep)', fontSize: 10 }}
            >
              {city.en}
            </span>
            <span className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-editorial text-ink-faint">
              <span aria-hidden className="inline-block rounded-pill" style={{ width: 6, height: 6, background: meta.color }} />
              {meta.en}
            </span>
          </div>

          <Link
            to={`/attraction/${live.slug}`}
            className="group inline-flex items-baseline gap-1"
          >
            <h3 className="font-chinese text-[16px] font-semibold leading-snug text-ink group-hover:text-lime-deep">
              {localized(live.name)}
            </h3>
            <ArrowUpRight size={13} className="text-ink-faint group-hover:text-lime-deep" />
          </Link>

          {ticket && (
            <p className="mt-1 font-mono text-[11px] text-ink-faint">
              {ticket.freeEntry ? (
                <span className="text-lime-dark">免費入場</span>
              ) : (
                <>
                  € {ticket.adult.EUR}
                  <span className="ml-1">
                    ({formatTWD(ticket.adult.EUR * exchangeRate)})
                  </span>
                </>
              )}
              {ticket.bookingUrl && (
                <a
                  href={ticket.bookingUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="ml-2 text-lime-deep underline-offset-2 hover:underline"
                >
                  訂票
                </a>
              )}
            </p>
          )}

          <div className="mt-2 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setShowCards((v) => !v)}
              className="btn-secondary"
              style={{ padding: '5px 10px', fontSize: 11 }}
            >
              <Languages size={11} />
              {showCards ? '收起' : '語言小卡'}
            </button>
            <button
              type="button"
              onClick={goToMap}
              className="btn-secondary"
              style={{ padding: '5px 10px', fontSize: 11 }}
            >
              <Compass size={11} />
              地圖
            </button>
          </div>
        </div>
      </div>

      {showCards && (
        <div className="border-t py-4">
          {live.languageCards.length > 0 ? (
            <div
              className="scrollbar-hidden flex gap-3 overflow-x-auto px-4 pb-1"
              style={{ scrollSnapType: 'x mandatory' }}
            >
              {live.languageCards.map((card) => (
                <div
                  key={card.id}
                  className="shrink-0"
                  style={{ scrollSnapAlign: 'start', width: 280 }}
                >
                  <LanguageCard card={card} />
                </div>
              ))}
            </div>
          ) : (
            <p className="px-4 text-center font-chinese text-[13px] text-ink-faint">
              這個景點還沒有語言小卡。
            </p>
          )}
        </div>
      )}

      {collaborativeData && <VoteRow attractionId={live.id} />}
    </article>
  );
}

/* ---- Vote row (collaborative mode) ----------------------------------------- */

function VoteRow({ attractionId }: { attractionId: string }) {
  const collaborativeData = useStore((s) => s.collaborativeData);
  const submitVote = useStore((s) => s.submitVote);
  const getVoterSessionId = useStore((s) => s.getVoterSessionId);

  const entry = collaborativeData?.votes.find(
    (v) => v.attractionId === attractionId,
  );
  const up = entry?.votes.up ?? 0;
  const down = entry?.votes.down ?? 0;
  const voted = entry?.voterIds.includes(getVoterSessionId()) ?? false;

  return (
    <div className="flex items-center gap-2 border-t px-4 py-2.5">
      <VoteButton
        active={voted}
        disabled={voted}
        onClick={() => submitVote(attractionId, 'up')}
      >
        <ThumbsUp size={12} /> {up}
      </VoteButton>
      <VoteButton
        active={voted}
        disabled={voted}
        onClick={() => submitVote(attractionId, 'down')}
      >
        <ThumbsDown size={12} /> {down}
      </VoteButton>
      {voted && (
        <span className="font-mono text-[10px] uppercase tracking-editorial text-ink-faint">
          已投票
        </span>
      )}
    </div>
  );
}

function VoteButton({
  active,
  disabled,
  onClick,
  children,
}: {
  active: boolean;
  disabled: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={cn(
        'flex items-center gap-1 rounded-pill px-3 py-1 font-mono text-[12px] transition',
        active ? 'bg-lime text-lime-deep' : 'text-ink-muted hover:text-ink',
        disabled && 'cursor-not-allowed',
      )}
      style={active ? undefined : { border: '0.5px solid var(--color-border-med)' }}
    >
      {children}
    </button>
  );
}

/* ---- Accommodation card ---------------------------------------------------- */

function AccommodationCard({ day }: { day: DayPlan }) {
  const localized = useLocalizedField();
  const exchangeRate = useStore((s) => s.exchangeRate);
  const acc = day.accommodation;

  if (!acc) {
    return (
      <div
        className="flex items-center justify-between gap-3 rounded px-4 py-3"
        style={{ background: 'var(--color-card)', borderLeft: '4px solid #8B6F9B', border: '0.5px solid var(--color-border)' }}
      >
        <span className="flex items-center gap-2 font-chinese text-[13px] text-ink-muted">
          <BedDouble size={15} />
          今晚住宿尚未選擇
        </span>
        <button type="button" className="btn-secondary" style={{ padding: '5px 12px', fontSize: 12 }}>
          選擇住宿 +
        </button>
      </div>
    );
  }

  return (
    <div
      className="rounded px-4 py-3"
      style={{ background: 'var(--color-card)', borderLeft: '4px solid #8B6F9B', border: '0.5px solid var(--color-border)' }}
    >
      <p className="font-mono text-[10px] uppercase tracking-editorial text-ink-faint">
        今晚住宿
      </p>
      <div className="mt-1 flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate font-chinese text-[14px] font-medium text-ink">
            {localized(acc.name)}
          </p>
          {acc.stars && (
            <span className="flex items-center gap-0.5 text-[#D4A84B]">
              {Array.from({ length: acc.stars }).map((_, i) => (
                <Star key={i} size={11} fill="currentColor" strokeWidth={0} />
              ))}
            </span>
          )}
        </div>
        <div className="shrink-0 text-right">
          <p className="font-mono text-[13px] text-ink">
            € {acc.pricePerNight.EUR}
            <span className="font-chinese text-[11px] text-ink-faint"> /晚</span>
          </p>
          <p className="font-mono text-[11px] text-ink-faint">
            {formatTWD(acc.pricePerNight.EUR * exchangeRate)}
          </p>
        </div>
      </div>
      <a
        href={acc.bookingUrl}
        target="_blank"
        rel="noreferrer"
        className="mt-1 inline-block font-mono text-[11px] text-lime-deep underline-offset-2 hover:underline"
      >
        查看 →
      </a>
    </div>
  );
}

/* ---- Transport connector --------------------------------------------------- */

function TransportConnector({ from, to }: { from: Attraction; to: Attraction }) {
  const { type, duration, route } = estimateTransport(from, to);
  const Icon =
    type === 'train'
      ? Train
      : type === 'bus'
        ? Bus
        : type === 'walk'
          ? Footprints
          : Car;

  return (
    <div className="relative flex items-center justify-center" style={{ height: 44 }}>
      <span
        aria-hidden
        className="absolute left-1/2 top-0 h-full"
        style={{ width: 1, marginLeft: -0.5, borderLeft: '1px dashed var(--color-border-med)' }}
      />
      <span
        className="relative z-[1] inline-flex items-center gap-2"
        style={{
          background: 'rgba(255, 255, 255, 0.92)',
          border: '0.5px solid var(--color-border)',
          borderRadius: 'var(--radius-pill)',
          padding: '4px 12px',
          boxShadow: 'var(--shadow-card)',
        }}
      >
        <Icon size={13} className="text-ink-muted" strokeWidth={1.8} />
        <span className="font-mono text-[11px] font-medium text-ink">{duration}</span>
        <span className="font-chinese text-[11px] text-ink-faint">· {route}</span>
      </span>
    </div>
  );
}

/* ---- Transport estimation -------------------------------------------------
   Inter-city legs use real driving times from Google Maps (normal traffic),
   keyed by a sorted city-pair. Anything not in the table falls back to a
   road-distance estimate. Within a city, Vienna/Prague hops are public transit
   (U-Bahn / metro / tram) and short hops are walked.
   --------------------------------------------------------------------------- */

function haversineKm(
  a: { lat: number; lng: number },
  b: { lat: number; lng: number },
): number {
  const R = 6371;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const x =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
}

/** Real driving minutes between cities (Google Maps, normal traffic). */
const ROAD_LEG_MIN: Record<string, number> = {
  'cesky-krumlov|vienna': 165,
  'cesky-krumlov|prague': 135,
  'prague|salzburg': 248,
  'konigssee|salzburg': 35,
  'gosau|salzburg': 80,
  'gosau|hallstatt': 25,
  'hallstatt|salzburg': 75,
  'hallstatt|melk': 135,
  'durnstein|melk': 35,
  'durnstein|vienna': 75,
  'melk|vienna': 70,
  'salzburg|vienna': 180,
  'hallstatt|vienna': 225,
  'hallstatt|konigssee': 80,
  'gosau|melk': 150,
};

function fmtMin(totalMin: number): string {
  const h = Math.floor(totalMin / 60);
  const m = totalMin % 60;
  return h > 0 ? `${h}h ${m.toString().padStart(2, '0')}min` : `${m}min`;
}

function estimateTransport(
  from: Attraction,
  to: Attraction,
): { type: 'train' | 'bus' | 'car' | 'walk'; duration: string; route: string } {
  const fromLabel = cityLabel(from.city).zh;
  const toLabel = cityLabel(to.city).zh;

  // ---- Inter-city: real driving time (road trip) -------------------------
  if (from.city !== to.city) {
    const key = [from.city, to.city].sort().join('|');
    const min =
      ROAD_LEG_MIN[key] ??
      Math.max(
        15,
        Math.round((haversineKm(from.coordinates, to.coordinates) * 1.3) / 75 * 60),
      );
    return { type: 'car', duration: fmtMin(min), route: `${fromLabel} → ${toLabel}` };
  }

  // ---- Within a city -----------------------------------------------------
  const roadKm = haversineKm(from.coordinates, to.coordinates) * 1.4;

  // Short hop → walk.
  if (roadKm < 0.9) {
    const min = Math.max(4, Math.round((roadKm / 4.8) * 60));
    return { type: 'walk', duration: fmtMin(min), route: `${fromLabel}市內 · 步行` };
  }

  // Vienna U-Bahn / Prague metro & tram (~6 min access + ride).
  if (from.city === 'vienna' || from.city === 'prague') {
    const min = Math.round((roadKm / 19) * 60) + 6;
    const label = from.city === 'vienna' ? 'U-Bahn' : '地鐵/電車';
    return { type: 'train', duration: fmtMin(min), route: `${fromLabel}市內 · ${label}` };
  }

  // Other towns (Salzburg, Hallstatt, Wachau villages) — walkable old towns.
  const min = Math.max(5, Math.round((roadKm / 4.8) * 60));
  return { type: 'walk', duration: fmtMin(min), route: `${fromLabel}市內 · 步行` };
}
