import { useTranslation } from 'react-i18next';
import { FilterPanel } from '../components/FilterPanel';

export function PlanPage() {
  const { t } = useTranslation();

  return (
    <div className="bg-cream">
      <header className="mx-auto max-w-[680px] px-6 pb-2 pt-16 text-center sm:pt-20">
        <p className="eyebrow mb-3">Step 01 · {t('nav.plan')}</p>
        <h1 className="font-serif text-4xl leading-tight text-ink sm:text-5xl">
          {t('filter.title')}
        </h1>
      </header>
      <FilterPanel />
    </div>
  );
}
