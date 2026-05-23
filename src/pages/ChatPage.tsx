import { Link } from 'react-router-dom';
import { ArrowUpRight, MapPin } from 'lucide-react';
import { PlanChatbot } from '../components/PlanChatbot';
import { useStore } from '../store';
import { useLocalizedField } from '../hooks/useLocalizedField';

const CITY_DISPLAY: Record<string, { zh: string; en: string }> = {
  vienna: { zh: '維也納', en: 'Vienna' },
  salzburg: { zh: '薩爾斯堡', en: 'Salzburg' },
  hallstatt: { zh: '哈修塔特', en: 'Hallstatt' },
  innsbruck: { zh: '因斯布魯克', en: 'Innsbruck' },
  graz: { zh: '格拉茲', en: 'Graz' },
};
const cityLabel = (c: string) => CITY_DISPLAY[c] ?? { zh: c, en: c };

/**
 * Full-height standalone chat — a roomier version of the embedded PlanChatbot,
 * with a live mini-itinerary preview that updates as the assistant edits it.
 */
export function ChatPage() {
  return (
    <div className="flex h-full flex-col bg-cream md:flex-row">
      {/* Chat column */}
      <div className="flex min-h-0 flex-1 flex-col px-4 py-5 sm:px-6">
        <header className="mx-auto mb-4 w-full max-w-[680px] shrink-0">
          <p className="eyebrow mb-2">REISE · AI Concierge</p>
          <h1 className="font-serif text-[32px] italic leading-none text-ink">
            和 AI 一起規劃
          </h1>
          <p className="mt-1.5 font-chinese text-[14px] text-ink-muted">
            告訴我你的想法，我會即時調整右側行程。
          </p>
        </header>
        <div className="mx-auto min-h-0 w-full max-w-[680px] flex-1">
          <PlanChatbot variant="page" />
        </div>
      </div>

      {/* Live itinerary preview (desktop) */}
      <aside
        className="hidden w-[340px] shrink-0 overflow-y-auto px-5 py-5 md:block"
        style={{ background: 'var(--color-card)', borderLeft: '0.5px solid var(--color-border)' }}
      >
        <MiniItinerary />
      </aside>
    </div>
  );
}

function MiniItinerary() {
  const itinerary = useStore((s) => s.itinerary);
  const localized = useLocalizedField();

  return (
    <div>
      <p className="eyebrow mb-3">Live preview · 行程預覽</p>

      {itinerary.length === 0 ? (
        <div className="card text-center">
          <p className="font-chinese text-[13px] leading-relaxed text-ink-muted">
            目前還沒有行程。先到規劃頁面產生行程，或直接請 AI 幫你安排。
          </p>
          <Link to="/plan" className="btn-secondary mt-4" style={{ fontSize: 12 }}>
            前往規劃頁面
            <ArrowUpRight size={13} />
          </Link>
        </div>
      ) : (
        <ol className="flex flex-col gap-4">
          {itinerary.map((day) => (
            <li key={day.day}>
              <div className="mb-1.5 flex items-baseline gap-2">
                <span className="font-mono text-[11px] uppercase tracking-editorial text-lime-deep">
                  Day {String(day.day).padStart(2, '0')}
                </span>
                <span className="font-chinese text-[13px] font-medium text-ink">
                  {cityLabel(day.city).zh}
                </span>
              </div>
              {day.attractions.length === 0 ? (
                <p className="font-chinese text-[12px] text-ink-faint">尚未安排景點</p>
              ) : (
                <ul className="flex flex-col gap-1">
                  {day.attractions.map((a) => (
                    <li
                      key={a.id}
                      className="flex items-center gap-1.5 font-chinese text-[13px] text-ink-muted"
                    >
                      <MapPin size={12} className="shrink-0 text-ink-faint" />
                      <span className="truncate">{localized(a.name)}</span>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
