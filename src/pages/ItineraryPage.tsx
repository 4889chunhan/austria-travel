import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowUpRight,
  Bus,
  Calendar,
  Car,
  Compass,
  FileDown,
  Languages,
  MapPin,
  Sparkles,
  Train,
  type LucideIcon,
} from 'lucide-react';
import { useStore } from '../store';
import { attractions } from '../data/attractions';
import { primaryCategory } from '../utils/categoryColors';
import { useLocalizedField } from '../hooks/useLocalizedField';
import { LanguageCardDeck } from '../components/LanguageCardDeck';
import { cn } from '../utils/cn';
import type { Attraction, DayPlan, TripConfig } from '../types';

const CITY_DISPLAY: Record<string, { zh: string; en: string }> = {
  vienna:    { zh: '維也納',     en: 'Vienna' },
  salzburg:  { zh: '薩爾斯堡',   en: 'Salzburg' },
  hallstatt: { zh: '哈修塔特',   en: 'Hallstatt' },
  innsbruck: { zh: '因斯布魯克', en: 'Innsbruck' },
  graz:      { zh: '格拉茨',     en: 'Graz' },
};

export function ItineraryPage() {
  const itinerary = useStore((s) => s.itinerary);
  const tripConfig = useStore((s) => s.tripConfig);
  const activeCategories = useStore((s) => s.activeCategories);

  const [selectedDay, setSelectedDay] = useState(0);

  // Auto-regenerate when trip config / filters change — but only if the user
  // already has an itinerary. First-time visitors keep the empty state.
  // Using getState() inside the effect avoids stale-closure issues with the
  // `itinerary` ref while keeping it out of the dep list (which would loop).
  const catsKey = activeCategories.join(',');
  useEffect(() => {
    const state = useStore.getState();
    if (state.itinerary.length > 0) {
      state.generateItinerary(attractions);
    }
  }, [
    tripConfig.days,
    tripConfig.travelers,
    tripConfig.startCity,
    catsKey,
  ]);

  // Keep selectedDay valid as itinerary length changes
  useEffect(() => {
    if (itinerary.length > 0 && selectedDay >= itinerary.length) {
      setSelectedDay(0);
    }
  }, [itinerary.length, selectedDay]);

  if (itinerary.length === 0) {
    return <EmptyState />;
  }

  const day = itinerary[selectedDay] ?? itinerary[0];

  return (
    <div className="relative min-h-[calc(100vh-64px)] bg-cream pb-32">
      <Header
        tripConfig={tripConfig}
        activeCategoryCount={activeCategories.length}
      />
      <DayTabs
        days={itinerary}
        selectedIndex={selectedDay}
        onSelect={setSelectedDay}
      />
      <Timeline day={day} />
      <ExportButton />
    </div>
  );
}

/* ---------------------------------------------------------------------------
   Empty state
   --------------------------------------------------------------------------- */

