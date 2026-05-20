import { Train, Bus, Car, type LucideIcon } from 'lucide-react';
import type { TransportMethod } from '../types';
import { cn } from '../utils/cn';

const TYPE_ICON: Record<TransportMethod['type'], LucideIcon> = {
  train: Train,
  bus: Bus,
  car: Car,
};

/**
 * Compact pill badge for a single transport method.
 * Format: `[icon] · 2h 30min · ÖBB Railjet`. The operator segment hides
 * automatically when the method has no operator field.
 */
export function TransportBadge({
  method,
  showOperator = true,
  className,
}: {
  method: TransportMethod;
  showOperator?: boolean;
  className?: string;
}) {
  const Icon = TYPE_ICON[method.type];

  return (
    <span
      className={cn(
        'inline-flex items-center gap-2 rounded-pill bg-card px-3 py-1 font-mono text-[11px]',
        className,
      )}
      style={{ border: '1px solid var(--color-border-med)' }}
    >
      <Icon size={12} strokeWidth={1.8} className="text-ink" />
      <span aria-hidden className="text-ink-faint">·</span>
      <span className="text-ink">{method.duration}</span>
      {showOperator && method.operator && (
        <>
          <span aria-hidden className="text-ink-faint">·</span>
          <span className="text-ink-muted">{method.operator}</span>
        </>
      )}
    </span>
  );
}
