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
 * Heuristic — the data model doesn't carry a category enum on cards.
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

// Font sizes scale down as text gets longer so nothing overflows the fixed
// card. The card is 300×200; these thresholds keep the longest seed phrases
// (~65 chars) inside the bounds.
function germanFontSize(text: string): number {
  const n = text.length;
  if (n > 58) return 15;
  if (n > 44) return 17;
  if (n > 30) return 20;
  return 24;
}
function pronFontSize(text: string): number {
  const n = text.length;
  if (n > 56) return 9;
  if (n > 38) return 10;
  return 11;
}
function chineseFontSize(text: string): number {
  const n = text.length;
  if (n > 26) return 16;
  if (n > 16) return 19;
  return 23;
}
function englishFontSize(text: string): number {
  return text.length > 52 ? 12.5 : 14.5;
}

/**
 * Bilingual signature card — German on the front, Chinese + English on the
 * back. Flips on click / tap / keyboard. Text auto-scales to avoid overflow.
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
  // Emergency cards get a soft coral back face to signal importance.
  const isEmergency = card.scenario === 'emergency';

  const toggle = () => setFlipped((f) => !f);

  return (
    <div
      className={cn(
        'group relative w-full max-w-[300px] cursor-pointer select-none',
        className,
      )}
      style={{ perspective: '1000px', aspectRatio: '300 / 200' }}
      onClick={toggle}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          toggle();
        }
      }}
      role="button"
      tabIndex={0}
      aria-label={`語言卡片：${card.german}，點擊翻轉查看中文翻譯`}
      aria-pressed={flipped}
    >
      <div
        className="relative h-full w-full transition-transform duration-200 group-hover:scale-[1.03]"
        style={{
          transformStyle: 'preserve-3d',
          transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
          transition: 'transform 0.55s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        {/* ============ Front — German ============ */}
        <div
          className="absolute inset-0 flex flex-col overflow-hidden p-4"
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
              size={13}
              strokeWidth={2.2}
              style={{ color: 'var(--color-lime)', flexShrink: 0 }}
            />
            <span
              className="truncate font-mono uppercase tracking-editorial"
              style={{ fontSize: 10, color: 'var(--color-lime)' }}
            >
              {situationLabel}
            </span>
          </div>

          <div className="flex flex-1 flex-col items-center justify-center overflow-hidden text-center">
            <p
              className="font-german italic text-white"
              style={{ fontSize: germanFontSize(card.german), lineHeight: 1.25 }}
            >
              {card.german}
            </p>
            <p
              className="mt-2 font-mono"
              style={{
                fontSize: pronFontSize(card.pronunciation),
                lineHeight: 1.35,
                color: 'rgba(255,255,255,0.45)',
              }}
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
          className="absolute inset-0 flex flex-col items-center overflow-hidden p-4"
          style={{
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            background: isEmergency ? '#FFF5F5' : 'var(--color-card)',
            borderRadius: 'var(--radius-lg)',
            border: isEmergency
              ? '0.5px solid #F1C9C9'
              : '0.5px solid var(--color-border)',
            boxShadow: 'var(--shadow-card)',
            transform: 'rotateY(180deg)',
          }}
        >
          <span
            className="max-w-full shrink-0 truncate rounded-pill px-3 py-1 font-mono uppercase tracking-editorial"
            style={{
              background: isEmergency ? '#FBDCDC' : 'var(--color-lime)',
              color: isEmergency ? '#B3261E' : 'var(--color-lime-deep)',
              fontSize: 10,
            }}
          >
            {situationLabel}
          </span>

          <div className="flex flex-1 flex-col items-center justify-center overflow-hidden text-center">
            <p
              className="font-chinese text-ink"
              style={{
                fontSize: chineseFontSize(card.chinese),
                fontWeight: 500,
                lineHeight: 1.25,
              }}
            >
              {card.chinese}
            </p>
            <p
              className="mt-1 font-serif italic text-ink-muted"
              style={{ fontSize: englishFontSize(card.english), lineHeight: 1.3 }}
            >
              {card.english}
            </p>
          </div>

          {note && (
            <p
              className="shrink-0 px-1 text-center font-german italic text-ink-faint"
              style={{
                fontSize: 10.5,
                lineHeight: 1.4,
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}
            >
              {note}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
