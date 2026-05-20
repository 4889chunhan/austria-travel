import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Ticket,
  Compass,
  Coffee,
  Utensils,
  Sparkles,
  Camera,
  CloudSun,
  Clock,
  CreditCard,
  AlertCircle,
  ShoppingBag,
  Headphones,
  Shirt,
  MessageCircle,
  type LucideIcon,
} from 'lucide-react';
import type { LanguageCard as LanguageCardType } from '../types';
import { useLocalizedField } from '../hooks/useLocalizedField';
import { cn } from '../utils/cn';

/**
 * Pick a lucide icon based on keywords in the situation's English label.
 * Falls back to a generic chat bubble. Intentionally heuristic — the data
 * model doesn't carry a category enum on language cards.
 */
function iconForSituation(en: string): LucideIcon {
  const s = en.toLowerCase();
  if (/ticket|counter|admission/.test(s)) return Ticket;
  if (/asking|finding|directions|where|queue|entrance/.test(s)) return Compass;
  if (/café|coffee|intermission|sekt/.test(s)) return Coffee;
  if (/restaurant|order|meal|dinner|trout/.test(s)) return Utensils;
  if (/did you know|fact|knowledge/.test(s)) return Sparkles;
  if (/photo|camera/.test(s)) return Camera;
  if (/weather|rain|cold|sun/.test(s)) return CloudSun;
  if (/time|wait|hours|last entry/.test(s)) return Clock;
  if (/card pay|payment|cash/.test(s)) return CreditCard;
  if (/emergency|safety|progress|warning/.test(s)) return AlertCircle;
  if (/shop|souvenir|buy/.test(s)) return ShoppingBag;
  if (/audio guide|language/.test(s)) return Headphones;
  if (/dress|wear|clothing/.test(s)) return Shirt;
  return MessageCircle;
}

/**
 * Bilingual signature card — German phrase on the front, Chinese + English
 * translation on the back. Flips on click / tap / keyboard.
 */
export function LanguageCard({
  card,
  className,
}: {
  card: LanguageCardType;
  className?: string;
}) {
  const { t } = useTranslation();
  const localized = useLocalizedField();
  const [flipped, setFlipped] = useState(false);

  const SituationIcon = iconForSituation(card.situation.en);
  const situationLabel = localized(card.situation);
  const note = card.note ? localized(card.note) : null;

  const toggle = () => setFlipped((f) => !f);

  return (
    <div
      className={cn(
        'group relative cursor-pointer select-none',
        'w-full max-w-[300px]',
        className,
      )}
      style={{ perspective: '1000px', aspectRatio: '300 / 190' }}
      onClick={toggle}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          toggle();
        }
      }}
      role="button"
      tabIndex={0}
      aria-label={t('card.flip')}
      aria-pressed={flipped}
    >
      <div
        className="relative h-full w-full transition-transform duration-200 group-hover:scale-[1.03]"
        style={{
          transformStyle: 'preserve-3d',
          transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
          transition:
            'transform 0.55s cubic-bezier(0.4, 0, 0.2, 1), filter 0.25s ease',
        }}
      >
        {/* ============ Front — German ============ */}
        <div
          className="absolute inset-0 flex flex-col p-5"
          style={{
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            background: 'var(--color-ink)',
            borderRadius: 'var(--radius-lg)',
            boxShadow: 'var(--shadow-card)',
          }}
        >
          <div className="flex items-center gap-1.5">
            <SituationIcon
              size={14}
              strokeWidth={2.2}
              style={{ color: 'var(--color-lime)' }}
            />
            <span
              className="font-mono uppercase tracking-editorial"
              style={{ fontSize: 10, color: 'var(--color-lime)' }}
            >
              {situationLabel}
            </span>
          </div>

          <div className="flex flex-1 flex-col items-center justify-center text-center">
            <p
              className="font-german italic text-white"
              style={{ fontSize: 26, lineHeight: 1.3, fontWeight: 400 }}
            >
              {card.german}
            </p>
            <p
              className="mt-3 font-mono"
              style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)' }}
            >
              {card.pronunciation}
            </p>
          </div>

          <div className="flex justify-end">
            <span
              className="font-mono uppercase tracking-editorial"
              style={{ fontSize: 9, color: 'rgba(255,255,255,0.35)' }}
            >
              {t('card.flip')} ↺
            </span>
          </div>
        </div>

        {/* ============ Back — Chinese + English ============ */}
        <div
          className="absolute inset-0 flex flex-col items-center p-5"
          style={{
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            background: 'var(--color-card)',
            borderRadius: 'var(--radius-lg)',
            border: '0.5px solid var(--color-border)',
            boxShadow: 'var(--shadow-card)',
            transform: 'rotateY(180deg)',
          }}
        >
          <span
            className="mt-1 rounded-pill px-3 py-1 font-mono uppercase tracking-editorial"
            style={{
              background: 'var(--color-lime)',
              color: 'var(--color-lime-deep)',
              fontSize: 10,
            }}
          >
            {situationLabel}
          </span>

          <div className="flex flex-1 flex-col items-center justify-center text-center">
            <p
              className="font-chinese text-ink"
              style={{ fontSize: 24, fontWeight: 500, lineHeight: 1.25 }}
            >
              {card.chinese}
            </p>
            <p
              className="mt-1 font-serif italic text-ink-muted"
              style={{ fontSize: 15, lineHeight: 1.35 }}
            >
              {card.english}
            </p>
          </div>

          {note && (
            <p
              className="px-2 text-center font-german italic text-ink-faint"
              style={{ fontSize: 11, lineHeight: 1.45 }}
            >
              {note}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
