import { useRef, useState, Fragment, type CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowUpRight, Volume2, VolumeX } from 'lucide-react';
import { useStore } from '../store';

const TICKER_CITIES = [
  '維也納', 'VIENNA',
  '薩爾斯堡', 'SALZBURG',
  '哈修塔特', 'HALLSTATT',
];

/**
 * Standalone fullscreen home page. Rendered outside `<Layout>` so the video
 * fills the viewport edge-to-edge; its own overlay header carries the logo,
 * language switcher, and mute button.
 *
 * Place the video at `public/hero.mp4` — Vite serves files from `public/` at
 * the site root, so `/hero.mp4` works in dev *and* production builds.
 * `/hero-poster.svg` ships a cream→sage gradient placeholder.
 */
export function HomePage() {
  const { t } = useTranslation();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);

  const toggleMute = () => {
    const v = videoRef.current;
    if (!v) return;
    const next = !muted;
    v.muted = next;
    setMuted(next);
  };

  return (
    <>
      {/* ============================================================
          Hero
          ============================================================ */}
      <section className="relative h-screen w-full overflow-hidden bg-cream">
        {/* Video layer */}
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          poster="/hero-poster.svg"
          className="absolute inset-0 z-0 h-full w-full object-cover"
        >
          <source src="/hero.mp4" type="video/mp4" />
        </video>

        {/* Bottom-fade gradient — keeps the video center clear */}
        <div
          className="absolute inset-0 z-10"
          style={{
            background:
              'linear-gradient(to top, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.15) 40%, transparent 70%)',
          }}
        />

        {/* Overlay header: logo (left), lang + mute (right) */}
        <div className="pointer-events-none absolute inset-x-0 top-0 z-30 flex items-center justify-between px-6 py-6 sm:px-12">
          <Link
            to="/"
            className="pointer-events-auto flex items-baseline gap-2 font-serif text-2xl leading-none text-white"
            style={{ textShadow: '0 1px 12px rgba(0,0,0,0.4)' }}
          >
            Austria Reise
            <span className="hidden font-mono text-[10px] uppercase tracking-editorial text-white/70 sm:inline">
              Est. 2026
            </span>
          </Link>
          <div className="pointer-events-auto flex items-center gap-3">
            <HeroLanguageSwitcher />
            <MuteButton muted={muted} onToggle={toggleMute} />
          </div>
        </div>

        {/* Content layer: bottom-left */}
        <div className="pointer-events-none absolute inset-0 z-20 flex flex-col justify-end px-6 pb-12 sm:px-12 sm:pb-16">
          <div className="pointer-events-auto max-w-3xl">
            <span className="mb-4 inline-flex items-center rounded-pill bg-lime px-4 py-1.5 font-chinese text-[12px] font-medium text-lime-deep">
              {t('hero.pill')}
            </span>

            <h1
              className="font-serif text-white"
              style={{
                lineHeight: 0.92,
                textShadow: '0 2px 24px rgba(0,0,0,0.3)',
              }}
            >
              <span className="block text-[56px] font-normal italic sm:text-[72px] md:text-[88px]">
                Discover
              </span>
              <span className="block text-[56px] font-bold sm:text-[72px] md:text-[88px]">
                Austria.
              </span>
            </h1>

            <p
              className="mt-4 max-w-lg font-chinese text-[17px] leading-relaxed"
              style={{ color: 'rgba(255,255,255,0.88)' }}
            >
              {t('hero.subtitle')}
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link to="/plan" className="btn-primary">
                {t('hero.cta')}
                <ArrowUpRight className="h-4 w-4" />
              </Link>
              <Link
                to="/map"
                className="inline-flex items-center gap-2 rounded-pill border border-white/60 px-5 py-2.5 font-chinese text-sm font-medium text-white transition hover:bg-white/30"
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
        </div>

        {/* Floating cards — hidden on small screens to keep mobile uncluttered */}
        <div className="pointer-events-none absolute inset-0 z-20 hidden md:block">
          {/* Card 1 — top-right */}
          <div
            className="float-card float-bob pointer-events-auto absolute max-w-[220px]"
            style={
              {
                top: '18%',
                right: '6%',
                '--card-rotate': 'rotate(2deg)',
                animationDelay: '0s',
                animationDuration: '4s',
              } as CSSProperties
            }
          >
            <p className="mb-1 font-mono text-[10px] uppercase tracking-editorial text-lime-dark">
              今日精選 · 維也納
            </p>
            <p className="font-chinese text-[13px] text-ink">
              維也納 · 5 個必訪景點
            </p>
          </div>

          {/* Card 2 — middle-right */}
          <div
            className="float-card float-bob pointer-events-auto absolute max-w-[220px]"
            style={
              {
                top: '42%',
                right: '4%',
                '--card-rotate': 'rotate(-1.5deg)',
                animationDelay: '1.3s',
                animationDuration: '4.5s',
              } as CSSProperties
            }
          >
            <p className="mb-2 font-mono text-[11px] text-ink-muted">
              126 景點 <span className="px-1 text-lime-dark">·</span> 3 城市
            </p>
            <p className="font-chinese text-[12px] font-medium text-lime-dark">
              開始探索 →
            </p>
          </div>

          {/* Card 3 — left */}
          <div
            className="float-card float-bob pointer-events-auto absolute max-w-[200px]"
            style={
              {
                top: '28%',
                left: '5%',
                '--card-rotate': 'rotate(1deg)',
                animationDelay: '2.6s',
                animationDuration: '4.2s',
              } as CSSProperties
            }
          >
            <p className="font-german text-[17px] italic leading-tight text-ink">
              Guten Morgen!
            </p>
            <p className="mt-1 font-chinese text-[12px] text-ink-muted">
              早安!
            </p>
          </div>
        </div>
      </section>

      {/* ============================================================
          Scrolling ticker
          ============================================================ */}
      <div
        className="overflow-hidden border-y bg-cream"
        style={{
          borderColor: 'var(--color-border)',
        }}
      >
        <div className="ticker-scroll flex w-max whitespace-nowrap py-3 font-mono text-[11px] uppercase tracking-editorial text-ink-muted">
          <TickerRow />
          <TickerRow aria-hidden />
        </div>
      </div>
    </>
  );
}

