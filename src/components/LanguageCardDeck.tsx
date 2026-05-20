import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { LanguageCard } from './LanguageCard';
import type { LanguageCard as LanguageCardType } from '../types';
import { cn } from '../utils/cn';

const STACK_ROTATIONS = [0, -3.5, 4];
const STACK_Y_OFFSETS = [0, 6, 12];
const STACK_X_OFFSETS = [0, -4, 5];

/**
 * Stacked-deck view of language cards with prev/next controls and a
 * "{i} / {n}" progress indicator. The top card is interactive; the two
 * behind it are visual depth only.
 */
export function LanguageCardDeck({
  cards,
  className,
}: {
  cards: LanguageCardType[];
  className?: string;
}) {
  const [index, setIndex] = useState(0);

  if (cards.length === 0) return null;

  const safeIndex = Math.min(Math.max(0, index), cards.length - 1);
  const visible = cards.slice(safeIndex, safeIndex + 3);

  const prev = () => setIndex((i) => Math.max(0, i - 1));
  const next = () => setIndex((i) => Math.min(cards.length - 1, i + 1));

  const atStart = safeIndex === 0;
  const atEnd = safeIndex >= cards.length - 1;

  return (
    <div className={cn('flex flex-col items-center', className)}>
      <div
        className="relative w-full max-w-[300px]"
        // Extra height accommodates the two tilted cards behind the top one.
        style={{ aspectRatio: '300 / 190', marginBottom: 24 }}
      >
        {visible.map((card, stackPosition) => {
          const isTop = stackPosition === 0;
          return (
            <div
              key={`${card.id}-${safeIndex}-${stackPosition}`}
              className="absolute inset-0 transition-all duration-300 ease-out"
              style={{
                transform: `translate(${STACK_X_OFFSETS[stackPosition]}px, ${STACK_Y_OFFSETS[stackPosition]}px) rotate(${STACK_ROTATIONS[stackPosition]}deg)`,
                opacity: isTop ? 1 : Math.max(0.35, 0.7 - stackPosition * 0.18),
                zIndex: 10 - stackPosition,
                pointerEvents: isTop ? 'auto' : 'none',
                filter: isTop ? 'none' : 'blur(0.4px)',
              }}
            >
              <LanguageCard card={card} />
            </div>
          );
        })}
      </div>

      <div className="flex items-center gap-3">
        <DeckButton onClick={prev} disabled={atStart} ariaLabel="Previous card">
          <ChevronLeft size={16} strokeWidth={2.2} />
        </DeckButton>

        <span className="min-w-[3.5rem] text-center font-mono text-[12px] uppercase tracking-editorial text-ink-muted">
          {String(safeIndex + 1).padStart(2, '0')} / {String(cards.length).padStart(2, '0')}
        </span>

        <DeckButton onClick={next} disabled={atEnd} ariaLabel="Next card">
          <ChevronRight size={16} strokeWidth={2.2} />
        </DeckButton>
      </div>
    </div>
  );
}

function DeckButton({
  onClick,
  disabled,
  ariaLabel,
  children,
}: {
  onClick: () => void;
  disabled: boolean;
  ariaLabel: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className={cn(
        'flex h-9 w-9 items-center justify-center rounded-pill bg-lime text-lime-deep transition',
        'hover:bg-[#C2DAAC] active:scale-[0.97]',
        'disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-lime disabled:active:scale-100',
      )}
    >
      {children}
    </button>
  );
}
