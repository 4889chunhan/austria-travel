import { useTranslation } from 'react-i18next';
import { useStore } from '../store';

/**
 * Toggles UI language between Traditional Chinese and English.
 *
 * The store's `setLang` calls `i18n.changeLanguage`, and i18next's
 * `LanguageDetector` middleware persists the choice to
 * `localStorage['austria-reise-lang']`. So this button is the only
 * touch-point needed — persistence is handled downstream.
 */
export function LanguageSwitcher() {
  const { t } = useTranslation();
  const lang = useStore((s) => s.lang);
  const setLang = useStore((s) => s.setLang);

  const next = lang === 'zh' ? 'en' : 'zh';

  return (
    <button
      type="button"
      onClick={() => setLang(next)}
      aria-label={`切換語言 — 目前：${lang === 'zh' ? '中文' : 'English'}`}
      className="inline-flex min-h-[44px] items-center rounded-pill border px-3 py-1.5 font-mono text-[11px] uppercase tracking-editorial text-ink-muted transition-colors hover:border-med hover:text-ink"
    >
      {t('nav.language')}
    </button>
  );
}