function EmptyState() {
  return (
    <div className="relative min-h-[calc(100vh-64px)] overflow-hidden bg-cream">
      {/* Decorative oversized "?" — using Cormorant since Playfair isn't loaded */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 flex select-none items-center justify-center"
      >
        <span
          className="font-serif"
          style={{
            fontSize: 240,
            lineHeight: 1,
            opacity: 0.05,
            color: 'var(--color-ink)',
            fontWeight: 700,
          }}
        >
          ?
        </span>
      </div>

      <div className="relative flex min-h-[calc(100vh-64px)] flex-col items-center justify-center px-6 text-center">
        <p className="eyebrow mb-4">No itinerary yet</p>
        <h1 className="font-serif text-4xl italic text-ink sm:text-5xl">
          尚未規劃行程
        </h1>
        <p className="mt-4 max-w-md font-chinese text-[15px] leading-relaxed text-ink-muted">
          前往規劃頁面，依你的天數、出發城市與興趣,為你產生客製化的奧地利之旅。
        </p>
        <Link to="/plan" className="btn-primary mt-8">
          前往規劃頁面
          <ArrowUpRight size={14} />
        </Link>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------------------
   Header
   --------------------------------------------------------------------------- */

function Header({
  tripConfig,
  activeCategoryCount,
}: {
  tripConfig: TripConfig;
  activeCategoryCount: number;
}) {
  const startCityLabel =
    CITY_DISPLAY[tripConfig.startCity]?.zh ?? tripConfig.startCity;
  const experienceLabel =
    activeCategoryCount > 0 ? `${activeCategoryCount}種體驗` : '全部體驗';

  return (
    <header className="bg-cream px-6 pb-6 pt-10 sm:px-12">
      <div className="mx-auto max-w-[720px]">
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <h1 className="font-serif text-[40px] italic leading-tight text-ink">
            你的奧地利行程
          </h1>
          <p className="font-german text-[14px] text-ink-muted">
            Your Itinerary
          </p>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          <SummaryPill icon={Calendar} label={`${tripConfig.days}天`} />
          <SummaryPill icon={MapPin} label={`${startCityLabel}出發`} />
          <SummaryPill icon={Sparkles} label={experienceLabel} />
        </div>
      </div>
    </header>
  );
}

function SummaryPill({ icon: Icon, label }: { icon: LucideIcon; label: string }) {
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-pill bg-lime px-3 py-1 font-mono uppercase tracking-editorial text-lime-deep"
      style={{ fontSize: 11 }}
    >
      <Icon size={12} strokeWidth={2.2} />
      {label}
    </span>
  );
}

/* ---------------------------------------------------------------------------
   Day tabs
   --------------------------------------------------------------------------- */

function DayTabs({
  days,
  selectedIndex,
  onSelect,
}: {
  days: DayPlan[];
  selectedIndex: number;
  onSelect: (i: number) => void;
}) {
  return (
    <div className="bg-cream px-6 sm:px-12">
      <div className="mx-auto max-w-[720px]">
        <div
          className="scrollbar-hidden flex gap-1 overflow-x-auto p-1.5"
          style={{
            background: 'var(--color-card)',
            border: '0.5px solid var(--color-border)',
            borderRadius: 'var(--radius-pill)',
          }}
        >
          {days.map((day, i) => (
            <button
              key={day.day}
              type="button"
              onClick={() => onSelect(i)}
              className={cn(
                'shrink-0 whitespace-nowrap rounded-pill px-5 py-2 font-chinese text-[14px] transition-colors',
                selectedIndex === i
                  ? 'bg-lime font-medium text-lime-deep'
                  : 'text-ink-muted hover:text-ink',
              )}
            >
              Day {String(day.day).padStart(2, '0')}
              {day.attractions.length > 0 && (
                <span className="ml-2 font-mono text-[10px] opacity-70">
                  · {day.attractions.length}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------------------
   Timeline
   --------------------------------------------------------------------------- */

function Timeline({ day }: { day: DayPlan }) {
  const items = day.attractions;

  return (
    <section className="mx-auto mt-8 max-w-[720px] px-6 sm:px-12">
      {items.length === 0 ? (
        <div className="card text-center">
          <p className="font-chinese text-[14px] text-ink-muted">
            這天還沒有安排景點 — 試試放寬偏好或增加天數。
          </p>
        </div>
      ) : (
        <ol className="space-y-0">
          {items.map((attraction, i) => (
            <li key={attraction.id}>
              <TimelineItem attraction={attraction} />
              {i < items.length - 1 && (
                <TransportConnector from={attraction} to={items[i + 1]!} />
              )}
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}

function TimelineItem({ attraction }: { attraction: Attraction }) {
  const [showCards, setShowCards] = useState(false);
  const navigate = useNavigate();
  const localized = useLocalizedField();
  const setSelectedAttraction = useStore((s) => s.setSelectedAttraction);

  const meta = primaryCategory(attraction.category);
  const cityLabel =
    CITY_DISPLAY[attraction.city] ?? { zh: attraction.city, en: attraction.city };

  const goToMap = () => {
    setSelectedAttraction(attraction);
    navigate('/map');
  };

  return (
    <article
      className="card card-hover overflow-hidden"
      style={{ padding: 0 }}
    >
      <div
        className="relative shrink-0 overflow-hidden"
        style={{
          height: 160,
          background: 'var(--color-cream)',
          borderTopLeftRadius: 'var(--radius-md)',
          borderTopRightRadius: 'var(--radius-md)',
        }}
      >
        <img
          src={attraction.imageUrl}
          alt={localized(attraction.name)}
          loading="lazy"
          className="h-full w-full object-cover"
          style={{ borderRadius: 0 }}
        />
      </div>

      <div className="px-5 py-4">
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <span
            className="rounded-pill px-2 py-0.5 font-mono uppercase tracking-editorial"
            style={{
              background: 'var(--color-lime)',
              color: 'var(--color-lime-deep)',
              fontSize: 10,
            }}
          >
            {cityLabel.en}
          </span>
          <span className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-editorial text-ink-faint">
            <span
              aria-hidden
              className="inline-block rounded-pill"
              style={{ width: 6, height: 6, background: meta.color }}
            />
            {meta.en}
          </span>
        </div>

        <Link
          to={`/attraction/${attraction.slug}`}
          className="group inline-flex items-baseline gap-1.5 transition-colors"
        >
          <h3 className="font-chinese text-[18px] font-semibold leading-snug text-ink group-hover:text-lime-deep">
            {localized(attraction.name)}
          </h3>
          <ArrowUpRight size={14} className="text-ink-faint transition-colors group-hover:text-lime-deep" />
        </Link>
        <p className="font-german text-[13px] text-ink-muted">
          {attraction.name.en}
        </p>

        <p
          className="mt-2 font-chinese text-[14px] leading-relaxed text-ink-muted"
          style={{
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {localized(attraction.description)}
        </p>

        <div className="mt-3 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setShowCards((v) => !v)}
            className="btn-secondary"
            style={{ padding: '6px 12px', fontSize: 12 }}
          >
            <Languages size={12} />
            {showCards ? '收起語言小卡' : '語言小卡'}
            <ArrowUpRight size={12} />
          </button>
          <button
            type="button"
            onClick={goToMap}
            className="btn-secondary"
            style={{ padding: '6px 12px', fontSize: 12 }}
          >
            <Compass size={12} />
            在地圖上看
          </button>
        </div>

        {showCards && (
          <div className="mt-4 border-t pt-4">
            {attraction.languageCards.length > 0 ? (
              <LanguageCardDeck cards={attraction.languageCards} />
            ) : (
              <p className="text-center font-chinese text-[13px] text-ink-faint">
                這個景點還沒有語言小卡。
              </p>
            )}
          </div>
        )}
      </div>
    </article>
  );
}

/* ---------------------------------------------------------------------------
   Transport connector
   --------------------------------------------------------------------------- */

function TransportConnector({ from, to }: { from: Attraction; to: Attraction }) {
  const { type, duration, route } = estimateTransport(from, to);
  const Icon = type === 'train' ? Train : type === 'bus' ? Bus : Car;

  return (
    <div className="relative flex items-center justify-center" style={{ height: 56 }}>
      <span
        aria-hidden
        className="absolute left-1/2 top-0 h-full"
        style={{
          width: 1,
          marginLeft: -0.5,
          borderLeft: '1px dashed var(--color-border-med)',
        }}
      />
      <span
        className="relative z-10 inline-flex items-center gap-2"
        style={{
          background: 'rgba(255, 255, 255, 0.92)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          border: '0.5px solid rgba(255, 255, 255, 0.6)',
          borderRadius: 'var(--radius-pill)',
          padding: '6px 14px',
          boxShadow: 'var(--shadow-card)',
        }}
      >
        <Icon size={14} className="text-ink-muted" strokeWidth={1.8} />
        <span className="font-mono text-[12px] font-medium text-ink">
          {duration}
        </span>
        <span className="font-chinese text-[11px] text-ink-faint">
          · {route}
        </span>
      </span>
    </div>
  );
}

/* ---------------------------------------------------------------------------
   Export button (content-relative, NOT viewport-fixed)
   --------------------------------------------------------------------------- */

function ExportButton() {
  return (
    <button
      type="button"
      className="btn-primary absolute"
      style={{ bottom: 32, right: 32 }}
      onClick={() => {
        // TODO: hook real PDF export
        // eslint-disable-next-line no-alert
        alert('PDF export coming soon');
      }}
    >
      <FileDown size={14} />
      匯出行程 PDF
      <ArrowUpRight size={14} />
    </button>
  );
}

/* ---------------------------------------------------------------------------
   Transport estimation — derived from haversine distance because we don't
   have a real `TransportRoute` dataset yet.
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

function estimateTransport(
  from: Attraction,
  to: Attraction,
): { type: 'train' | 'bus' | 'car'; duration: string; route: string } {
  const km = haversineKm(from.coordinates, to.coordinates);
  const sameCity = from.city === to.city;
  const speedKmh = sameCity ? 25 : 70;
  const type: 'train' | 'bus' | 'car' = sameCity ? 'bus' : 'train';

  const totalMin = Math.max(5, Math.round((km / speedKmh) * 60));
  const h = Math.floor(totalMin / 60);
  const m = totalMin % 60;
  const duration = h > 0 ? `${h}h ${m.toString().padStart(2, '0')}min` : `${m}min`;

  const fromLabel = CITY_DISPLAY[from.city]?.zh ?? from.city;
  const toLabel = CITY_DISPLAY[to.city]?.zh ?? to.city;
  const route = sameCity ? `${fromLabel}市內` : `${fromLabel} → ${toLabel}`;

  return { type, duration, route };
}
