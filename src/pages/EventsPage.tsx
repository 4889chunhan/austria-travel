import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  CalendarDays,
  ChevronRight,
  ExternalLink,
  MapPin,
  MousePointerClick,
  Sparkles,
  Ticket,
  X,
} from 'lucide-react';
import {
  CATEGORY_LABEL,
  CATEGORY_ORDER,
  eventPrograms,
  FORMAT_LABEL,
  travelEvents,
  type EventCategory,
  type ProgramItem,
  type TravelEvent,
} from '../data/events';
import { CATEGORY_META } from '../utils/categoryColors';
import { useLocalizedField } from '../hooks/useLocalizedField';
import { cityLabel } from '../utils/cityDisplay';
import { cn } from '../utils/cn';

/* ---------------------------------------------------------------------------
   Events · 活動
   Concerts, orchestras, exhibitions, expos and architecture walks that fall
   within the 7/8–7/20 trip window. Clicking a card opens the programme in a
   sticky right-hand panel on desktop, or a bottom sheet on mobile.
   --------------------------------------------------------------------------- */

type Filter = EventCategory | 'all';

/** Category accent color, borrowed from the shared attraction palette. */
function categoryColor(cat: EventCategory): string {
  return CATEGORY_META[cat].color;
}

export function EventsPage() {
  const { i18n } = useTranslation();
  const localized = useLocalizedField();
  const isZh = i18n.language.startsWith('zh');
  const [filter, setFilter] = useState<Filter>('all');
  const [selected, setSelected] = useState<TravelEvent | null>(null);

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: travelEvents.length };
    for (const e of travelEvents) c[e.category] = (c[e.category] ?? 0) + 1;
    return c;
  }, []);

  const visible = useMemo(() => {
    const list =
      filter === 'all'
        ? travelEvents
        : travelEvents.filter((e) => e.category === filter);
    // Sort by the first trip-day so the grid roughly follows the journey.
    return [...list].sort((a, b) => (a.tripDays[0] ?? 99) - (b.tripDays[0] ?? 99));
  }, [filter]);

  return (
    <div className="min-h-[calc(100vh-64px)] bg-cream">
      <div className="mx-auto max-w-[1240px] px-6 py-12 sm:py-16">
        {/* Header */}
        <header className="mb-8">
          <p className="eyebrow mb-3">What’s On · 7/8 – 7/20 · Wien × Praha</p>
          <h1 className="font-serif text-[40px] italic leading-none text-ink sm:text-[48px]">
            Events &amp; Concerts
          </h1>
          <p className="mt-2 font-chinese text-[16px] text-ink-muted">
            活動 · 音樂會、交響樂團、展覽、博覽會與建築散步
          </p>
          <p className="mt-4 max-w-[680px] font-chinese text-[13px] leading-relaxed text-ink-faint">
            以下依旅行期間（7/8–7/20）整理維也納、薩爾斯堡、庫倫洛夫與布拉格的精選活動。點選任一活動即可在右側查看近兩週檔期與票價。
            實際場次與票價請以官方網站為準，建議提早訂票。
          </p>
        </header>

        {/* Category filter */}
        <div className="scrollbar-hidden mb-8 flex gap-2 overflow-x-auto pb-1">
          <FilterChip
            label={isZh ? '全部' : 'All'}
            count={counts.all ?? 0}
            active={filter === 'all'}
            onClick={() => setFilter('all')}
          />
          {CATEGORY_ORDER.map((cat) => (
            <FilterChip
              key={cat}
              label={isZh ? CATEGORY_LABEL[cat].zh : CATEGORY_LABEL[cat].en}
              count={counts[cat] ?? 0}
              color={categoryColor(cat)}
              active={filter === cat}
              onClick={() => setFilter(cat)}
            />
          ))}
        </div>

        {/* Master (grid) + detail (right rail on desktop) */}
        <div className="grid gap-6 lg:grid-cols-[1fr_minmax(360px,400px)]">
          <div className="grid h-fit gap-4 sm:grid-cols-2">
            {visible.map((e) => (
              <EventCard
                key={e.id}
                event={e}
                localized={localized}
                isZh={isZh}
                active={selected?.id === e.id}
                onOpen={() => setSelected(e)}
              />
            ))}
          </div>

          {/* Desktop right rail */}
          <aside className="hidden lg:block">
            <div
              className="sticky top-6 max-h-[calc(100vh-96px)] overflow-y-auto rounded-lg bg-card"
              style={{ border: '1px solid var(--color-border-med)', boxShadow: 'var(--shadow-card)' }}
            >
              {selected ? (
                <EventDetailContent
                  event={selected}
                  localized={localized}
                  isZh={isZh}
                  onClose={() => setSelected(null)}
                />
              ) : (
                <DetailPlaceholder isZh={isZh} />
              )}
            </div>
          </aside>
        </div>
      </div>

      {/* Mobile bottom sheet */}
      {selected && (
        <MobileSheet
          event={selected}
          localized={localized}
          isZh={isZh}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  );
}

function FilterChip({
  label,
  count,
  color,
  active,
  onClick,
}: {
  label: string;
  count: number;
  color?: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        'flex shrink-0 items-center gap-1.5 rounded-pill px-4 py-1.5 font-chinese text-[13px] transition-colors',
        active ? 'bg-lime font-medium text-lime-deep' : 'text-ink-muted hover:text-ink',
      )}
      style={active ? undefined : { border: '0.5px solid var(--color-border-med)' }}
    >
      {color && (
        <span
          aria-hidden
          className="inline-block rounded-pill"
          style={{ width: 8, height: 8, background: color }}
        />
      )}
      {label}
      <span className="font-mono text-[11px] opacity-60">{count}</span>
    </button>
  );
}

