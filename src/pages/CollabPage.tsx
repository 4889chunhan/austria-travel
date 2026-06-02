import { useEffect, useMemo, useState, type CSSProperties } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  ArrowUpRight,
  Calendar,
  Check,
  Clock,
  RefreshCw,
  ThumbsDown,
  ThumbsUp,
  Users,
} from 'lucide-react';
import { useStore } from '../store';
import { useLocalizedField } from '../hooks/useLocalizedField';
import { cn } from '../utils/cn';
import { CITY_DISPLAY } from '../utils/cityDisplay';
import type { Attraction, CollaborativeItinerary, DayPlan } from '../types';

const cityLabel = (c: string) => CITY_DISPLAY[c] ?? { zh: c, en: c };

/* ---------------------------------------------------------------------------
   Per-visitor vote direction map — localStorage `reise_votes_${collabId}`.
   --------------------------------------------------------------------------- */

type VoteMap = Record<string, 'up' | 'down'>;

function readMyVotes(id: string): VoteMap {
  try {
    return JSON.parse(localStorage.getItem(`reise_votes_${id}`) ?? '{}') as VoteMap;
  } catch {
    return {};
  }
}

function writeMyVotes(id: string, map: VoteMap) {
  try {
    localStorage.setItem(`reise_votes_${id}`, JSON.stringify(map));
  } catch {
    /* ignore quota */
  }
}

/* ===========================================================================
   Page — loads the shared itinerary, then routes to a status view
   =========================================================================== */

export function CollabPage() {
  const { id } = useParams<{ id: string }>();
  const loadFromShareLink = useStore((s) => s.loadFromShareLink);
  const [status, setStatus] = useState<'loading' | 'ready' | 'notfound'>(
    'loading',
  );

  useEffect(() => {
    let active = true;
    void (async () => {
      if (!id) {
        setStatus('notfound');
        return;
      }
      await loadFromShareLink(id);
      if (!active) return;
      const data = useStore.getState().collaborativeData;
      setStatus(data && data.id === id ? 'ready' : 'notfound');
    })();
    return () => {
      active = false;
    };
  }, [id, loadFromShareLink]);

  if (status === 'loading') {
    return (
      <CenteredState>
        <p className="font-chinese text-[15px] text-ink-muted">載入共享行程中…</p>
      </CenteredState>
    );
  }
  if (status === 'notfound') return <NotFoundState />;
  return <CollabView />;
}

/* ---- Status states --------------------------------------------------------- */

function CenteredState({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-[calc(100vh-64px)] flex-col items-center justify-center bg-cream px-6 text-center">
      {children}
    </div>
  );
}

function NotFoundState() {
  return (
    <CenteredState>
      <span aria-hidden className="font-serif" style={{ fontSize: 96, lineHeight: 1, opacity: 0.08 }}>
        ?
      </span>
      <h1 className="mt-2 font-serif text-3xl italic text-ink">找不到此行程</h1>
      <p className="mt-3 max-w-sm font-chinese text-[14px] leading-relaxed text-ink-muted">
        這個分享連結可能已失效，或在此裝置上找不到。請向分享者重新索取連結。
      </p>
      <Link to="/" className="btn-primary mt-7">
        回到首頁
        <ArrowUpRight size={14} />
      </Link>
    </CenteredState>
  );
}

function ExpiredState({ data }: { data: CollaborativeItinerary }) {
  const navigate = useNavigate();
  const setTripConfig = useStore((s) => s.setTripConfig);

  const recreate = () => {
    setTripConfig(data.tripConfig);
    navigate('/plan');
  };

  return (
    <CenteredState>
      <Clock size={56} className="text-ink-faint" strokeWidth={1.4} />
      <h1 className="mt-4 font-serif text-3xl italic text-ink">行程已過期</h1>
      <p className="mt-3 max-w-sm font-chinese text-[14px] leading-relaxed text-ink-muted">
        此行程已過期（分享連結 30 天有效期）。你可以用相同的設定，重新建立一份新的行程。
      </p>
      <button type="button" onClick={recreate} className="btn-primary mt-7">
        <RefreshCw size={14} />
        重新建立類似行程
      </button>
    </CenteredState>
  );
}

/* ===========================================================================
   Collaborative view
   =========================================================================== */

function CollabView() {
  const data = useStore((s) => s.collaborativeData);
  const [selectedDay, setSelectedDay] = useState(0);

  if (!data) return <NotFoundState />;

  const expired = new Date(data.expiresAt).getTime() < Date.now();
  if (expired) return <ExpiredState data={data} />;

  const itinerary = data.itinerary;
  const day = itinerary[selectedDay] ?? itinerary[0];

  return (
    <div className="min-h-[calc(100vh-64px)] bg-card">
      <div className="mx-auto flex max-w-[760px] flex-col gap-5 px-6 py-6">
        <CollabBanner data={data} />
        {itinerary.length > 0 && <VoteTally itinerary={itinerary} votes={data.votes} />}
        {itinerary.length > 1 && (
          <DayTabs days={itinerary} selected={selectedDay} onSelect={setSelectedDay} />
        )}
        {day && <CollabDay day={day} collabId={data.id} />}
      </div>
    </div>
  );
}

