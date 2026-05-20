import { type CSSProperties } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Headphones,
  Palette,
  Mountain,
  Building2,
  Coffee,
  TreePine,
  ShoppingBag,
  BookOpen,
  Minus,
  Plus,
  ArrowUpRight,
  type LucideIcon,
} from 'lucide-react';
import { useStore } from '../store';
import { attractions } from '../data/attractions';
import type { AttractionCategory, TripConfig } from '../types';
import { cn } from '../utils/cn';

const DAYS_MIN = 3;
const DAYS_MAX = 14;
const TRAVELERS_MIN = 1;
const TRAVELERS_MAX = 10;

type CategoryMeta = {
  id: AttractionCategory;
  icon: LucideIcon;
  zh: string;
  en: string;
};

// Bilingual labels are baked in (not pulled from i18n) because the card
// intentionally shows both ZH + EN regardless of the active UI language —
// it's a design element, not a translation choice.
const CATEGORIES: CategoryMeta[] = [
  { id: 'music', icon: Headphones, zh: '音樂演出', en: 'Music' },
  { id: 'art', icon: Palette, zh: '藝術博物館', en: 'Art' },
  { id: 'scenery', icon: Mountain, zh: '自然風景', en: 'Scenery' },
  { id: 'architecture', icon: Building2, zh: '建築', en: 'Architecture' },
  { id: 'food', icon: Coffee, zh: '美食咖啡', en: 'Food' },
  { id: 'outdoor', icon: TreePine, zh: '戶外活動', en: 'Outdoor' },
  { id: 'shopping', icon: ShoppingBag, zh: '購物市集', en: 'Shopping' },
  { id: 'history', icon: BookOpen, zh: '歷史文化', en: 'History' },
];

const START_CITIES: { id: TripConfig['startCity']; label: string }[] = [
  { id: 'vienna', label: '維也納 · Vienna' },
  { id: 'salzburg', label: '薩爾斯堡 · Salzburg' },
];

export function FilterPanel() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const tripConfig = useStore((s) => s.tripConfig);
  const setTripConfig = useStore((s) => s.setTripConfig);
  const activeCategories = useStore((s) => s.activeCategories);
  const toggleCategory = useStore((s) => s.toggleCategory);
  const generateItinerary = useStore((s) => s.generateItinerary);

  const setDays = (next: number) =>
    setTripConfig({ days: clamp(next, DAYS_MIN, DAYS_MAX) });
  const setTravelers = (next: number) =>
    setTripConfig({ travelers: clamp(next, TRAVELERS_MIN, TRAVELERS_MAX) });

  const handleGenerate = () => {
    generateItinerary(attractions);
    navigate('/itinerary');
  };

  return (
    <div className="mx-auto max-w-[680px] px-6 py-12 sm:py-16">
      {/* ============ SECTION 1 — Duration & Travelers ============ */}
      <div
        className="panel-section grid grid-cols-1 gap-4 sm:grid-cols-2"
        style={{ animationDelay: '0s' }}
      >
        <Stepper
          label={t('filter.days')}
          value={tripConfig.days}
          onDecrement={() => setDays(tripConfig.days - 1)}
          onIncrement={() => setDays(tripConfig.days + 1)}
          atMin={tripConfig.days <= DAYS_MIN}
          atMax={tripConfig.days >= DAYS_MAX}
        />
        <Stepper
          label={t('filter.travelers')}
          value={tripConfig.travelers}
          onDecrement={() => setTravelers(tripConfig.travelers - 1)}
          onIncrement={() => setTravelers(tripConfig.travelers + 1)}
          atMin={tripConfig.travelers <= TRAVELERS_MIN}
          atMax={tripConfig.travelers >= TRAVELERS_MAX}
        />
      </div>

      {/* ============ SECTION 2 — Start city ============ */}
      <section
        className="panel-section mt-12"
        style={{ animationDelay: '0.15s' }}
      >
        <h3 className="mb-3 font-chinese text-[15px] font-medium text-ink">
          {t('filter.startCity')}
        </h3>
        <div className="flex flex-col gap-3 sm:flex-row">
          {START_CITIES.map((city) => (
            <CityButton
              key={city.id}
              label={city.label}
              selected={tripConfig.startCity === city.id}
              onClick={() => setTripConfig({ startCity: city.id })}
            />
          ))}
        </div>
      </section>

      {/* ============ SECTION 3 — Interests ============ */}
      <section
        className="panel-section mt-12"
        style={{ animationDelay: '0.3s' }}
      >
        <h2 className="font-serif text-[28px] italic leading-tight text-ink">
          {t('filter.experience')}
        </h2>
        <p className="mb-6 mt-2 font-chinese text-[14px] text-ink-muted">
          {t('filter.experienceSub')}
        </p>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {CATEGORIES.map((cat) => (
            <CategoryCard
              key={cat.id}
              meta={cat}
              selected={activeCategories.includes(cat.id)}
              onClick={() => toggleCategory(cat.id)}
            />
          ))}
        </div>
      </section>

      {/* ============ SECTION 4 — CTA ============ */}
      <section
        className="panel-section mt-12"
        style={{ animationDelay: '0.45s' }}
      >
        <button
          type="button"
          onClick={handleGenerate}
          className="btn-primary flex w-full items-center justify-center gap-2"
          style={{ height: '52px', fontSize: '16px' }}
        >
          {t('filter.generate')}
          <ArrowUpRight className="h-5 w-5" />
        </button>
        <p className="mt-4 text-center font-mono text-[11px] uppercase tracking-editorial text-ink-faint">
          {t('filter.generateHint')}
        </p>
      </section>
    </div>
  );
}

