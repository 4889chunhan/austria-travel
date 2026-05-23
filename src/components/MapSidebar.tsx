import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowUpRight,
  Bell,
  Bus,
  Car,
  ChevronDown,
  ChevronUp,
  Coffee,
  Dumbbell,
  ExternalLink,
  Footprints,
  Mountain,
  PawPrint,
  Snowflake,
  Sparkles,
  Star,
  Train,
  UtensilsCrossed,
  Waves,
  Wifi,
  Wine,
  type LucideIcon,
} from 'lucide-react';
import { useStore } from '../store';
import { attractions } from '../data/attractions';
import { primaryCategory } from '../utils/categoryColors';
import { ACCOMMODATION_COLOR } from './MapMarkers';
import { useLocalizedField } from '../hooks/useLocalizedField';
import { cn } from '../utils/cn';
import type { Accommodation, Attraction } from '../types';

/** Amenity key → icon + bilingual chip label. Unknown keys fall back to text. */
const AMENITY_META: Record<string, { icon: LucideIcon; zh: string }> = {
  wifi: { icon: Wifi, zh: '免費 Wi-Fi' },
  breakfast: { icon: Coffee, zh: '早餐' },
  parking: { icon: Car, zh: '停車' },
  spa: { icon: Sparkles, zh: 'Spa' },
  restaurant: { icon: UtensilsCrossed, zh: '餐廳' },
  bar: { icon: Wine, zh: '酒吧' },
  gym: { icon: Dumbbell, zh: '健身房' },
  pool: { icon: Waves, zh: '泳池' },
  pets: { icon: PawPrint, zh: '寵物友善' },
  ac: { icon: Snowflake, zh: '空調' },
  lakeview: { icon: Mountain, zh: '湖景' },
  concierge: { icon: Bell, zh: '禮賓服務' },
};

const CITY_DISPLAY: Record<string, { zh: string; en: string }> = {
  vienna:    { zh: '維也納',     en: 'Vienna' },
  salzburg:  { zh: '薩爾斯堡',   en: 'Salzburg' },
  hallstatt: { zh: '哈修塔特',   en: 'Hallstatt' },
  innsbruck: { zh: '因斯布魯克', en: 'Innsbruck' },
  graz:      { zh: '格拉茨',     en: 'Graz' },
};

const PROFILE_FOR_CATEGORY: Record<string, string> = {
  music:        '情侶 / 文化愛好者',
  art:          '獨旅 / 文化愛好者',
  scenery:      '情侶 / 家庭 / 攝影師',
  architecture: '獨旅 / 文化愛好者',
  food:         '情侶 / 家庭',
  outdoor:      '家庭 / 冒險旅人',
  shopping:     '情侶 / 家庭',
  history:      '獨旅 / 文化愛好者',
};