/* ---------------------------------------------------------------------------
   Sub-components
   --------------------------------------------------------------------------- */

function TickerRow({ 'aria-hidden': ariaHidden }: { 'aria-hidden'?: boolean }) {
  // 4× repeats keeps the strip visually dense and the loop seamless.
  const items = Array.from({ length: 4 }).flatMap(() => TICKER_CITIES);
  return (
    <div
      className="flex shrink-0 items-center gap-4 pr-4"
      aria-hidden={ariaHidden ? true : undefined}
    >
      {items.map((city, i) => (
        <Fragment key={`${city}-${i}`}>
          <span>{city}</span>
          <span className="text-lime-dark">·</span>
        </Fragment>
      ))}
    </div>
  );
}

function MuteButton({
  muted,
  onToggle,
}: {
  muted: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={muted ? 'Unmute video' : 'Mute video'}
      className="flex h-10 w-10 items-center justify-center rounded-pill border border-white/40 text-ink transition hover:bg-white/90"
      style={{
        background: 'rgba(255, 255, 255, 0.7)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
      }}
    >
      {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
    </button>
  );
}

/**
 * Hero-styled language switcher — same store integration as the global
 * `LanguageSwitcher` but with light-on-glass styling for the video backdrop.
 */
function HeroLanguageSwitcher() {
  const { t } = useTranslation();
  const lang = useStore((s) => s.lang);
  const setLang = useStore((s) => s.setLang);
  const next = lang === 'zh' ? 'en' : 'zh';

  return (
    <button
      type="button"
      onClick={() => setLang(next)}
      aria-label={lang === 'zh' ? 'Switch to English' : '切換至中文'}
      className="rounded-pill border border-white/40 px-3 py-1.5 font-mono text-[11px] uppercase tracking-editorial text-white transition-colors hover:bg-white/25"
      style={{
        background: 'rgba(255, 255, 255, 0.15)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
      }}
    >
      {t('nav.language')}
    </button>
  );
}
