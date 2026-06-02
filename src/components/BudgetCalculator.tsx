import { Fragment, useMemo, useState, type CSSProperties } from 'react';
import { ChevronDown, ChevronUp, Pencil, RotateCcw } from 'lucide-react';
import { useStore } from '../store';
import { useExchangeRate } from '../hooks/useExchangeRate';
import { usePulsedNumber } from '../hooks/usePulsedNumber';
import { findRoute } from '../data/transport';
import { cn } from '../utils/cn';
import { CITY_DISPLAY } from '../utils/cityDisplay';
import type { DayPlan, TripConfig } from '../types';

/* ---------------------------------------------------------------------------
   Static config
   --------------------------------------------------------------------------- */

type Lang = 'zh' | 'en';
type RowGroup = 'transport' | 'accommodation' | 'attractions' | 'food';

interface BudgetRow {
  id: string;
  group: RowGroup;
  label: string;
  note: string;
  baseEUR: number;
  editable: boolean;
}

const SECTION_META: Record<RowGroup, { zh: string; en: string; color: string }> = {
  transport: { zh: '交通', en: 'Transport', color: '#5B9EC9' },
  accommodation: { zh: '住宿', en: 'Accommodation', color: '#8B6F9B' },
  attractions: { zh: '門票', en: 'Tickets', color: '#D4A84B' },
  food: { zh: '餐飲', en: 'Food', color: '#6BAF7A' },
};
const BUFFER_COLOR = '#E5E5E0';
const SECTION_ORDER: RowGroup[] = ['transport', 'accommodation', 'attractions', 'food'];

/* ---------------------------------------------------------------------------
   Helpers
   --------------------------------------------------------------------------- */

const formatTWD = (n: number) => `NT$ ${Math.round(n).toLocaleString('en-US')}`;
const formatEUR = (n: number) => `€${Math.round(n).toLocaleString('en-US')}`;

const cityLabel = (city: string, lang: Lang) =>
  (CITY_DISPLAY[city] ?? { zh: city, en: city })[lang];

/** Pull a representative EUR number from a price string like "€30–50". */
function extractEUR(price?: string): number | null {
  if (!price) return null;
  const nums = price.match(/\d+(?:[.,]\d+)?/g);
  if (!nums?.length) return null;
  const vals = nums.map((n) => parseFloat(n.replace(',', '.')));
  if (vals.length >= 2) return Math.round((vals[0]! + vals[1]!) / 2);
  return Math.round(vals[0]!);
}

/** Walk the itinerary into editable budget line items, mirroring the store's
 *  estimation heuristics but with per-leg / per-night / per-ticket detail. */