/* ---- Banner ---------------------------------------------------------------- */

function CollabBanner({ data }: { data: CollaborativeItinerary }) {
  return (
    <div
      className="card flex flex-wrap items-center justify-between gap-3"
      style={{ borderLeft: '4px solid var(--color-lime-deep)' }}
    >
      <div>
        <p className="font-mono text-[11px] uppercase tracking-editorial text-ink-faint">
          你正在查看共享行程
        </p>
        <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 font-chinese text-[13px] text-ink">
          <span>由 旅行者 分享</span>
          <span className="flex items-center gap-1 text-ink-muted">
            <Users size={13} /> 共 {data.tripConfig.travelers} 人
          </span>
          <span className="flex items-center gap-1 text-ink-muted">
            <Calendar size={13} /> {data.tripConfig.days} 天
          </span>
        </p>
        <p className="mt-1.5 font-chinese text-[14px] text-ink-muted">
          對景點投票來幫助決定行程！
        </p>
      </div>
      <Link to="/plan" className="btn-secondary shrink-0" style={{ fontSize: 13 }}>
        建立我自己的行程
        <ArrowUpRight size={14} />
      </Link>
    </div>
  );
}

/* ---- Vote tally summary ---------------------------------------------------- */

function VoteTally({
  itinerary,
  votes,
}: {
  itinerary: DayPlan[];
  votes: CollaborativeItinerary['votes'];
}) {
  const localized = useLocalizedField();
  const all = useMemo(
    () => itinerary.flatMap((d) => d.attractions),
    [itinerary],
  );

  return (
    <div className="card" style={{ padding: '12px 16px' }}>
      <p className="mb-2 font-mono text-[10px] uppercase tracking-editorial text-ink-faint">
        投票結果摘要
      </p>
      <div className="scrollbar-hidden flex gap-3 overflow-x-auto pb-1">
        {all.map((a) => {
          const entry = votes.find((v) => v.attractionId === a.id);
          const up = entry?.votes.up ?? 0;
          const down = entry?.votes.down ?? 0;
          const total = up + down;
          const upPct = total > 0 ? (up / total) * 100 : 0;
          return (
            <div key={a.id} className="shrink-0" style={{ width: 96 }}>
              <p className="truncate font-chinese text-[12px] text-ink">
                {localized(a.name).slice(0, 8)}
              </p>
              <div
                className="mt-1 flex h-1.5 w-full overflow-hidden rounded-pill"
                style={{ background: 'var(--color-border)' }}
              >
                <span style={{ width: `${upPct}%`, background: 'var(--color-sage)' }} />
                <span style={{ width: `${100 - upPct}%`, background: 'var(--color-border-med)' }} />
              </div>
              <p className="mt-0.5 font-mono text-[10px] text-ink-faint">
                {up}·{down}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ---- Day tabs -------------------------------------------------------------- */

function DayTabs({
  days,
  selected,
  onSelect,
}: {
  days: DayPlan[];
  selected: number;
  onSelect: (i: number) => void;
}) {
  return (
    <div
      className="scrollbar-hidden flex gap-1 overflow-x-auto p-1.5"
      style={{
        background: 'var(--color-cream)',
        border: '0.5px solid var(--color-border)',
        borderRadius: 'var(--radius-pill)',
      }}
    >
      {days.map((day, i) => (
        <button
          key={day.day}
          type="button"
          onClick={() => onSelect(i)}
          className={cn(
            'shrink-0 whitespace-nowrap rounded-pill px-4 py-2 font-chinese text-[13px] transition-colors',
            selected === i
              ? 'bg-lime font-medium text-lime-deep'
              : 'text-ink-muted hover:text-ink',
          )}
        >
          Day {day.day} · {cityLabel(day.city).zh}
        </button>
      ))}
    </div>
  );
}

/* ---- Day timeline ---------------------------------------------------------- */

function CollabDay({ day, collabId }: { day: DayPlan; collabId: string }) {
  if (day.attractions.length === 0) {
    return (
      <div className="card text-center">
        <p className="font-chinese text-[14px] text-ink-muted">這天沒有安排景點。</p>
      </div>
    );
  }
  return (
    <ol className="flex flex-col gap-4">
      {day.attractions.map((a, i) => (
        <li
          key={a.id}
          className="stagger-item"
          style={{ ['--index' as string]: i } as CSSProperties}
        >
          <CollabAttractionCard attraction={a} collabId={collabId} />
        </li>
      ))}
    </ol>
  );
}

/* ---- Attraction card with vote UI ------------------------------------------ */

function CollabAttractionCard({
  attraction,
  collabId,
}: {
  attraction: Attraction;
  collabId: string;
}) {
  const localized = useLocalizedField();
  const data = useStore((s) => s.collaborativeData);
  const submitVote = useStore((s) => s.submitVote);

  const [myVotes, setMyVotes] = useState<VoteMap>(() => readMyVotes(collabId));
  const myVote = myVotes[attraction.id];

  const entry = data?.votes.find((v) => v.attractionId === attraction.id);
  const up = entry?.votes.up ?? 0;
  const down = entry?.votes.down ?? 0;
  const voters = entry?.voterIds.length ?? 0;
  const city = cityLabel(attraction.city);

  const vote = (dir: 'up' | 'down') => {
    if (myVotes[attraction.id]) return; // already voted — locked
    submitVote(attraction.id, dir);
    const next = { ...myVotes, [attraction.id]: dir };
    setMyVotes(next);
    writeMyVotes(collabId, next);
  };

  return (
    <article className="card card-hover overflow-hidden" style={{ padding: 0 }}>
      <div className="flex gap-0">
        <div className="relative shrink-0 overflow-hidden" style={{ width: 110 }}>
          <img
            src={attraction.imageUrl}
            alt={localized(attraction.name)}
            loading="lazy"
            className="h-full w-full object-cover"
            style={{ borderRadius: 0 }}
          />
        </div>
        <div className="min-w-0 flex-1 px-4 py-3">
          <span
            className="rounded-pill px-2 py-0.5 font-mono uppercase tracking-editorial"
            style={{ background: 'var(--color-lime)', color: 'var(--color-lime-deep)', fontSize: 10 }}
          >
            {city.en}
          </span>
          <Link
            to={`/attraction/${attraction.slug}`}
            className="group mt-1.5 flex items-baseline gap-1"
          >
            <h3 className="font-chinese text-[16px] font-semibold leading-snug text-ink group-hover:text-lime-deep">
              {localized(attraction.name)}
            </h3>
            <ArrowUpRight size={13} className="text-ink-faint group-hover:text-lime-deep" />
          </Link>
          <p className="font-german text-[12px] text-ink-muted">
            {attraction.name.en}
          </p>
        </div>
      </div>

      {/* Vote row */}
      <div className="border-t px-4 py-3">
        <div className="mb-2 flex items-center justify-between">
          <span aria-live="polite" className="font-mono text-[11px] text-ink-faint">
            👍 {up} · 👎 {down}
          </span>
          {myVote && (
            <span className="font-mono text-[10px] uppercase tracking-editorial text-ink-faint">
              {voters} 人投票
            </span>
          )}
        </div>

        {!myVote ? (
          <div className="grid grid-cols-2 gap-2">
            <VotePill
              variant="up"
              onClick={() => vote('up')}
              ariaLabel={`投贊成票 · 目前 ${up} 票`}
            >
              <ThumbsUp size={15} /> 想去
            </VotePill>
            <VotePill
              variant="down"
              onClick={() => vote('down')}
              ariaLabel={`投反對票 · 目前 ${down} 票`}
            >
              <ThumbsDown size={15} /> 跳過
            </VotePill>
          </div>
        ) : (
          <VotePill variant={myVote === 'up' ? 'up' : 'down'} filled disabled>
            {myVote === 'up' ? <ThumbsUp size={15} /> : <ThumbsDown size={15} />}
            {myVote === 'up' ? '想去' : '跳過'}
            <Check size={14} />
          </VotePill>
        )}
      </div>
    </article>
  );
}

function VotePill({
  variant,
  filled = false,
  disabled = false,
  onClick,
  ariaLabel,
  children,
}: {
  variant: 'up' | 'down';
  filled?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  ariaLabel?: string;
  children: React.ReactNode;
}) {
  const isUp = variant === 'up';
  let style: React.CSSProperties;
  if (filled) {
    style = isUp
      ? { background: 'var(--color-lime)', color: 'var(--color-lime-deep)' }
      : { background: 'var(--color-border-med)', color: 'var(--color-ink-muted)' };
  } else {
    style = {
      border: `1px solid ${isUp ? 'var(--color-sage)' : 'var(--color-border-med)'}`,
      color: isUp ? 'var(--color-lime-deep)' : 'var(--color-ink-muted)',
    };
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className={cn(
        'focus-coral inline-flex w-full items-center justify-center gap-1.5 rounded-pill font-chinese text-[14px] transition active:scale-[0.97]',
        !disabled && (isUp ? 'hover:bg-[rgba(212,232,194,0.4)]' : 'hover:bg-black/5'),
        disabled && 'cursor-not-allowed',
      )}
      style={{ minHeight: 48, padding: '0 14px', ...style }}
    >
      {children}
    </button>
  );
}