export function MapSidebar({ onFlyTo }: { onFlyTo: (lng: number, lat: number, zoom?: number) => void }) {
  const selectedAttraction = useStore((s) => s.selectedAttraction);
  const setSelectedAttraction = useStore((s) => s.setSelectedAttraction);
  const selectedAccommodation = useStore((s) => s.selectedAccommodation);
  const setSelectedAccommodation = useStore((s) => s.setSelectedAccommodation);
  const setHovered = useStore((s) => s.setHoveredAttraction);
  const [mobileExpanded, setMobileExpanded] = useState(false);

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className="absolute left-0 z-20 hidden h-[calc(100%-52px)] w-[300px] flex-col bg-card md:flex"
        style={{
          top: 52,
          boxShadow: '4px 0 24px rgba(0,0,0,0.07)',
          transform: 'translateX(0)',
          transition: 'transform 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        <SidebarBody
          selected={selectedAttraction}
          selectedAccommodation={selectedAccommodation}
          onBack={() => setSelectedAttraction(null)}
          onBackAccommodation={() => setSelectedAccommodation(null)}
          onFlyTo={onFlyTo}
          onCityClick={(city) => {
            const first = attractions.find((a) => a.city === city);
            if (first) onFlyTo(first.coordinates.lng, first.coordinates.lat, 10);
          }}
          onHover={setHovered}
        />
      </aside>

      {/* Mobile bottom sheet — simple snap (drag deferred to follow-up) */}
      <aside
        className={cn(
          'fixed inset-x-0 bottom-0 z-20 flex flex-col bg-card md:hidden',
          'transition-[height,transform] duration-300 ease-out',
        )}
        style={{
          height: mobileExpanded ? '72vh' : '120px',
          borderTopLeftRadius: 'var(--radius-xl)',
          borderTopRightRadius: 'var(--radius-xl)',
          boxShadow: '0 -8px 32px rgba(0,0,0,0.12)',
        }}
      >
        <button
          type="button"
          onClick={() => setMobileExpanded(!mobileExpanded)}
          aria-label="拖曳展開詳細資訊"
          aria-expanded={mobileExpanded}
          className="flex h-11 w-full items-center justify-center"
        >
          <span
            className={cn('block rounded-pill bg-ink-faint/50', !mobileExpanded && 'handle-pulse')}
            style={{ width: 48, height: 4 }}
          />
          {mobileExpanded ? (
            <ChevronDown size={14} className="ml-2 text-ink-faint" />
          ) : (
            <ChevronUp size={14} className="ml-2 text-ink-faint" />
          )}
        </button>
        <div className="flex-1 overflow-y-auto">
          <SidebarBody
            selected={selectedAttraction}
            selectedAccommodation={selectedAccommodation}
            onBack={() => setSelectedAttraction(null)}
            onBackAccommodation={() => setSelectedAccommodation(null)}
            onFlyTo={onFlyTo}
            onCityClick={(city) => {
              const first = attractions.find((a) => a.city === city);
              if (first) onFlyTo(first.coordinates.lng, first.coordinates.lat, 10);
            }}
            onHover={setHovered}
          />
        </div>
      </aside>
    </>
  );
}

/* ---------------------------------------------------------------------------
   Sidebar body — switches between default (city list) and selected (detail)
   --------------------------------------------------------------------------- */

function SidebarBody({
  selected,
  selectedAccommodation,
  onBack,
  onBackAccommodation,
  onFlyTo,
  onCityClick,
  onHover,
}: {
  selected: Attraction | null;
  selectedAccommodation: Accommodation | null;
  onBack: () => void;
  onBackAccommodation: () => void;
  onFlyTo: (lng: number, lat: number, zoom?: number) => void;
  onCityClick: (city: string) => void;
  onHover: (id: string | null) => void;
}) {
  return (
    <div
      key={selectedAccommodation?.id ?? selected?.id ?? 'default'}
      className="flex h-full flex-col"
      style={{ animation: 'panel-fade-in 0.25s ease-out both' }}
    >
      {selectedAccommodation ? (
        <AccommodationDetailCard
          accommodation={selectedAccommodation}
          onBack={onBackAccommodation}
        />
      ) : selected ? (
        <SelectedView attraction={selected} onBack={onBack} />
      ) : (
        <DefaultView
          onCityClick={onCityClick}
          onFlyTo={onFlyTo}
          onHover={onHover}
        />
      )}
    </div>
  );
}

/* ---------------------------------------------------------------------------
   Default state — city list
   --------------------------------------------------------------------------- */

function DefaultView({
  onCityClick,
  onFlyTo,
  onHover,
}: {
  onCityClick: (city: string) => void;
  onFlyTo: (lng: number, lat: number, zoom?: number) => void;
  onHover: (id: string | null) => void;
}) {
  const localized = useLocalizedField();
  const byCity = useMemo(() => {
    const map = new Map<string, Attraction[]>();
    for (const a of attractions) {
      const list = map.get(a.city) ?? [];
      list.push(a);
      map.set(a.city, list);
    }
    return Array.from(map.entries());
  }, []);

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="border-b px-5 py-5">
        <p className="eyebrow mb-2">Edition 01</p>
        <h2 className="font-serif text-2xl italic text-ink">
          City guide
        </h2>
      </div>

      {byCity.map(([city, list]) => {
        const label = CITY_DISPLAY[city] ?? { zh: city, en: city };
        return (
          <div key={city} className="border-b px-4 py-4">
            <button
              type="button"
              onClick={() => onCityClick(city)}
              className="block w-full text-left transition-opacity hover:opacity-90"
            >
              <div className="flex items-baseline gap-2">
                <h3 className="font-serif text-[20px] italic text-ink">
                  {localized(label)}
                </h3>
                <span className="font-mono text-[10px] uppercase tracking-editorial text-ink-faint">
                  · {list.length}個景點
                </span>
              </div>
              <div className="mt-2 flex gap-1.5">
                {list.slice(0, 3).map((a) => (
                  <div
                    key={a.id}
                    className="overflow-hidden rounded"
                    style={{
                      width: 60,
                      height: 60,
                      background: 'var(--color-cream)',
                    }}
                  >
                    <img
                      src={a.imageUrl}
                      alt=""
                      loading="lazy"
                      className="h-full w-full object-cover"
                      style={{ borderRadius: 0 }}
                    />
                  </div>
                ))}
              </div>
            </button>
            <ul className="mt-3 space-y-1">
              {list.map((a) => (
                <li
                  key={a.id}
                  onMouseEnter={() => onHover(a.id)}
                  onMouseLeave={() => onHover(null)}
                >
                  <button
                    type="button"
                    onClick={() =>
                      onFlyTo(a.coordinates.lng, a.coordinates.lat, 13)
                    }
                    className="block w-full text-left font-chinese text-[13px] text-ink-muted transition-colors hover:text-ink"
                  >
                    · {localized(a.name)}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </div>
  );
}

/* ---------------------------------------------------------------------------
   Selected state — full attraction detail
   --------------------------------------------------------------------------- */

function SelectedView({
  attraction,
  onBack,
}: {
  attraction: Attraction;
  onBack: () => void;
}) {
  const localized = useLocalizedField();
  const meta = primaryCategory(attraction.category);
  const cityLabel = CITY_DISPLAY[attraction.city] ?? {
    zh: attraction.city,
    en: attraction.city,
  };
  const toggleSaved = useStore((s) => s.toggleSaved);
  const isSaved = useStore((s) =>
    s.savedAttractions.includes(attraction.id),
  );

  const setLanguageCardsOpen = useStore((s) => s.setLanguageCardsOpen);

  const profile = PROFILE_FOR_CATEGORY[meta.id] ?? '所有旅人';
  const highlights = (attraction.tips?.zh ?? attraction.tagline.zh)
    .replace(/。$/, '');

  return (
    <div className="flex h-full flex-col">
      {/* Photo (flush to top, square corners) */}
      <div
        className="relative shrink-0"
        style={{ height: 190, background: 'var(--color-cream)' }}
      >
        <img
          src={attraction.imageUrl}
          alt={localized(attraction.name)}
          className="h-full w-full object-cover"
          style={{ borderRadius: 0 }}
        />
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Back */}
        <div className="px-4 pt-3">
          <button
            type="button"
            onClick={onBack}
            className="btn-secondary inline-flex items-center gap-1"
          >
            <ArrowLeft size={14} />
            全部景點
          </button>
        </div>

        {/* Meta row */}
        <div className="mt-3 flex items-center gap-2 px-4">
          <span
            className="inline-block rounded-pill"
            style={{ width: 8, height: 8, background: meta.color }}
          />
          <span className="font-mono text-[10px] uppercase tracking-editorial text-ink-faint">
            {meta.en}
          </span>
          <span
            className="ml-auto rounded-pill bg-lime px-2 py-0.5 font-mono text-[9px] uppercase tracking-editorial text-lime-deep"
          >
            {cityLabel.en}
          </span>
        </div>

        {/* Names — clickable into the full detail page */}
        <Link
          to={`/attraction/${attraction.slug}`}
          className="group mt-2 block px-4 transition-colors"
        >
          <h2 className="flex items-baseline gap-1.5 font-chinese text-[22px] font-bold leading-tight text-ink group-hover:text-lime-deep">
            {attraction.name.zh}
            <ArrowUpRight size={16} className="text-ink-faint transition-all group-hover:text-lime-deep" />
          </h2>
          <p className="font-serif text-[16px] italic text-ink-muted">
            {attraction.name.en}
          </p>
        </Link>
        <p className="mt-0.5 px-4 font-german text-[11px] text-ink-faint">
          {attraction.name.de}
        </p>

        <hr className="mx-4 my-3 border-t" />

        {/* Description */}
        <p className="px-4 font-chinese text-[13px] leading-relaxed text-ink">
          {attraction.description.zh}
        </p>

        {/* Who it's for */}
        <Field label="適合對象" value={profile} />

        {/* Highlights */}
        <Field label="亮點" value={highlights} />

        {/* Transport time card */}
        <TransportCard />

        {/* CTAs — "語言小卡" opens the floating panel over the map */}
        <div className="flex flex-col gap-2 px-4 pb-6 pt-4">
          <button
            type="button"
            onClick={() => setLanguageCardsOpen(true)}
            disabled={attraction.languageCards.length === 0}
            className="btn-primary w-full justify-center disabled:cursor-not-allowed disabled:opacity-50"
          >
            語言小卡
            <span className="font-mono text-[10px] opacity-70">
              {attraction.languageCards.length}
            </span>
          </button>
          <button
            type="button"
            onClick={() => toggleSaved(attraction.id)}
            className="btn-secondary w-full justify-center"
          >
            {isSaved ? '已加入行程' : '加入行程'}
          </button>
          <a
            href={attraction.website}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary w-full justify-center"
          >
            官方網站 <ExternalLink size={14} />
          </a>
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------------------
   Accommodation detail — shown in the sidebar detail slot
   --------------------------------------------------------------------------- */

function AccommodationDetailCard({
  accommodation,
  onBack,
}: {
  accommodation: Accommodation;
  onBack: () => void;
}) {
  const localized = useLocalizedField();
  const exchangeRate = useStore((s) => s.exchangeRate);
  const assignAccommodationToDay = useStore((s) => s.assignAccommodationToDay);
  const isSaved = useStore((s) =>
    s.savedAccommodations.includes(accommodation.id),
  );

  const cityLabel = CITY_DISPLAY[accommodation.city] ?? {
    zh: accommodation.city,
    en: accommodation.city,
  };
  const twd = Math.round(accommodation.pricePerNight.EUR * exchangeRate);

  // Resolve nearby slugs to real attractions (skips cities without data).
  const nearby = accommodation.nearbyAttractions
    .map((slug) => attractions.find((a) => a.slug === slug))
    .filter((a): a is Attraction => Boolean(a));

  return (
    <div className="flex h-full flex-col">
      {/* Photo */}
      <div
        className="relative shrink-0"
        style={{ height: 180, background: 'var(--color-cream)' }}
      >
        <img
          src={accommodation.imageUrl}
          alt={localized(accommodation.name)}
          className="h-full w-full object-cover"
          style={{ borderRadius: 0 }}
        />
        <span
          className="absolute right-3 top-3 flex items-center gap-1 rounded-pill px-2 py-0.5 font-mono text-[10px] uppercase tracking-editorial text-white"
          style={{ background: ACCOMMODATION_COLOR }}
        >
          {accommodation.type}
        </span>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Back */}
        <div className="px-4 pt-3">
          <button
            type="button"
            onClick={onBack}
            className="btn-secondary inline-flex items-center gap-1"
          >
            <ArrowLeft size={14} />
            返回
          </button>
        </div>

        {/* Stars + city */}
        <div className="mt-3 flex items-center gap-2 px-4">
          {accommodation.stars && (
            <span className="flex items-center gap-0.5 text-[#D4A84B]">
              {Array.from({ length: accommodation.stars }).map((_, i) => (
                <Star key={i} size={12} fill="currentColor" strokeWidth={0} />
              ))}
            </span>
          )}
          <span className="ml-auto rounded-pill bg-lime px-2 py-0.5 font-mono text-[9px] uppercase tracking-editorial text-lime-deep">
            {cityLabel.en}
          </span>
        </div>

        {/* Names */}
        <h2 className="mt-2 px-4 font-chinese text-[20px] font-bold leading-tight text-ink">
          {accommodation.name.zh}
        </h2>
        <p className="px-4 font-serif text-[15px] italic text-ink-muted">
          {accommodation.name.en}
        </p>

        {/* Price */}
        <div className="mt-3 flex items-baseline gap-1.5 px-4">
          <span className="font-serif text-[28px] font-bold leading-none text-ink">
            €{accommodation.pricePerNight.EUR}
          </span>
          <span className="font-chinese text-[14px] text-ink-muted">/晚</span>
        </div>
        <p className="px-4 font-mono text-[12px] text-ink-faint">
          (約 NT$ {twd.toLocaleString('en-US')})
        </p>

        {/* Amenities */}
        {accommodation.amenities.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5 px-4">
            {accommodation.amenities.map((key) => {
              const meta = AMENITY_META[key];
              const Icon = meta?.icon;
              return (
                <span
                  key={key}
                  className="inline-flex items-center gap-1 rounded-pill px-2 py-1 font-chinese text-[11px] text-ink-muted"
                  style={{ border: '0.5px solid var(--color-border)' }}
                >
                  {Icon && <Icon size={12} strokeWidth={1.8} />}
                  {meta?.zh ?? key}
                </span>
              );
            })}
          </div>
        )}

        {/* Description */}
        <p
          className="mt-3 px-4 font-chinese text-[13px] leading-relaxed text-ink"
          style={{
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {localized(accommodation.description)}
        </p>

        {/* Nearby attractions */}
        {nearby.length > 0 && (
          <div className="mt-4 px-4">
            <p className="font-mono text-[9px] uppercase tracking-editorial text-ink-faint">
              鄰近景點
            </p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {nearby.map((a) => (
                <Link
                  key={a.id}
                  to={`/attraction/${a.slug}`}
                  className="inline-flex items-center gap-0.5 rounded-pill bg-cream px-2.5 py-1 font-chinese text-[12px] text-ink transition-colors hover:text-lime-deep"
                  style={{ border: '0.5px solid var(--color-border)' }}
                >
                  {localized(a.name)}
                  <ArrowUpRight size={11} />
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* CTAs */}
        <div className="flex flex-col gap-2 px-4 pb-6 pt-4">
          <button
            type="button"
            onClick={() => assignAccommodationToDay(accommodation)}
            className="btn-primary w-full justify-center"
          >
            {isSaved ? '已加入行程' : '加入行程'}
            <ArrowUpRight size={14} />
          </button>
          <a
            href={accommodation.bookingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary w-full justify-center"
          >
            查看訂房 <ExternalLink size={14} />
          </a>
        </div>
      </div>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="mt-3 px-4">
      <p className="font-mono text-[9px] uppercase tracking-editorial text-ink-faint">
        {label}
      </p>
      <p className="mt-1 font-chinese text-[12px] text-ink">{value}</p>
    </div>
  );
}

function TransportCard() {
  return (
    <div
      className="mx-4 mt-4 flex items-center gap-4 px-3.5 py-2.5"
      style={{
        border: '0.5px solid var(--color-border)',
        borderRadius: 'var(--radius-md)',
        background: 'var(--color-card)',
      }}
    >
      <Stop icon={Train} value="2h30" />
      <Stop icon={Bus} value="1h30" />
      <Stop icon={Footprints} value="19min" />
    </div>
  );
}

function Stop({ icon: Icon, value }: { icon: typeof Train; value: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <Icon size={16} className="text-ink-muted" strokeWidth={1.8} />
      <span className="font-mono text-[13px] font-medium text-ink">{value}</span>
    </div>
  );
}
