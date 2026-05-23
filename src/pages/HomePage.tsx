import { useRef, useState, type CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowUpRight, Volume2, VolumeX } from 'lucide-react';
import { attractions } from '../data/attractions';
import { useLocalizedField } from '../hooks/useLocalizedField';

/**
 * Home page. The hero is a contained rounded card (not full-bleed) sitting on
 * the cream page below the shared Layout header. Below it, a left-aligned
 * editorial block pairs a portrait image with a featured card.
 */
export function HomePage() {
  const { t } = useTranslation();
  const localized = useLocalizedField();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);

  const featured =
    attractions.find((a) => a.city === 'vienna') ?? attractions[0]!;
  const hallstatt =
    attractions.find((a) => a.city === 'hallstatt') ?? attractions[0]!;

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
        style={{ height: 'min(78vh, 760px)', borderRadius: 'var(--radius-xl)' }}
      >
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          poster="/hero-poster.svg"
          className="absolute inset-0 h-full w-full object-cover"
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
          to={`/attraction/${featured.slug}`}
          className="float-card float-bob absolute hidden md:block"
          style={
            { top: 24, right: 24, width: 230, ['--card-rotate']: 'rotate(2deg)' } as CSSProperties
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
              src={featured.imageUrl}
              alt={localized(featured.name)}
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

      {/* ============ SECOND SECTION — image + editorial card ============ */}
      <section className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-[320px_minmax(0,640px)]">
        <Link
          to={`/attraction/${hallstatt.slug}`}
          className="card-hover block overflow-hidden rounded-2xl"
          style={{ aspectRatio: '320 / 440' }}
        >
          <img
            src={hallstatt.imageUrl}
            alt={localized(hallstatt.name)}
            className="h-full w-full object-cover"
            style={{ borderRadius: 0 }}
          />
        </Link>

        <Link
          to="/plan"
          className="card card-hover relative flex flex-col justify-center"
          style={{ minHeight: 280 }}
        >
          <ArrowUpRight
            size={22}
            className="absolute text-ink-faint"
            style={{ top: 24, right: 24 }}
          />
          <p className="eyebrow mb-4">Edition 01 · Österreich</p>
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
    </div>
  );
}
