import { useMemo, useState, type FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Beer,
  Coffee,
  ExternalLink,
  Globe,
  IceCreamCone,
  Instagram,
  Plus,
  Sandwich,
  Trash2,
  UtensilsCrossed,
  type LucideIcon,
} from 'lucide-react';
import { useStore } from '../store';
import { CITY_DISPLAY, cityLabel } from '../utils/cityDisplay';
import { cn } from '../utils/cn';
import type { FoodCategory, FoodItem } from '../types';

/* ---------------------------------------------------------------------------
   Food Collection · 美食收藏
   Save Instagram posts and web links for restaurants & cafés worth trying in
   Austria and Czechia. Persisted in localStorage via the store.
   --------------------------------------------------------------------------- */

const CATEGORY_META: Record<
  FoodCategory,
  { zh: string; en: string; icon: LucideIcon; color: string }
> = {
  restaurant: { zh: '餐廳', en: 'Restaurant', icon: UtensilsCrossed, color: '#E87D7D' },
  cafe: { zh: '咖啡館', en: 'Café', icon: Coffee, color: '#C4956A' },
  streetfood: { zh: '街頭小吃', en: 'Street food', icon: Sandwich, color: '#E8956D' },
  dessert: { zh: '甜點', en: 'Dessert', icon: IceCreamCone, color: '#9B7EC8' },
  bar: { zh: '酒吧', en: 'Bar', icon: Beer, color: '#D4A84B' },
};

const CATEGORY_ORDER: FoodCategory[] = [
  'restaurant',
  'cafe',
  'streetfood',
  'dessert',
  'bar',
];

type Filter = FoodCategory | 'all';

const EMPTY_FORM = {
  url: '',
  title: '',
  category: 'restaurant' as FoodCategory,
  city: '',
  note: '',
  imageUrl: '',
};