function EventCard({
  event,
  localized,
  isZh,
  active,
  onOpen,
}: {
  event: TravelEvent;
  localized: ReturnType<typeof useLocalizedField>;
  isZh: boolean;
  active: boolean;
  onOpen: () => void;
}) {
  const color = categoryColor(event.category);
  const format = FORMAT_LABEL[event.format];
  const category = CATEGORY_LABEL[event.category];
  const programCount = eventPrograms[event.id]?.length ?? 0;
  const subtitle = isZh ? event.title.en : event.title.zh;

  return (
    <article
      onClick={onOpen}
      role="button"
      tabIndex={0}
      aria-pressed={active}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onOpen();
        }
      }}
      className={cn(
        'group flex cursor-pointer flex-col rounded-lg bg-card p-5 text-left transition-all duration-200 hover:-translate-y-0.5',
        active && 'ring-2 ring-lime-deep',
      )}
      style={{
        border: '1px solid var(--color-border-med)',
        boxShadow: 'var(--shadow-card)',
        borderTop: `3px solid ${color}`,
      }}
    >
      {/* Chips */}
      <div className="mb-2.5 flex flex-wrap items-center gap-1.5">
        <span
          className="rounded-pill px-2 py-0.5 font-chinese text-[11px] font-medium text-white"
          style={{ background: color }}
        >
          {isZh ? category.zh : category.en}
        </span>
        <span
          className="rounded-pill px-2 py-0.5 font-chinese text-[11px] text-ink-muted"
          style={{ border: '0.5px solid var(--color-border-med)' }}
        >
          {isZh ? format.zh : format.en}
        </span>
        {event.featured && (
          <span className="flex items-center gap-1 rounded-pill bg-lime px-2 py-0.5 font-chinese text-[11px] font-medium text-lime-deep">
            <Sparkles size={10} strokeWidth={2} />
            {isZh ? '精選' : 'Pick'}
          </span>
        )}
      </div>

      {/* Title + English subtitle */}
      <h3 className="font-chinese text-[16px] font-semibold leading-snug text-ink group-hover:text-lime-deep">
        {localized(event.title)}
      </h3>
      <p className="font-serif text-[13px] italic leading-tight text-ink-faint">
        {subtitle}
      </p>

      {/* Venue + city */}
      <p className="mt-1.5 flex items-start gap-1.5 font-chinese text-[12px] text-ink-muted">
        <MapPin size={12} strokeWidth={1.8} className="mt-0.5 shrink-0" />
        <span>
          {localized(event.venue)}
          <span className="text-ink-faint"> · {cityLabel(event.city, isZh ? 'zh' : 'en')}</span>
        </span>
      </p>

      {/* When */}
      <p className="mt-1 flex items-center gap-1.5 font-mono text-[11px] text-lime-deep">
        <CalendarDays size={12} strokeWidth={1.8} className="shrink-0" />
        {localized(event.when)}
      </p>

      {/* Footer — open the programme */}
      <div className="mt-auto flex items-center justify-between pt-3">
        <span className="inline-flex items-center gap-1 font-chinese text-[12px] font-medium text-lime-deep group-hover:underline">
          <Ticket size={12} strokeWidth={1.8} />
          {programCount > 0
            ? isZh
              ? `檔期與票價（${programCount}）`
              : `Dates & prices (${programCount})`
            : isZh
              ? '詳情'
              : 'Details'}
        </span>
        <ChevronRight size={15} className="text-ink-faint transition-transform group-hover:translate-x-0.5" />
      </div>
    </article>
  );
}

