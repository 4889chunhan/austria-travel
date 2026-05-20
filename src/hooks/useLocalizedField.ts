import { useTranslation } from 'react-i18next';

type BilingualField = { zh: string; en: string };

/**
 * Returns a getter that picks `zh` or `en` from a content field based on the
 * active i18n language. Use for *content* fields (Attraction.name, .tagline,
 * etc.) — for UI strings, use `t('key')` from `useTranslation()` directly.
 *
 * Extra keys on the field (e.g. `de` on Attraction.name) are ignored.
 */
export function useLocalizedField() {
  const { i18n } = useTranslation();
  const lang: 'zh' | 'en' = i18n.language.startsWith('zh') ? 'zh' : 'en';
  return <T extends BilingualField>(field: T): string => field[lang];
}
