import { Sparkles } from 'lucide-react';
import { useStore } from '../store';
import {
  CATEGORY_META,
  CATEGORY_ORDER,
  type CategoryMeta,
} from '../utils/categoryColors';
import { cn } from '../utils/cn';

/**
 * Glassmorphic horizontal filter bar at the top of the map. Reads /
 * writes `activeCategories` from the Zustand store. "All" is implicit —
 * an empty `activeCategories` array means no filter.
 */
export function MapFilterBar() {
  const activeCategories = useStore((s) => s.activeCategories);
  const toggleCategory = useStore((s) => s.toggleCategory);
  const clearCategories = useStore((s) => s.clearCategories);

  const allActive = activeCategories.length === 0;

  return (
    <div
      className="scrollbar-hidden absolute inset-x-0 top-0 z-30 flex h-[52px] items-center gap-1 overflow-x-auto px-4"
      style={{
        background: 'rgba(255, 255, 255, 0.93)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        borderBottom: '0.5px solid var(--color-border)',
        borderBottomLeftRadius: 'var(--radius-lg)',
        borderBottomRightRadius: 'var(--radius-lg)',
      }}
    >
      <AllPill active={allActive} onClick={clearCategories} />
      <Separator />
      {CATEGORY_ORDER.map((id, i) => {
        const meta = CATEGORY_META[id];
        const active = activeCategories.includes(id);
        return (
          <FilterPill
            key={id}
            meta={meta}
            active={active}
            onClick={() => toggleCategory(id)}
            withSeparator={i < CATEGORY_ORDER.length - 1}
          />
        );
      })}
    </div>
  );
}

function AllPill({ active, onClick }: { active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        'flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-pill px-3.5 py-1.5 font-chinese text-[12px] transition-all duration-200',
        active
          ? 'text-lime-deep'
          : 'text-ink-muted hover:text-ink',
      )}
      style={
        active
          ? {
              background: 'rgba(212, 232, 194, 0.45)',
              border: '1.5px solid var(--color-lime)',
            }
          : { border: '1.5px solid transparent' }
      }
    >
      <Sparkles size={14} strokeWidth={2.2} />
      全部 · All
    </button>
  );
}

function FilterPill({
  meta,
  active,
  onClick,
  withSeparator,
}: {
  meta: CategoryMeta;
  active: boolean;
  onClick: () => void;
  withSeparator: boolean;
}) {
  const Icon = meta.icon;
  return (
    <>
      <button
        type="button"
        onClick={onClick}
        aria-pressed={active}
        className={cn(
          'flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-pill px-3.5 py-1.5 font-chinese text-[12px] transition-all duration-200',
          active ? '' : 'text-ink-muted hover:text-ink',
        )}
        style={
          active
            ? {
                background: hexAlpha(meta.color, 0.15),
                color: meta.color,
                border: `1.5px solid ${meta.color}`,
              }
            : { border: '1.5px solid transparent' }
        }
      >
        <Icon size={14} strokeWidth={2.2} />
        {meta.zh}
      </button>
      {withSeparator && <Separator />}
    </>
  );
}

function Separator() {
  return (
    <span
      aria-hidden
      className="mx-1 inline-block shrink-0"
      style={{ width: 0.5, height: 20, background: 'rgba(0,0,0,0.08)' }}
    />
  );
}

/** Hex (#RRGGBB) + alpha → rgba string. */
function hexAlpha(hex: string, alpha: number): string {
  const m = /^#([0-9a-f]{6})$/i.exec(hex);
  if (!m) return hex;
  const num = parseInt(m[1], 16);
  const r = (num >> 16) & 255;
  const g = (num >> 8) & 255;
  const b = num & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
