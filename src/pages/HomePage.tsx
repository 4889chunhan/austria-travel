import { useRef, useState, type CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowUpRight, Volume2, VolumeX } from 'lucide-react';
import { useStore } from '../store';
import { CITY_DISPLAY } from '../utils/cityDisplay';

const cityLabel = (c: string) => CITY_DISPLAY[c] ?? { zh: c, en: c };

/**
 * Home page. The hero is a contained rounded card (not full-bleed) sitting on
 * the cream page below the shared Layout header. Below it, a 3-column row
 * pairs a portrait image with two notched-corner editorial cards, all aligned
 * at the bottom.
 */
export function HomePage() {
  const { t, i18n } = useTranslation();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);

  const itinerary = useStore((s) => s.itinerary);
  const tripConfig = useStore((s) => s.tripConfig);
  const isZh = i18n.language.startsWith('zh');

  const toggleMute = () => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !muted;
    setMuted(!muted);
  };

  return (
    <div className="bg-cream px-4 pb-16 pt-4 sm:px-6">
      {/* ============ HERO (contained rounded card) ============ */}
      <section
        className="relative overflow-hidden"
        style={{
          height: 'min(78vh, 800px)',
          borderRadius: 'var(--radius-xl)',
          // Black underlay so any subpixel gap at the rounded edges blends
          // with the video instead of showing the cream page through.
          background: '#000',
        }}
      >
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          poster="/hero-poster.svg"
          className="absolute inset-0 h-full w-full object-cover"
          // Slight overscan eliminates the thin edge lines caused by the video
          // not quite reaching the rounded mask after subpixel rounding.
          style={{ transform: 'scale(1.01)' }}
        >
          <source src="/hero.mp4" type="video/mp4" />
        </video>

        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(to top, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.12) 45%, transparent 70%)',
          }}
        />

        {/* Featured floating card — top-right, tilted. Hidden on mobile (would
            overlap the headline); gently bobs from tablet up. */}
        <Link
          to="/plan"
          className="float-card float-bob absolute hidden md:block"
          style={
            { top: 32, right: 32, width: 250, ['--card-rotate']: 'rotate(3deg)' } as CSSProperties
          }
        >
          <div className="flex items-center justify-between gap-2">
            <p className="font-mono text-[10px] uppercase tracking-editorial text-lime-dark">
              今日精選 · 維也納
            </p>
            <ArrowUpRight size={14} className="text-ink-faint" />
          </div>
          <div className="mt-2 overflow-hidden rounded-md" style={{ height: 110 }}>
            <img
              src="/home-float.png"
              alt="今日精選"
              className="h-full w-full object-cover"
              style={{ borderRadius: 0 }}
            />
          </div>
        </Link>

        {/* Mute toggle — bottom-right */}
        <button
          type="button"
          onClick={toggleMute}
          aria-label={muted ? 'Unmute video' : 'Mute video'}
          className="absolute z-20 flex h-10 w-10 items-center justify-center rounded-pill border border-white/40 text-ink transition hover:bg-white/90"
          style={{
            bottom: 24,
            right: 24,
            background: 'rgba(255, 255, 255, 0.7)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
          }}
        >
          {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
        </button>

        {/* Content — bottom-left */}
        <div className="absolute inset-x-0 bottom-0 px-8 pb-12 sm:px-12">
          <h1
            className="font-serif text-white"
            style={{
              lineHeight: 0.92,
              textShadow: '0 2px 24px rgba(0,0,0,0.3)',
            }}
          >
            <span className="block text-[44px] font-normal italic sm:text-[64px] md:text-[80px]">
              Discover
            </span>
            <span className="block text-[44px] font-bold sm:text-[64px] md:text-[80px]">
              Austria.
            </span>
          </h1>
          <p
            className="mt-4 max-w-md font-chinese text-[16px] leading-relaxed"
            style={{ color: 'rgba(255, 255, 255, 0.88)' }}
          >
            {t('hero.subtitle')}
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Link to="/plan" className="btn-primary w-full justify-center sm:w-auto">
              {t('hero.cta')}
              <ArrowUpRight size={16} />
            </Link>
            <Link
              to="/map"
              className="inline-flex w-full items-center justify-center gap-2 rounded-pill border border-white/60 px-5 py-2.5 font-chinese text-sm font-medium text-white transition hover:bg-white/30 sm:w-auto"
              style={{
                background: 'rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)',
              }}
            >
              {t('hero.ctaSecondary')}
            </Link>
          </div>
        </div>
      </section>

      {/* ============ SECOND SECTION ============
          2-column grid on md+: LEFT = image + editorial card (bottom-aligned,
          64px from hero); RIGHT = itinerary card (top-aligned, 32px from hero).
          Stacks vertically on mobile. */}
      <div className="md:grid md:grid-cols-[minmax(0,1fr)_320px] md:items-start md:gap-6">
        {/* LEFT column — image + editorial card row, 96px under hero */}
        <section className="mt-12 flex flex-col gap-8 md:mt-24 md:flex-row md:items-end">
          <Link
            to="/plan"
            className="block shrink-0 overflow-hidden rounded-2xl transition-transform duration-[250ms] ease-out hover:-translate-y-1"
            style={{ width: 300, aspectRatio: '280 / 380' }}
          >
            <img
              src="/home-scenery.png"
              alt="Discover Austria"
              className="h-full w-full object-cover"
              style={{ borderRadius: 0 }}
            />
          </Link>

          {/* Editorial "Plan a Trip" card — same .card shadow/border as the
              itinerary card on the right, with the arrow at the top-right. */}
          <Link
            to="/plan"
            className="card card-hover relative flex flex-1 flex-col justify-center"
            style={{ minHeight: 250, maxWidth: 480 }}
          >
            <ArrowUpRight
              size={22}
              className="absolute text-ink-muted"
              style={{ top: 20, right: 20 }}
            />
            <h2 className="font-serif text-3xl italic leading-tight text-ink sm:text-4xl">
              A slow journey
              <br />
              through Austria.
            </h2>
            <p className="mt-4 max-w-md font-chinese text-[15px] leading-relaxed text-ink-muted">
              精選城市、阿爾卑斯湖光與帝國建築 — 依你的步調,規劃一場專屬的奧地利旅行。
            </p>
            <span className="mt-6 inline-flex items-center gap-1.5 font-german text-sm text-lime-deep">
              {t('hero.cta')}
              <ArrowUpRight size={14} />
            </span>
          </Link>
        </section>

        {/* RIGHT column — itinerary overview (plain rectangle, no arrow icon) */}
        <div className="mt-6 md:mt-8">
          <ItineraryOverviewCard
            itinerary={itinerary}
            tripConfig={tripConfig}
            isZh={isZh}
          />
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------------------
   Itinerary overview card — shows up to 5 lines of the current plan, or an
   empty-state CTA when nothing is generated yet.
   --------------------------------------------------------------------------- */

function ItineraryOverviewCard({
  itinerary,
  tripConfig,
  isZh,
}: {
  itinerary: ReturnType<typeof useStore.getState>['itinerary'];
  tripConfig: ReturnType<typeof useStore.getState>['tripConfig'];
  isZh: boolean;
}) {
  const hasItinerary = itinerary.length > 0;
  const MAX_LINES = 4;
  const visibleDays = itinerary.slice(0, MAX_LINES);
  const remaining = Math.max(0, itinerary.length - MAX_LINES);

  return (
    <Link
      to="/plan"
      className="card card-hover flex flex-col"
      style={{ minHeight: 240 }}
    >
      <p className="eyebrow mb-3">Your itinerary · 行程預覽</p>

      {hasItinerary ? (
        <>
          <h2 className="font-serif text-[28px] italic leading-tight text-ink">
            {tripConfig.days} 天 · {tripConfig.cities.length || 1} 城
          </h2>
          <ul className="mt-3 flex flex-col gap-1.5">
            {visibleDays.map((day) => {
              const featured = day.attractions[0];
              return (
                <li
                  key={day.day}
                  className="flex items-baseline gap-2 truncate font-chinese text-[13px] text-ink-muted"
                >
                  <span className="shrink-0 font-mono text-[11px] uppercase tracking-editorial text-ink-faint">
                    Day {String(day.day).padStart(2, '0')}
                  </span>
                  <span className="shrink-0 text-ink">
                    {cityLabel(day.city)[isZh ? 'zh' : 'en']}
                  </span>
                  {featured && (
                    <span
                      className="shrink truncate rounded-pill bg-lime px-2 py-0.5 font-chinese text-[11px] text-lime-deep"
                      style={{ maxWidth: 140 }}
                    >
                      {featured.name[isZh ? 'zh' : 'en']}
                    </span>
                  )}
                </li>
              );
            })}
            {remaining > 0 && (
              <li className="font-mono text-[11px] text-ink-faint">
                …還有 {remaining} 天
              </li>
            )}
          </ul>
          <span className="mt-auto inline-flex items-center gap-1.5 pt-4 font-german text-sm text-lime-deep">
            View full itinerary
            <ArrowUpRight size={14} />
          </span>
        </>
      ) : (
        <>
          <h2 className="font-serif text-[28px] italic leading-tight text-ink">
            還沒有行程
          </h2>
          <p className="mt-3 font-chinese text-[14px] leading-relaxed text-ink-muted">
            從規劃頁面開始，或試試 7/8–7/20 中歐自駕範例
          </p>
          <span className="mt-auto inline-flex items-center gap-1.5 pt-4 font-german text-sm text-lime-deep">
            Start planning
            <ArrowUpRight size={14} />
          </span>
        </>
      )}
    </Link>
  );
}