export function FoodPage() {
  const { i18n } = useTranslation();
  const isZh = i18n.language.startsWith('zh');

  const foodCollection = useStore((s) => s.foodCollection);
  const addFoodItem = useStore((s) => s.addFoodItem);
  const removeFoodItem = useStore((s) => s.removeFoodItem);

  const [form, setForm] = useState(EMPTY_FORM);
  const [filter, setFilter] = useState<Filter>('all');
  const [error, setError] = useState<string | null>(null);

  const set = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: foodCollection.length };
    for (const f of foodCollection) c[f.category] = (c[f.category] ?? 0) + 1;
    return c;
  }, [foodCollection]);

  const visible = useMemo(
    () =>
      filter === 'all'
        ? foodCollection
        : foodCollection.filter((f) => f.category === filter),
    [foodCollection, filter],
  );

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const url = form.url.trim();
    const title = form.title.trim();
    if (!url) {
      setError(isZh ? '請貼上 Instagram 或網頁連結。' : 'Paste an Instagram or web link.');
      return;
    }
    if (!/^https?:\/\//i.test(url)) {
      setError(isZh ? '連結需以 http:// 或 https:// 開頭。' : 'The link must start with http:// or https://.');
      return;
    }
    addFoodItem({
      url,
      title: title || url,
      category: form.category,
      city: form.city.trim() || undefined,
      note: form.note.trim() || undefined,
      imageUrl: form.imageUrl.trim() || undefined,
    });
    setForm(EMPTY_FORM);
    setError(null);
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-cream">
      <div className="mx-auto max-w-[1100px] px-6 py-12 sm:py-16">
        {/* Header */}
        <header className="mb-8">
          <p className="eyebrow mb-3">Eat &amp; Drink · Österreich × Čechy</p>
          <h1 className="font-serif text-[40px] italic leading-none text-ink sm:text-[48px]">
            Food Collection
          </h1>
          <p className="mt-2 font-chinese text-[16px] text-ink-muted">
            美食收藏 · 蒐集想吃的餐廳與咖啡館
          </p>
          <p className="mt-4 max-w-[680px] font-chinese text-[13px] leading-relaxed text-ink-faint">
            把在 Instagram 或網路上看到、想在奧地利與捷克嘗試的餐廳、咖啡館與小吃貼進來，建立自己的口袋清單。
            資料儲存在本機瀏覽器，隨時可新增或刪除。
          </p>
        </header>

        <div className="grid gap-8 lg:grid-cols-[340px_1fr]">
          {/* Add form */}
          <form
            onSubmit={handleSubmit}
            className="h-fit rounded-lg bg-card p-5 lg:sticky lg:top-6"
            style={{ border: '1px solid var(--color-border-med)', boxShadow: 'var(--shadow-card)' }}
          >
            <h2 className="mb-4 font-chinese text-[15px] font-semibold text-ink">
              {isZh ? '新增收藏' : 'Add to collection'}
            </h2>

            <Field label={isZh ? '連結（IG 貼文或網址）' : 'Link (IG post or URL)'}>
              <input
                type="url"
                inputMode="url"
                placeholder="https://www.instagram.com/p/…"
                value={form.url}
                onChange={(e) => set('url', e.target.value)}
                className="food-input"
              />
            </Field>

            <Field label={isZh ? '名稱' : 'Name'}>
              <input
                type="text"
                placeholder={isZh ? '例如 Café Central' : 'e.g. Café Central'}
                value={form.title}
                onChange={(e) => set('title', e.target.value)}
                className="food-input"
              />
            </Field>

            <Field label={isZh ? '分類' : 'Category'}>
              <div className="flex flex-wrap gap-1.5">
                {CATEGORY_ORDER.map((c) => {
                  const meta = CATEGORY_META[c];
                  const active = form.category === c;
                  const Icon = meta.icon;
                  return (
                    <button
                      key={c}
                      type="button"
                      onClick={() => set('category', c)}
                      className={cn(
                        'flex items-center gap-1 rounded-pill px-2.5 py-1 font-chinese text-[12px] transition-colors',
                        active ? 'bg-lime font-medium text-lime-deep' : 'text-ink-muted hover:text-ink',
                      )}
                      style={active ? undefined : { border: '0.5px solid var(--color-border-med)' }}
                    >
                      <Icon size={12} strokeWidth={1.8} />
                      {isZh ? meta.zh : meta.en}
                    </button>
                  );
                })}
              </div>
            </Field>

            <Field label={isZh ? '城市（選填）' : 'City (optional)'}>
              <input
                type="text"
                list="food-city-list"
                placeholder={isZh ? '維也納、布拉格…' : 'Vienna, Prague…'}
                value={form.city}
                onChange={(e) => set('city', e.target.value)}
                className="food-input"
              />
              <datalist id="food-city-list">
                {Object.entries(CITY_DISPLAY).map(([slug, label]) => (
                  <option key={slug} value={slug}>
                    {label.zh} · {label.en}
                  </option>
                ))}
              </datalist>
            </Field>

            <Field label={isZh ? '備註（選填）' : 'Note (optional)'}>
              <textarea
                rows={2}
                placeholder={isZh ? '想點的餐點、推薦原因…' : 'What to order, why it’s good…'}
                value={form.note}
                onChange={(e) => set('note', e.target.value)}
                className="food-input resize-none"
              />
            </Field>

            <Field label={isZh ? '圖片網址（選填）' : 'Image URL (optional)'}>
              <input
                type="url"
                inputMode="url"
                placeholder="https://…/photo.jpg"
                value={form.imageUrl}
                onChange={(e) => set('imageUrl', e.target.value)}
                className="food-input"
              />
            </Field>

            {error && (
              <p className="mb-2 font-chinese text-[12px] text-[#c0392b]">{error}</p>
            )}

            <button type="submit" className="btn-primary w-full justify-center">
              <Plus size={16} />
              {isZh ? '加入收藏' : 'Add'}
            </button>
          </form>

          {/* Collection */}
          <div>
            {/* Filter */}
            <div className="scrollbar-hidden mb-5 flex gap-2 overflow-x-auto pb-1">
              <FilterChip
                label={isZh ? '全部' : 'All'}
                count={counts.all ?? 0}
                active={filter === 'all'}
                onClick={() => setFilter('all')}
              />
              {CATEGORY_ORDER.map((c) => (
                <FilterChip
                  key={c}
                  label={isZh ? CATEGORY_META[c].zh : CATEGORY_META[c].en}
                  count={counts[c] ?? 0}
                  color={CATEGORY_META[c].color}
                  active={filter === c}
                  onClick={() => setFilter(c)}
                />
              ))}
            </div>

            {visible.length === 0 ? (
              <div className="rounded-lg bg-card p-10 text-center" style={{ border: '1px dashed var(--color-border-med)' }}>
                <p className="font-chinese text-[14px] text-ink-muted">
                  {isZh ? '還沒有收藏 — 從左側貼上第一個連結吧。' : 'Nothing saved yet — add your first link on the left.'}
                </p>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                {visible.map((item) => (
                  <FoodCard
                    key={item.id}
                    item={item}
                    isZh={isZh}
                    onRemove={() => removeFoodItem(item.id)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Local input styling (kept inline to avoid touching globals.css). */}
      <style>{`
        .food-input {
          width: 100%;
          background: var(--color-cream);
          border: 0.5px solid var(--color-border);
          border-radius: var(--radius-md);
          padding: 9px 11px;
          font-family: var(--font-zh);
          font-size: 13px;
          color: var(--color-ink);
          outline: none;
        }
        .food-input:focus { border-color: var(--color-sage); }
        .food-input::placeholder { color: var(--color-ink-faint); }
      `}</style>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="mb-3 block">
      <span className="mb-1 block font-mono text-[10px] uppercase tracking-editorial text-ink-faint">
        {label}
      </span>
      {children}
    </label>
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
        <span aria-hidden className="inline-block rounded-pill" style={{ width: 8, height: 8, background: color }} />
      )}
      {label}
      <span className="font-mono text-[11px] opacity-60">{count}</span>
    </button>
  );
}

function FoodCard({
  item,
  isZh,
  onRemove,
}: {
  item: FoodItem;
  isZh: boolean;
  onRemove: () => void;
}) {
  const meta = CATEGORY_META[item.category];
  const Icon = meta.icon;
  const SourceIcon = item.source === 'instagram' ? Instagram : Globe;
  const cityText = item.city
    ? CITY_DISPLAY[item.city]
      ? cityLabel(item.city, isZh ? 'zh' : 'en')
      : item.city
    : null;

  return (
    <article
      className="group flex flex-col overflow-hidden rounded-lg bg-card transition-all duration-200 hover:-translate-y-0.5"
      style={{ border: '1px solid var(--color-border-med)', boxShadow: 'var(--shadow-card)' }}
    >
      {item.imageUrl && (
        <div className="h-36 w-full overflow-hidden">
          <img
            src={item.imageUrl}
            alt={item.title}
            loading="lazy"
            className="h-full w-full object-cover"
            style={{ borderRadius: 0 }}
          />
        </div>
      )}

      <div className="flex flex-1 flex-col p-4">
        <div className="mb-2 flex items-center gap-1.5">
          <span
            className="flex items-center gap-1 rounded-pill px-2 py-0.5 font-chinese text-[11px] font-medium text-white"
            style={{ background: meta.color }}
          >
            <Icon size={11} strokeWidth={2} />
            {isZh ? meta.zh : meta.en}
          </span>
          <span
            className="flex items-center gap-1 rounded-pill px-2 py-0.5 font-mono text-[10px] uppercase tracking-editorial text-ink-muted"
            style={{ border: '0.5px solid var(--color-border-med)' }}
          >
            <SourceIcon size={11} strokeWidth={1.8} />
            {item.source === 'instagram' ? 'Instagram' : 'Web'}
          </span>
        </div>

        <h3 className="font-chinese text-[15px] font-semibold leading-snug text-ink">
          {item.title}
        </h3>
        {cityText && (
          <p className="mt-0.5 font-mono text-[11px] uppercase tracking-editorial text-ink-faint">
            {cityText}
          </p>
        )}
        {item.note && (
          <p className="mt-2 font-chinese text-[12.5px] leading-relaxed text-ink-muted">
            {item.note}
          </p>
        )}

        <div className="mt-auto flex items-center justify-between pt-3">
          <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 font-chinese text-[12px] font-medium text-lime-deep group-hover:underline"
          >
            {isZh ? '開啟連結' : 'Open link'}
            <ExternalLink size={12} strokeWidth={1.8} />
          </a>
          <button
            type="button"
            onClick={onRemove}
            aria-label={isZh ? '刪除' : 'Remove'}
            className="flex h-8 w-8 items-center justify-center rounded-pill text-ink-faint transition-colors hover:bg-cream hover:text-[#c0392b]"
          >
            <Trash2 size={14} strokeWidth={1.8} />
          </button>
        </div>
      </div>
    </article>
  );
}