function deriveRows(
  itinerary: DayPlan[],
  tripConfig: TripConfig,
  lang: Lang,
): BudgetRow[] {
  const pick = (f: { zh: string; en: string }) => f[lang];
  const rows: BudgetRow[] = [];

  // Transport — inter-city legs (from route data) + per-day local transit.
  for (let i = 1; i < itinerary.length; i++) {
    const prev = itinerary[i - 1]!;
    const cur = itinerary[i]!;
    if (prev.city !== cur.city) {
      const method = findRoute(prev.city, cur.city)?.methods[0];
      const price = extractEUR(method?.price) ?? 35;
      const op = method?.operator ? ` (${method.operator})` : '';
      rows.push({
        id: `transport-${i}`,
        group: 'transport',
        label: `${cityLabel(prev.city, lang)} → ${cityLabel(cur.city, lang)}${op}`,
        note: method ? `${method.operator ?? ''} ${method.duration}`.trim() : '估算',
        baseEUR: price,
        editable: true,
      });
    } else {
      rows.push({
        id: `transport-local-${i}`,
        group: 'transport',
        label: `${cityLabel(cur.city, lang)}${lang === 'zh' ? ' 市內交通' : ' local transit'}`,
        note: lang === 'zh' ? '大眾運輸估算' : 'public transit est.',
        baseEUR: 6,
        editable: true,
      });
    }
  }

  // Accommodation — group consecutive nights at the same property.
  let i = 0;
  while (i < itinerary.length) {
    const acc = itinerary[i]!.accommodation;
    if (!acc) {
      i += 1;
      continue;
    }
    let j = i;
    while (j + 1 < itinerary.length && itinerary[j + 1]!.accommodation?.id === acc.id) {
      j += 1;
    }
    const nights = j - i + 1;
    const per = acc.pricePerNight.EUR;
    rows.push({
      id: `acc-${i}`,
      group: 'accommodation',
      label: pick(acc.name),
      note: `${formatEUR(per)}/${lang === 'zh' ? '晚' : 'night'} × ${nights}`,
      baseEUR: per * nights,
      editable: true,
    });
    i = j + 1;
  }

  // Attractions — one row per paid attraction (deduped across days).
  const seen = new Set<string>();
  for (const day of itinerary) {
    for (const a of day.attractions) {
      const t = a.ticketPrice;
      if (!t || t.freeEntry || t.adult.EUR <= 0 || seen.has(a.id)) continue;
      seen.add(a.id);
      rows.push({
        id: `attr-${a.id}`,
        group: 'attractions',
        label: pick(a.name),
        note: t.adult.note ? pick(t.adult.note) : lang === 'zh' ? '成人票' : 'Adult',
        baseEUR: t.adult.EUR,
        editable: true,
      });
    }
  }

  // Food — single estimate row.
  const days = Math.max(1, tripConfig.days || itinerary.length);
  const travelers = Math.max(1, tripConfig.travelers);
  rows.push({
    id: 'food',
    group: 'food',
    label: lang === 'zh' ? '餐飲估算' : 'Food estimate',
    note:
      lang === 'zh'
        ? `${days}天 × ${travelers}人 × €35（午餐 €10–15 + 晚餐 €20–30）`
        : `${days}d × ${travelers}ppl × €35 (lunch €10–15 + dinner €20–30)`,
    baseEUR: days * travelers * 35,
    editable: true,
  });

  return rows;
}

/* ===========================================================================
   Component
   =========================================================================== */

