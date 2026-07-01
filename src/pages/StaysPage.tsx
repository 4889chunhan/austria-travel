import { useTranslation } from 'react-i18next';
import {
  BedDouble,
  CalendarCheck,
  Car,
  Clock,
  Coffee,
  ExternalLink,
  MapPin,
  Snowflake,
} from 'lucide-react';
import { tripStays, type TripStay } from '../data/stayOptions';
import { useLocalizedField } from '../hooks/useLocalizedField';
import { cityLabel } from '../utils/cityDisplay';

/* ---------------------------------------------------------------------------
   Stays · 住宿
   The confirmed hotels for the 7/8–7/20 trip (from the itinerary PDF), each
   with room, board, climate, parking and check-in details. Booking.com and
   Hotels.com links open a live search pre-filled with the stay's dates and
   3 guests so a click lands on the real property.
   --------------------------------------------------------------------------- */

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

function hotelsUrl(term: string, checkin: string, checkout: string): string {
  const p = new URLSearchParams({
    destination: term,
    startDate: checkin,
    endDate: checkout,
    rooms: '1',
    adults: '3',
  });
  return `https://www.hotels.com/Hotel-Search?${p.toString()}`;
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
            住宿 · 7/8–7/20 已預訂的 6 間飯店（房型、設備、停車、位置）
          </p>
          <p className="mt-4 max-w-[680px] font-chinese text-[13px] leading-relaxed text-ink-faint">
            以下為本次行程實際入住的飯店與細節。每張卡片的 Booking.com 或 Hotels.com 連結會開啟「即時搜尋」，
            已帶入該次入住日期與 3 位入住人數，方便查價、看房與確認。實際房價與空房請以平台為準。
          </p>
        </header>

        <div className="space-y-6">
          {tripStays.map((stay) => (
            <StayCard key={stay.id} stay={stay} localized={localized} isZh={isZh} />
          ))}
        </div>
      </div>
    </div>
  );
}

function StayCard({
  stay,
  localized,
  isZh,
}: {
  stay: TripStay;
  localized: ReturnType<typeof useLocalizedField>;
  isZh: boolean;
}) {
  return (
    <article
      className="overflow-hidden rounded-lg bg-card"
      style={{ border: '1px solid var(--color-border-med)', boxShadow: 'var(--shadow-card)' }}
    >
      <div className="flex flex-col gap-5 p-5 sm:p-6 lg:flex-row">
        {/* Left: identity + facilities */}
        <div className="min-w-0 flex-1">
          {/* Date + city */}
          <div className="mb-2 flex flex-wrap items-center gap-x-3 gap-y-1">
            <span
              className="inline-flex items-center gap-1.5 rounded-pill px-3 py-1 font-mono text-[12px] font-medium text-lime-deep"
              style={{ background: 'var(--color-lime)' }}
            >
              <CalendarCheck size={13} strokeWidth={2} />
              {shortDate(stay.checkin)} – {shortDate(stay.checkout)}
              <span className="opacity-70">· {stay.nights}{isZh ? ' 晚' : 'n'}</span>
            </span>
            <span className="font-mono text-[11px] uppercase tracking-editorial text-ink-faint">
              {cityLabel(stay.city, isZh ? 'zh' : 'en')}
            </span>
          </div>

          {/* Name */}
          <h2 className="font-chinese text-[19px] font-semibold leading-snug text-ink">
            {isZh ? stay.nameZh : stay.name}
          </h2>
          <p className="mt-0.5 font-chinese text-[12px] text-ink-faint">
            {isZh ? stay.name : stay.nameZh}
          </p>

          {/* Address */}
          <p className="mt-2 flex items-start gap-1.5 font-chinese text-[12.5px] text-ink-muted">
            <MapPin size={13} strokeWidth={1.8} className="mt-0.5 shrink-0 text-ink-faint" />
            {stay.address}
          </p>

          {/* Facility rows */}
          <div className="mt-4 grid gap-2.5 sm:grid-cols-2">
            <FacilityRow icon={BedDouble} label={isZh ? '房型' : 'Room'}>
              {localized(stay.roomType)}
            </FacilityRow>
            <FacilityRow icon={Coffee} label={isZh ? '早餐' : 'Breakfast'}>
              {stay.facility.breakfast
                ? isZh
                  ? '含早餐'
                  : 'Included'
                : isZh
                  ? '無早餐'
                  : 'Not included'}
            </FacilityRow>
            <FacilityRow icon={Snowflake} label={isZh ? '空調' : 'Climate'}>
              {localized(stay.facility.climate)}
            </FacilityRow>
            <FacilityRow icon={Car} label={isZh ? '停車' : 'Parking'}>
              {localized(stay.facility.parking)}
            </FacilityRow>
            <FacilityRow icon={Clock} label={isZh ? '入住 / 退房' : 'Check-in / out'}>
              {stay.checkInWindow} · {isZh ? '退房 ' : 'out '}
              {stay.checkOutTime}
            </FacilityRow>
            {stay.facility.frontDesk && (
              <FacilityRow icon={CalendarCheck} label={isZh ? '櫃台' : 'Front desk'}>
                {localized(stay.facility.frontDesk)}
              </FacilityRow>
            )}
          </div>

          {/* Notes */}
          {stay.notes.length > 0 && (
            <ul className="mt-4 flex flex-col gap-1.5">
              {stay.notes.map((n, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2 font-chinese text-[12px] leading-relaxed text-ink-muted"
                >
                  <span aria-hidden className="mt-0.5 text-lime-deep">•</span>
                  {localized(n)}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Right: booking CTAs */}
        <div className="flex shrink-0 flex-col gap-2 lg:w-[190px] lg:border-l lg:pl-6" style={{ borderColor: 'var(--color-border)' }}>
          <p className="hidden font-mono text-[10px] uppercase tracking-editorial text-ink-faint lg:block">
            {isZh ? '查價 · 訂房' : 'Check · book'}
          </p>
          <a
            href={bookingUrl(stay.searchTerm, stay.checkin, stay.checkout)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-1.5 rounded-pill px-4 py-2.5 font-mono text-[12px] font-medium text-white transition-transform hover:scale-[1.02]"
            style={{ background: '#003580' }}
          >
            Booking.com
            <ExternalLink size={13} strokeWidth={2} />
          </a>
          <a
            href={hotelsUrl(stay.searchTerm, stay.checkin, stay.checkout)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-1.5 rounded-pill px-4 py-2.5 font-mono text-[12px] font-medium text-white transition-transform hover:scale-[1.02]"
            style={{ background: '#D32F2F' }}
          >
            Hotels.com
            <ExternalLink size={13} strokeWidth={2} />
          </a>
          <p className="mt-1 text-center font-chinese text-[10px] leading-relaxed text-ink-faint lg:text-left">
            {isZh ? '已帶入日期與 3 人入住' : 'Pre-filled dates · 3 guests'}
          </p>
        </div>
      </div>
    </article>
  );
}

function FacilityRow({
  icon: Icon,
  label,
  children,
}: {
  icon: typeof BedDouble;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-2">
      <Icon size={15} strokeWidth={1.8} className="mt-0.5 shrink-0 text-ink-faint" />
      <div className="min-w-0">
        <p className="font-mono text-[10px] uppercase tracking-editorial text-ink-faint">
          {label}
        </p>
        <p className="font-chinese text-[13px] leading-snug text-ink">{children}</p>
      </div>
    </div>
  );
}
