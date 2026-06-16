import { useTranslation } from 'react-i18next';
import { BedDouble, ExternalLink, MapPin } from 'lucide-react';
import {
  stayNights,
  type StayNight,
  type StayOption,
  type StayType,
} from '../data/stayOptions';
import { useLocalizedField } from '../hooks/useLocalizedField';
import { cityLabel } from '../utils/cityDisplay';
import { cn } from '../utils/cn';

/* ---------------------------------------------------------------------------
   Accommodations · 住宿
   One section per overnight, each with five stays (Booking.com + Airbnb) within
   ~20 min drive of that day's last attraction, for 3 guests. Every link opens a
   LIVE search pre-filled with the night's dates and 3 adults — so it always
   lands on real, bookable results.
   --------------------------------------------------------------------------- */

const TYPE_LABEL: Record<StayType, { zh: string; en: string }> = {
  hotel: { zh: '飯店', en: 'Hotel' },
  boutique: { zh: '精品', en: 'Boutique' },
  guesthouse: { zh: '民宿', en: 'Guesthouse' },
  hostel: { zh: '青旅', en: 'Hostel' },
  apartment: { zh: '公寓', en: 'Apartment' },
};

const PLATFORM_META = {
  booking: { label: 'Booking.com', color: '#003580' },
  airbnb: { label: 'Airbnb', color: '#FF385C' },
} as const;

const WEEKDAY_ZH = ['日', '一', '二', '三', '四', '五', '六'];

function bookingUrl(term: string, checkin: string, checkout: string): string {
  const p = new URLSearchParams({
    ss: term,
    checkin,
    checkout,
    group_adults: '3',
    no_rooms: '1',
    group_children: '0',
  });
  return `https://www.booking.com/searchresults.html?${p.toString()}`;
}

function airbnbUrl(term: string, checkin: string, checkout: string): string {
  const p = new URLSearchParams({ checkin, checkout, adults: '3' });
  return `https://www.airbnb.com/s/${encodeURIComponent(term)}/homes?${p.toString()}`;
}

function optionUrl(o: StayOption, night: StayNight): string {
  return o.platform === 'booking'
    ? bookingUrl(o.searchTerm, night.date, night.checkout)
    : airbnbUrl(o.searchTerm, night.date, night.checkout);
}

/** "7/9 (三)" from an ISO date. */
function shortDate(iso: string): string {
  const d = new Date(`${iso}T00:00:00`);
  return `${d.getMonth() + 1}/${d.getDate()} (${WEEKDAY_ZH[d.getDay()]})`;
}

export function StaysPage() {
  const { i18n } = useTranslation();
  const localized = useLocalizedField();
  const isZh = i18n.language.startsWith('zh');

  return (
    <div className="min-h-[calc(100vh-64px)] bg-cream">
      <div className="mx-auto max-w-[1100px] px-6 py-12 sm:py-16">
        {/* Header */}
        <header className="mb-8">
          <p className="eyebrow mb-3">Where to Sleep · Österreich × Čechy</p>
          <h1 className="font-serif text-[40px] italic leading-none text-ink sm:text-[48px]">
            Accommodations
          </h1>
          <p className="mt-2 font-chinese text-[16px] text-ink-muted">
            住宿 · 每晚 5 個選項，距當天最後一個景點 20 分鐘車程內（3 人）
          </p>
          <p className="mt-4 max-w-[680px] font-chinese text-[13px] leading-relaxed text-ink-faint">
            點擊任一選項會開啟 Booking.com 或 Airbnb 的「即時搜尋」，已自動帶入該晚日期與
            3 位入住人數，因此一定看得到可訂房源。房名為當地真實住宿，標價為每晚 3 人約略價格，
            實際房價與空房請以平台為準。
          </p>
        </header>

        <div className="space-y-10">
          {stayNights.map((night) => (
            <NightSection
              key={night.date}
              night={night}
              localized={localized}
              isZh={isZh}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function NightSection({
  night,
  localized,
  isZh,
}: {
  night: StayNight;
  localized: ReturnType<typeof useLocalizedField>;
  isZh: boolean;
}) {
  return (
    <section>
      {/* Night header */}
      <div className="mb-4 flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <span className="font-mono text-[13px] font-medium text-lime-deep">
          {shortDate(night.date)}
        </span>
        <h2 className="font-serif text-[24px] text-ink">
          {cityLabel(night.city, isZh ? 'zh' : 'en')}
        </h2>
        <span className="flex items-center gap-1 font-chinese text-[13px] text-ink-muted">
          <MapPin size={12} strokeWidth={1.8} />
          {isZh ? '最後一站：' : 'Last stop: '}
          {localized(night.anchor)}
        </span>
      </div>

      {/* Optional planning note */}
      {night.note && (
        <p
          className="mb-4 rounded-lg px-4 py-3 font-chinese text-[13px] leading-relaxed text-ink-muted"
          style={{ background: 'var(--color-lime)', color: 'var(--color-lime-deep)' }}
        >
          {localized(night.note)}
        </p>
      )}

      {/* Option grid */}
      <div className="grid gap-3 sm:grid-cols-2">
        {night.options.map((o, i) => (
          <OptionCard
            key={i}
            option={o}
            href={optionUrl(o, night)}
            localized={localized}
            isZh={isZh}
          />
        ))}
      </div>
    </section>
  );
}

function OptionCard({
  option,
  href,
  localized,
  isZh,
}: {
  option: StayOption;
  href: string;
  localized: ReturnType<typeof useLocalizedField>;
  isZh: boolean;
}) {
  const platform = PLATFORM_META[option.platform];
  const type = TYPE_LABEL[option.type];

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        'group flex flex-col rounded-lg bg-card p-4 transition-all duration-200',
        'hover:-translate-y-0.5',
      )}
      style={{ border: '1px solid var(--color-border-med)', boxShadow: 'var(--shadow-card)' }}
    >
      {/* Top row: platform + type */}
      <div className="mb-2 flex items-center gap-2">
        <span
          className="rounded-pill px-2 py-0.5 font-mono text-[10px] font-medium text-white"
          style={{ background: platform.color }}
        >
          {platform.label}
        </span>
        <span
          className="flex items-center gap-1 rounded-pill px-2 py-0.5 font-chinese text-[11px] text-ink-muted"
          style={{ border: '1px solid var(--color-border-med)' }}
        >
          <BedDouble size={11} strokeWidth={1.8} />
          {isZh ? type.zh : type.en}
        </span>
      </div>

      {/* Name */}
      <h3 className="font-chinese text-[15px] font-medium leading-snug text-ink">
        {option.name}
      </h3>

      {/* Note */}
      <p className="mt-1 font-chinese text-[12px] leading-relaxed text-ink-muted">
        {localized(option.note)}
      </p>

      {/* Footer: price + CTA */}
      <div className="mt-3 flex items-center justify-between border-t pt-3" style={{ borderColor: 'var(--color-border)' }}>
        <span className="font-mono text-[13px] text-ink">
          {option.priceEUR}
          <span className="ml-1 font-chinese text-[11px] text-ink-faint">/ 晚 · 3 人</span>
        </span>
        <span className="flex items-center gap-1 font-chinese text-[12px] font-medium text-lime-deep group-hover:underline">
          {isZh ? '查看房源' : 'View'}
          <ExternalLink size={12} strokeWidth={1.8} />
        </span>
      </div>
    </a>
  );
}