export function BudgetCalculator() {
  const itinerary = useStore((s) => s.itinerary);
  const tripConfig = useStore((s) => s.tripConfig);
  const lang = useStore((s) => s.lang);
  const computeBudget = useStore((s) => s.computeBudget);
  const { rate, updatedAt, loading } = useExchangeRate();

  const [overrides, setOverrides] = useState<Record<string, number>>({});
  const [expanded, setExpanded] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [rateInfo, setRateInfo] = useState(false);

  const rows = useMemo(
    () => deriveRows(itinerary, tripConfig, lang),
    [itinerary, tripConfig, lang],
  );

  const eff = (r: BudgetRow) => overrides[r.id] ?? r.baseEUR;

  const sums = useMemo(() => {
    const acc: Record<RowGroup, number> = {
      transport: 0,
      accommodation: 0,
      attractions: 0,
      food: 0,
    };
    for (const r of rows) acc[r.group] += overrides[r.id] ?? r.baseEUR;
    return acc;
  }, [rows, overrides]);

  const subtotal = sums.transport + sums.accommodation + sums.attractions + sums.food;
  const buffer = Math.round(subtotal * 0.1);
  const totalEUR = Math.round(subtotal + buffer);
  const totalTWD = Math.round(totalEUR * rate);

  // Pulse the headline figure whenever it changes (hooks run before any return).
  const totalPulse = usePulsedNumber(totalTWD);

  if (itinerary.length === 0) return null;

  const travelers = Math.max(1, tripConfig.travelers);
  const days = Math.max(1, tripConfig.days || itinerary.length);

  const segments = [
    { key: 'transport', label: SECTION_META.transport.zh, color: SECTION_META.transport.color, eur: sums.transport },
    { key: 'accommodation', label: SECTION_META.accommodation.zh, color: SECTION_META.accommodation.color, eur: sums.accommodation },
    { key: 'tickets', label: SECTION_META.attractions.zh, color: SECTION_META.attractions.color, eur: sums.attractions },
    { key: 'food', label: SECTION_META.food.zh, color: SECTION_META.food.color, eur: sums.food },
    { key: 'buffer', label: '預備金', color: BUFFER_COLOR, eur: buffer },
  ];
  const segTotal = segments.reduce((a, b) => a + b.eur, 0) || 1;

  const updatedText = updatedAt
    ? new Date(updatedAt).toLocaleString('zh-TW', {
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      })
    : '預設匯率';

  const refresh = () => {
    setOverrides({});
    setEditingId(null);
    computeBudget();
  };

  const setOverride = (id: string, value: string) =>
    setOverrides((o) => ({ ...o, [id]: Math.max(0, Number(value) || 0) }));

  return (
    // Sticks to the top of the right-panel scroll area on desktop; on mobile
    // it just scrolls with the page (the whole panel stacks under the form).
    <div className="flex flex-col gap-4 md:top-0 md:z-10">
      {/* ===== Summary card ===== */}
      <div className="card" style={{ padding: 20 }}>
        <div className="flex flex-col gap-5 md:flex-row md:items-start md:gap-6">
          {/* Left — totals */}
          <div className="shrink-0">
            <p className="font-mono text-[11px] uppercase tracking-editorial text-ink-faint">
              預估總費用
            </p>
            <p
              aria-live="polite"
              aria-atomic="true"
              className="font-serif text-[36px] font-bold leading-none text-ink tabular-nums"
            >
              <span key={totalPulse.key} className={cn('inline-block', totalPulse.pulseClass)}>
                {formatTWD(totalTWD)}
              </span>
            </p>
            <p className="mt-1 font-mono text-[14px] text-ink-muted">
              ≈ {formatEUR(totalEUR)}
            </p>
            <div className="relative mt-2 inline-block">
              <button
                type="button"
                onClick={() => setRateInfo((v) => !v)}
                className="inline-flex items-center gap-1 rounded-pill bg-lime px-2.5 py-1 font-mono text-[10px] text-lime-deep transition hover:brightness-95"
              >
                1 EUR = {loading ? '…' : rate.toFixed(2)} TWD
              </button>
              {rateInfo && (
                <div
                  className="absolute left-0 top-full z-20 mt-1.5 w-48 rounded p-2.5 font-mono text-[10px] leading-relaxed text-ink-muted shadow-float"
                  style={{ background: 'var(--color-card)', border: '0.5px solid var(--color-border)' }}
                >
                  資料來源：Frankfurter API
                  <br />
                  更新時間：{updatedText}
                </div>
              )}
            </div>
          </div>

          {/* Center — stacked bar */}
          <div className="min-w-0 flex-1">
            <p className="mb-1.5 font-mono text-[12px] uppercase tracking-editorial text-ink-faint">
              費用分配
            </p>
            <div
              className="flex h-4 overflow-hidden rounded-pill"
              style={{ width: 220, maxWidth: '100%', background: 'var(--color-cream)' }}
            >
              {segments.map((seg, i) =>
                seg.eur <= 0 ? null : (
                  <span
                    key={seg.key}
                    className="bar-grow"
                    title={`${seg.label} · ${formatEUR(seg.eur)} · ${formatTWD(seg.eur * rate)}`}
                    style={
                      {
                        width: `${(seg.eur / segTotal) * 100}%`,
                        background: seg.color,
                        ['--w']: `${(seg.eur / segTotal) * 100}%`,
                        ['--index']: i,
                      } as CSSProperties
                    }
                  />
                ),
              )}
            </div>
            <ul className="mt-2.5 flex flex-col gap-1">
              {segments.map((seg) =>
                seg.eur <= 0 ? null : (
                  <li key={seg.key} className="flex items-center gap-2">
                    <span
                      aria-hidden
                      className="inline-block rounded-pill"
                      style={{ width: 8, height: 8, background: seg.color }}
                    />
                    <span className="font-chinese text-[11px] text-ink">{seg.label}</span>
                    <span className="ml-auto font-mono text-[10px] text-ink-muted">
                      {formatTWD(seg.eur * rate)}
                    </span>
                  </li>
                ),
              )}
            </ul>
          </div>

          {/* Right — averages + refresh */}
          <div className="flex shrink-0 flex-col gap-2 md:items-end">
            <button
              type="button"
              onClick={refresh}
              aria-label="重新計算預算"
              className="flex h-11 w-11 items-center justify-center self-start rounded-pill text-ink-muted transition hover:bg-cream hover:text-ink md:h-7 md:w-7 md:self-end"
            >
              <RotateCcw size={15} className={loading ? 'animate-spin' : undefined} />
            </button>
            <div
              className="grid grid-cols-2 gap-x-4 gap-y-1 md:block md:text-right"
              style={{
                background: '#F4F1EA',
                border: '0.5px solid var(--color-border)',
                borderRadius: 'var(--radius-md)',
                padding: '8px 12px',
              }}
            >
              <p className="font-mono text-[12px] text-ink-muted">
                每人均攤{' '}
                <span key={`pp-${totalPulse.key}`} className={cn('inline-block', totalPulse.pulseClass)}>
                  {formatTWD(totalTWD / travelers)}
                </span>
              </p>
              <p className="font-mono text-[12px] text-ink-muted">
                每日平均{' '}
                <span key={`pd-${totalPulse.key}`} className={cn('inline-block', totalPulse.pulseClass)}>
                  {formatTWD(totalTWD / days)}
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Detail toggle */}
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="mt-3 flex w-full items-center justify-center gap-1 border-t pt-3 font-mono text-[11px] uppercase tracking-editorial text-ink-faint transition-colors hover:text-ink"
        >
          {expanded ? '收起明細' : '查看明細'}
          {expanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
        </button>

        {expanded && (
          <BudgetDetailTable
            rows={rows}
            sums={sums}
            buffer={buffer}
            totalEUR={totalEUR}
            totalTWD={totalTWD}
            rate={rate}
            lang={lang}
            eff={eff}
            overrides={overrides}
            editingId={editingId}
            onStartEdit={setEditingId}
            onCommitEdit={() => setEditingId(null)}
            onChangeValue={setOverride}
          />
        )}
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------------------
   Detail table
   --------------------------------------------------------------------------- */

function BudgetDetailTable({
  rows,
  sums,
  buffer,
  totalEUR,
  totalTWD,
  rate,
  lang,
  eff,
  overrides,
  editingId,
  onStartEdit,
  onCommitEdit,
  onChangeValue,
}: {
  rows: BudgetRow[];
  sums: Record<RowGroup, number>;
  buffer: number;
  totalEUR: number;
  totalTWD: number;
  rate: number;
  lang: Lang;
  eff: (r: BudgetRow) => number;
  overrides: Record<string, number>;
  editingId: string | null;
  onStartEdit: (id: string) => void;
  onCommitEdit: () => void;
  onChangeValue: (id: string, value: string) => void;
}) {
  return (
    <div className="mt-3 overflow-x-auto">
    <table className="w-full min-w-[480px] border-collapse">
      <thead>
        <tr>
          {['項目', 'EUR', 'TWD', '說明'].map((h, i) => (
            <th
              key={h}
              className={cn(
                'pb-1.5 font-mono text-[11px] font-normal uppercase tracking-editorial text-ink-faint',
                i === 0 ? 'text-left' : i === 3 ? 'text-left' : 'text-right',
              )}
            >
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {SECTION_ORDER.map((group) => {
          const groupRows = rows.filter((r) => r.group === group);
          if (groupRows.length === 0) return null;
          const meta = SECTION_META[group];
          return (
            <Fragment key={group}>
              <tr style={{ background: 'var(--color-cream)' }}>
                <td colSpan={4} className="px-2 py-1.5">
                  <span className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-editorial text-ink-faint">
                    <span
                      aria-hidden
                      className="inline-block h-2 w-2 rounded-pill"
                      style={{ background: meta.color }}
                    />
                    {meta.zh} · {meta.en}
                    <span className="ml-auto text-ink-muted">{formatTWD(sums[group] * rate)}</span>
                  </span>
                </td>
              </tr>
              {groupRows.map((row) => {
                const value = eff(row);
                const edited = overrides[row.id] !== undefined;
                return (
                  <tr key={row.id} className="group border-b" style={{ borderColor: 'var(--color-border)' }}>
                    <td className="px-2 py-2 font-chinese text-[13px] text-ink">{row.label}</td>
                    <td className="px-2 py-2 text-right">
                      {editingId === row.id ? (
                        <input
                          type="number"
                          min={0}
                          autoFocus
                          value={value}
                          onChange={(e) => onChangeValue(row.id, e.target.value)}
                          onBlur={onCommitEdit}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') onCommitEdit();
                          }}
                          className="w-16 rounded bg-cream px-1.5 py-0.5 text-right font-mono text-[12px] text-ink outline-none"
                          style={{ border: '0.5px solid var(--color-border-med)' }}
                        />
                      ) : (
                        <span className="inline-flex items-center justify-end gap-1">
                          <span
                            className={cn(
                              'font-mono text-[12px]',
                              edited ? 'font-medium text-lime-deep' : 'text-ink-muted',
                            )}
                          >
                            {formatEUR(value)}
                          </span>
                          {row.editable && (
                            <button
                              type="button"
                              onClick={() => onStartEdit(row.id)}
                              aria-label={`編輯 ${row.label}`}
                              className="text-ink-faint opacity-0 transition hover:text-ink group-hover:opacity-100"
                            >
                              <Pencil size={11} />
                            </button>
                          )}
                        </span>
                      )}
                    </td>
                    <td className="px-2 py-2 text-right font-mono text-[12px] font-medium text-ink">
                      {formatTWD(value * rate)}
                    </td>
                    <td className="px-2 py-2 font-mono text-[10px] text-ink-faint">{row.note}</td>
                  </tr>
                );
              })}
            </Fragment>
          );
        })}

        {/* Buffer (derived) */}
        <tr className="border-b" style={{ borderColor: 'var(--color-border)' }}>
          <td className="px-2 py-2 font-chinese text-[13px] text-ink">
            {lang === 'zh' ? '預備金 (10%)' : 'Buffer (10%)'}
          </td>
          <td className="px-2 py-2 text-right font-mono text-[12px] text-ink-muted">
            {formatEUR(buffer)}
          </td>
          <td className="px-2 py-2 text-right font-mono text-[12px] font-medium text-ink">
            {formatTWD(buffer * rate)}
          </td>
          <td className="px-2 py-2 font-mono text-[10px] text-ink-faint">
            {lang === 'zh' ? '建議預留' : 'recommended'}
          </td>
        </tr>

        {/* Total */}
        <tr style={{ background: 'var(--color-lime)' }}>
          <td className="px-2 py-2.5 font-chinese text-[14px] font-semibold text-lime-deep">
            {lang === 'zh' ? '總計' : 'Total'}
          </td>
          <td className="px-2 py-2.5 text-right font-mono text-[13px] font-bold text-lime-deep">
            {formatEUR(totalEUR)}
          </td>
          <td className="px-2 py-2.5 text-right font-mono text-[13px] font-bold text-lime-deep">
            {formatTWD(totalTWD)}
          </td>
          <td className="px-2 py-2.5" />
        </tr>
      </tbody>
    </table>
    </div>
  );
}
