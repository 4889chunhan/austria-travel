import type { CSSProperties } from 'react';
import { cn } from '../utils/cn';

/**
 * Shimmer skeleton placeholder. Pair with the `.skeleton` utility in
 * globals.css. Pass width/height (number = px) and an optional radius.
 */
export function Skeleton({
  width = '100%',
  height = 16,
  radius,
  className,
  style,
}: {
  width?: number | string;
  height?: number | string;
  radius?: number | string;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <span
      aria-hidden
      className={cn('skeleton block', className)}
      style={{
        width,
        height,
        ...(radius !== undefined ? { borderRadius: radius } : null),
        ...style,
      }}
    />
  );
}