/* ---------------------------------------------------------------------------
   Sub-components
   --------------------------------------------------------------------------- */

function Stepper({
  label,
  value,
  onDecrement,
  onIncrement,
  atMin,
  atMax,
}: {
  label: string;
  value: number;
  onDecrement: () => void;
  onIncrement: () => void;
  atMin: boolean;
  atMax: boolean;
}) {
  return (
    <div className="card flex flex-col items-center py-8 text-center">
      <p className="font-chinese text-[13px] text-ink-muted">{label}</p>
      <p className="my-3 font-serif text-[80px] font-bold leading-none text-ink tabular-nums">
        {value}
      </p>
      <div className="mt-2 flex items-center justify-center gap-3">
        <StepperButton
          onClick={onDecrement}
          disabled={atMin}
          ariaLabel={`Decrease ${label}`}
        >
          <Minus className="h-4 w-4" />
        </StepperButton>
        <StepperButton
          onClick={onIncrement}
          disabled={atMax}
          ariaLabel={`Increase ${label}`}
        >
          <Plus className="h-4 w-4" />
        </StepperButton>
      </div>
    </div>
  );
}

function StepperButton({
  onClick,
  disabled,
  ariaLabel,
  children,
}: {
  onClick: () => void;
  disabled: boolean;
  ariaLabel: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className={cn(
        'flex h-11 w-11 items-center justify-center rounded-pill bg-lime text-lime-deep transition',
        'hover:bg-[#C2DAAC] active:scale-[0.97]',
        'disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-lime disabled:active:scale-100',
      )}
    >
      {children}
    </button>
  );
}

function CityButton({
  label,
  selected,
  onClick,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  const style: CSSProperties = selected
    ? {}
    : { border: '0.5px solid var(--color-border)' };

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      style={style}
      className={cn(
        'flex-1 rounded px-4 py-4 font-chinese text-[15px] font-medium transition-colors duration-200',
        selected
          ? 'bg-lime text-lime-deep shadow-card'
          : 'bg-card text-ink hover:bg-white',
      )}
    >
      {label}
    </button>
  );
}

function CategoryCard({
  meta,
  selected,
  onClick,
}: {
  meta: CategoryMeta;
  selected: boolean;
  onClick: () => void;
}) {
  const Icon = meta.icon;
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={cn(
        'card card-hover flex flex-col items-center gap-2 px-3 py-5 text-center transition-colors duration-200',
        selected && 'border-transparent bg-lime',
      )}
    >
      <Icon
        className={cn(
          'h-6 w-6 transition-colors',
          selected ? 'text-lime-deep' : 'text-ink-muted',
        )}
      />
      <span
        className={cn(
          'mt-1 font-chinese text-[14px] font-medium leading-tight transition-colors',
          selected ? 'text-lime-deep' : 'text-ink',
        )}
      >
        {meta.zh}
      </span>
      <span
        className={cn(
          'font-mono text-[10px] uppercase tracking-editorial transition-colors',
          selected ? 'text-lime-dark' : 'text-ink-faint',
        )}
      >
        {meta.en}
      </span>
    </button>
  );
}

/* ---------------------------------------------------------------------------
   Helpers
   --------------------------------------------------------------------------- */

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}
