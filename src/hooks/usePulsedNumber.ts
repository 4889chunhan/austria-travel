import { useEffect, useRef, useState } from 'react';

/**
 * Replays a brief pulse animation whenever `value` changes. Returns a `key`
 * (bump it on the animated element to restart the CSS animation) and a
 * `pulseClass` that is empty on first render — so the element only pulses on
 * *changes*, not on mount.
 *
 * Usage:
 *   const { key, pulseClass } = usePulsedNumber(total);
 *   <span key={key} className={cn('...', pulseClass)}>{total}</span>
 */
export function usePulsedNumber(value: number): { key: number; pulseClass: string } {
  const [key, setKey] = useState(0);
  const prev = useRef(value);

  useEffect(() => {
    if (prev.current !== value) {
      prev.current = value;
      setKey((k) => k + 1);
    }
  }, [value]);

  return { key, pulseClass: key > 0 ? 'number-pulse' : '' };
}