/** Placeholder shown in the desktop rail before an event is picked. */
function DetailPlaceholder({ isZh }: { isZh: boolean }) {
  return (
    <div className="flex h-[360px] flex-col items-center justify-center px-8 text-center">
      <MousePointerClick size={28} strokeWidth={1.4} className="mb-3 text-ink-faint" />
      <p className="font-chinese text-[14px] text-ink-muted">
        {isZh ? '點選左側任一活動' : 'Select an event on the left'}
      </p>
      <p className="mt-1 font-chinese text-[12px] text-ink-faint">
        {isZh ? '即可在此查看近兩週檔期與票價' : 'to see the next two weeks of dates & prices'}
      </p>
    </div>
  );
}

/** Bottom sheet used on mobile widths (the rail is hidden there). */
function MobileSheet({
  event,
  localized,
  isZh,
  onClose,
}: {
  event: TravelEvent;
  localized: ReturnType<typeof useLocalizedField>;
  isZh: boolean;
  onClose: () => void;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div
      className="backdrop-in fixed inset-0 z-[70] flex items-end justify-center bg-black/40 lg:hidden"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className="sheet-up max-h-[88vh] w-full overflow-y-auto bg-card"
        style={{ borderTopLeftRadius: 'var(--radius-xl)', borderTopRightRadius: 'var(--radius-xl)' }}
        onClick={(e) => e.stopPropagation()}
      >
        <EventDetailContent
          event={event}
          localized={localized}
          isZh={isZh}
          onClose={onClose}
        />
      </div>
    </div>
  );
}

/** Reusable detail body — used by both the desktop rail and the mobile sheet. */
function EventDetailContent({
  event,
  localized,
  isZh,
  onClose,
}: {
  event: TravelEvent;
  localized: ReturnType<typeof useLocalizedField>;
  isZh: boolean;
  onClose: () => void;
}) {
  const color = categoryColor(event.category);
  const format = FORMAT_LABEL[event.format];
  const category = CATEGORY_LABEL[event.category];
  const program = eventPrograms[event.id] ?? [];
  const subtitle = isZh ? event.title.en : event.title.zh;

  return (
    <div className="flex flex-col">
      {/* Header */}
      <div className="relative px-6 pb-4 pt-6" style={{ borderTop: `4px solid ${color}` }}>
        <button
          type="button"
          onClick={onClose}
          aria-label={isZh ? '關閉' : 'Close'}
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-pill text-ink-muted transition hover:bg-cream hover:text-ink"
        >
          <X size={17} />
        </button>

        <div className="mb-2 flex flex-wrap items-center gap-1.5">
          <span
            className="rounded-pill px-2 py-0.5 font-chinese text-[11px] font-medium text-white"
            style={{ background: color }}
          >
            {isZh ? category.zh : category.en}
          </span>
          <span
            className="rounded-pill px-2 py-0.5 font-chinese text-[11px] text-ink-muted"
            style={{ border: '0.5px solid var(--color-border-med)' }}
          >
            {isZh ? format.zh : format.en}
          </span>
        </div>

        <h2 className="pr-8 font-chinese text-[20px] font-semibold leading-snug text-ink">
          {localized(event.title)}
        </h2>
        <p className="font-serif text-[14px] italic leading-tight text-ink-faint">
          {subtitle}
        </p>
        <p className="mt-1.5 flex items-center gap-1.5 font-chinese text-[12.5px] text-ink-muted">
          <MapPin size={13} strokeWidth={1.8} className="shrink-0" />
          {localized(event.venue)} · {cityLabel(event.city, isZh ? 'zh' : 'en')}
        </p>
      </div>

      {/* Body */}
      <div className="px-6 pb-6">
        <p className="font-chinese text-[13px] leading-relaxed text-ink-muted">
          {localized(event.description)}
        </p>

        <h3 className="mb-2.5 mt-5 font-mono text-[11px] uppercase tracking-editorial text-ink-faint">
          {isZh ? '近兩週檔期與票價' : 'What’s on · next two weeks'}
        </h3>

        {program.length === 0 ? (
          <p className="font-chinese text-[13px] text-ink-faint">
            {isZh ? '詳細檔期請見官方網站。' : 'See the official site for the full schedule.'}
          </p>
        ) : (
          <ul className="flex flex-col gap-2">
            {program.map((p, i) => (
              <ProgramRow key={i} item={p} localized={localized} isZh={isZh} />
            ))}
          </ul>
        )}

        {event.priceNote && (
          <p className="mt-3 rounded-lg px-3 py-2 font-chinese text-[12px] text-lime-deep" style={{ background: 'var(--color-lime)' }}>
            💡 {localized(event.priceNote)}
          </p>
        )}

        <p className="mt-3 font-chinese text-[11px] leading-relaxed text-ink-faint">
          {isZh
            ? '＊ 2026 年 7 月的實際場次、卡司與票價以官方網站為準，建議提早訂票。'
            : '* July 2026 dates, casts and prices are indicative — confirm and book on the official site.'}
        </p>

        {event.url && (
          <a
            href={event.url}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary mt-4 w-full justify-center"
          >
            {isZh ? '前往官方網站訂票' : 'Book on the official site'}
            <ExternalLink size={15} />
          </a>
        )}
      </div>
    </div>
  );
}

