import { Plus, Minus, Route } from 'lucide-react';
import { cn } from '../utils/cn';

/**
 * Dark vertical zoom card — bottom-right of map.
 */
export function ZoomControls({
  onZoomIn,
  onZoomOut,
}: {
  onZoomIn: () => void;
  onZoomOut: () => void;
}) {
  return (
    <div
      className="absolute z-20 flex flex-col items-stretch overflow-hidden"
      style={{
        right: 16,
        bottom: 40,
        width: 52,
        padding: '8px 0',
        background: 'rgba(30, 30, 28, 0.88)',
        backdropFilter: 'blur(6px)',
        WebkitBackdropFilter: 'blur(6px)',
        borderRadius: 'var(--radius-xl)',
        border: '0.5px solid rgba(255,255,255,0.08)',
        boxShadow: '0 4px 20px rgba(0,0,0,0.25)',
      }}
    >
      <span
        className="pt-2 text-center font-mono uppercase tracking-editorial"
        style={{ fontSize: 9, color: 'rgba(255,255,255,0.5)' }}
      >
        Zoom in
      </span>
      <ZoomButton onClick={onZoomIn} aria-label="Zoom in">
        <Plus size={20} strokeWidth={1.5} />
      </ZoomButton>
      <hr
        className="mx-auto"
        style={{
          width: '60%',
          border: 0,
          borderTop: '0.5px solid rgba(255,255,255,0.12)',
          margin: '2px auto',
        }}
      />
      <ZoomButton onClick={onZoomOut} aria-label="Zoom out">
        <Minus size={20} strokeWidth={1.5} />
      </ZoomButton>
      <span
        className="pb-2 text-center font-mono uppercase tracking-editorial"
        style={{ fontSize: 9, color: 'rgba(255,255,255,0.5)' }}
      >
        Zoom out
      </span>
    </div>
  );
}

function ZoomButton({
  onClick,
  children,
  'aria-label': ariaLabel,
}: {
  onClick: () => void;
  children: React.ReactNode;
  'aria-label': string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      className="flex h-11 w-full items-center justify-center text-white transition-colors"
      style={{ background: 'transparent' }}
      onMouseEnter={(e) =>
        (e.currentTarget.style.background = 'rgba(255,255,255,0.08)')
      }
      onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
    >
      {children}
    </button>
  );
}

/**
 * Route-mode toggle pill — top-right of the filter bar area, lime when active.
 */
export function RouteToggle({
  enabled,
  active,
  onToggle,
}: {
  enabled: boolean;
  active: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      disabled={!enabled}
      aria-pressed={active}
      title={enabled ? '切換路線模式' : '請先產生行程'}
      className={cn(
        'absolute z-30 flex items-center gap-1.5 rounded-pill px-3.5 py-1.5 font-chinese text-[12px] font-medium transition-all duration-200',
        'shadow-card',
        active
          ? 'text-lime-deep'
          : 'text-ink-muted hover:text-ink',
        !enabled && 'cursor-not-allowed opacity-50',
      )}
      style={{
        top: 64,
        right: 16,
        background: active ? 'var(--color-lime)' : 'rgba(255,255,255,0.93)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        border: active
          ? '1.5px solid var(--color-lime-dark)'
          : '0.5px solid var(--color-border)',
      }}
    >
      <Route size={14} strokeWidth={2.2} />
      路線模式
    </button>
  );
}
