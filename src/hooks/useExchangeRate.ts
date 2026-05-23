import { useEffect, useState } from 'react';
import { useStore } from '../store';

const FOUR_HOURS_MS = 4 * 60 * 60 * 1000;

/**
 * EUR→TWD exchange rate, refreshed on mount when the cached value is stale
 * (> 4 hours). Delegates to the store's `fetchExchangeRate`, which calls the
 * Frankfurter API (https://api.frankfurter.app/latest?from=EUR&to=TWD),
 * caches to localStorage, and falls back to 34.5 on failure.
 *
 * Returns the live rate, its last-updated ISO timestamp, and a loading flag
 * that's true only while a fresh fetch is in flight.
 */
export function useExchangeRate(): {
  rate: number;
  updatedAt: string;
  loading: boolean;
} {
  const rate = useStore((s) => s.exchangeRate);
  const updatedAt = useStore((s) => s.exchangeRateUpdatedAt);
  const fetchExchangeRate = useStore((s) => s.fetchExchangeRate);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const stale =
      !updatedAt || Date.now() - new Date(updatedAt).getTime() > FOUR_HOURS_MS;
    if (!stale) return;

    let active = true;
    setLoading(true);
    void fetchExchangeRate().finally(() => {
      if (active) setLoading(false);
    });
    return () => {
      active = false;
    };
    // Intentionally mount-only: avoids refetch loops as the rate updates.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { rate, updatedAt: updatedAt ?? '', loading };
}