/** A single programme entry — stacked top-to-bottom: date/time · name · price. */
function ProgramRow({
  item,
  localized,
  isZh,
}: {
  item: ProgramItem;
  localized: ReturnType<typeof useLocalizedField>;
  isZh: boolean;
}) {
  const dateText = item.date
    ? formatProgramDate(item.date, isZh)
    : item.dateLabel
      ? localized(item.dateLabel)
      : '';

  return (
    <li
      className="rounded-lg px-3.5 py-3"
      style={{ background: 'var(--color-cream)', border: '0.5px solid var(--color-border)' }}
    >
      {/* Row 1 — date & time */}
      <div className="flex items-center gap-1.5">
        <CalendarDays size={13} strokeWidth={1.8} className="shrink-0 text-ink-faint" />
        <span className="font-mono text-[12px] font-medium text-ink">{dateText}</span>
        {item.time && (
          <span className="font-mono text-[12px] text-ink-muted">· {item.time}</span>
        )}
        {item.soldOut && (
          <span className="ml-1 rounded-pill bg-[#f6e0e0] px-1.5 py-0.5 font-chinese text-[10px] text-[#c0392b]">
            {isZh ? '售罄' : 'Sold out'}
          </span>
        )}
      </div>

      {/* Row 2 — programme / exhibition name */}
      <p className="mt-1.5 font-chinese text-[13.5px] leading-snug text-ink">
        {localized(item.title)}
      </p>
      {item.note && (
        <p className="mt-0.5 font-chinese text-[11.5px] leading-relaxed text-ink-faint">
          {localized(item.note)}
        </p>
      )}

      {/* Row 3 — price */}
      {item.price && (
        <p className="mt-2 flex items-center gap-1.5 font-mono text-[12px] font-medium text-lime-deep">
          <Ticket size={12} strokeWidth={1.8} className="shrink-0" />
          {localized(item.price)}
        </p>
      )}
    </li>
  );
}

/** "7/9 (三)" from an ISO date. */
function formatProgramDate(iso: string, isZh: boolean): string {
  const d = new Date(`${iso}T00:00:00`);
  if (Number.isNaN(d.getTime())) return iso;
  const md = `${d.getMonth() + 1}/${d.getDate()}`;
  if (!isZh) return md;
  const weekday = ['日', '一', '二', '三', '四', '五', '六'][d.getDay()];
  return `${md} (${weekday})`;
}
